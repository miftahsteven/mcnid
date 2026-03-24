import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_URL ?? 'http://localhost:4000').replace('localhost', '127.0.0.1');

export const maxDuration = 300;
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

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log(`[SNA Proxy POST] Analyzing: "${body.keyword}"`);
    
    const res = await fetch(`${BACKEND_URL}/api/sna/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch (e) {
      return NextResponse.json({ 
        error: 'Backend Response Error', 
        raw: text.substring(0, 100) 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[SNA Proxy Analyze Error]:', error.message);
    return NextResponse.json({ error: 'Proxy Error', message: error.message }, { status: 500 });
  }
}
