// components/SocialProof.tsx
"use client";

export default function SocialProof() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blurb 1 */}
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-700">
              “Finally, a clear pass/fail on SPF, DKIM, and DMARC in one place.”
            </p>
            <div className="mt-3 text-xs text-gray-500">Beta tester • SaaS founder</div>
          </div>
          {/* Blurb 2 */}
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-700">
              “Took our deliverability from guesswork to green checks in an afternoon.”
            </p>
            <div className="mt-3 text-xs text-gray-500">Lifecycle marketer</div>
          </div>
          {/* Blurb 3 */}
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-700">
              “The one-click unsubscribe generator is a lifesaver for Gmail/Yahoo rules.”
            </p>
            <div className="mt-3 text-xs text-gray-500">ESP consultant</div>
          </div>
        </div>
      </div>
    </section>
  );
}
