import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:4000';

async function proxy(request: NextRequest, method: string, url: string, body?: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(url, {
    method,
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json({ error: data?.error ?? 'Request failed' }, { status: res.status });
  return NextResponse.json(data);
}

// POST: add lesson to module
export async function POST(request: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const body = await request.json().catch(() => ({}));
  return proxy(request, 'POST', `${BACKEND}/api/courses/modules/${moduleId}/lessons`, body);
}
