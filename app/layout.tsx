// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "SendAlign — Inbox Deliverability & Compliance",
  description:
    "Audits SPF, DKIM, DMARC, adds one-click unsubscribe, and monitors spam-rate thresholds so you stay under 0.3%.",
  metadataBase: new URL("https://sendalign.com"),
  openGraph: {
    title: "SendAlign",
    description:
      "Inbox deliverability & compliance made simple.",
    url: "https://sendalign.com",
    siteName: "SendAlign",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SendAlign",
    description: "Inbox deliverability & compliance made simple.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // e.g. G-G7K53K2LK9

  return (
    <html lang="en">
      <head>
        {/* GA4 (loads only if NEXT_PUBLIC_GA_ID is set) */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        {/* MailerLite embed */}
        <Script
          src="https://groot.mailerlite.com/js/w/webforms.min.js"
          strategy="afterInteractive"
          onLoad={() => console.log("MailerLite script loaded ✅")}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
