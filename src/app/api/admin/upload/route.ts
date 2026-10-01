import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadImageFile } from '@/lib/firebaseService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    // Sanitize filename & create unique name with timestamp
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const ext = path.extname(originalName) || '.jpg';
    const baseName = path.basename(originalName, ext);
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || 'image/jpeg';

    const result = await uploadImageFile(buffer, uniqueFileName, contentType);

    return NextResponse.json({
      success: true,
      url: result.url,
      fileName: uniqueFileName,
      cloud: result.cloud,
      message: result.cloud
        ? 'Uploaded directly to Firebase Cloud Storage!'
        : 'Uploaded to local media storage',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image: ' + error.message },
      { status: 500 }
    );
  }
}
