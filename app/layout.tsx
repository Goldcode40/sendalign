// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://sendalign.vercel.app"),
  title: {
    default: "SendAlign",
    template: "%s • SendAlign",
  },
  description: "Keep team email clear, synced, and on-track — without duplicate replies or lost threads.",
  alternates: {
    canonical: "/",
  },
  icons: {
    // Classic favicon served from /public
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    // App icon for modern browsers / iOS
    apple: "/icon.png",
  },
  openGraph: {
    title: "SendAlign",
    description:
      "Keep team email clear, synced, and on-track — without duplicate replies or lost threads.",
    url: "https://sendalign.vercel.app",
    siteName: "SendAlign",
    images: [
      {
        url: "/dashboard-mock.png", // replace with a real image when ready
        width: 1200,
        height: 630,
        alt: "SendAlign dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SendAlign",
    description:
      "Keep team email clear, synced, and on-track — without duplicate replies or lost threads.",
    images: ["/dashboard-mock.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Extra compatibility links (Next will dedupe with metadata icons) */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon.png" />

        {/* Viewport for responsive layout */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Plausible analytics (tagged events build) */}
        {/* If you switch to a custom domain later, change data-domain to e.g. sendalign.com */}
        <Script
          defer
          data-domain="sendalign.vercel.app"
          src="https://plausible.io/js/script.tagged-events.js"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
