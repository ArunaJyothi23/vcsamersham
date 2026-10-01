import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD || 'VCS@Amersham94';

    if (!password || password !== correctPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid security passcode. Access denied.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Authentication service error.' },
      { status: 500 }
    );
  }
}
