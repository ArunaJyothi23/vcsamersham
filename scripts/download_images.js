const fs = require('fs');
const path = require('path');
const https = require('https');

const srcDir = path.resolve(__dirname, '..', 'src');
const publicImagesDir = path.resolve(__dirname, '..', 'public', 'images', 'migrated');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

const urls = new Set();
const urlRegex = /https:\/\/vcsamersham\.co\.uk\/wp-content\/uploads\/[^\s\"\'\)\>]+/g;

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (/\.(tsx|ts|jsx|js|json)$/.test(file)) {
      const content = fs.readFileSync(full, 'utf8');
      let match;
      while ((match = urlRegex.exec(content)) !== null) {
        urls.add(match[0]);
      }
    }
  }
}

walk(srcDir);
console.log(`Found ${urls.size} unique WordPress image URLs.`);

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const mapping = {};
  for (const url of Array.from(urls)) {
    const parsed = new URL(url);
    const filename = path.basename(parsed.pathname);
    const localDest = path.join(publicImagesDir, filename);
    const localWebPath = `/images/migrated/${filename}`;
    console.log(`Downloading: ${filename}...`);
    try {
      await downloadFile(url, localDest);
      mapping[url] = localWebPath;
      console.log(`  -> Saved to: ${localWebPath}`);
    } catch (e) {
      console.error(`  -> ERROR downloading ${url}:`, e.message);
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, 'image_mapping.json'),
    JSON.stringify(mapping, null, 2),
    'utf8'
  );
  console.log(`Finished downloading. Saved mapping for ${Object.keys(mapping).length} files.`);
}

run();
