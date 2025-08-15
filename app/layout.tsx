// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Analytics from "../components/Analytics";

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
