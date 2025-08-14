import { NextResponse } from 'next/server';
import { verifyUnsub } from '../../../lib/crypto'; // relative import to avoid alias issues

// Simple GET so we can still poke the route in a browser if needed
export async function GET() {
  return new NextResponse('UNSUB GET OK', { status: 200 });
}

// RFC 8058 one-click: POST with no body. All params in the URL.
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const email = (url.searchParams.get('email') || '').toLowerCase();
    const listId = url.searchParams.get('list') || 'default';
    const tsStr = url.searchParams.get('t') || '';
    const sig = url.searchParams.get('sig') || '';
    const ts = Number(tsStr);
    const secret = process.env.UNSUBSCRIBE_SECRET || '';

    if (!email || !ts || !sig || !secret) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const ok = verifyUnsub(email, listId, ts, sig, secret);
    if (!ok) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    // TODO: record the unsubscribe (hash + listId) in your DB.
    // For MVP we just acknowledge per RFC 8058 with a 200 OK.
    return new NextResponse('OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch {
    return new NextResponse('Server error', { status: 500 });
  }
}
