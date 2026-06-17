import React, { useState } from 'react';
import { Copy, Check, ArrowRight, BookOpen, SlidersHorizontal, Grid, Layers, ChevronRight } from 'lucide-react';

/* ── Code Snippet ─────────────────────────────────────────────────────────── */
const CodeSnippet = ({ code, color = '#10b981' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-snippet-box" style={{ marginTop: '1rem', border: `1px solid ${color}40` }}>
      <div className="code-header" style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
        <span style={{ color, fontWeight: 600 }}>Python Code + Output</span>
        <button
          className={`btn btn-copy ${copied ? 'copied' : ''}`}
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="pre-code" style={{ margin: 0, border: 'none', background: 'transparent' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

/* ── Step-by-step breakdown box ───────────────────────────────────────────── */
const StepBox = ({ steps, color }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
    {steps.map((s, i) => (
      <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
        <div style={{
          background: color, color: '#fff', fontWeight: 800,
          fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem',
          borderRadius: '50%', width: '26px', height: '26px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>{i + 1}</div>
        <div style={{ paddingTop: '3px' }}>
          <span style={{ color, fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem' }}>{s.title}: </span>
          <span style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.6 }}>{s.body}</span>
        </div>
      </div>
    ))}
  </div>
);

/* ── Salary Binarization Visual ───────────────────────────────────────────── */
const SalaryDemo = ({ threshold }) => {
  const salaries = [3, 4.5, 6, 7, 8.5, 10, 12, 15];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', margin: '1rem 0' }}>
      {salaries.map((s, i) => {
        const isHigh = s > threshold;
        return (
          <div key={i} style={{
            background: isHigh ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.1)',
            border: `1.5px solid ${isHigh ? 'rgba(16,185,129,0.4)' : 'rgba(248,113,113,0.3)'}`,
            borderRadius: '12px', padding: '0.75rem 1rem', textAlign: 'center',
            minWidth: '80px', transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>Salary</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#e2e8f0', fontSize: '0.92rem' }}>{s} lac</div>
            <div style={{ margin: '0.3rem 0', fontSize: '0.75rem', color: '#475569' }}>→</div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 800,
              fontSize: '1.3rem', color: isHigh ? '#10b981' : '#f87171'
            }}>{isHigh ? 1 : 0}</div>
            <div style={{ fontSize: '0.65rem', color: isHigh ? '#10b981' : '#f87171', marginTop: '0.15rem' }}>
              {isHigh ? 'High' : 'Low'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Interactive Slider Demo ──────────────────────────────────────────────── */
const InteractiveDemo = () => {
  const [threshold, setThreshold] = useState(7);
  const values = [3, 4.5, 6, 7, 8.5, 10, 12, 15];

  return (
    <div style={{ background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <SlidersHorizontal size={16} style={{ color: '#10b981' }} />
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#10b981', fontSize: '1rem' }}>
          Salary Binarizer — Move the Threshold
        </span>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Threshold (in Lakhs)</span>
          <span style={{ color: '#10b981', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem' }}>
            {threshold} lac
          </span>
        </div>
        <input
          type="range" min={1} max={14} step={0.5} value={threshold}
          onChange={e => setThreshold(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', height: '6px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', marginTop: '0.25rem' }}>
          <span>1 lac</span><span>14 lac</span>
        </div>
      </div>

      <SalaryDemo threshold={threshold} />

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', color: '#94a3b8' }}>
        Rule: &nbsp;
        <span style={{ color: '#10b981' }}>Salary &gt; {threshold} lac → 1 (High)</span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <span style={{ color: '#f87171' }}>Salary ≤ {threshold} lac → 0 (Low)</span>
      </div>
    </div>
  );
};

/* ── Pixel Grid for Image Binarization ────────────────────────────────────── */
const PixelGrid = ({ values, threshold, cols = 8 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '3px' }}>
    {values.map((v, i) => {
      const bin = v > threshold ? 1 : 0;
      return (
        <div key={i} style={{
          aspectRatio: '1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: bin === 1 ? '#f8fafc' : '#0f172a',
          border: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.55rem', color: bin === 1 ? '#1e293b' : '#334155',
          fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, transition: 'background 0.3s'
        }}>
          {bin}
        </div>
      );
    })}
  </div>
);

/* ── Binning Visual ───────────────────────────────────────────────────────── */
const BinVisual = ({ data, bins, labels, color }) => {
  const getBin = (val) => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (val > bins[i] && val <= bins[i + 1]) return i;
    }
    return 0;
  };
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0' }}>
      {data.map((v, i) => {
        const binIdx = getBin(v);
        const c = colors[binIdx % colors.length];
        return (
          <div key={i} style={{
            background: `${c}15`, border: `1.5px solid ${c}40`,
            borderRadius: '10px', padding: '0.5rem 0.75rem', textAlign: 'center', minWidth: '60px'
          }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#e2e8f0', fontSize: '0.9rem' }}>{v}</div>
            <div style={{ fontSize: '0.65rem', color: c, fontWeight: 600, marginTop: '0.2rem' }}>
              {labels[binIdx]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function Binarization() {
  const [activeTab, setActiveTab] = useState('what');
  const [imgThreshold, setImgThreshold] = useState(128);

  // Sample 8x8 grayscale pixel values (0–255)
  const pixels = [
    220, 180, 30,  10,  15,  25,  190, 210,
    200, 170, 20,  5,   8,   12,  180, 200,
    160, 140, 15,  8,   5,   10,  150, 170,
    100, 90,  10,  5,   5,   8,   95,  110,
    80,  70,  8,   5,   5,   6,   75,  90,
    50,  40,  6,   4,   4,   5,   45,  55,
    200, 190, 20,  8,   10,  15,  195, 205,
    230, 220, 35,  12,  14,  20,  215, 225,
  ];

  const tabs = [
    { id: 'what',    label: '1. What is Binarization?' },
    { id: 'binning', label: '2. Binning Techniques' },
    { id: 'image',   label: '3. Image Binarization' },
    { id: 'apps',    label: '4. Applications' },
  ];

  return (
    <div className="tab-layout-container">
      <div className="sub-nav-links">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`sub-nav-link ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="sub-tab-content" style={{ marginTop: '1.5rem' }}>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1 — WHAT IS BINARIZATION
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'what' && (
          <div className="tab-content fade-in">

            {/* Hero Definition */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)',
              border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '1.75rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                <div style={{ background: '#10b981', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                  <BookOpen size={16} color="white" />
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#f1f5f9' }}>
                  What is Binarization?
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                <strong style={{ color: '#10b981' }}>Binarization</strong> is a data preprocessing technique that transforms
                continuous or categorical data into <strong style={{ color: '#fff' }}>binary values — typically 0 and 1</strong>.
                It simplifies data representation, making it suitable for algorithms that require binary input or where binary
                features improve interpretability or model performance.
              </p>
            </div>

            {/* Simple one-liner */}
            <div className="section-block">
              <h3 className="section-title-sub">Think of It This Way</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {[
                  { emoji: '💰', q: 'Is salary high or low?', a: 'Set a threshold (e.g., 7 lac). Above → 1, Below → 0', color: '#10b981' },
                  { emoji: '🌡️', q: 'Is the patient having fever?', a: 'Temp > 37.5°C → 1 (Fever), else → 0 (Normal)', color: '#f43f5e' },
                  { emoji: '📧', q: 'Is this email spam?', a: 'Spam words > 5 → 1 (Spam), else → 0 (Not Spam)', color: '#f59e0b' },
                  { emoji: '📸', q: 'Is this pixel bright or dark?', a: 'Pixel value > 128 → 1 (White), else → 0 (Black)', color: '#6366f1' },
                ].map((c, i) => (
                  <div key={i} style={{
                    background: 'rgba(10,15,30,0.65)', border: `1px solid ${c.color}25`,
                    borderRadius: '12px', padding: '1rem'
                  }}>
                    <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{c.emoji}</div>
                    <div style={{ fontWeight: 700, color: c.color, fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem', marginBottom: '0.35rem' }}>
                      {c.q}
                    </div>
                    <div style={{ fontSize: '0.81rem', color: '#94a3b8', lineHeight: 1.5 }}>{c.a}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── THE MAIN SALARY EXAMPLE ── */}
            <div className="section-block">
              <h3 className="section-title-sub" style={{ color: '#10b981' }}>
                📌 Step-by-Step Example: Salary Binarization
              </h3>

              {/* Step 1 — Original data */}
              <div style={{ background: 'rgba(10,15,30,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                  Step 1 — Original Salary Data
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[3, 4.5, 6, 7, 8.5, 10, 12, 15].map((s, i) => (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px', padding: '0.45rem 0.8rem',
                      fontFamily: 'JetBrains Mono, monospace', color: '#e2e8f0', fontSize: '0.88rem', fontWeight: 600
                    }}>
                      {s} lac
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2 — Choose threshold */}
              <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>
                  Step 2 — Choose a Threshold
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                  We decide: <strong style={{ color: '#fff' }}>Threshold = 7 lac</strong><br />
                  This is a <em>business decision</em> — "7 lac is a reasonable boundary between low and high salary."
                </p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', padding: '0.5rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>6 lac → 0</span>
                    <span style={{ color: '#64748b' }}> &nbsp;(≤ 7, Low)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#475569' }}>→</div>
                  <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '0.5rem 1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>10 lac → 1</span>
                    <span style={{ color: '#64748b' }}> &nbsp;(&gt; 7, High)</span>
                  </div>
                </div>
              </div>

              {/* Step 3 — Apply rule to all rows */}
              <div style={{ background: 'rgba(10,15,30,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
                  Step 3 — Apply Rule to Every Row
                </div>

                {/* Table */}
                <div className="table-wrapper">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Salary (lac)</th>
                        <th>Rule: &gt; 7?</th>
                        <th>Binary Output</th>
                        <th>Label</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['A', 3,    'No',  0, 'Low'],
                        ['B', 4.5,  'No',  0, 'Low'],
                        ['C', 6,    'No',  0, 'Low'],
                        ['D', 7,    'No',  0, 'Low (exactly 7 → 0)'],
                        ['E', 8.5,  'Yes', 1, 'High'],
                        ['F', 10,   'Yes', 1, 'High'],
                        ['G', 12,   'Yes', 1, 'High'],
                        ['H', 15,   'Yes', 1, 'High'],
                      ].map(([emp, sal, rule, bin, lbl], i) => (
                        <tr key={i}>
                          <td style={{ color: '#cbd5e1', fontWeight: 600 }}>{emp}</td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{sal}</td>
                          <td style={{ color: rule === 'Yes' ? '#10b981' : '#f87171', fontWeight: 700 }}>{rule}</td>
                          <td>
                            <span style={{
                              fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, fontSize: '1rem',
                              color: bin === 1 ? '#10b981' : '#f87171',
                              background: bin === 1 ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.1)',
                              padding: '0.15rem 0.6rem', borderRadius: '6px'
                            }}>{bin}</span>
                          </td>
                          <td style={{ color: bin === 1 ? '#10b981' : '#f87171', fontSize: '0.82rem' }}>{lbl}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  ⚠ Note: value exactly equal to threshold (7) → 0 &nbsp;(rule is strictly &gt;, not ≥)
                </div>
              </div>

              {/* Before/After summary */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Before</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '0.75rem', color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.8 }}>
                    Salary: [3, 4.5, 6, 7, 8.5, 10, 12, 15]
                  </div>
                </div>
                <ArrowRight size={22} style={{ color: '#10b981', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>After Binarization (threshold=7)</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', padding: '0.75rem', color: '#10b981', fontSize: '0.85rem', lineHeight: 1.8, border: '1px solid rgba(16,185,129,0.2)' }}>
                    Salary_bin: [0, 0, 0, 0, 1, 1, 1, 1]
                  </div>
                </div>
              </div>
            </div>

            {/* Code */}
            <div className="section-block">
              <CodeSnippet color="#10b981" code={`import pandas as pd
from sklearn.preprocessing import Binarizer

# Original salary data (in lakhs)
df = pd.DataFrame({
    'Employee': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    'Salary':   [3, 4.5, 6, 7, 8.5, 10, 12, 15]
})

# Apply Binarizer with threshold = 7
# Rule: Salary > 7 → 1 (High),  Salary ≤ 7 → 0 (Low)
binarizer = Binarizer(threshold=7)
df['Salary_bin'] = binarizer.fit_transform(df[['Salary']])

print(df)
# Output:
#   Employee  Salary  Salary_bin
# 0        A     3.0         0.0    ← 3 ≤ 7 → Low
# 1        B     4.5         0.0    ← 4.5 ≤ 7 → Low
# 2        C     6.0         0.0    ← 6 ≤ 7 → Low
# 3        D     7.0         0.0    ← 7 ≤ 7 → Low (exactly threshold → 0)
# 4        E     8.5         1.0    ← 8.5 > 7 → High ✓
# 5        F    10.0         1.0    ← 10 > 7 → High ✓
# 6        G    12.0         1.0    ← 12 > 7 → High ✓
# 7        H    15.0         1.0    ← 15 > 7 → High ✓

# Check counts
print(df['Salary_bin'].value_counts())
# 0.0    4   (Low Salary)
# 1.0    4   (High Salary)`} />
            </div>

            {/* Interactive slider */}
            <div className="section-block">
              <h3 className="section-title-sub">🎮 Try It — Change the Threshold</h3>
              <InteractiveDemo />
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2 — BINNING TECHNIQUES
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'binning' && (
          <div className="tab-content fade-in">

            <h2 className="section-title-main">Binning Techniques</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '0.5rem' }}>
              <strong style={{ color: '#fff' }}>Binning</strong> (also called Bucketing) groups continuous values into discrete
              "bins" or ranges. Unlike Binarization (only 2 outputs), Binning creates <em>multiple</em> groups.
            </p>

            {/* Binarization vs Binning */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0 2rem' }}>
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ color: '#10b981', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem', fontSize: '0.92rem' }}>
                  ⚡ Binarization
                </div>
                <div style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  Exactly <strong style={{ color: '#fff' }}>2 outputs</strong> — 0 or 1<br/>
                  Uses <strong style={{ color: '#fff' }}>one threshold</strong><br/>
                  E.g.: Salary &gt; 7 → High (1) or Low (0)
                </div>
              </div>
              <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ color: '#6366f1', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem', fontSize: '0.92rem' }}>
                  📦 Binning
                </div>
                <div style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  <strong style={{ color: '#fff' }}>Multiple buckets</strong> — Low, Medium, High, ...<br/>
                  Uses <strong style={{ color: '#fff' }}>multiple cut points</strong><br/>
                  E.g.: 0–5 = Low, 5–10 = Mid, 10–15 = High
                </div>
              </div>
            </div>

            {/* ── TECHNIQUE 1: Equal-Width Binning ── */}
            <div className="premium-card" style={{ borderTop: '4px solid #6366f1', marginBottom: '1.75rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>1. Equal-Width Binning</h3>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>Divides the range into equal-sized intervals</div>
                  </div>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc">
                  Divides the <strong style={{ color: '#fff' }}>range</strong> of values into N equal-width intervals.
                  Each bin has the same width, but may have different numbers of data points inside it.
                </p>

                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    📌 Step-by-Step Example
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '1.1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.9, border: '1px solid rgba(99,102,241,0.15)' }}>
                    <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '0.5rem' }}>Data: [1, 2, 3, 10, 12] &nbsp; n_bins = 3</div>
                    <div><span style={{ color: '#6366f1' }}>Min</span> = 1, &nbsp; <span style={{ color: '#6366f1' }}>Max</span> = 12</div>
                    <div><span style={{ color: '#6366f1' }}>Width</span> = (12 − 1) / 3 = <span style={{ color: '#fff', fontWeight: 700 }}>3.67</span></div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <div>Bin 1: [<span style={{ color: '#6366f1' }}>1.00 → 4.67</span>]   &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>1, 2, 3</span></div>
                      <div>Bin 2: [<span style={{ color: '#10b981' }}>4.67 → 8.33</span>]   &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>(none)</span></div>
                      <div>Bin 3: [<span style={{ color: '#f59e0b' }}>8.33 → 12.00</span>]  &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>10, 12</span></div>
                    </div>
                    <div style={{ marginTop: '0.5rem', color: '#f87171', fontSize: '0.78rem' }}>
                      ⚠ Problem: Bin 2 is empty! Equal width ≠ equal population.
                    </div>
                  </div>

                  <BinVisual
                    data={[1, 2, 3, 10, 12]}
                    bins={[0, 4.67, 8.33, 12]}
                    labels={['Bin 1\n[1–4.67]', 'Bin 2\n[4.67–8.33]', 'Bin 3\n[8.33–12]']}
                    color="#6366f1"
                  />
                </div>

                <CodeSnippet color="#6366f1" code={`import pandas as pd
import numpy as np

data = [1, 2, 3, 10, 12]
df = pd.DataFrame({'value': data})

# Equal-Width Binning: 3 bins of equal width
df['bin_equalwidth'] = pd.cut(df['value'], bins=3, labels=['Low', 'Mid', 'High'])

print(df)
# Output:
#    value bin_equalwidth
# 0      1            Low   ← falls in [0.989, 4.667]
# 1      2            Low
# 2      3            Low
# 3     10           High   ← falls in [8.333, 12.0]
# 4     12           High

# To see the bin edges:
_, edges = pd.cut(df['value'], bins=3, retbins=True)
print(edges.round(2))
# [ 0.99  4.67  8.33 12.  ]`} />
              </div>
            </div>

            {/* ── TECHNIQUE 2: Quantile Binning ── */}
            <div className="premium-card" style={{ borderTop: '4px solid #10b981', marginBottom: '1.75rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
                    <SlidersHorizontal size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>2. Quantile Binning</h3>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>Each bin has approximately equal number of data points</div>
                  </div>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc">
                  Divides data so that each bin has <strong style={{ color: '#fff' }}>approximately the same number of data points</strong>.
                  Very useful when the data is <strong style={{ color: '#10b981' }}>unevenly distributed</strong> (skewed).
                  Bin widths will differ but populations are balanced.
                </p>

                <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', padding: '0.9rem', minWidth: '200px' }}>
                    <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem' }}>❌ Equal-Width Problem</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>With skewed data, some bins have hundreds of values, others have zero. Model gets no useful signal from empty bins.</div>
                  </div>
                  <div style={{ flex: 1, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.9rem', minWidth: '200px' }}>
                    <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem' }}>✅ Quantile Solution</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Bins always have roughly equal points. Handles skewed distributions perfectly — commonly used in credit scoring.</div>
                  </div>
                </div>

                <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', marginTop: '1rem' }}>
                  📌 Step-by-Step Example
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '1.1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.9, border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '0.5rem' }}>Data: [1, 2, 3, 10, 12] &nbsp; n_bins = 3</div>
                  <div style={{ color: '#10b981' }}>Step 1: Sort data → [1, 2, 3, 10, 12]</div>
                  <div>Step 2: Divide into 3 equal-count groups (5 ÷ 3 ≈ 1–2 each)</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div>Bin 1: [<span style={{ color: '#6366f1' }}>1 → 2</span>]    &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>1, 2</span> &nbsp;(≈equal points)</div>
                    <div>Bin 2: [<span style={{ color: '#10b981' }}>2 → 10</span>]   &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>3, 10</span> &nbsp;(≈equal points)</div>
                    <div>Bin 3: [<span style={{ color: '#f59e0b' }}>10 → 12</span>]  &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>12</span></div>
                  </div>
                  <div style={{ marginTop: '0.5rem', color: '#10b981', fontSize: '0.8rem' }}>
                    ✅ No empty bins! Useful when data is unevenly distributed.
                  </div>
                </div>

                <CodeSnippet color="#10b981" code={`import pandas as pd

data = [1, 2, 3, 10, 12]
df = pd.DataFrame({'value': data})

# Quantile Binning: equal-frequency bins
# q=3 means we want 3 quantile-based bins
df['bin_quantile'] = pd.qcut(df['value'], q=3, labels=['Low', 'Mid', 'High'])

print(df)
# Output:
#    value bin_quantile
# 0      1          Low
# 1      2          Low
# 2      3          Mid
# 3     10         High
# 4     12         High

# See the actual bin boundaries (quantiles)
_, edges = pd.qcut(df['value'], q=3, retbins=True)
print(edges)
# [ 1.   2.   3.  12. ]   ← bins: [1-2], [2-3], [3-12]

# ── Real-world example: Salary quantile binning ──
salary = [20000, 25000, 30000, 80000, 90000, 200000]
df2 = pd.DataFrame({'Salary': salary})
df2['Salary_tier'] = pd.qcut(df2['Salary'], q=3, labels=['Low', 'Medium', 'High'])
print(df2)
# Each tier has exactly 2 salaries — equal population!`} />
              </div>
            </div>

            {/* ── TECHNIQUE 3: Custom Binning ── */}
            <div className="premium-card" style={{ borderTop: '4px solid #f59e0b', marginBottom: '1.75rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                    <Grid size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>3. Custom Binning</h3>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>You define the exact bin edges using domain knowledge</div>
                  </div>
                </div>
              </div>
              <div className="premium-card-body">
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '0.25rem 0 1rem' }}>
                  <div style={{ flex: 1, minWidth: '200px', fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '0.9rem' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '0.35rem' }}>Allows you to define custom bin edges</div>
                    based on <strong style={{ color: '#fff' }}>domain knowledge</strong> or specific requirements.
                  </div>
                  <div style={{ flex: 1, minWidth: '200px', fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '0.9rem' }}>
                    <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '0.35rem' }}>Provides full control</div>
                    over the binning process. You decide where each bin starts and ends — not the algorithm.
                  </div>
                </div>

                <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  📌 Step-by-Step Example
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '1.1rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.9, border: '1px solid rgba(245,158,11,0.15)' }}>
                  <div style={{ color: '#e2e8f0', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Data: [1, 2, 3, 10, 12] &nbsp; Custom bins: [0, 5, 10, 15]
                  </div>
                  <div style={{ color: '#f59e0b' }}>Bin edges defined by YOU: 0, 5, 10, 15</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    Bins created:
                    <div style={{ paddingLeft: '1rem' }}>
                      <div><span style={{ color: '#6366f1' }}>[0 – 5]</span>   &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>1, 2, 3</span></div>
                      <div><span style={{ color: '#10b981' }}>[5 – 10]</span>  &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>(none)</span></div>
                      <div><span style={{ color: '#f59e0b' }}>[10 – 15]</span> &nbsp; → &nbsp; values: <span style={{ color: '#e2e8f0' }}>10, 12</span></div>
                    </div>
                  </div>
                </div>

                <BinVisual
                  data={[1, 2, 3, 10, 12]}
                  bins={[0, 5, 10, 15]}
                  labels={['[0–5]', '[5–10]', '[10–15]']}
                  color="#f59e0b"
                />

                <CodeSnippet color="#f59e0b" code={`import pandas as pd

data = [1, 2, 3, 10, 12]
df = pd.DataFrame({'value': data})

# Custom Binning — YOU define where the bins are
custom_bins   = [0, 5, 10, 15]          # bin edges
custom_labels = ['0–5', '5–10', '10–15'] # optional labels

df['bin_custom'] = pd.cut(df['value'],
                           bins=custom_bins,
                           labels=custom_labels)

print(df)
# Output:
#    value bin_custom
# 0      1        0–5   ← 1 falls in (0, 5]
# 1      2        0–5
# 2      3        0–5
# 3     10      10–15   ← 10 falls in (10, 15]... wait!
# 4     12      10–15

# ─── Real-world: Age groups for marketing ───
ages = [5, 15, 25, 35, 55, 70]
df2  = pd.DataFrame({'Age': ages})
df2['Age_group'] = pd.cut(df2['Age'],
                            bins=[0, 12, 17, 35, 60, 100],
                            labels=['Child', 'Teen', 'Young Adult', 'Middle Age', 'Senior'])
print(df2)
#    Age   Age_group
# 0    5       Child
# 1   15        Teen
# 2   25 Young Adult
# 3   35 Middle Age
# 4   55 Middle Age
# 5   70      Senior`} />
              </div>
            </div>

            {/* Comparison Table */}
            <div className="section-block">
              <h3 className="section-title-sub">Comparison: All Three Binning Types</h3>
              <div className="table-wrapper">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>How Bins are Defined</th>
                      <th>Bin Width</th>
                      <th>Points per Bin</th>
                      <th>Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ color: '#6366f1', fontWeight: 700 }}>Equal-Width</td>
                      <td>Automatic (min–max / N)</td>
                      <td style={{ color: '#10b981' }}>Equal ✓</td>
                      <td style={{ color: '#f87171' }}>Unequal ✗</td>
                      <td>Uniformly distributed data</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#10b981', fontWeight: 700 }}>Quantile</td>
                      <td>Automatic (by percentiles)</td>
                      <td style={{ color: '#f87171' }}>Unequal ✗</td>
                      <td style={{ color: '#10b981' }}>Equal ✓</td>
                      <td>Skewed / unevenly distributed data</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#f59e0b', fontWeight: 700 }}>Custom</td>
                      <td>You define them manually</td>
                      <td style={{ color: '#f59e0b' }}>You decide</td>
                      <td style={{ color: '#f59e0b' }}>You decide</td>
                      <td>Domain knowledge (age groups, credit tiers)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3 — IMAGE BINARIZATION
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'image' && (
          <div className="tab-content fade-in">

            <h2 className="section-title-main">Image Binarization</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '1.5rem' }}>
              One of the most important uses of Binarization — converting a grayscale image into a <strong style={{ color: '#fff' }}>pure black-and-white image</strong>. Every pixel has a value 0–255. We apply a threshold: above → white (1), below → black (0).
            </p>

            {/* Concept boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { emoji: '🖼️', title: 'Grayscale Image', body: 'Each pixel is a number from 0 (black) to 255 (white). A 100×100 image = 10,000 pixel values.', color: '#6366f1' },
                { emoji: '⚡', title: 'Apply Threshold', body: 'Choose threshold (e.g., 128). Pixel > 128 → 1 (white). Pixel ≤ 128 → 0 (black).', color: '#10b981' },
                { emoji: '🤖', title: 'Why ML Needs It', body: 'Many image algorithms (OCR, document scanning) work best on binary pixels — it removes noise and simplifies patterns.', color: '#f59e0b' },
                { emoji: '📐', title: 'Common Thresholds', body: 'Default: 128 (midpoint). Otsu\'s method auto-finds the optimal threshold by maximizing between-class variance.', color: '#ec4899' },
              ].map((c, i) => (
                <div key={i} style={{ background: 'rgba(10,15,30,0.65)', border: `1px solid ${c.color}25`, borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{c.emoji}</div>
                  <div style={{ fontWeight: 700, color: c.color, fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem', marginBottom: '0.35rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.81rem', color: '#94a3b8', lineHeight: 1.5 }}>{c.body}</div>
                </div>
              ))}
            </div>

            {/* Interactive pixel grid */}
            <div style={{ background: 'rgba(10,15,30,0.7)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Grid size={16} style={{ color: '#6366f1' }} />
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#6366f1', fontSize: '1rem' }}>
                  Live Pixel Binarization Demo (8×8 grid)
                </span>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Pixel Threshold</span>
                  <span style={{ color: '#6366f1', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem' }}>
                    {imgThreshold}
                  </span>
                </div>
                <input
                  type="range" min={0} max={255} value={imgThreshold}
                  onChange={e => setImgThreshold(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', marginTop: '0.25rem' }}>
                  <span>0 (Black)</span><span>255 (White)</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Grayscale (raw pixel values)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3px' }}>
                    {pixels.map((v, i) => (
                      <div key={i} style={{
                        aspectRatio: '1', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `rgb(${v},${v},${v})`,
                        border: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.42rem', color: v > 140 ? '#0f172a' : '#94a3b8',
                        fontFamily: 'JetBrains Mono, monospace', fontWeight: 600
                      }}>
                        {v}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '1.5rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <ArrowRight size={20} style={{ color: '#6366f1' }} />
                    <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: '0.25rem' }}>threshold<br/>{imgThreshold}</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Binary (0 = Black, 1 = White)
                  </div>
                  <PixelGrid values={pixels} threshold={imgThreshold} cols={8} />
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.79rem', color: '#94a3b8' }}>
                Rule: pixel &gt; {imgThreshold} → <span style={{ color: '#f8fafc', fontWeight: 700 }}>1 (White)</span> &nbsp;|&nbsp; pixel ≤ {imgThreshold} → <span style={{ color: '#1e293b', background: '#f8fafc', padding: '0 4px', borderRadius: '3px', fontWeight: 700 }}>0 (Black)</span>
              </div>
            </div>

            {/* Code for image binarization */}
            <CodeSnippet color="#6366f1" code={`import numpy as np
from sklearn.preprocessing import Binarizer
import matplotlib.pyplot as plt

# ── Simulate a small 4x4 grayscale image ──
# Pixel values range from 0 (black) to 255 (white)
image_flat = np.array([[200, 50, 30, 210,
                         180, 40, 20, 190,
                         60,  220, 230, 70,
                         50,  210, 200, 55]])

print("Raw pixel values:")
print(image_flat.reshape(4, 4))
# [[200  50  30 210]
#  [180  40  20 190]
#  [ 60 220 230  70]
#  [ 50 210 200  55]]

# Apply binarization with threshold = 128
binarizer = Binarizer(threshold=128)
binary_image = binarizer.transform(image_flat)

print("\\nBinary image (threshold=128):")
print(binary_image.reshape(4, 4))
# [[1 0 0 1]     ← 200>128→1, 50≤128→0
#  [1 0 0 1]
#  [0 1 1 0]
#  [0 1 1 0]]

# ── With OpenCV (real images) ──
# import cv2
# img = cv2.imread('photo.jpg', cv2.IMREAD_GRAYSCALE)  # Load as grayscale
# _, binary = cv2.threshold(img, 128, 255, cv2.THRESH_BINARY)  # Binarize
# cv2.imwrite('binary_photo.jpg', binary)

# ── With Otsu's Method (auto threshold) ──
# _, binary_otsu = cv2.threshold(img, 0, 255,
#                                cv2.THRESH_BINARY + cv2.THRESH_OTSU)
# Otsu auto-finds the best threshold — no manual guessing needed!`} />

            <div className="card-note alert-indigo" style={{ marginTop: '1.5rem' }}>
              <strong>💡 Why Image Binarization?</strong> Used in OCR (reading text from images), document scanning, fingerprint recognition, medical imaging (X-rays, MRI segmentation), and QR code detection — wherever you need a clean black/white separation of foreground and background.
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4 — APPLICATIONS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'apps' && (
          <div className="tab-content fade-in">

            <h2 className="section-title-main">Real-World Applications</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              Binning and Binarization are used across every major industry. Below is a field-by-field breakdown of how each technique is applied.
            </p>

            {/* Application cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { field: '🔬 Data Science', binning: 'Data simplification and visualization', binarization: 'Threshold-based feature engineering', bColor: '#6366f1', rColor: '#10b981' },
                { field: '🏥 Healthcare',   binning: 'Grouping patients by risk levels',           binarization: 'Binary outcomes for diagnoses or tests (fever: yes/no)', bColor: '#f43f5e', rColor: '#10b981' },
                { field: '💳 Finance',      binning: 'Risk categories for loans or credit',         binarization: 'Flagging thresholds for fraud detection', bColor: '#f59e0b', rColor: '#10b981' },
                { field: '🛒 Retail',       binning: 'Customer segmentation by spending tiers',     binarization: 'Flagging purchase behavior (bought: 1 / not: 0)', bColor: '#ec4899', rColor: '#10b981' },
                { field: '🎓 Education',    binning: 'Grouping students by performance tiers',      binarization: 'Pass / Fail outcomes (score > 33 → 1, else → 0)', bColor: '#8b5cf6', rColor: '#10b981' },
                { field: '🏭 Manufacturing',binning: 'Grouping products by defect rates',           binarization: 'Quality control — pass/fail (defects > N → reject)', bColor: '#06b6d4', rColor: '#10b981' },
                { field: '📣 Marketing',    binning: 'Customer segmentation by habits',             binarization: 'Campaign success (responded: 1, ignored: 0)', bColor: '#f59e0b', rColor: '#10b981' },
                { field: '⚽ Sports',       binning: 'Grouping player statistics into tiers',       binarization: 'Binary match results (Win=1, Loss=0)', bColor: '#22c55e', rColor: '#10b981' },
              ].map((a, i) => (
                <div key={i} style={{ background: 'rgba(10,15,30,0.65)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.1rem' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem', marginBottom: '0.8rem' }}>{a.field}</div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: a.bColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>📦 Binning</div>
                    <div style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.5 }}>{a.binning}</div>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', color: a.rColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>⚡ Binarization</div>
                    <div style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.5 }}>{a.binarization}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full comparison table */}
            <h3 className="section-title-sub">Full Reference Table</h3>
            <div className="table-wrapper" style={{ marginBottom: '2rem' }}>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th style={{ color: '#6366f1' }}>Binning Use</th>
                    <th style={{ color: '#10b981' }}>Binarization Use</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Data Science',   'Data simplification and visualization',       'Threshold-based feature engineering'],
                    ['Healthcare',     'Grouping patients by risk levels',             'Binary outcomes for diagnoses or tests'],
                    ['Finance',        'Risk categories for loans or credit',          'Flagging thresholds for fraud detection'],
                    ['Retail',         'Customer segmentation by spending tiers',      'Flagging purchase behavior'],
                    ['Education',      'Grouping students by performance tiers',       'Pass/Fail outcomes'],
                    ['Manufacturing',  'Grouping products by defect rates',            'Quality control (pass/fail)'],
                    ['Marketing',      'Customer segmentation',                         'Campaign success (response or no response)'],
                    ['Sports',         'Grouping player statistics',                    'Binary match results'],
                  ].map(([f, b, r], i) => (
                    <tr key={i}>
                      <td style={{ color: '#f1f5f9', fontWeight: 600 }}>{f}</td>
                      <td style={{ color: '#94a3b8' }}>{b}</td>
                      <td style={{ color: '#94a3b8' }}>{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Key use-case highlights from notes */}
            <h3 className="section-title-sub">Key Highlighted Use Cases</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '12px', padding: '1.1rem', display: 'flex', gap: '0.75rem' }}>
                <ChevronRight size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>Customer Segmentation (Binning): </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                    Grouping customers by age, income, or spending habits to create segments like <em>"low spenders"</em> or <em>"premium customers."</em>
                    Example: Income [0–3L] = Budget, [3–7L] = Standard, [7L+] = Premium.
                  </span>
                </div>
              </div>

              <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '12px', padding: '1.1rem', display: 'flex', gap: '0.75rem' }}>
                <ChevronRight size={18} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ color: '#6366f1', fontWeight: 700 }}>Binary Classification Prep (Binarization): </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                    Preparing data for binary classification problems — e.g., <em>spam vs. non-spam</em>, <em>fraud vs. non-fraud</em>, <em>pass vs. fail</em>.
                    Binarization creates the binary target label directly from continuous scores.
                  </span>
                </div>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '1.1rem', display: 'flex', gap: '0.75rem' }}>
                <ChevronRight size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>Education — Pass/Fail Example: </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                    Scores: 33, 73, 85, 20, 45. Threshold = 33.
                    &nbsp;<code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f87171' }}>33 → 0</code> (fail, not strictly greater),
                    &nbsp;<code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#10b981' }}>73 → 1</code> (pass),
                    &nbsp;<code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#10b981' }}>85 → 1</code>,
                    &nbsp;<code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f87171' }}>20 → 0</code>,
                    &nbsp;<code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#10b981' }}>45 → 1</code>.
                  </span>
                </div>
              </div>
            </div>

            {/* Summary note */}
            <div className="card-note alert-indigo">
              <strong>Interview One-Liner:</strong> <em>Binarization</em> converts a continuous feature into 0/1 using a <strong>domain threshold</strong> (e.g., salary &gt; 7lac → 1). <em>Binning</em> groups continuous data into multiple buckets using equal-width, quantile (equal-frequency), or custom edges — used for segmentation, visualization, and reducing overfitting from noisy numeric features.
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
