import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getSiteContent,
  getMenuData,
  saveSiteContent,
  saveMenuData,
} from '@/lib/firebaseService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server passcode for admin operations (configured in .env.local)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'VCS@Amersham94';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(request: NextRequest) {
  try {
    const [siteContent, menuData] = await Promise.all([
      getSiteContent(),
      getMenuData(),
    ]);

    return NextResponse.json(
      {
        success: true,
        siteContent,
        menuData,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to read data: ' + error.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, type, data, siteData, menuData } = body;

    // Password verification
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin passcode. Access denied.' },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    // Support combined save ('all') in a single atomic HTTP request
    if (type === 'all' || (siteData && menuData)) {
      const targetSite = siteData || data?.siteData;
      const targetMenu = menuData || data?.menuData;

      const [siteResult, menuResult] = await Promise.all([
        targetSite ? saveSiteContent(targetSite) : Promise.resolve({ success: true, cloud: false }),
        targetMenu ? saveMenuData(targetMenu) : Promise.resolve({ success: true, cloud: false }),
      ]);

      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/outdoor-catering');
        revalidatePath('/live-dosa-catering');
        revalidatePath('/privacy-policy');
        revalidatePath('/cookies-policy');
        revalidatePath('/disclaimer');
        revalidatePath('/sitemap.xml');
        revalidatePath('/robots.txt');
      } catch {}

      return NextResponse.json(
        {
          success: true,
          cloud: siteResult.cloud || menuResult.cloud,
          version: Date.now(),
          message: 'All site and menu content saved successfully!',
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No data provided to save.' },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    let saveResult: { success: boolean; cloud: boolean; error?: string };

    if (type === 'menu') {
      saveResult = await saveMenuData(data);
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
      } catch {}
      return NextResponse.json(
        {
          success: true,
          cloud: saveResult.cloud,
          version: Date.now(),
          message: saveResult.cloud
            ? 'Menu synchronized with Firebase Cloud & saved!'
            : 'Menu saved locally!',
        },
        { headers: NO_CACHE_HEADERS }
      );
    } else {
      // Default to updating site content
      saveResult = await saveSiteContent(data);
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/outdoor-catering');
        revalidatePath('/live-dosa-catering');
        revalidatePath('/privacy-policy');
        revalidatePath('/cookies-policy');
        revalidatePath('/disclaimer');
        revalidatePath('/sitemap.xml');
        revalidatePath('/robots.txt');
      } catch {}
      return NextResponse.json(
        {
          success: true,
          cloud: saveResult.cloud,
          version: Date.now(),
          message: saveResult.cloud
            ? 'Site content synchronized with Firebase Cloud & saved!'
            : 'Site content saved locally!',
        },
        { headers: NO_CACHE_HEADERS }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to save data: ' + error.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
