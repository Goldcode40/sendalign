// components/Analytics.tsx
"use client";

import Script from "next/script";

export default function Analytics() {
  // Use your production domain (no protocol, no slash)
  const domain =
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "sendalign.vercel.app";

  return (
    <Script
      src="https://plausible.io/js/script.js"
      data-domain={domain}
      strategy="afterInteractive"
    />
  );
}
