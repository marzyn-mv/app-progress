import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const settingsPassword = process.env.SETTINGS_PASSWORD;

  if (!settingsPassword) {
    return NextResponse.json({ ok: false, error: 'SETTINGS_PASSWORD not configured' }, { status: 500 });
  }

  const { password } = await request.json();

  if (password === settingsPassword) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
}
