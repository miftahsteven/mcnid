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

    let reqBody: any = {};
    try {
      reqBody = await request.json();
    } catch (e) {
      // Ignore if body is empty
    }

    const res = await fetch(`${BACKEND_URL}/api/scraper/play-run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody),
      cache: 'no-store'
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Scraper failed' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Proxy scraper error:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
