import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();

    const res = await fetch(`${BACKEND_URL}/api/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      cache: 'no-store'
    });

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: data.error || 'Upload failed' }, { status: res.status });
      }
      return NextResponse.json(data);
    }

    // Default error
    return NextResponse.json({ error: 'Upload failed' }, { status: res.status });
  } catch (error) {
    console.error(`Proxy media upload error:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
