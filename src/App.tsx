import { useState, useRef, useEffect } from 'react';
import './styles.css';

interface ReviewFinding {
  severity: 'P1' | 'P2' | 'P3';
  category: string;
  message: string;
  line?: number;
  memoryHit?: string;
}

interface MemoryRule {
  pattern: string;
  rule: string;
  confidence: number;
  hits: number;
}

const SAMPLE_DIFF = `diff --git a/src/billing.ts b/src/billing.ts
+ export async function charge(user, amount) {
+   await fetch('/api/pay', {
+     method: 'POST',
+     body: JSON.stringify({ user, amount })
+   });
+ }
+
+ export function refund(txId) {
+   return fetch('/api/refund/' + txId, { method: 'DELETE' });
+ }`;

const MEMORY_RULES: MemoryRule[] = [
  { pattern: 'billing/*', rule: 'All external writes must include audit metadata (userId, timestamp, source)', confidence: 0.94, hits: 12 },
  { pattern: 'api/pay', rule: 'Payment endpoints require idempotency keys for retry safety', confidence: 0.91, hits: 8 },
  { pattern: 'fetch.*POST', rule: 'POST requests to external services must use typed request bodies', confidence: 0.87, hits: 15 },
  { pattern: 'DELETE', rule: 'Destructive operations need soft-delete flag check before execution', confidence: 0.82, hits: 6 },
  { pattern: '*.ts', rule: 'All exported functions require explicit return types', confidence: 0.79, hits: 23 },
];

