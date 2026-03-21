import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let backendEndpoint = '';
    
    if (method === 'GET') {
      backendEndpoint = `${BACKEND_URL}/api/videos/admin/all`;
    } else if (method === 'POST') {
      backendEndpoint = `${BACKEND_URL}/api/videos`;
    }

    let body = undefined;
    if (method === 'POST') {
      body = await request.text();
    }

    const res = await fetch(backendEndpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body: body || undefined,
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
    console.error(`Proxy videos error:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
