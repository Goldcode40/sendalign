// app/page.tsx
"use client";

import React from "react";
import Link from "next/link";

/* -------------------- Signup (calls /api/subscribe) -------------------- */
function SignupBox() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to subscribe");
      setDone(true);
      if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("join_waitlist");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        role="status"
        style={{
          padding: "14px 16px",
          borderRadius: 8,
          border: "1px solid #d1fadf",
          background: "#f0fff4",
          color: "#14532d",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        ✅ Thanks! You’re on the list. Please check your email.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email"
        style={{
          width: "100%",
          borderRadius: 8,
          border: "1px solid #ddd",
          padding: "12px 14px",
          fontSize: 16,
        }}
      />
      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: "12px 16px",
          borderRadius: 8,
          border: "1px solid #0000",
          fontWeight: 700,
          cursor: submitting ? "not-allowed" : "pointer",
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? "Submitting…" : "Join the Waitlist"}
      </button>
      {error && <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>}
    </form>
  );
}

/* ------------------------------- Page ------------------------------- */
export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section id="hero" aria-label="Hero" style={{ padding: "72px 0" }}>
        <div className="container" style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "42px", lineHeight: 1.1, margin: "0 0 16px" }}>
              Keep your emails in inbox — not spam.
            </h1>
            <p style={{ fontSize: "18px", color: "var(--muted, #555)", margin: "0 auto 28px", maxWidth: 760 }}>
              <strong>SendAlign</strong> is a deliverability & compliance copilot that audits and fixes
              <strong> SPF</strong>, <strong>DKIM</strong>, and <strong>DMARC</strong>, adds
              RFC-8058 one-click unsubscribe, and monitors Gmail/Yahoo spam-rate thresholds so you
              stay under <strong>0.3%</strong>.
            </p>

            <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href="#join"
                style={{ padding: "12px 18px", borderRadius: 8, textDecoration: "none", border: "1px solid #0000", fontWeight: 600, display: "inline-block" }}
              >
                Join the Waitlist →
              </a>
              <a
                href="#how-it-works"
                style={{ padding: "12px 18px", borderRadius: 8, textDecoration: "none", border: "1px solid #ddd", fontWeight: 600, display: "inline-block" }}
              >
                How it works
              </a>
            </div>

            <div style={{ marginTop: 36 }}>
              <img
                src="/dashboard-mock.png"
                alt="SendAlign compliance dashboard: SPF/DKIM/DMARC checks, one-click unsubscribe, and spam-rate monitoring"
                style={{ width: "100%", maxWidth: 960, height: "auto", borderRadius: 12, border: "1px solid #eee", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" aria-label="How it works" style={{ padding: "56px 0", background: "var(--bg-subtle, #fafafa)" }}>
        <div className="container" style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 28 }}>How SendAlign works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            <HowCard
              icon="🔎"
              title="Audit your domain"
              text="Detect SPF/DKIM/DMARC alignment, rDNS/TLS/BIMI, and List-Unsubscribe headers. Clear pass/fail checks."
            />
            <HowCard
              icon="🛠️"
              title="Fix with guided steps"
              text="Generate copy-paste DNS records, add RFC-8058 one-click unsubscribe, validate changes instantly."
            />
            <HowCard
              icon="📈"
              title="Monitor & alert"
              text="Pull Gmail Postmaster spam rate & reputation; warn when you trend over 0.3% so you can course-correct."
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (placeholders) */}
      <section id="testimonials" aria-label="Testimonials" style={{ padding: "48px 0" }}>
        <div className="container" style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 22 }}>What early users say</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
            <li style={quoteStyle}>“Setup took 10 minutes — DMARC finally aligned.”</li>
            <li style={quoteStyle}>“Postmaster alerts caught a spike before it became a problem.”</li>
            <li style={quoteStyle}>“One-click unsubscribe was the missing piece for Gmail compliance.”</li>
          </ul>
        </div>
      </section>

      {/* JOIN WAITLIST */}
      <section id="join" aria-label="Join the waitlist" style={{ padding: "56px 0", background: "var(--bg-subtle, #fafafa)" }}>
        <div className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 10 }}>Join the SendAlign waitlist</h2>
          <p style={{ textAlign: "center", color: "var(--muted, #555)", marginBottom: 24 }}>
            Be first in line for early access and help shape the roadmap.
          </p>
          <SignupBox />
        </div>
      </section>

      {/* FOOTER */}
      <footer aria-label="Footer" style={{ padding: "28px 0" }}>
        <div className="container" style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/about" style={footerLink}>About</Link>
          <a href="mailto:info@sendalign.com" style={footerLink}>Contact</a>
          <Link href="/privacy" style={footerLink}>Privacy</Link>
          <Link href="/legal/dpa" style={footerLink}>DPA</Link>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, color: "#888", fontSize: 13 }}>
          © {new Date().getFullYear()} SendAlign. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

/* ---------- helpers ---------- */
function HowCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 18, display: "grid", gap: 8 }}>
      <div aria-hidden="true" style={{ fontSize: 28, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ color: "var(--muted, #555)" }}>{text}</div>
    </div>
  );
}

const quoteStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  padding: "16px 18px",
  fontStyle: "italic",
};

const footerLink: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #eee",
};