function simulateReview(diff: string): ReviewFinding[] {
  const findings: ReviewFinding[] = [];
  if (diff.includes('fetch') && !diff.includes('idempotency')) {
    findings.push({ severity: 'P1', category: 'Security', message: 'Payment call has no idempotency key. Add a request key before retryable operations.', line: 3, memoryHit: 'api/pay → idempotency keys required (91% confidence, 8 prior hits)' });
  }
  if (diff.includes('JSON.stringify') && !diff.includes('interface') && !diff.includes('type ')) {
    findings.push({ severity: 'P2', category: 'Reliability', message: 'Team convention requires typed request bodies for billing endpoints. Define an interface for the payload.', line: 5, memoryHit: 'fetch.*POST → typed request bodies (87% confidence, 15 prior hits)' });
  }
  if (diff.includes('billing') || diff.includes('/api/pay')) {
    findings.push({ severity: 'P2', category: 'Compliance', message: 'Matched billing/* rule: all external writes must include audit metadata (userId, timestamp, source).', line: 2, memoryHit: 'billing/* → audit metadata (94% confidence, 12 prior hits)' });
  }
  if (diff.includes('function') && !diff.includes(': ')) {
    findings.push({ severity: 'P3', category: 'Style', message: 'Exported functions should have explicit return types per team convention.', line: 1 });
  }
  if (diff.includes('DELETE') && !diff.includes('softDelete')) {
    findings.push({ severity: 'P2', category: 'Data Safety', message: 'Destructive operation without soft-delete check. Verify soft-delete flag before permanent removal.', line: 9, memoryHit: 'DELETE → soft-delete flag check (82% confidence, 6 prior hits)' });
  }
  if (diff.includes('string concatenation') || (diff.includes("'/") && diff.includes('+ '))) {
    findings.push({ severity: 'P3', category: 'Security', message: 'URL constructed with string concatenation. Use template literals or URL builder to prevent injection.', line: 9 });
  }
  return findings;
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = { P1: '#ef4444', P2: '#f59e0b', P3: '#6b7280' };
  return <span style={{ background: colors[severity] || '#6b7280', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{severity}</span>;
}

export default function App() {
  const [diff, setDiff] = useState('');
  const [findings, setFindings] = useState<ReviewFinding[]>([]);
  const [stage, setStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const stages = [
    'Validating webhook signature (HMAC-SHA256)…',
    'Parsing changed files and diff hunks…',
    'Querying SQLite memory for matching rules…',
    'Generating structured review with LLM…',
    'Formatting inline PR comments…',
    'Review complete — ready to post'
  ];

  useEffect(() => { return () => timerRef.current.forEach(clearTimeout); }, []);

  function runReview() {
    const input = diff.trim() || SAMPLE_DIFF;
    if (!diff.trim()) setDiff(SAMPLE_DIFF);
    setFindings([]);
    setStage(0);
    setRunning(true);
    timerRef.current = [];
    stages.forEach((_, i) => {
      const t = setTimeout(() => {
        setStage(i);
        if (i === stages.length - 1) {
          setFindings(simulateReview(input));
          setRunning(false);
        }
      }, (i + 1) * 700);
      timerRef.current.push(t);
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <header style={{ borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1f7a5c, #f4b740)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>CR</div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>AI Code Reviewer</span>
          <span style={{ fontSize: 12, color: '#64748b', background: '#1e293b', padding: '2px 8px', borderRadius: 4 }}>with Memory</span>
        </div>
        <button onClick={() => setShowMemory(!showMemory)} style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          {showMemory ? 'Hide' : 'Show'} Memory Bank ({MEMORY_RULES.length} rules)
        </button>
      </header>

      {showMemory && (
        <div style={{ margin: '16px 24px', background: '#111827', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#94a3b8' }}>📚 Learned Convention Rules (SQLite)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b' }}><th style={{ textAlign: 'left', padding: 8 }}>Pattern</th><th style={{ textAlign: 'left', padding: 8 }}>Rule</th><th style={{ textAlign: 'right', padding: 8 }}>Confidence</th><th style={{ textAlign: 'right', padding: 8 }}>Hits</th></tr></thead>
            <tbody>{MEMORY_RULES.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: 8, fontFamily: 'monospace', color: '#1f7a5c' }}>{r.pattern}</td>
                <td style={{ padding: 8 }}>{r.rule}</td>
                <td style={{ padding: 8, textAlign: 'right', color: r.confidence > 0.9 ? '#22c55e' : '#f59e0b' }}>{(r.confidence * 100).toFixed(0)}%</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{r.hits}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 24, maxWidth: 1400, margin: '0 auto' }}>
        <div>
          <label style={{ fontSize: 13, color: '#94a3b8', display: 'block', marginBottom: 8 }}>Paste a pull request diff</label>
          <textarea value={diff} onChange={e => setDiff(e.target.value)} placeholder={SAMPLE_DIFF} rows={16} style={{ width: '100%', background: '#111827', border: '1px solid #1e293b', borderRadius: 8, padding: 14, color: '#e2e8f0', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, resize: 'vertical', lineHeight: 1.6 }} />
          <button onClick={runReview} disabled={running} style={{ marginTop: 12, width: '100%', padding: '12px 20px', background: running ? '#334155' : 'linear-gradient(135deg, #1f7a5c, #16a34a)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: running ? 'not-allowed' : 'pointer' }}>
            {running ? 'Reviewing…' : '🔍 Review Diff'}
          </button>

          {stage >= 0 && (
            <div style={{ marginTop: 20, background: '#111827', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#94a3b8' }}>Pipeline Stages</h3>
              {stages.map((s, i) => (
                <div key={i} style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: 8, opacity: i <= stage ? 1 : 0.3, transition: 'opacity 0.3s' }}>
                  <span style={{ fontSize: 14 }}>{i < stage ? '✅' : i === stage ? (running ? '⏳' : '✅') : '⬜'}</span>
                  <span style={{ fontSize: 13 }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, color: '#94a3b8' }}>Review Findings</h2>
          {findings.length === 0 && stage < 0 && <p style={{ color: '#475569', fontSize: 14 }}>Run a review to see findings here.</p>}
          {findings.length === 0 && running && <p style={{ color: '#475569', fontSize: 14 }}>Analyzing diff…</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {findings.map((f, i) => (
              <div key={i} style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: 8, padding: 16, animation: 'fadeIn 0.3s ease-in' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <SeverityBadge severity={f.severity} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{f.category}</span>
                  {f.line && <span style={{ fontSize: 12, color: '#64748b', marginLeft: 'auto' }}>Line {f.line}</span>}
                </div>
                <p style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.5 }}>{f.message}</p>
                {f.memoryHit && (
                  <div style={{ fontSize: 12, color: '#1f7a5c', background: '#0a1f17', padding: '6px 10px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>🧠</span> Memory: {f.memoryHit}
                  </div>
                )}
              </div>
            ))}
          </div>

          {findings.length > 0 && (
            <div style={{ marginTop: 20, background: '#111827', border: '1px solid #1e293b', borderRadius: 8, padding: 16 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 14, color: '#94a3b8' }}>Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {['P1', 'P2', 'P3'].map(s => (
                  <div key={s} style={{ textAlign: 'center', padding: 12, background: '#0a0f1a', borderRadius: 8 }}>
                    <SeverityBadge severity={s} />
                    <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{findings.filter(f => f.severity === s).length}</div>
                  </div>
                ))}
              </div>
              <p style={{ margin: '12px 0 0', fontSize: 13, color: '#64748b' }}>Memory rules matched: {findings.filter(f => f.memoryHit).length} / {findings.length} findings backed by learned conventions.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
