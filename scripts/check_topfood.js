const fs = require('fs');
const html = fs.readFileSync('live_site.html', 'utf8');
const topFoodIndex = html.indexOf('Top Food');
const nextSection = html.indexOf('Our Menu', topFoodIndex);
const topFoodHtml = html.slice(topFoodIndex, nextSection);

const imgs = [...topFoodHtml.matchAll(/src=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Images in Top Food on live site:');
imgs.forEach(img => console.log(img));
