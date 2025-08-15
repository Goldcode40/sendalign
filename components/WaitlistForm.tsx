// components/WaitlistForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function WaitlistForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!isValid) {
      setErr("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, list: "main" }),
      });

      if (res.ok) {
        if (typeof window !== "undefined" && (window as any).plausible) {
        (window as any).plausible("join_waitlist", { props: { source: "hero" } });
        }
        router.push("/success");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setErr(data?.error || "Something went wrong. Please try again.");
    } catch {
      setErr("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="flex-1 rounded-md border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md border px-4 py-2 font-medium hover:bg-gray-50 disabled:opacity-60"
        >
          {loading ? "Joining…" : "Join waitlist"}
        </button>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <p className="text-xs text-gray-500">
        By joining, you agree to receive product updates. Unsubscribe anytime.
      </p>
    </form>
  );
}
