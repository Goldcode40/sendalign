import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SendAlign — Inbox Deliverability & Compliance",
  description:
    "Keep your emails in inbox — not spam. SendAlign audits SPF, DKIM, DMARC and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager / Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G7K53K2LK9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-G7K53K2LK9');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
