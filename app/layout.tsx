/* app/layout.tsx */
import type { Metadata } from "next";
import React from "react";
// Keep or adjust this import to match your stylesheet setup
import "./globals.css";
import PlausibleScript from "../components/PlausibleScript";

export const metadata: Metadata = {
  title: "SendAlign",
  description: "Get to inbox. Stay compliant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Loads window.plausible globally */}
        <PlausibleScript />
      </head>
      <body className="antialiased bg-white">{children}</body>
    </html>
  );
}
