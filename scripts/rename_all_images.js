const fs = require('fs');
const path = require('path');

const renameMap = {
  // 1. Logos & Branding
  'vcsr-logo.webp': 'vcs-amersham-round-logo.webp',
  'WhatsApp-Image-2025-11-03-at-18.48.43-1024x430.jpeg': 'vcsr-veg-chennai-srilalitha-logo.jpeg',

  // 2. Hero & Grand Feast
  'WhatsApp-Image-2025-11-01-at-15.41.07-2.jpeg': 'vcs-authentic-south-indian-feast.jpeg',

  // 3. Allergen & Dietary Guide
  'WhatsApp-Image-2025-12-03-at-11.49.42-e1764743369811.jpeg': 'menu-allergen-dietary-guide.jpeg',
  'WhatsApp-Image-2025-12-03-at-11.49.42-e1764743369811-300x75.jpeg': 'menu-allergen-dietary-guide-300x75.jpeg',

  // 4. Delivery Platforms
  'Add-a-heading-6.png': 'delivery-platform-just-eat.png',
  'Add-a-heading-6-150x150.png': 'delivery-platform-just-eat-150x150.png',
  'Add-a-heading-6-300x300.png': 'delivery-platform-just-eat-300x300.png',
  'Add-a-heading-7.png': 'delivery-platform-deliveroo.png',
  'Add-a-heading-7-150x150.png': 'delivery-platform-deliveroo-150x150.png',
  'Add-a-heading-7-300x300.png': 'delivery-platform-deliveroo-300x300.png',
  'Add-a-heading-8.png': 'delivery-platform-uber-eats.png',
  'Add-a-heading-8-150x150.png': 'delivery-platform-uber-eats-150x150.png',
  'Add-a-heading-8-300x300.png': 'delivery-platform-uber-eats-300x300.png',

  // 5. Atmosphere, Interior & Catering Setup
  'Screenshot-2026-07-04-110817.png': 'vcs-amersham-restaurant-dining-room.png',
  'Screenshot-2026-07-04-110817-300x267.png': 'vcs-amersham-restaurant-dining-room-300x267.png',
  'Screenshot-2026-07-04-110817-768x684.png': 'vcs-amersham-restaurant-dining-room-768x684.png',
  'CaffeChennai-70.jpg': 'vcs-catering-buffet-setup.jpg',
  'CaffeChennai-70-300x200.jpg': 'vcs-catering-buffet-setup-300x200.jpg',
  'CaffeChennai-70-768x512.jpg': 'vcs-catering-buffet-setup-768x512.jpg',
  'CaffeChennai-70-1024x683.jpg': 'vcs-catering-buffet-setup-1024x683.jpg',
  'gallery-interior-BRfaSl7G.jpg': 'restaurant-interior-dining.jpg',
  'gallery-interior-BRfaSl7G-240x300.jpg': 'restaurant-interior-dining-240x300.jpg',
  'gallery-interior-BRfaSl7G-768x960.jpg': 'restaurant-interior-dining-768x960.jpg',
  'gallery-interior-BRfaSl7G-819x1024.jpg': 'restaurant-interior-dining-819x1024.jpg',

  // 6. Feature & Catering Service Icons
  'Screenshot-2025-11-01-172306.png': 'icon-authentic-recipes.png',
  'Screenshot-2025-11-01-172314.png': 'icon-expert-chefs.png',
  'Screenshot-2025-11-01-172321.png': 'icon-award-winning.png',
  'Screenshot-2025-11-01-172329.png': 'icon-family-friendly.png',
  'Screenshot-2025-11-01-172630.png': 'icon-corporate-events.png',
  'Screenshot-2025-11-01-172645.png': 'icon-weddings-parties.png',
  'Screenshot-2025-11-01-172702.png': 'icon-private-functions.png',

  // 7. Kitchen Dishes & Daily Food
  'WhatsApp-Image-2026-04-25-at-12.56.12.jpeg': 'fresh-green-salad-platter.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.12-1.jpeg': 'fresh-fruit-salad-platter.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.12-2.jpeg': 'gourmet-fruit-vegetable-catering-display.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.12-3.jpeg': 'tropical-dragonfruit-kiwi-platter.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.12-4.jpeg': 'fresh-strawberry-orange-fruit-salad.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.13.jpeg': 'steamed-idli-medu-vada-chutney.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.13-3.jpeg': 'crispy-medu-vada-chutney-sambar.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.13-8.jpeg': 'chilli-paneer-dry-starter.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.14-2.jpeg': 'cocktail-idli-skewers-platter.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.14-6.jpeg': 'crispy-podi-idli-skewers.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.14-7.jpeg': 'crispy-potli-samosa-starter.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.15-2.jpeg': 'crispy-vegetable-spring-rolls.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.15-3.jpeg': 'crispy-masala-dal-vada.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.16-1.jpeg': 'dal-makhani-jeera-rice.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.16-2.jpeg': 'paneer-tikka-masala-tandoori-roti.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.16-4.jpeg': 'veg-manchurian-dry.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.16-6.jpeg': 'chilli-paneer-tossed-appetizer.jpeg',
  'WhatsApp-Image-2026-04-25-at-12.56.17.jpeg': 'chettinad-spicy-roast-starter.jpeg'
};

const migratedDir = path.join(__dirname, '../public/images/migrated');

// 1. Rename files on disk
console.log('Renaming files in', migratedDir);
for (const [oldName, newName] of Object.entries(renameMap)) {
  const oldPath = path.join(migratedDir, oldName);
  const newPath = path.join(migratedDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${oldName} -> ${newName}`);
  } else if (fs.existsSync(newPath)) {
    console.log(`Already renamed: ${newName}`);
  } else {
    console.warn(`File not found: ${oldName}`);
  }
}

// 2. Update references in code and data files
const targets = [
  'src/data/site_content.json',
  'src/data/outdoor_catering_data.json',
  'src/data/migrated_content.json',
  'src/components/Header.tsx',
  'src/components/TopFood.tsx',
  'src/components/Footer.tsx',
  'src/components/Reviews.tsx',
  'src/components/OrderOnline.tsx',
  'src/app/layout.tsx',
  'src/app/live-dosa-catering/page.tsx',
  'src/app/outdoor-catering/page.tsx',
  'src/app/cookies-policy/page.tsx',
  'src/app/disclaimer/page.tsx',
  'src/app/privacy-policy/page.tsx',
  'src/app/admin/page.tsx',
  'scripts/image_mapping.json',
  'scripts/update_and_sync_content.js'
];

// Sort keys longest first to avoid partial replacements
const sortedOldNames = Object.keys(renameMap).sort((a, b) => b.length - a.length);

for (const targetRel of targets) {
  const fullPath = path.join(__dirname, '..', targetRel);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');
  let count = 0;
  for (const oldName of sortedOldNames) {
    if (content.includes(oldName)) {
      const newName = renameMap[oldName];
      const regex = new RegExp(oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(regex, newName);
      count++;
    }
  }
  if (count > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${count} image references in ${targetRel}`);
  }
}

console.log('All image names updated successfully!');
