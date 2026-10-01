import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getSiteContent,
  getMenuData,
  saveSiteContent,
  saveMenuData,
} from '@/lib/firebaseService';

// Server passcode for admin operations (configured in .env.local)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'VCS@Amersham94';

export async function GET(request: NextRequest) {
  try {
    const [siteContent, menuData] = await Promise.all([
      getSiteContent(),
      getMenuData(),
    ]);

    return NextResponse.json({
      success: true,
      siteContent,
      menuData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to read data: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, type, data } = body;

    // Password verification
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin passcode. Access denied.' },
        { status: 401 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No data provided to save.' },
        { status: 400 }
      );
    }

    let saveResult: { success: boolean; cloud: boolean; error?: string };

    if (type === 'menu') {
      saveResult = await saveMenuData(data);
      revalidatePath('/');
      revalidatePath('/admin');
      return NextResponse.json({
        success: true,
        cloud: saveResult.cloud,
        message: saveResult.cloud
          ? 'Menu synchronized with Firebase Cloud & saved!'
          : 'Menu saved locally!',
      });
    } else {
      // Default to updating site content
      saveResult = await saveSiteContent(data);
      revalidatePath('/');
      revalidatePath('/admin');
      return NextResponse.json({
        success: true,
        cloud: saveResult.cloud,
        message: saveResult.cloud
          ? 'Site content synchronized with Firebase Cloud & saved!'
          : 'Site content saved locally!',
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to save data: ' + error.message },
      { status: 500 }
    );
  }
}
