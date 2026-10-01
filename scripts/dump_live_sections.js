const fs = require('fs');
const html = fs.readFileSync('live_site.html', 'utf8');

// Strip styles and scripts first
const cleanHtml = html
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<script[\s\S]*?<\/script>/gi, '');

// Extract sections
const regex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>([\s\S]*?)(?=<h[1-3]|$)/gi;
let match;
let count = 0;
while ((match = regex.exec(cleanHtml)) !== null) {
  count++;
  const level = match[1].toUpperCase();
  const heading = match[2].replace(/<[^>]+>/g, '').trim();
  const body = match[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (heading && !heading.includes('Search')) {
    console.log(`\n==============================================`);
    console.log(`[${level}] ${heading}`);
    console.log(`==============================================`);
    console.log(body.slice(0, 500));
  }
}
console.log(`Total sections extracted: ${count}`);
