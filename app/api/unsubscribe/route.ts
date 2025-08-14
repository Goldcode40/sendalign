/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyUnsub } from '../../../lib/crypto';
import { rateLimit } from '../../../lib/rateLimit';
import { logJSON, sha256 } from '../../../lib/log';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const email = (url.searchParams.get('email') || '').toLowerCase();
    const listId = url.searchParams.get('list') || 'default';
    const tsStr = url.searchParams.get('t') || '';
    const sig = url.searchParams.get('sig') || '';
    const ts = Number(tsStr);
    const secret = process.env.UNSUBSCRIBE_SECRET || '';

    // rate limit by IP + route
    const h = headers();
    const ip = (h.get('x-real-ip') || h.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
    const rl = rateLimit(`unsub:${ip}`);
    if (!rl.ok) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfterSec) },
      });
    }

    if (!email || !ts || !sig || !secret) {
      logJSON('unsub_bad_request', { ip, emailHash: email ? sha256(email) : null, listId });
      return new NextResponse('Bad Request', { status: 400 });
    }

    const ok = verifyUnsub(email, listId, ts, sig, secret);
    if (!ok) {
      logJSON('unsub_invalid_sig', { ip, emailHash: sha256(email), listId, ts });
      return new NextResponse('Invalid signature', { status: 401 });
    }

    // TODO: record unsubscribe in a DB (future step)
    logJSON('unsub_ok', { ip, emailHash: sha256(email), listId });

    return new NextResponse('OK', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (e: any) {
    console.error('unsub_error', e?.message || e);
    return new NextResponse('Server error', { status: 500 });
  }
}
