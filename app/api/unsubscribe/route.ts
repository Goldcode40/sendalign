// app/api/unsubscribe/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

function verifySig(email: string, list: string, t: string, sig: string) {
  const secret = process.env.UNSUBSCRIBE_SECRET || "dev-secret";
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${email}:${list}:${t}`)
    .digest("hex");

  // timing-safe compare
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

async function handler(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "";
  const list = url.searchParams.get("list") || "main";
  const t = url.searchParams.get("t") || "";
  const sig = url.searchParams.get("sig") || "";

  if (!email || !sig || !t) {
    return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
  }

  // optional: check timestamp freshness (e.g., 7 days)
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - Number(t) > maxAgeMs) {
    return NextResponse.json({ error: "Link expired." }, { status: 410 });
  }

  if (!verifySig(email, list, t, sig)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  // TODO: call your ESP to unsubscribe here if desired.
  // For now, just acknowledge.
  return NextResponse.json({ ok: true });
}

export const POST = handler; // supports POST …/api/unsubscribe?email=…&list=…&t=…&sig=…
export const GET = handler;  // (optional) also allow GET for browser clicks
