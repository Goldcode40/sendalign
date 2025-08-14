import { NextResponse } from 'next/server';
import dns from 'dns/promises';

// simple timeout helper
function withTimeout<T>(p: Promise<T>, ms = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('DNS lookup timed out')), ms);
    p.then((v) => { clearTimeout(t); resolve(v); })
     .catch((e) => { clearTimeout(t); reject(e); });
  });
}

// very basic domain validation (keeps it simple for now)
function isValidDomain(d: string) {
  return /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(d);
}

export async function POST(request: Request) {
  try {
    const { domain } = await request.json();

    if (!domain || typeof domain !== 'string' || !isValidDomain(domain)) {
      return NextResponse.json({ error: 'Valid domain is required' }, { status: 400 });
    }

    const result = {
      domain,
      spfPass: false,
      dkimPass: false,
      dmarcPass: false,
      dmarcPolicy: 'missing' as 'reject' | 'quarantine' | 'none' | 'missing',
      records: {
        spf: [] as string[],
        dkim: [] as string[],     // any selector hits we find
        dmarc: '' as string | '',
      },
      notes: [] as string[],
    };

    // --- SPF ---
    try {
      const txt = await withTimeout(dns.resolveTxt(domain));
      const flattened = txt.map(parts => parts.join(''));
      result.records.spf = flattened.filter(v => v.toLowerCase().includes('v=spf1'));
      result.spfPass = result.records.spf.length > 0;
      if (!result.spfPass) result.notes.push('No SPF record with v=spf1 found.');
    } catch (e: any) {
      result.notes.push(`SPF lookup failed: ${e?.message || e}`);
    }

    // --- DKIM (try common selectors) ---
    const selectors = ['selector1', 'default', 'k1', 's1', 's2', 'mail'];
    for (const sel of selectors) {
      try {
        const host = `${sel}._domainkey.${domain}`;
        const txt = await withTimeout(dns.resolveTxt(host));
        const flattened = txt.map(parts => parts.join(''));
        const hits = flattened.filter(v =>
          v.toUpperCase().includes('DKIM1') || v.includes('p=')
        );
        if (hits.length > 0) {
          result.dkimPass = true;
          // include selector label so user sees which one resolved
          hits.forEach(h => result.records.dkim.push(`${host}: ${h}`));
        }
      } catch {
        // ignore individual selector failures
      }
      if (result.dkimPass) break; // one is enough to say "present"
    }
    if (!result.dkimPass) {
      result.notes.push('No DKIM TXT found on common selectors (e.g., selector1._domainkey).');
    }

    // --- DMARC ---
    try {
      const host = `_dmarc.${domain}`;
      const txt = await withTimeout(dns.resolveTxt(host));
      if (txt.length > 0) {
        const rec = txt[0].join('');
        result.records.dmarc = rec;
        const recLower = rec.toLowerCase();
        result.dmarcPass = recLower.includes('v=dmarc1');
        if (recLower.includes('p=reject')) result.dmarcPolicy = 'reject';
        else if (recLower.includes('p=quarantine')) result.dmarcPolicy = 'quarantine';
        else if (recLower.includes('p=none')) result.dmarcPolicy = 'none';
      } else {
        result.notes.push('No DMARC TXT record found at _dmarc.' + domain);
      }
    } catch (e: any) {
      result.notes.push(`DMARC lookup failed: ${e?.message || e}`);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
