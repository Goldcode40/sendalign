// app/api/generate-unsub/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

type Body = { email?: string; list?: string };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email, list = "main" }: Body = await req.json().catch(() => ({}));

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Build origin without next/headers (fixes TS build issue)
    const envOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    const reqOrigin = new URL(req.url).origin;
    const origin = envOrigin || reqOrigin;

    // Signed one-click unsubscribe URL
    const t = Date.now().toString();
    const secret = process.env.UNSUBSCRIBE_SECRET || "dev-secret";
    const sig = crypto
      .createHmac("sha256", secret)
      .update(`${email}:${list}:${t}`)
      .digest("hex");

    const url =
      `${origin}/api/unsubscribe` +
      `?email=${encodeURIComponent(email)}` +
      `&list=${encodeURIComponent(list)}` +
      `&t=${t}` +
      `&sig=${sig}`;

    return NextResponse.json({
      url,
      headers: {
        "List-Unsubscribe": `<${url}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Unexpected server error.", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
