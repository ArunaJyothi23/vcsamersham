import fs from 'fs/promises';
import path from 'path';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'vcs-amersham';
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCd6EskMn3ED4SJ2FeeiWwOtYP1nXaKxeU';
const STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'vcs-amersham.firebasestorage.app';

const LOCAL_SITE_PATH = path.join(process.cwd(), 'src', 'data', 'site_content.json');
const LOCAL_MENU_PATH = path.join(process.cwd(), 'src', 'data', 'menu.json');

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// In-memory cache with short TTL (3s) for near-instant Admin Studio reflection
let cachedSiteContent: { data: any; timestamp: number } | null = null;
let cachedMenuData: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 3000; // 3 seconds

let lastGlobalVersion = Date.now();

export function invalidateCache() {
  cachedSiteContent = null;
  cachedMenuData = null;
  lastGlobalVersion = Date.now();
}

/**
 * Returns latest content timestamp for live tab synchronization
 */
export async function getContentVersion(): Promise<number> {
  let cloudVersion = 0;
  if (API_KEY && PROJECT_ID) {
    try {
      const url = `${FIRESTORE_BASE}/content/site?key=${API_KEY}&mask.fieldPaths=updatedAt`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json?.updateTime) {
          cloudVersion = Date.parse(json.updateTime);
        }
      }
    } catch {
      // Fallback silently
    }
  }

  let fileVersion = 0;
  try {
    const stat = await fs.stat(LOCAL_SITE_PATH);
    fileVersion = stat.mtimeMs;
  } catch {}

  return Math.max(cloudVersion, fileVersion, lastGlobalVersion);
}

function deepMerge(target: any, source: any): any {
  if (!source) return target;
  if (!target) return source;
  if (typeof target !== 'object' || typeof source !== 'object' || Array.isArray(target) || Array.isArray(source)) {
    return source !== undefined ? source : target;
  }
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] !== undefined && source[key] !== null) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  return output;
}

/**
 * Fetch site content: checks memory cache, then Cloud Firestore (source of truth for Admin edits), merged with local defaults
 */
export async function getSiteContent(): Promise<any> {
  const now = Date.now();
  if (cachedSiteContent && now - cachedSiteContent.timestamp < CACHE_TTL) {
    return cachedSiteContent.data;
  }

  // Load default base content
  let defaultData: any = {};
  try {
    const raw = await fs.readFile(LOCAL_SITE_PATH, 'utf-8');
    defaultData = JSON.parse(raw);
  } catch {
    const fallback = await import('../data/site_content.json');
    defaultData = fallback.default || fallback;
  }

  // 1. Fetch from Firebase Cloud Firestore FIRST so Admin Studio edits always reflect on the live site
  if (API_KEY && PROJECT_ID) {
    try {
      const url = `${FIRESTORE_BASE}/content/site?key=${API_KEY}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json?.fields?.data?.stringValue) {
          const parsed = JSON.parse(json.fields.data.stringValue);
          const merged = deepMerge(defaultData, parsed);
          cachedSiteContent = { data: merged, timestamp: now };
          return merged;
        }
      }
    } catch (err) {
      console.warn('Firebase Firestore read failed, falling back to local store:', err);
    }
  }

  // 2. Fall back to local JSON file if offline or Firestore temporarily unavailable
  cachedSiteContent = { data: defaultData, timestamp: now };
  return defaultData;
}

/**
 * Save site content: writes to Firebase Firestore and local store, clearing cache immediately
 */
export async function saveSiteContent(data: any): Promise<{ success: boolean; cloud: boolean; error?: string }> {
  let cloudSuccess = false;

  // Invalidate and set cache immediately so any concurrent read gets the new content instantly
  lastGlobalVersion = Date.now();
  cachedSiteContent = { data, timestamp: Date.now() };

  // Run local filesystem write and Firebase Firestore sync in parallel
  const localWritePromise = fs.writeFile(LOCAL_SITE_PATH, JSON.stringify(data, null, 2), 'utf-8').catch((err) => {
    // Expected on read-only serverless platforms like Vercel
  });

  const cloudPromise = (async () => {
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
  })();

  await Promise.all([localWritePromise, cloudPromise]);

  return { success: true, cloud: cloudSuccess };
}

/**
 * Fetch menu data: checks memory cache, then Cloud Firestore, then local store
 */
export async function getMenuData(): Promise<any> {
  const now = Date.now();
  if (cachedMenuData && now - cachedMenuData.timestamp < CACHE_TTL) {
    return cachedMenuData.data;
  }

  // 1. Fetch from Firebase Cloud Firestore FIRST
  if (API_KEY && PROJECT_ID) {
    try {
      const url = `${FIRESTORE_BASE}/content/menu?key=${API_KEY}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json?.fields?.data?.stringValue) {
          const parsed = JSON.parse(json.fields.data.stringValue);
          cachedMenuData = { data: parsed, timestamp: now };
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Firebase Firestore menu read failed:', err);
    }
  }

  // 2. Fall back to local JSON file
  try {
    const raw = await fs.readFile(LOCAL_MENU_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    cachedMenuData = { data: parsed, timestamp: now };
    return parsed;
  } catch {
    // Continue to import fallback
  }

  const fallback = await import('../data/menu.json');
  return fallback.default || fallback;
}

/**
 * Save menu data: writes to memory cache, local JSON, and Firebase Firestore
 */
export async function saveMenuData(data: any): Promise<{ success: boolean; cloud: boolean; error?: string }> {
  let cloudSuccess = false;

  lastGlobalVersion = Date.now();
  cachedMenuData = { data, timestamp: Date.now() };

  const localWritePromise = fs.writeFile(LOCAL_MENU_PATH, JSON.stringify(data, null, 2), 'utf-8').catch(() => {
    // Expected on read-only serverless platforms
  });

  const cloudPromise = (async () => {
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
  })();

  await Promise.all([localWritePromise, cloudPromise]);

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
