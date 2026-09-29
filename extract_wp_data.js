const fs = require('fs');
const xml2js = require('xml2js');

const xmlFilePath = './vcsamersham.WordPress.2026-09-29.xml';
const outputJsonPath = './migrated_content.json';

const parser = new xml2js.Parser();

fs.readFile(xmlFilePath, function (err, data) {
    if (err) {
        console.error("Error reading XML file:", err);
        return;
    }
    
    parser.parseString(data, function (err, result) {
        if (err) {
            console.error("Error parsing XML:", err);
            return;
        }

        const channel = result.rss.channel[0];
        const items = channel.item || [];

        const extractedPages = [];
        const extractedPosts = [];

        items.forEach(item => {
            const postType = item['wp:post_type'] ? item['wp:post_type'][0] : '';
            const status = item['wp:status'] ? item['wp:status'][0] : '';

            // We usually only want published pages/posts
            if ((postType === 'page' || postType === 'post') && status === 'publish') {
                const title = item.title ? item.title[0] : '';
                const link = item.link ? item.link[0] : '';
                const slug = item['wp:post_name'] ? item['wp:post_name'][0] : '';
                const content = item['content:encoded'] ? item['content:encoded'][0] : '';
                const excerpt = item['excerpt:encoded'] ? item['excerpt:encoded'][0] : '';
                const publishedAt = item['wp:post_date'] ? item['wp:post_date'][0] : '';
                const author = item['dc:creator'] ? item['dc:creator'][0] : '';

                // Extract postmeta (SEO data, Elementor data, etc.)
                const postmeta = item['wp:postmeta'] || [];
                const meta = {};
                postmeta.forEach(m => {
                    const key = m['wp:meta_key'][0];
                    const value = m['wp:meta_value'][0];
                    meta[key] = value;
                });

                const pageData = {
                    title,
                    link,
                    slug,
                    content,
                    excerpt,
                    publishedAt,
                    author,
                    seo: {
                        title: meta['_yoast_wpseo_title'] || title,
                        description: meta['_yoast_wpseo_metadesc'] || '',
                        canonical: meta['_yoast_wpseo_canonical'] || link
                    },
                    meta // raw meta just in case
                };

                if (postType === 'page') {
                    extractedPages.push(pageData);
                } else if (postType === 'post') {
                    extractedPosts.push(pageData);
                }
            }
        });

        const outputData = {
            pages: extractedPages,
            posts: extractedPosts
        };

        fs.writeFileSync(outputJsonPath, JSON.stringify(outputData, null, 2));
        console.log(`Extracted ${extractedPages.length} pages and ${extractedPosts.length} posts.`);
        console.log(`Data saved to ${outputJsonPath}`);
    });
});
