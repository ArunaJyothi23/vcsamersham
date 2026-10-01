import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SITE_CONTENT_PATH = path.join(process.cwd(), 'src', 'data', 'site_content.json');
const MENU_PATH = path.join(process.cwd(), 'src', 'data', 'menu.json');

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [siteStat, menuStat] = await Promise.all([
      fs.stat(SITE_CONTENT_PATH).catch(() => ({ mtimeMs: 0 })),
      fs.stat(MENU_PATH).catch(() => ({ mtimeMs: 0 })),
    ]);

    const version = Math.max(siteStat.mtimeMs, menuStat.mtimeMs);

    return NextResponse.json(
      { version },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ version: Date.now() });
  }
}
