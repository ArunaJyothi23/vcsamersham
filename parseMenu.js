const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('menu_html.html', 'utf8');
const $ = cheerio.load(html);

const menuData = {};
const categories = [];

// Get tab titles
$('[data-tab-title-id]').each((i, el) => {
    const title = $(el).text().trim();
    if (title) {
        categories.push(title);
        menuData[title] = [];
    }
});

// The content area has the same ID as aria-controls
$('[data-tab-index]').each((i, el) => {
    const controlsId = $(el).attr('aria-controls');
    const title = $(el).text().trim();
    if (controlsId && title && menuData[title]) {
        const contentDiv = $('#' + controlsId);
        contentDiv.find('.elementor-price-list-item').each((_, item) => {
            const itemTitle = $(item).find('.elementor-price-list-title').text().trim();
            const price = $(item).find('.elementor-price-list-price').text().trim();
            const desc = $(item).find('.elementor-price-list-description').text().trim();
            if (itemTitle) {
                menuData[title].push({
                    title: itemTitle,
                    price: price,
                    desc: desc
                });
            }
        });
    }
});

fs.writeFileSync('menu_parsed.json', JSON.stringify({ categories, menuData }, null, 2));
console.log('Saved to menu_parsed.json');
