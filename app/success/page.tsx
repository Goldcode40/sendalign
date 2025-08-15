// app/success/page.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're on the list | SendAlign",
  description: "Thanks for joining the SendAlign waitlist.",
};

export default function SuccessPage() {
  return (
    <main className="min-h-[70vh] mx-auto max-w-2xl px-6 py-20 flex flex-col items-center text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border">
        <span aria-hidden>✅</span>
      </div>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight">
        You’re on the list!
      </h1>

      <p className="mt-3 text-base text-muted-foreground">
        We’ve sent a quick welcome email. If you don’t see it, check your spam or
        promotions tab and whitelist <strong>hello@sendalign.com</strong>.
      </p>

      <ul className="mt-6 space-y-2 text-left text-sm text-muted-foreground">
        <li>• Expect early access invites and progress updates.</li>
        <li>• You can unsubscribe anytime in one click.</li>
      </ul>

      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
      >
        ← Back to home
      </Link>
    </main>
  );
}
