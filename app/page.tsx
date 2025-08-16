// app/page.tsx
import React from "react";
import Link from "next/link";
import Script from "next/script";

/* -------------------- Client Signup Box (no external JS) -------------------- */
function SignupBox() {
  "use client";
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const submittedRef = React.useRef(false);

  const onSubmit = () => {
    submittedRef.current = true;
    setSubmitting(true);
  };

  const onIframeLoad = () => {
    // This will fire after the POST returns.
    if (submittedRef.current && !done) {
      setDone(true);
      setSubmitting(false);
      // @ts-ignore
      if (typeof window !== "undefined" && (window as any).plausible) {
        // @ts-ignore
        (window as any).plausible("join_waitlist");
      }
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 20,
      }}
    >
      {done ? (
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
      ) : (
        <>
          {/* Hidden iframe target to avoid page navigation */}
          <iframe
            name="ml_iframe"
            style={{ display: "none" }}
            onLoad={onIframeLoad}
          />
          <form
            action="https://assets.mailerlite.com/jsonp/1707319/forms/162292314122749781/subscribe"
            method="post"
            target="ml_iframe"
            onSubmit={onSubmit}
            style={{ display: "grid", gap: 12 }}
          >
            <input
              type="email"
              name="fields[email]"
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
          </form>
        </>
      )}
    </div>
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
              Your inbox deserves order, not chaos.
            </h1>
            <p style={{ fontSize: "18px", color: "var(--muted, #555)", margin: "0 auto 28px", maxWidth: 720 }}>
              <strong>SendAlign</strong> keeps team email clear, synced, and on-track — no duplicate replies,
              no lost threads, and built-in analytics to keep everyone aligned.
            </p>

            <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#join" style={{ padding: "12px 18px", borderRadius: 8, textDecoration: "none", border: "1px solid #0000", fontWeight: 600, display: "inline-block" }}>
                Join the Waitlist →
              </a>
              <a href="#how-it-works" style={{ padding: "12px 18px", borderRadius: 8, textDecoration: "none", border: "1px solid #ddd", fontWeight: 600, display: "inline-block" }}>
                How it works
              </a>
            </div>

            <div style={{ marginTop: 36 }}>
              <img
                src="/dashboard-mock.png"
                alt="SendAlign dashboard mockup"
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
            <HowCard icon="🔌" title="Connect your email" text="Works with Gmail & Outlook. Get started in minutes." />
            <HowCard icon="💬" title="Collaborate clearly" text="Shared context means no duplicate replies or lost threads." />
            <HowCard icon="📈" title="Stay aligned" text="Lightweight analytics & reminders keep everyone on the same page." />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" aria-label="Testimonials" style={{ padding: "48px 0" }}>
        <div className="container" style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 22 }}>What early users say</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
            <li style={quoteStyle}>“Finally — no more stepping on each other’s email replies.”</li>
            <li style={quoteStyle}>“SendAlign feels like Slack for email, but without the noise.”</li>
            <li style={quoteStyle}>“Keeps our client comms sharp. Total game-changer.”</li>
          </ul>
        </div>
      </section>

      {/* JOIN WAITLIST (No external JS) */}
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
        </div>
        <div style={{ textAlign: "center", marginTop: 10, color: "#888", fontSize: 13 }}>
          © {new Date().getFullYear()} SendAlign. All rights reserved.
        </div>
      </footer>

      {/* Plausible (already in layout) — leaving here in case it’s not */}
      <Script defer data-domain="sendalign.vercel.app" src="https://plausible.io/js/script.tagged-events.js" />
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
