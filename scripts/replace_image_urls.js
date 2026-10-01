const fs = require('fs');
const path = require('path');

const mapping = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'image_mapping.json'), 'utf8')
);

const srcDir = path.resolve(__dirname, '..', 'src');

function walkAndReplace(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walkAndReplace(full);
    } else if (/\.(tsx|ts|jsx|js|json)$/.test(file)) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;

      for (const [remoteUrl, localUrl] of Object.entries(mapping)) {
        if (content.includes(remoteUrl)) {
          content = content.replaceAll(remoteUrl, localUrl);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log(`Updated URLs in: ${path.relative(srcDir, full)}`);
      }
    }
  }
}

walkAndReplace(srcDir);
console.log('Finished updating image URLs in src directory!');
