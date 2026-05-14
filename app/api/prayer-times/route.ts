import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  try {
    const response = await fetch(
      `https://api.myquran.com/v2/sholat/jadwal/1301/${year}/${month}/${day}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Prayer times fetch error:', error);
    return NextResponse.json(
      { status: false, message: 'Failed to fetch prayer times' },
      { status: 500 }
    );
  }
}
