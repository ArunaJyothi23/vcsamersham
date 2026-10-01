import fs from 'fs/promises';
import path from 'path';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vcs-amersham';
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'vcs-amersham.firebasestorage.app';

const LOCAL_SITE_PATH = path.join(process.cwd(), 'src', 'data', 'site_content.json');
const LOCAL_MENU_PATH = path.join(process.cwd(), 'src', 'data', 'menu.json');

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

/**
 * Fetch site content: checks Firebase Firestore first, falls back to local JSON
 */
export async function getSiteContent(): Promise<any> {
  if (API_KEY && PROJECT_ID) {
    try {
      const url = `${FIRESTORE_BASE}/content/site?key=${API_KEY}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json?.fields?.data?.stringValue) {
          return JSON.parse(json.fields.data.stringValue);
        }
      }
    } catch (err) {
      console.warn('Firebase Firestore read failed, falling back to local file:', err);
    }
  }

  // Fallback to local JSON file
  try {
    const raw = await fs.readFile(LOCAL_SITE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    const fallback = await import('../data/site_content.json');
    return fallback.default || fallback;
  }
}

/**
 * Save site content: writes to BOTH Firebase Firestore AND local JSON file
 */
export async function saveSiteContent(data: any): Promise<{ success: boolean; cloud: boolean; error?: string }> {
  let cloudSuccess = false;

  // 1. Always update local JSON as backup
  try {
    await fs.writeFile(LOCAL_SITE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    console.error('Local JSON save error:', err);
  }

  // 2. Save to Cloud Firestore
  if (API_KEY && PROJECT_ID) {
    try {
      const url = `${FIRESTORE_BASE}/content/site?key=${API_KEY}`;
      const payload = {
        fields: {
          data: { stringValue: JSON.stringify(data) },
          updatedAt: { stringValue: new Date().toISOString() },
        },
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        cloudSuccess = true;
      }
    } catch (err: any) {
      console.warn('Firebase Firestore save error:', err);
    }
  }

  return { success: true, cloud: cloudSuccess };
}

/**
 * Fetch menu data: checks Firebase Firestore first, falls back to local JSON
 */
export async function getMenuData(): Promise<any> {
  if (API_KEY && PROJECT_ID) {
    try {
      const url = `${FIRESTORE_BASE}/content/menu?key=${API_KEY}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json?.fields?.data?.stringValue) {
          return JSON.parse(json.fields.data.stringValue);
        }
      }
    } catch (err) {
      console.warn('Firebase Firestore menu read failed, falling back to local file:', err);
    }
  }

  try {
    const raw = await fs.readFile(LOCAL_MENU_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    const fallback = await import('../data/menu.json');
    return fallback.default || fallback;
  }
}

/**
 * Save menu data: writes to BOTH Firebase Firestore AND local JSON file
 */
export async function saveMenuData(data: any): Promise<{ success: boolean; cloud: boolean; error?: string }> {
  let cloudSuccess = false;

  try {
    await fs.writeFile(LOCAL_MENU_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err: any) {
    console.error('Local JSON menu save error:', err);
  }

  if (API_KEY && PROJECT_ID) {
    try {
      const url = `${FIRESTORE_BASE}/content/menu?key=${API_KEY}`;
      const payload = {
        fields: {
          data: { stringValue: JSON.stringify(data) },
          updatedAt: { stringValue: new Date().toISOString() },
        },
      };

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        cloudSuccess = true;
      }
    } catch (err: any) {
      console.warn('Firebase Firestore menu save error:', err);
    }
  }

  return { success: true, cloud: cloudSuccess };
}

/**
 * Upload image to Firebase Storage or local disk fallback
 */
export async function uploadImageFile(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; cloud: boolean }> {
  // Try Firebase Cloud Storage first
  if (API_KEY && STORAGE_BUCKET) {
    try {
      const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o?uploadType=media&name=uploads%2F${encodeURIComponent(fileName)}&key=${API_KEY}`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': contentType || 'image/jpeg' },
        body: new Uint8Array(buffer),
      });

      if (res.ok) {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/uploads%2F${encodeURIComponent(fileName)}?alt=media`;
        return { url: publicUrl, cloud: true };
      }
    } catch (err) {
      console.warn('Firebase Storage upload failed, falling back to local:', err);
    }
  }

  // Local filesystem fallback
  const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, fileName), buffer);
  return { url: `/images/uploads/${fileName}`, cloud: false };
}
