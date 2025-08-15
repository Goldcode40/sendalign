// app/api/subscribe/route.ts
import { NextResponse } from "next/server";

type Body = { email?: string; list?: string };

function isValidEmail(email: string) {
  // Simple RFC5322-ish check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const ML_API = "https://connect.mailerlite.com/api";

export async function POST(req: Request) {
  try {
    const { email }: Body = await req.json().catch(() => ({}));

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const API_KEY = process.env.MAILERLITE_API_KEY;
    const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

    if (!API_KEY || !GROUP_ID) {
      return NextResponse.json(
        { error: "Server is missing MailerLite configuration." },
        { status: 500 }
      );
    }

    // 1) Try to create/update subscriber and attach to group in one go
    // MailerLite v2 will create (or upsert) and assign groups when provided.
    const createRes = await fetch(`${ML_API}/subscribers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        groups: [GROUP_ID],
      }),
      // Optional: set a short timeout by race, omitted here for simplicity
    });

    if (createRes.ok) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // If create failed (e.g., already exists), try to fetch by email and ensure group membership.
    // Some tenants receive 409/422 for existing subscribers—handle gracefully.
    if (createRes.status === 409 || createRes.status === 422) {
      // 2) Lookup existing subscriber by email
      const searchRes = await fetch(
        `${ML_API}/subscribers?filter[email]=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: "application/json",
          },
        }
      );

      if (!searchRes.ok) {
        const t = await safeText(searchRes);
        return NextResponse.json(
          { error: "Could not verify subscriber.", details: t },
          { status: 502 }
        );
      }

      const searchJson = (await searchRes.json()) as {
        data?: Array<{ id: string }>;
      };

      const subscriberId = searchJson?.data?.[0]?.id;
      if (!subscriberId) {
        // If we can’t find them but creation said conflict, treat as soft success anyway
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      // 3) Ensure they’re in the group
      const attachRes = await fetch(
        `${ML_API}/subscribers/${subscriberId}/groups`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ groups: [GROUP_ID] }),
        }
      );

      if (attachRes.ok) {
        return NextResponse.json({ ok: true }, { status: 200 });
      }

      const attachErr = await safeText(attachRes);
      return NextResponse.json(
        { error: "Could not add subscriber to group.", details: attachErr },
        { status: 502 }
      );
    }

    // Other errors — forward a concise message
    const errText = await safeText(createRes);
    return NextResponse.json(
      { error: "Subscription failed.", details: errText || undefined },
      { status: 502 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "Unexpected server error.", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}

async function safeText(res: Response) {
  try {
    const txt = await res.text();
    return txt?.slice(0, 500);
  } catch {
    return "";
  }
}
