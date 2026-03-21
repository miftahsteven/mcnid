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

    const body = await request.text();

    const res = await fetch(`${BACKEND_URL}/api/videos/youtube-cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body,
      cache: 'no-store'
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error ?? data?.message ?? 'Request failed' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy yt-cover error:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
