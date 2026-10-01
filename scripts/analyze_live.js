const fs = require('fs');
const html = fs.readFileSync('live_site.html', 'utf8');

// Find font family styles
const fontMatches = html.match(/font-family:[^;\"']+/gi) || [];
console.log('Unique fonts:');
console.log([...new Set(fontMatches)].slice(0, 15));

// Find Google font links
const googleFonts = html.match(/fonts\.googleapis\.com\/css2\?[^"'\s]+/gi) || [];
console.log('\nGoogle Fonts links:');
console.log([...new Set(googleFonts)]);

// Find headings
const hMatches = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
console.log('\n--- HEADINGS (' + hMatches.length + ') ---');
hMatches.forEach(h => {
  const tag = h.match(/<(h[1-6])/i)[1];
  const text = h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`[${tag.toUpperCase()}] ${text}`);
});

// Find text blocks & paragraphs
const pMatches = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
console.log('\n--- PARAGRAPHS (' + pMatches.length + ') ---');
pMatches.slice(0, 25).forEach(p => {
  const text = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length > 10) console.log(`- ${text}`);
});

// Find all images
const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('\n--- UNIQUE IMAGES (' + new Set(imgMatches).size + ') ---');
console.log([...new Set(imgMatches)]);
