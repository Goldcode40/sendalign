/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email, list = 'default' } = await req.json();
    const secret = process.env.UNSUBSCRIBE_SECRET || '';

    if (!secret) {
      return NextResponse.json({ error: 'Server missing UNSUBSCRIBE_SECRET' }, { status: 500 });
    }
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    const listId = typeof list === 'string' ? list : 'default';

    const ts = Date.now();
    const msg = `${email.toLowerCase()}|${listId}|${ts}`;
    const sig = crypto.createHmac('sha256', secret).update(msg).digest('hex');

    // Build absolute URL (works in dev; in prod swap origin to your domain)
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL('/api/unsubscribe', origin);
    url.searchParams.set('email', email.toLowerCase());
    url.searchParams.set('list', listId);
    url.searchParams.set('t', String(ts));
    url.searchParams.set('sig', sig);

    return NextResponse.json({
      url: url.toString(),
      headers: {
        // RFC 8058 one-click:
        'List-Unsubscribe': `<${url.toString()}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
