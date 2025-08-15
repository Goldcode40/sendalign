"use client";

import Script from "next/script";

/**
 * Loads Plausible globally so window.plausible(...) is available.
 * Domain must match your live domain exactly (no protocol).
 */
export default function PlausibleScript() {
  return (
    <Script
      defer
      data-domain="sendalign.vercel.app"
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
