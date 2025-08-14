import crypto from 'crypto';

export function signUnsub(email: string, listId: string, ts: number, secret: string) {
  const msg = `${email}|${listId}|${ts}`;
  return crypto.createHmac('sha256', secret).update(msg).digest('hex');
}

export function verifyUnsub(email: string, listId: string, ts: number, sig: string, secret: string) {
  // Accept ~24h window
  const maxSkewMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  if (!Number.isFinite(ts) || Math.abs(now - ts) > maxSkewMs) return false;

  const expected = signUnsub(email, listId, ts, secret);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}
