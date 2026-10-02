const fs = require('fs');
const path = require('path');

const sitePath = path.join(__dirname, '..', 'src', 'data', 'site_content.json');
const content = JSON.parse(fs.readFileSync(sitePath, 'utf8'));

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCd6EskMn3ED4SJ2FeeiWwOtYP1nXaKxeU';
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vcs-amersham';
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

fetch(`${FIRESTORE_BASE}/content/site?key=${API_KEY}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fields: {
      data: { stringValue: JSON.stringify(content) },
      updatedAt: { stringValue: new Date().toISOString() }
    }
  })
}).then(async res => {
  console.log('Firebase Cloud Firestore sync HTTP status:', res.status);
  const text = await res.text();
  console.log('Response sample:', text.substring(0, 150));
}).catch(err => {
  console.error('Firebase Cloud sync error:', err.message);
});
