import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export const maxDuration = 60; // Increase timeout for scraping tasks
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Sesi anda telah berakhir' }, { status: 401 });
    }

    const body = await request.json();
    const { handle, platform = 'instagram', forceRegenerate = false } = body;
    
    console.log(`Proxying socmed detail request: handle="${handle}", platform="${platform}", forceRegenerate=${forceRegenerate}`);

    const res = await fetch(`${BACKEND_URL}/api/scraper/socmed-detail`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ handle, platform, forceRegenerate }),
      cache: 'no-store'
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Detail report failed' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy socmed detail error:`, error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal' }, { status: 500 });
  }
}
