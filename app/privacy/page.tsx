// app/privacy/page.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy • SendAlign",
  description: "How SendAlign handles your data and privacy.",
};

const LAST_UPDATED = "August 16, 2025";

export default function PrivacyPage() {
  return (
    <main style={{ padding: "56px 0" }}>
      <div className="container" style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}>
        <h1 style={{ fontSize: 36, lineHeight: 1.2, margin: "0 0 8px" }}>Privacy Policy</h1>
        <p style={{ color: "#777", margin: "0 0 24px" }}>Last updated: {LAST_UPDATED}</p>

        <Notice />

        <Section title="What we collect">
          <ul style={ul}>
            <li>
              <strong>Waitlist info:</strong> name and email address when you join the waitlist.
            </li>
            <li>
              <strong>Product emails:</strong> any replies you send us (for support/feedback).
            </li>
            <li>
              <strong>Analytics:</strong> privacy-friendly usage stats via Plausible (no cookies, no
              personal identifiers).
            </li>
          </ul>
        </Section>

        <Section title="How we use it">
          <ul style={ul}>
            <li>To provide updates, onboard early users, and improve SendAlign.</li>
            <li>To understand page performance and interest (aggregate analytics only).</li>
            <li>To contact you about early access or important changes.</li>
          </ul>
        </Section>

        <Section title="Email & unsubscribe">
          <p style={p}>
            Emails are sent via MailerLite. You can unsubscribe at any time using the link in any
            email, or by emailing <a href="mailto:privacy@sendalign.com">privacy@sendalign.com</a>.
          </p>
        </Section>

        <Section title="Data sharing">
          <p style={p}>
            We don’t sell personal data. We use trusted processors (e.g., MailerLite for email, Plausible
            for analytics) solely to run SendAlign. They process data on our behalf under their own
            privacy terms.
          </p>
        </Section>

        <Section title="Data retention">
          <p style={p}>
            We keep waitlist/contact data until you ask us to delete it or until it’s no longer needed for
            the purposes above. You can request deletion anytime.
          </p>
        </Section>

        <Section title="Your rights">
          <p style={p}>
            You can request access, correction, or deletion of your personal data by emailing{" "}
            <a href="mailto:privacy@sendalign.com">privacy@sendalign.com</a>.
          </p>
        </Section>

        <Section title="Security">
          <p style={p}>
            We take reasonable measures to protect your data. No method of transmission or storage is
            100% secure, but we aim for industry-standard safeguards.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p style={p}>
            We may update this page as the product evolves. We’ll change the “Last updated” date and, when
            material, notify waitlist subscribers.
          </p>
        </Section>

        <Section title="Contact">
          <p style={p}>
            Privacy questions? Email <a href="mailto:privacy@sendalign.com">privacy@sendalign.com</a> or{" "}
            <a href="mailto:info@sendalign.com">info@sendalign.com</a>.
          </p>
        </Section>

        <footer style={{ marginTop: 28, color: "#888", fontSize: 13 }}>
          © {new Date().getFullYear()} SendAlign. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

function Notice() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
        margin: "0 0 18px",
      }}
    >
      <p style={{ margin: 0, color: "#444" }}>
        This is a lightweight privacy notice for early testing. It’s not legal advice. If you have
        specific compliance needs (e.g., GDPR/CCPA), contact us and we’ll share details on data
        processors and DPA options.
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ margin: "22px 0" }}>
      <h2 style={{ fontSize: 22, margin: "0 0 10px" }}>{title}</h2>
      {children}
    </section>
  );
}

const p: React.CSSProperties = { color: "#444", margin: 0 };
const ul: React.CSSProperties = { margin: "0 0 0 18px", color: "#444", padding: 0 };
