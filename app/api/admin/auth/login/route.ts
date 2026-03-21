import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: data?.error ?? data?.message ?? 'Login gagal' },
        { status: backendRes.status }
      );
    }

    // Jika 2FA diperlukan, return temp_token dan setup info ke client
    if (data.mfa_required) {
      return NextResponse.json(
        { 
          mfa_required: true, 
          temp_token: data.temp_token,
          mfa_setup_required: data.mfa_setup_required,
          otpauth_url: data.otpauth_url,
          secret: data.secret
        },
        { status: 200 }
      );
    }

    // Login sukses tanpa 2FA — set httpOnly cookie
    const response = NextResponse.json({ success: true, user: data.user });
    response.cookies.set('admin_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 jam
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
