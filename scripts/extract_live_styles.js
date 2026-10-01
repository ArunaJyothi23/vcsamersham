const fs = require('fs');

if (fs.existsSync('live_site.html')) {
  const html = fs.readFileSync('live_site.html', 'utf8');

  // Find Astra or theme style blocks
  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  let allCss = styleBlocks.map(s => s.replace(/<\/?style[^>]*>/gi, '')).join('\n');

  console.log('Total CSS length:', allCss.length);

  // Look for h1, h2, font-size, banner, hero in allCss
  const h1Rules = allCss.match(/(?:^|\})\s*([^{]*h1[^{]*\{[^}]+\})/gi) || [];
  console.log('\n--- H1 RULES ---');
  h1Rules.slice(0, 10).forEach(r => console.log(r.trim()));

  const h2Rules = allCss.match(/(?:^|\})\s*([^{]*h2[^{]*\{[^}]+\})/gi) || [];
  console.log('\n--- H2 RULES ---');
  h2Rules.slice(0, 10).forEach(r => console.log(r.trim()));

  const bodyRules = allCss.match(/(?:^|\})\s*(body[^{]*\{[^}]+\})/gi) || [];
  console.log('\n--- BODY RULES ---');
  bodyRules.slice(0, 5).forEach(r => console.log(r.trim()));

  // Banner / slider / hero rules
  const heroRules = allCss.match(/([^{]*(?:elementor-section|wp-block|banner|hero|slider)[^{]*\{[^}]*(?:height|min-height)[^}]+\})/gi) || [];
  console.log('\n--- HERO/BANNER HEIGHT RULES ---');
  heroRules.slice(0, 10).forEach(r => console.log(r.trim()));

  // Inspect hero / first elementor section
  const sectionMatches = allCss.match(/([^{]*(?:min-height|height)\s*:\s*(?:calc|100vh|[0-9]+px)[^}]*)/gi) || [];
  console.log('\n--- HEIGHT DECLARATIONS ---');
  sectionMatches.slice(0, 10).forEach(r => console.log(r.trim()));

  // Section padding / margin
  const spacingMatches = allCss.match(/(\.ast-container|\.elementor-section)[^{]*\{[^}]*padding[^}]*\}/gi) || [];
  console.log('\n--- SECTION PADDING / MARGIN ---');
  spacingMatches.slice(0, 10).forEach(r => console.log(r.trim()));
} else {
  console.log('live_site.html does not exist');
}

