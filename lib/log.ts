// lib/log.ts
import crypto from 'crypto';

export function sha256(s: string) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

export function logJSON(event: string, data: Record<string, unknown>) {
  // Vercel collects console.log; keep logs structured
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...data }));
}
