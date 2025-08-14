'use client';

import React, { useMemo, useState } from 'react';

/* ---------------- Types ---------------- */
type CheckResult = {
  domain: string;
  spfPass: boolean;
  dkimPass: boolean;
  dmarcPass: boolean;
  dmarcPolicy: 'reject' | 'quarantine' | 'none' | 'missing';
  records: {
    spf: string[];
    dkim: string[];
    dmarc: string | '';
  };
  notes: string[];
  error?: string;
};

/* ---------------- Component ---------------- */
export default function Home() {
  /* Domain checker state */
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  /* Unsubscribe generator state */
  const [email, setEmail] = useState('');
  const [listId, setListId] = useState('main');
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [genOut, setGenOut] = useState<{ url: string; headers: Record<string, string> } | null>(null);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/check-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) setError(data?.error || 'Unknown error');
      else setResult(data as CheckResult);
    } catch (err: any) {
      setError(err?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  function CopyBtn({ text, id }: { text: string; id: string }) {
    return (
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(id);
          setTimeout(() => setCopied((c) => (c === id ? null : c)), 1200);
        }}
        className="text-xs rounded border border-gray-300 px-2 py-1 hover:bg-gray-50"
        type="button"
      >
        {copied === id ? 'Copied!' : 'Copy'}
      </button>
    );
  }

  const pill = (text: string, state: 'pass' | 'warn' | 'fail') => {
    const classes =
      state === 'pass'
        ? 'bg-green-100 text-green-800'
        : state === 'warn'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800';
    return <span className={`px-3 py-1 rounded-full text-sm ${classes}`}>{text}</span>;
  };

  const dmarcState = (r: CheckResult) => {
    if (!r.dmarcPass || r.dmarcPolicy === 'missing') return 'fail';
    if (r.dmarcPolicy === 'none') return 'warn';
    return 'pass';
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );

  // Suggested DNS (SPF/DMARC) — unchanged from prior step
  const suggestions = useMemo(() => {
    if (!result) return null;
    const name = result.domain;
    const spf = `v=spf1 a mx ~all`;
    const rua = `mailto:dmarc@${name}`;
    const ruf = `mailto:dmarc@${name}`;
    const dmarc = `v=DMARC1; p=quarantine; pct=100; rua=${rua}; ruf=${ruf}; fo=1; sp=quarantine; aspf=r; adkim=r`;
    const showSpf = !result.spfPass || result.records.spf.length === 0;
    const showDmarc = !result.dmarcPass || result.dmarcPolicy === 'none' || !result.records.dmarc;
    if (!showSpf && !showDmarc) return null;
    return { spf, dmarc, showSpf, showDmarc };
  }, [result]);

  /* Generate List-Unsubscribe */
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenLoading(true);
    setGenError(null);
    setGenOut(null);

    try {
      const res = await fetch('/api/generate-unsub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, list: listId }),
      });
      const data = await res.json();
      if (!res.ok) setGenError(data?.error || 'Unknown error');
      else setGenOut(data);
    } catch (err: any) {
      setGenError(err?.message || 'Request failed');
    } finally {
      setGenLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-1">SendAlign</h1>
          <p className="text-gray-600">Get to inbox. Stay compliant.</p>
        </header>

        {/* Domain Checker */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Domain Compliance Check</h2>
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="yourdomain.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value.trim())}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
              pattern="^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
              title="Enter a valid domain, e.g., example.com"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-50 inline-flex items-center justify-center"
            >
              {loading ? 'Checking…' : 'Check'}
            </button>
          </form>

          {error && <div className="rounded-md bg-red-50 text-red-700 p-3 mb-4">{error}</div>}

          {result && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {pill(`SPF: ${result.spfPass ? 'Pass' : 'Missing/Fail'}`, result.spfPass ? 'pass' : 'fail')}
                {pill(`DKIM: ${result.dkimPass ? 'Pass' : 'Missing'}`, result.dkimPass ? 'pass' : 'fail')}
                {pill(
                  result.dmarcPass ? `DMARC: Pass (${result.dmarcPolicy})` : 'DMARC: Missing',
                  dmarcState(result) as 'pass' | 'warn' | 'fail'
                )}
              </div>

              <Section title="SPF record(s)">
                {result.records.spf.length > 0 ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {result.records.spf.map((r, i) => (
                      <li key={i}>
                        <code className="bg-gray-100 px-1 py-0.5 rounded break-all">{r}</code>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-700">
                    No SPF TXT with <code>v=spf1</code> found.
                  </div>
                )}
              </Section>

              <Section title="DKIM record(s) found">
                {result.records.dkim.length > 0 ? (
                  <ul className="list-disc ml-5 space-y-1">
                    {result.records.dkim.map((r, i) => (
                      <li key={i}>
                        <code className="bg-gray-100 px-1 py-0.5 rounded break-all">{r}</code>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-700">
                    No DKIM TXT found on common selectors (<code>selector1</code>, <code>default</code>,{' '}
                    <code>k1</code>, <code>s1</code>, <code>s2</code>, <code>mail</code>). Set up DKIM in your provider.
                  </div>
                )}
              </Section>

              <Section title="DMARC policy">
                {result.records.dmarc ? (
                  <code className="bg-gray-100 px-1 py-0.5 rounded break-all">{result.records.dmarc}</code>
                ) : (
                  <div className="text-sm text-gray-700">
                    No DMARC TXT at <code>_dmarc.{result.domain}</code>.
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-2">
                  Best practice: start at <span className="font-medium">quarantine</span>, then move to{' '}
                  <span className="font-medium">reject</span> once aligned.
                </div>
              </Section>

              {/* Suggested DNS */}
              {suggestions && (
                <Section title="Suggested DNS records">
                  <div className="text-sm text-gray-700 mb-3">
                    Add these TXT records at your DNS host (e.g., Cloudflare, GoDaddy).
                  </div>

                  {suggestions.showSpf && (
                    <div className="mb-3">
                      <div className="font-medium">SPF (host/root <code>@</code>):</div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded break-all">v=spf1 a mx ~all</code>
                        <CopyBtn id="spf" text="v=spf1 a mx ~all" />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Append your sender includes, e.g., <code>include:_spf.google.com</code>.
                      </div>
                    </div>
                  )}

                  {suggestions.showDmarc && (
                    <div className="mb-1">
                      <div className="font-medium">
                        DMARC (host: <code>_dmarc</code>):
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-gray-100 px-2 py-1 rounded break-all">
                          {suggestions.dmarc}
                        </code>
                        <CopyBtn id="dmarc" text={suggestions.dmarc} />
                      </div>
                    </div>
                  )}
                </Section>
              )}

              {result.notes.length > 0 && (
                <Section title="Notes">
                  <ul className="list-disc ml-5 space-y-1">
                    {result.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          )}
        </section>

        {/* Unsubscribe Header Generator */}
        <section>
          <h2 className="text-xl font-semibold mb-3">One‑Click Unsubscribe (RFC 8058) Generator</h2>
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <input
              type="email"
              placeholder="recipient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              type="text"
              placeholder="list id (e.g., main)"
              value={listId}
              onChange={(e) => setListId(e.target.value.trim())}
              className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={genLoading}
              className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-50"
            >
              {genLoading ? 'Generating…' : 'Generate headers'}
            </button>
          </form>

          {genError && <div className="rounded-md bg-red-50 text-red-700 p-3 mb-4">{genError}</div>}

          {genOut && (
            <div className="space-y-3">
              <Section title="One‑click URL">
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded break-all">{genOut.url}</code>
                  <CopyBtn id="url" text={genOut.url} />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  This is the URL your ESP will call via POST when a recipient clicks “Unsubscribe”.
                </div>
              </Section>

              <Section title="Email headers to add">
                <div className="flex items-center gap-2 mb-2">
                  <code className="bg-gray-100 px-2 py-1 rounded break-all">
                    List-Unsubscribe: &lt;{genOut.url}&gt;
                  </code>
                  <CopyBtn id="h1" text={`List-Unsubscribe: <${genOut.url}>`} />
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded break-all">
                    List-Unsubscribe-Post: List-Unsubscribe=One-Click
                  </code>
                  <CopyBtn id="h2" text={`List-Unsubscribe-Post: List-Unsubscribe=One-Click`} />
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  Add both headers to promotional/commercial email to meet Gmail/Yahoo bulk‑sender rules.
                </div>
              </Section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
