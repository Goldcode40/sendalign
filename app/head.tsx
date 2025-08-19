// app/head.tsx
export default function Head() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-7K53K2LK9"; // fallback just for verification

  return (
    <>
      {/* Simple marker so we can confirm this file is active in DevTools */}
      <meta name="ga-head-check" content="on" />

      {/* GA4 loader */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />

      {/* GA4 init */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  );
}
