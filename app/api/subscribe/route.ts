// app/api/subscribe/route.ts
import { NextResponse } from "next/server";

type Body = { email?: string };

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

    const auth = { Authorization: `Bearer ${API_KEY}`, Accept: "application/json" };

    // --- 1) Lookup existing subscriber ---
    let subscriberId: string | null = null;
    {
      const r = await fetch(
        `${ML_API}/subscribers?filter[email]=${encodeURIComponent(email)}`,
        { headers: auth }
      );
      if (r.ok) {
        const j = (await r.json()) as { data?: Array<{ id: string }> };
        subscriberId = j?.data?.[0]?.id ?? null;
      }
    }

    // --- 2) If not found, create subscriber WITHOUT groups (important) ---
    if (!subscriberId) {
      const create = await fetch(`${ML_API}/subscribers`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // no groups here on purpose
      });

      if (!create.ok) {
        const t = await safeText(create);
        return NextResponse.json(
          { error: "Could not create subscriber.", details: t || undefined },
          { status: 502 }
        );
      }

      const cj = (await create.json()) as { data?: { id: string } };
      subscriberId = cj?.data?.id || null;

      if (!subscriberId) {
        return NextResponse.json(
          { error: "Subscriber created but ID not returned." },
          { status: 502 }
        );
      }
    }

    // --- 3) Best-effort: remove from group (if present) so re-join is guaranteed to fire ---
    await fetch(`${ML_API}/subscribers/${subscriberId}/groups/${GROUP_ID}`, {
      method: "DELETE",
      headers: auth,
    }).catch(() => {});

    // --- 4) Attach to the target group using the single-group endpoint (triggers “joins group”) ---
    const attach = await fetch(
      `${ML_API}/subscribers/${subscriberId}/groups/${GROUP_ID}`,
      { method: "POST", headers: auth }
    );

    if (!attach.ok) {
      const t = await safeText(attach);
      return NextResponse.json(
        { error: "Could not add subscriber to group.", details: t || undefined },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
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
