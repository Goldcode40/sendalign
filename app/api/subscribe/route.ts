// app/api/subscribe/route.ts
import { NextResponse } from "next/server";

type Body = { email?: string; list?: string };

function isValidEmail(email: string) {
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

    // Helper for ML fetch
    const MLHeaders = {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // 1) Look up existing subscriber by email
    const searchRes = await fetch(
      `${ML_API}/subscribers?filter[email]=${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${API_KEY}`, Accept: "application/json" } }
    );

    let subscriberId: string | null = null;
    if (searchRes.ok) {
      const searchJson = (await searchRes.json()) as { data?: Array<{ id: string }> };
      subscriberId = searchJson?.data?.[0]?.id ?? null;
    }

    // 2) If subscriber already exists, try to remove them from the group first
    //    (so "joins group" will re-trigger on add)
    if (subscriberId) {
      // Best-effort detach; ignore errors quietly so flow continues
      await fetch(`${ML_API}/subscribers/${subscriberId}/groups/${GROUP_ID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${API_KEY}`, Accept: "application/json" },
      }).catch(() => {});
    }

    // 3) Create (or upsert) subscriber and assign the group — this should fire the automation
    const createRes = await fetch(`${ML_API}/subscribers`, {
      method: "POST",
      headers: MLHeaders,
      body: JSON.stringify({ email, groups: [GROUP_ID] }),
    });

    if (createRes.ok) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // 4) If API says “already exists”, ensure group assignment happens (re-attach)
    if (createRes.status === 409 || createRes.status === 422) {
      if (!subscriberId) {
        // Re-fetch id if we didn’t get it earlier
        const refetch = await fetch(
          `${ML_API}/subscribers?filter[email]=${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${API_KEY}`, Accept: "application/json" } }
        );
        if (refetch.ok) {
          const j = (await refetch.json()) as { data?: Array<{ id: string }> };
          subscriberId = j?.data?.[0]?.id ?? null;
        }
      }

      if (subscriberId) {
        const attachRes = await fetch(`${ML_API}/subscribers/${subscriberId}/groups`, {
          method: "POST",
          headers: MLHeaders,
          body: JSON.stringify({ groups: [GROUP_ID] }),
        });

        if (attachRes.ok) {
          return NextResponse.json({ ok: true }, { status: 200 });
        }

        const t = await safeText(attachRes);
        return NextResponse.json(
          { error: "Could not add subscriber to group.", details: t || undefined },
          { status: 502 }
        );
      }

      // If we still can’t find them, treat as soft success
      return NextResponse.json({ ok: true }, { status: 200 });
    }

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
