import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_URL ?? 'http://localhost:4000').replace('localhost', '127.0.0.1');

export const dynamic = 'force-dynamic';

async function getAuthToken(request: NextRequest) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get('admin_token')?.value;
  if (cookieToken) return cookieToken;

  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/sna`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON', raw: text.substring(0, 50) }, { status: res.status });
    }
  } catch (error: any) {
    console.error('[SNA Proxy List Error]:', error.message);
    return NextResponse.json({ error: 'Proxy Error', message: error.message }, { status: 500 });
  }
}
