// app/legal/dpa/page.tsx
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Addendum • SendAlign",
  description: "SendAlign Data Processing Addendum (early-access placeholder).",
};

export default function DpaPage() {
  return (
    <main style={{ padding: "56px 0" }}>
      <div
        className="container"
        style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px" }}
      >
        <h1 style={{ fontSize: 32, margin: "0 0 16px" }}>
          Data Processing Addendum (DPA)
        </h1>
        <p style={{ color: "#555", margin: "0 0 24px" }}>
          This placeholder outlines our intent to provide a formal DPA when
          required by customers under GDPR, CCPA, or similar regulations. For
          early access users, the following applies:
        </p>

        <ul style={{ margin: "0 0 18px 18px", color: "#444" }}>
          <li>
            We process personal data (e.g., email addresses) solely to operate
            the SendAlign service.
          </li>
          <li>
            We use trusted sub-processors (MailerLite for email, Plausible for
            analytics) bound by their own terms.
          </li>
          <li>
            We don’t sell personal data. We’ll sign a formal DPA with paying
            customers on request.
          </li>
        </ul>

        <p style={{ color: "#444" }}>
          For any questions or DPA requests, email{" "}
          <a href="mailto:privacy@sendalign.com">privacy@sendalign.com</a>.
        </p>

        <footer style={{ marginTop: 28, color: "#888", fontSize: 13 }}>
          © {new Date().getFullYear()} SendAlign. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
