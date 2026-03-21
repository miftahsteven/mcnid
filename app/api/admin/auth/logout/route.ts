import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  try {
    // Optionally call backend to invalidate token immediately
    const token = request.headers.get('cookie')?.match(/admin_token=([^;]+)/)?.[1];
    if (token) {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }).catch(() => {});
    }

    const response = NextResponse.json({ success: true, message: 'Berhasil keluar' });
    
    // Clear the HTTP-only cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
