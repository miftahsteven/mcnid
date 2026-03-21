import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pathname = request.nextUrl.pathname;
    const parts = pathname.split('/');
    const id = parts[parts.length - 1];

    let backendEndpoint = '';
    let finalMethod = method;
    
    if (method === 'GET') {
      backendEndpoint = `${BACKEND_URL}/api/posts/admin/${id}`;
    } else if (method === 'PUT') {
      backendEndpoint = `${BACKEND_URL}/api/posts/${id}`;
      finalMethod = 'PATCH'; // Backend uses PATCH for updates
    } else if (method === 'DELETE') {
      backendEndpoint = `${BACKEND_URL}/api/posts/${id}`;
    }

    let body = undefined;
    if (['PUT', 'PATCH', 'POST'].includes(finalMethod)) {
      body = await request.text();
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`
    };

    const contentType = request.headers.get('content-type');
    if (contentType && body) {
      headers['Content-Type'] = contentType;
    } else if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(backendEndpoint, {
      method: finalMethod,
      headers,
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
    console.error(`Proxy posts error:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
