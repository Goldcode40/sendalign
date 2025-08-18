// components/Analytics.tsx
"use client";

import Script from "next/script";

export default function Analytics() {
  const plausibleDomain =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "sendalign.com";
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID; // e.g. G-G7K53K2LK9

  return (
    <>
      {/* Plausible (keeps your current analytics) */}
      <Script
        src="https://plausible.io/js/script.js"
        data-domain={plausibleDomain}
        strategy="afterInteractive"
      />

      {/* Google Analytics 4 (only loads if env is set) */}
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
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </>
  );
}
