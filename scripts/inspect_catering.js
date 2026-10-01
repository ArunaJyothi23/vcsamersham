const fs = require('fs');

function inspectPage(file) {
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');
  console.log(`\n================== ${file} ==================`);
  const regex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>([\s\S]*?)(?=<h[1-4]|$)/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = match[1].toUpperCase();
    const heading = match[2].replace(/<[^>]+>/g, '').trim();
    const body = match[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (heading && !heading.includes('Search') && heading.length < 100) {
      console.log(`[${level}] ${heading}: ${body.slice(0, 150)}...`);
    }
  }
}

inspectPage('outdoor_catering.html');
inspectPage('live_dosa.html');
