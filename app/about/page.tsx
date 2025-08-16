// app/about/page.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About • SendAlign",
  description: "About SendAlign — the simple way to keep team email aligned.",
};

export default function AboutPage() {
  return (
    <main style={{ padding: "56px 0" }}>
      <div className="container" style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: 36, lineHeight: 1.2, margin: "0 0 16px" }}>About SendAlign</h1>
        <p style={{ color: "#555", margin: "0 0 24px" }}>
          SendAlign keeps team email clear, synced, and on-track. No more duplicate replies, missed
          follow-ups, or scattered context. We’re building a focused tool that makes conversation
          handoffs and client comms effortless.
        </p>

        <section style={section}>
          <h2 style={h2}>Why we’re building this</h2>
          <p style={p}>
            Teams still run on email, but most inboxes weren’t designed for collaboration. We want
            the best parts of a shared inbox without the bloat, and just enough analytics to keep
            everyone aligned.
          </p>
        </section>

        <section style={section}>
          <h2 style={h2}>What’s coming</h2>
          <ul style={ul}>
            <li>Gmail/Outlook connection (shared context, no stepping on replies)</li>
            <li>Lightweight analytics to spot stuck threads & response gaps</li>
            <li>Reminders and gentle nudges to keep conversations moving</li>
          </ul>
        </section>

        <section style={section}>
          <h2 style={h2}>Contact</h2>
          <p style={p}>
            Questions, feedback, or early access? Email{" "}
            <a href="mailto:info@sendalign.com">info@sendalign.com</a>.
          </p>
        </section>

        <footer style={{ marginTop: 28, color: "#888", fontSize: 13 }}>
          © {new Date().getFullYear()} SendAlign. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

const section: React.CSSProperties = { margin: "22px 0" };
const h2: React.CSSProperties = { fontSize: 22, margin: "0 0 10px" };
const p: React.CSSProperties = { color: "#444", margin: 0 };
const ul: React.CSSProperties = { margin: "0 0 0 18px", color: "#444", padding: 0 };
