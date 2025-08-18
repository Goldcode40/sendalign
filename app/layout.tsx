// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const siteUrl = "https://sendalign.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-7K53K2LK9"; // fall back so we can verify

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SendAlign — Inbox Deliverability & Compliance Copilot",
    template: "%s · SendAlign",
  },
  description:
    "Keep your emails in inbox — not spam. SendAlign audits & fixes SPF, DKIM, and DMARC, adds RFC-8058 one-click unsubscribe, and monitors Gmail/Yahoo spam-rate thresholds (<0.3%).",
  alternates: { canonical: "/" },
  keywords: [
    "SPF", "DKIM", "DMARC",
    "one-click unsubscribe", "RFC 8058",
    "Gmail bulk sender rules", "Yahoo sender requirements",
    "email deliverability", "Google Postmaster Tools",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "SendAlign",
    title: "SendAlign — Inbox Deliverability & Compliance Copilot",
    description:
      "Automate SPF, DKIM, DMARC, one-click unsubscribe, and Postmaster monitoring so you stay under 0.3% spam complaints.",
    images: [
      { url: "/dashboard-mock.png", width: 1200, height: 630, alt: "SendAlign dashboard" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SendAlign — Inbox Deliverability & Compliance Copilot",
    description:
      "Automate SPF, DKIM, DMARC, one-click unsubscribe, and Postmaster monitoring so you stay under 0.3% spam complaints.",
    images: ["/dashboard-mock.png"],
  },
  icons: { icon: "/favicon.ico", apple: "/icon.png" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* --- Plausible (working) --- */}
        <Script
          defer
          data-domain="sendalign.com"
          src="https://plausible.io/js/script.tagged-events.js"
        />

        {/* --- GA4 (must be afterInteractive and in body) --- */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `}
        </Script>
      </body>
    </html>
  );
}
