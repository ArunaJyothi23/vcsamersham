import { NextResponse } from 'next/server';
import { getContentVersion } from '@/lib/firebaseService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const version = await getContentVersion();

    return NextResponse.json(
      { version },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ version: 0 });
  }
}

