// app/page.tsx
import React from "react";
import Link from "next/link";

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
              <strong>SendAlign</strong> keeps team email clear, synced, and on‑track—no duplicate replies,
              no lost threads, and built‑in analytics to keep everyone aligned.
            </p>

            <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {/* Keep CTA simple; the actual conversion event is captured on the form submit below */}
              <a
                href="#join"
                className="btn btn-primary"
                style={{
                  padding: "12px 18px",
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "1px solid #0000",
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                Join the Waitlist →
              </a>
              <a
                href="#how-it-works"
                className="btn btn-secondary"
                style={{
                  padding: "12px 18px",
                  borderRadius: 8,
                  textDecoration: "none",
                  border: "1px solid #ddd",
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                How it works
              </a>
            </div>

            {/* Swap this <img> src for your existing mockup if you have one */}
            <div style={{ marginTop: 36 }}>
              <img
                src="/dashboard-mock.png"
                alt="SendAlign dashboard mockup"
                style={{
                  width: "100%",
                  maxWidth: 960,
                  height: "auto",
                  borderRadius: 12,
                  border: "1px solid #eee",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" aria-label="How it works" style={{ padding: "56px 0", background: "var(--bg-subtle, #fafafa)" }}>
        <div className="container" style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 28 }}>How SendAlign works</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            <HowCard
              icon="🔌"
              title="Connect your email"
              text="Works with Gmail & Outlook. Get started in minutes."
            />
            <HowCard
              icon="💬"
              title="Collaborate clearly"
              text="Shared context means no duplicate replies or lost threads."
            />
            <HowCard
              icon="📈"
              title="Stay aligned"
              text="Lightweight analytics & reminders keep everyone on the same page."
            />
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
            <li style={quoteStyle}>“Keeps our client comms sharp. Total game‑changer.”</li>
          </ul>
        </div>
      </section>

      {/* JOIN WAITLIST (Mailerlite embed lives here) */}
      <section id="join" aria-label="Join the waitlist" style={{ padding: "56px 0", background: "var(--bg-subtle, #fafafa)" }}>
        <div className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, marginBottom: 10 }}>Join the SendAlign waitlist</h2>
          <p style={{ textAlign: "center", color: "var(--muted, #555)", marginBottom: 24 }}>
            Be first in line for early access and help shape the roadmap.
          </p>

          {/* ↓↓↓ Keep your existing MailerLite FORM exactly here ↓↓↓
              - This is where your Plausible goal `join_waitlist` fires on successful submit.
              - If you had it working before, just ensure the <form> or embed sits inside this container.
          */}
          <div id="ml-embed" style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
            {/* Example placeholder: remove this block when your real form is in place */}
            <p style={{ margin: 0, color: "#777" }}>
              {/* Remove this line after you paste your MailerLite form embed code */}
              Paste your MailerLite form embed here.
            </p>
          </div>
          {/* ↑↑↑ MailerLite embed ends here ↑↑↑ */}
        </div>
      </section>

      {/* FOOTER (basic credibility links) */}
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
    </main>
  );
}

/* ---------- Small presentational helpers ---------- */

function HowCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 18,
        display: "grid",
        gap: 8,
      }}
    >
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
