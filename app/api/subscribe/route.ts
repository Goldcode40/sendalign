// app/api/subscribe/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.MAILERLITE_API_KEY; // set in Vercel
    const groupId = process.env.MAILERLITE_GROUP_ID; // set in Vercel (your "Waitlist" group)

    if (!apiKey || !groupId) {
      return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 500 });
    }

    // MailerLite v2 API
    const mlRes = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        groups: [groupId], // adds to your Waitlist group
        // You can pass name or custom_fields here if you add inputs later
      }),
    });

    if (!mlRes.ok) {
      const text = await mlRes.text();
      return NextResponse.json({ ok: false, error: text || "MailerLite error" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
