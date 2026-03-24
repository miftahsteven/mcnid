import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = (process.env.BACKEND_URL ?? 'http://localhost:4000').replace('localhost', '127.0.0.1');

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getAuthToken(request);
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${BACKEND_URL}/api/sna/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store'
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[SNA Detail Proxy Error]:', error.message);
    return NextResponse.json({ error: 'Proxy Error', message: error.message }, { status: 500 });
  }
}
