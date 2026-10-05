import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface MediaItem {
  name: string;
  url: string;
  folder: string;
  sizeBytes: number;
  modifiedMs: number;
}

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const targetDirs = [
      { folder: 'uploads', dir: path.join(process.cwd(), 'public', 'images', 'uploads') },
      { folder: 'images', dir: path.join(process.cwd(), 'public', 'images') },
      { folder: 'migrated', dir: path.join(process.cwd(), 'public', 'images', 'migrated') },
      { folder: '3d', dir: path.join(process.cwd(), 'public', 'images', '3d') },
    ];

    const items: MediaItem[] = [];
    const seenUrls = new Set<string>();

    for (const { folder, dir } of targetDirs) {
      if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) continue;

      const entries = fs.readdirSync(/*turbopackIgnore: true*/ dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'].includes(ext)) {
          continue;
        }

        const fullPath = path.join(/*turbopackIgnore: true*/ dir, entry.name);
        const relFromPublic = path.relative(publicDir, fullPath).replace(/\\/g, '/');
        const url = `/${relFromPublic}`;

        if (!seenUrls.has(url)) {
          seenUrls.add(url);
          try {
            const stat = fs.statSync(/*turbopackIgnore: true*/ fullPath);
            items.push({
              name: entry.name,
              url,
              folder,
              sizeBytes: stat.size,
              modifiedMs: stat.mtimeMs,
            });
          } catch {
            items.push({
              name: entry.name,
              url,
              folder,
              sizeBytes: 0,
              modifiedMs: 0,
            });
          }
        }
      }
    }

    // Sort by newest first (uploads at top)
    items.sort((a, b) => {
      if (a.folder === 'uploads' && b.folder !== 'uploads') return -1;
      if (b.folder === 'uploads' && a.folder !== 'uploads') return 1;
      return b.modifiedMs - a.modifiedMs;
    });

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to list media: ' + error.message },
      { status: 500 }
    );
  }
}
