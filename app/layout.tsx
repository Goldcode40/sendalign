// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://sendalign.vercel.app"; // swap to https://sendalign.com once the custom domain is live

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SendAlign — Inbox Deliverability & Compliance Copilot",
    template: "%s · SendAlign",
  },
  description:
    "Keep your emails in inbox — not spam. SendAlign audits & fixes SPF, DKIM, DMARC, adds RFC-8058 one-click unsubscribe, and monitors Gmail/Yahoo spam-rate thresholds (<0.3%).",
  keywords: [
    "SPF",
    "DKIM",
    "DMARC",
    "one-click unsubscribe",
    "RFC 8058",
    "Gmail bulk sender rules",
    "Yahoo sender requirements",
    "email deliverability",
    "Google Postmaster Tools",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "SendAlign",
    title: "SendAlign — Inbox Deliverability & Compliance Copilot",
    description:
      "Automate SPF, DKIM, DMARC, one-click unsubscribe, and Postmaster monitoring so you stay under 0.3% spam complaints.",
    images: [
      {
        url: "/dashboard-mock.png",
        width: 1200,
        height: 630,
        alt: "SendAlign compliance dashboard (SPF/DKIM/DMARC & spam-rate monitoring)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SendAlign — Inbox Deliverability & Compliance Copilot",
    description:
      "Automate SPF, DKIM, DMARC, one-click unsubscribe, and Postmaster monitoring so you stay under 0.3% spam complaints.",
    images: ["/dashboard-mock.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png", // lives in /app or /public depending on your setup; both are fine for Next metadata
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Plausible analytics */}
        <Script
          defer
          data-domain="sendalign.vercel.app" // change to your custom domain when live
          src="https://plausible.io/js/script.tagged-events.js"
        />
      </body>
    </html>
  );
}
