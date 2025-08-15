// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Analytics from "../components/Analytics";

<head>
  <script
    defer
    data-domain="sendalign.vercel.app"
    src="https://plausible.io/js/script.js"
  ></script>
</head>

export const metadata: Metadata = {
  title: "SendAlign",
  description: "Align your outbound sends automatically.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
