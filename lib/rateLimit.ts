// lib/rateLimit.ts
type Bucket = { tokens: number; last: number };

// in-memory token buckets (survives warm invocations; fine for MVP)
const buckets = new Map<string, Bucket>();

// allow N requests per windowSeconds using token bucket
export function rateLimit(
  key: string,
  { capacity = 30, refillPerSec = 0.5 } = {} // == 30 reqs with 1 token every 2s (~30/min)
) {
  const now = Date.now() / 1000;
  const b = buckets.get(key) ?? { tokens: capacity, last: now };

  // refill
  const elapsed = Math.max(0, now - b.last);
  b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSec);
  b.last = now;

  if (b.tokens < 1) {
    buckets.set(key, b);
    return { ok: false, retryAfterSec: Math.ceil((1 - b.tokens) / refillPerSec) };
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return { ok: true, retryAfterSec: 0 };
}
