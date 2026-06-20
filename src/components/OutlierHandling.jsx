import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRight, Filter, Scissors, Shield } from 'lucide-react';

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function getMean(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function getStd(arr, mean) { return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length); }
function getQ(arr, p) {
  const s = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (s.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (idx - lo);
}

/* ── Code Snippet ─────────────────────────────────────────────────────────── */
const Code = ({ code, color = '#6366f1' }) => {
  const [c, setC] = useState(false);
  return (
    <div className="code-snippet-box" style={{ marginTop: '1rem', border: `1px solid ${color}40` }}>
      <div className="code-header" style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
        <span style={{ color, fontWeight: 600 }}>Python Code</span>
        <button className={`btn btn-copy ${c ? 'copied' : ''}`} onClick={() => { navigator.clipboard.writeText(code); setC(true); setTimeout(() => setC(false), 2000); }}>
          {c ? <Check size={12} /> : <Copy size={12} />}
          <span>{c ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="pre-code" style={{ margin: 0, border: 'none', background: 'transparent' }}><code>{code}</code></pre>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   SVG BOXPLOT — Annotated Anatomy Diagram
══════════════════════════════════════════════════════════════════════════ */
const BoxplotSVG = ({ data, color = '#6366f1', showLabels = true, compact = false }) => {
  const sorted = [...data].sort((a, b) => a - b);
  const Q1 = getQ(data, 25);
  const Q3 = getQ(data, 75);
  const median = getQ(data, 50);
  const IQR = Q3 - Q1;
  const lowerFence = Q1 - 1.5 * IQR;
  const upperFence = Q3 + 1.5 * IQR;
  const whiskerMin = sorted.find(v => v >= lowerFence) ?? sorted[0];
  const whiskerMax = [...sorted].reverse().find(v => v <= upperFence) ?? sorted[sorted.length - 1];
  const outliers = data.filter(v => v < lowerFence || v > upperFence);

  const W = compact ? 420 : 560;
  const H = compact ? 160 : 220;
  const PAD_L = showLabels ? 60 : 20;
  const PAD_R = showLabels ? 100 : 30;
  const PAD_T = showLabels ? 50 : 25;
  const PAD_B = showLabels ? 50 : 25;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const midY = PAD_T + plotH / 2;
  const boxH = compact ? 36 : 50;

  // Domain: whiskerMin to max(outliers or whiskerMax), capped nicely
  const domMin = Math.min(whiskerMin, ...outliers) * 0.9;
  const domMax = Math.max(whiskerMax, ...outliers) * 1.05;

  const toX = (v) => PAD_L + ((v - domMin) / (domMax - domMin)) * plotW;

  const xQ1 = toX(Q1), xQ3 = toX(Q3), xMed = toX(median);
  const xWMin = toX(whiskerMin), xWMax = toX(whiskerMax);

  // Axis ticks
  const ticks = [whiskerMin, Q1, median, Q3, whiskerMax].map(v => ({ v, x: toX(v) }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', margin: '0 auto' }}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* Background grid lines */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x} x2={t.x} y1={PAD_T - 10} y2={PAD_T + plotH + 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
      ))}

      {/* Whisker left line */}
      <line x1={xWMin} x2={xQ1} y1={midY} y2={midY} stroke={color} strokeWidth="2.5" strokeOpacity="0.7" />
      {/* Whisker left cap */}
      <line x1={xWMin} x2={xWMin} y1={midY - 10} y2={midY + 10} stroke={color} strokeWidth="2.5" strokeOpacity="0.7" />

      {/* Whisker right line */}
      <line x1={xQ3} x2={xWMax} y1={midY} y2={midY} stroke={color} strokeWidth="2.5" strokeOpacity="0.7" />
      {/* Whisker right cap */}
      <line x1={xWMax} x2={xWMax} y1={midY - 10} y2={midY + 10} stroke={color} strokeWidth="2.5" strokeOpacity="0.7" />

      {/* IQR Box */}
      <rect x={xQ1} y={midY - boxH / 2} width={xQ3 - xQ1} height={boxH}
        fill={`${color}25`} stroke={color} strokeWidth="2" rx="4" />

      {/* Median Line */}
      <line x1={xMed} x2={xMed} y1={midY - boxH / 2} y2={midY + boxH / 2}
        stroke="#f8fafc" strokeWidth="3" filter="url(#glow)" />

      {/* Outlier dots */}
      {outliers.map((v, i) => (
        <g key={i}>
          <circle cx={toX(v)} cy={midY} r={8} fill="rgba(244,63,94,0.15)" stroke="#f43f5e" strokeWidth="2" />
          <circle cx={toX(v)} cy={midY} r={3} fill="#f43f5e" />
        </g>
      ))}

      {/* ── LABELS ──────────────────────────────────────────────────────── */}
      {showLabels && (
        <>
          {/* Min whisker label */}
          <text x={xWMin} y={midY + boxH / 2 + 22} textAnchor="middle" fontSize="10" fill="#94a3b8">Min</text>
          <text x={xWMin} y={midY + boxH / 2 + 34} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{whiskerMin.toFixed(1)}</text>

          {/* Q1 label */}
          <text x={xQ1} y={midY - boxH / 2 - 18} textAnchor="middle" fontSize="10" fill="#94a3b8">Q1</text>
          <text x={xQ1} y={midY - boxH / 2 - 6} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{Q1.toFixed(1)}</text>

          {/* Median label */}
          <text x={xMed} y={midY - boxH / 2 - 18} textAnchor="middle" fontSize="11" fill="#f8fafc" fontWeight="bold">Median</text>
          <text x={xMed} y={midY - boxH / 2 - 6} textAnchor="middle" fontSize="10" fill="#f8fafc" fontWeight="bold">{median.toFixed(1)}</text>

          {/* Q3 label */}
          <text x={xQ3} y={midY - boxH / 2 - 18} textAnchor="middle" fontSize="10" fill="#94a3b8">Q3</text>
          <text x={xQ3} y={midY - boxH / 2 - 6} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{Q3.toFixed(1)}</text>

          {/* Max whisker label */}
          <text x={xWMax} y={midY + boxH / 2 + 22} textAnchor="middle" fontSize="10" fill="#94a3b8">Max</text>
          <text x={xWMax} y={midY + boxH / 2 + 34} textAnchor="middle" fontSize="10" fill={color} fontWeight="bold">{whiskerMax.toFixed(1)}</text>

          {/* IQR brace */}
          <text x={(xQ1 + xQ3) / 2} y={midY + boxH / 2 + 22} textAnchor="middle" fontSize="10" fill="#f59e0b">← IQR →</text>
          <text x={(xQ1 + xQ3) / 2} y={midY + boxH / 2 + 34} textAnchor="middle" fontSize="10" fill="#f59e0b" fontWeight="bold">{IQR.toFixed(1)}</text>

          {/* Outlier labels */}
          {outliers.map((v, i) => (
            <g key={i}>
              <text x={toX(v)} y={midY - boxH / 2 - 18} textAnchor="middle" fontSize="11" fill="#f43f5e" fontWeight="bold">Outlier!</text>
              <text x={toX(v)} y={midY - boxH / 2 - 6} textAnchor="middle" fontSize="10" fill="#f43f5e" fontWeight="bold">{v}</text>
            </g>
          ))}

          {/* Axis line */}
          <line x1={PAD_L - 10} x2={W - PAD_R + 10} y1={PAD_T + plotH} y2={PAD_T + plotH} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </>
      )}
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   SVG HISTOGRAM
══════════════════════════════════════════════════════════════════════════ */
const HistogramSVG = ({ data, color = '#6366f1', lowerFence, upperFence }) => {
  const W = 480, H = 180;
  const PAD = { l: 40, r: 20, t: 20, b: 40 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const bins = 8;
  const binWidth = (max - min) / bins;

  const buckets = Array.from({ length: bins }, (_, i) => ({
    start: min + i * binWidth,
    end: min + (i + 1) * binWidth,
    count: 0,
  }));
  data.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1);
    buckets[idx].count++;
  });

  const maxCount = Math.max(...buckets.map(b => b.count));
  const toX = (v) => PAD.l + ((v - min) / (max - min)) * plotW;
  const toY = (c) => PAD.t + plotH - (c / maxCount) * plotH;

  const barW = plotW / bins;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', margin: '0 auto' }}>
      {/* Fence zones */}
      {lowerFence !== undefined && (
        <rect x={PAD.l} y={PAD.t} width={Math.max(0, toX(lowerFence) - PAD.l)} height={plotH}
          fill="rgba(244,63,94,0.06)" />
      )}
      {upperFence !== undefined && (
        <rect x={toX(upperFence)} y={PAD.t} width={Math.max(0, W - PAD.r - toX(upperFence))} height={plotH}
          fill="rgba(244,63,94,0.06)" />
      )}

      {/* Bars */}
      {buckets.map((b, i) => {
        const x = PAD.l + i * barW;
        const h = (b.count / maxCount) * plotH;
        const isOutlierBin = (lowerFence !== undefined && b.end < lowerFence) ||
          (upperFence !== undefined && b.start > upperFence);
        return (
          <g key={i}>
            <rect x={x + 1} y={toY(b.count)} width={barW - 2} height={h}
              fill={isOutlierBin ? 'rgba(244,63,94,0.7)' : `${color}90`}
              stroke={isOutlierBin ? '#f43f5e' : color}
              strokeWidth="1" rx="2" />
            {b.count > 0 && (
              <text x={x + barW / 2} y={toY(b.count) - 4} textAnchor="middle" fontSize="10" fill="#94a3b8">{b.count}</text>
            )}
          </g>
        );
      })}

      {/* Fence lines */}
      {upperFence !== undefined && toX(upperFence) < W - PAD.r && (
        <g>
          <line x1={toX(upperFence)} x2={toX(upperFence)} y1={PAD.t} y2={PAD.t + plotH} stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 3" />
          <text x={toX(upperFence) + 4} y={PAD.t + 12} fontSize="9" fill="#f43f5e">Upper Fence</text>
        </g>
      )}

      {/* Axis */}
      <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + plotH} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <text x={PAD.l} y={PAD.t + plotH + 16} fontSize="9" fill="#64748b">{min}</text>
      <text x={W - PAD.r} y={PAD.t + plotH + 16} textAnchor="end" fontSize="9" fill="#64748b">{max}</text>
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="10" fill="#64748b">Value</text>
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   SVG SCATTER PLOT
══════════════════════════════════════════════════════════════════════════ */
const ScatterSVG = ({ data, color, lowerFence, upperFence }) => {
  const W = 480, H = 140;
  const PAD = { l: 40, r: 20, t: 20, b: 30 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const min = Math.min(...data), max = Math.max(...data);
  const toX = (v) => PAD.l + ((v - min) / (max - min)) * plotW;
  const midY = PAD.t + plotH / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, display: 'block', margin: '0 auto' }}>
      {/* Fence zones */}
      {upperFence !== undefined && (
        <rect x={toX(upperFence)} y={PAD.t} width={Math.max(0, W - PAD.r - toX(upperFence))} height={plotH} fill="rgba(244,63,94,0.07)" />
      )}
      {/* Upper fence line */}
      {upperFence !== undefined && (
        <g>
          <line x1={toX(upperFence)} x2={toX(upperFence)} y1={PAD.t} y2={PAD.t + plotH} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x={toX(upperFence) + 3} y={PAD.t + 10} fontSize="8" fill="#f43f5e">Upper</text>
        </g>
      )}
      {/* Baseline */}
      <line x1={PAD.l} x2={W - PAD.r} y1={midY} y2={midY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Dots */}
      {data.map((v, i) => {
        const isOut = (lowerFence !== undefined && v < lowerFence) || (upperFence !== undefined && v > upperFence);
        return (
          <g key={i}>
            <circle cx={toX(v)} cy={midY + (Math.random() - 0.5) * 20} r={isOut ? 7 : 5}
              fill={isOut ? 'rgba(244,63,94,0.2)' : `${color}40`}
              stroke={isOut ? '#f43f5e' : color}
              strokeWidth={isOut ? 2 : 1.5} />
            {isOut && <text x={toX(v)} y={midY - 14} textAnchor="middle" fontSize="9" fill="#f43f5e" fontWeight="bold">{v}</text>}
          </g>
        );
      })}
      {/* Axis */}
      <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + plotH} y2={PAD.t + plotH} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <text x={PAD.l} y={PAD.t + plotH + 14} fontSize="9" fill="#64748b">{min}</text>
      <text x={W - PAD.r} y={PAD.t + plotH + 14} textAnchor="end" fontSize="9" fill="#64748b">{max}</text>
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   BOXPLOT ANATOMY LEGEND (used in Overview)
══════════════════════════════════════════════════════════════════════════ */
const BoxplotAnatomyLegend = ({ color }) => (
  <div className="boxplot-legend-grid">
    {[
      { sym: '│ Min', desc: 'Whisker end — smallest non-outlier value', c: color },
      { sym: 'Q1', desc: '25th percentile — bottom of the box', c: color },
      { sym: '━━━', desc: 'Median (middle line inside box)', c: '#f8fafc' },
      { sym: 'Q3', desc: '75th percentile — top of the box', c: color },
      { sym: '│ Max', desc: 'Whisker end — largest non-outlier value', c: color },
      { sym: 'IQR', desc: 'Q3 − Q1, the box width (middle 50% spread)', c: '#f59e0b' },
      { sym: '●', desc: 'Data points beyond fences = OUTLIERS', c: '#f43f5e' },
      { sym: '1.5×IQR', desc: 'The fence rule — extends beyond Q1/Q3', c: '#f43f5e' },
    ].map((item, i) => (
      <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
        <code style={{ color: item.c, fontWeight: 700, minWidth: '48px', fontSize: '0.85rem' }}>{item.sym}</code>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.desc}</span>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const RAW_DATA = [30, 35, 40, 38, 36, 42, 33, 400];

export default function OutlierHandling() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoMethod, setDemoMethod] = useState('iqr');
  const [handleMode, setHandleMode] = useState('cap');

  const tabs = [
    { id: 'overview', label: '1. What Are Outliers?' },
    { id: 'detect', label: '2. Detection Methods' },
    { id: 'handle', label: '3. Handling Techniques' },
    { id: 'interactive', label: '4. Interactive Demo' },
    { id: 'decision', label: '5. Decision Guide' },
  ];

  const demo = useMemo(() => {
    const data = RAW_DATA;
    const mean = getMean(data);
    const std = getStd(data, mean);
    const Q1 = getQ(data, 25), Q3 = getQ(data, 75), IQR = Q3 - Q1;
    const zScores = data.map(v => (v - mean) / std);
    let lb, ub;
    if (demoMethod === 'zscore') { lb = mean - 3 * std; ub = mean + 3 * std; }
    else if (demoMethod === 'iqr') { lb = Q1 - 1.5 * IQR; ub = Q3 + 1.5 * IQR; }
    else { lb = getQ(data, 5); ub = getQ(data, 95); }
    const outlierIdx = data.map((v, i) => (v < lb || v > ub ? i : -1)).filter(i => i >= 0);
    const handled = handleMode === 'trim'
      ? data.filter((v) => v >= lb && v <= ub)
      : data.map(v => Math.min(Math.max(v, lb), ub));
    return { data, mean: mean.toFixed(1), std: std.toFixed(1), Q1: Q1.toFixed(1), Q3: Q3.toFixed(1), IQR: IQR.toFixed(1), lb: lb.toFixed(1), ub: ub.toFixed(1), outlierIdx, zScores: zScores.map(z => z.toFixed(2)), handled };
  }, [demoMethod, handleMode]);

  return (
    <div className="tab-layout-container">
      <div className="sub-nav-links">
        {tabs.map(t => <button key={t.id} className={`sub-nav-link ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>)}
      </div>

      <div className="sub-tab-content" style={{ marginTop: '1.5rem' }}>

        {/* ═══ TAB 1: OVERVIEW ══════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="tab-content fade-in">
            <div className="hero-section" style={{ paddingTop: 0 }}>
              <h2 className="hero-title">Outlier Handling</h2>
              <p className="hero-subtitle">An outlier is a data point that lies far from the rest of the data. A single outlier can shift the mean, corrupt scaling, and skew every model trained on it.</p>
            </div>

            {/* Boxplot Anatomy */}
            <div className="section-block">
              <h3 className="section-title-sub">📦 The Boxplot — Most Important Outlier Visualization</h3>
              <p className="tutorial-paragraph" style={{ marginBottom: '1rem' }}>
                A boxplot (box-and-whisker plot) summarises the full distribution of a feature in one visual.
                Any point <strong>beyond the whiskers</strong> is flagged as a potential outlier.
              </p>

              <div style={{ background: 'rgba(10,15,30,0.6)', borderRadius: '14px', padding: '1.5rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                  Dataset: [30, 35, 40, 38, 36, 42, 33, <span style={{ color: '#f43f5e', fontWeight: 700 }}>400</span>]
                </div>
                <BoxplotSVG data={RAW_DATA} color="#6366f1" showLabels={true} />
              </div>

              <BoxplotAnatomyLegend color="#6366f1" />
            </div>

            {/* Danger cards */}
            <div className="section-block">
              <h3 className="section-title-sub">Why Are Outliers Dangerous?</h3>
              <div className="analysis-grid">
                {[
                  { c: '#f43f5e', title: 'Shifts the Mean', body: 'Salary [30,40,50,60] → mean = 45\nAdd 5000 → mean = 1036\nOne point destroys the average.' },
                  { c: '#f59e0b', title: 'Distorts Scaling', body: 'MinMaxScaler maps values to [0,1].\nWith outlier 5000, all normal values\nget compressed to near 0.00–0.01.' },
                  { c: '#8b5cf6', title: 'Skews Regression', body: 'The regression line pulls toward\nthe outlier. Predictions on normal\ndata become inaccurate.' },
                  { c: '#f43f5e', title: 'Inflates Variance', body: 'One extreme value explodes std dev,\nmaking data appear highly variable\neven when most values are tight.' },
                ].map((d, i) => (
                  <div key={i} className="analysis-card" style={{ borderLeft: `3px solid ${d.c}` }}>
                    <div className="analysis-name" style={{ color: d.c }}>{d.title}</div>
                    <pre className="analysis-note" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.85rem', margin: 0 }}>{d.body}</pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block">
              <h3 className="section-title-sub">Detection → Handling Workflow</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {[
                  { label: '1. Visualize', sub: 'Boxplot / Histogram / Scatter', c: '#6366f1' },
                  { label: '2. Detect', sub: 'Z-Score / IQR / Percentile', c: '#f59e0b' },
                  { label: '3. Handle', sub: 'Trim / Cap / Winsorize', c: '#10b981' },
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    <div style={{ background: `${s.c}15`, border: `1px solid ${s.c}40`, borderRadius: '10px', padding: '0.75rem 1.25rem', textAlign: 'center', flex: 1, minWidth: '140px' }}>
                      <div style={{ color: s.c, fontWeight: 700, fontSize: '1rem' }}>{s.label}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.2rem' }}>{s.sub}</div>
                    </div>
                    {i < 2 && <ArrowRight size={20} style={{ color: '#475569', flexShrink: 0 }} />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: DETECTION ═════════════════════════════════════════════ */}
        {activeTab === 'detect' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Outlier Detection Methods</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>Always detect before handling. Start with visuals, then apply a statistical method.</p>

            {/* Visual Methods */}
            <div className="premium-card" style={{ borderTop: '4px solid #64748b', marginBottom: '1.5rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <h3>Step 0: Visual Detection</h3>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc" style={{ marginBottom: '1.5rem' }}>Before any formula, visualise. A boxplot, histogram, or scatter plot instantly reveals suspicious extreme values.</p>

                {/* BOXPLOT */}
                <h4 style={{ color: '#a5b4fc', marginBottom: '0.5rem', fontSize: '1rem' }}>📦 Box Plot</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Points outside the whiskers are potential outliers. The red dot at 400 is clearly far from the main cluster.</p>
                <div style={{ background: 'rgba(10,15,30,0.6)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                  <BoxplotSVG data={RAW_DATA} color="#6366f1" showLabels={true} />
                </div>

                {/* HISTOGRAM */}
                <h4 style={{ color: '#a5b4fc', marginBottom: '0.5rem', fontSize: '1rem' }}>📊 Histogram</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>An isolated bar far from the main cluster (red shaded zone) signals an outlier region.</p>
                <div style={{ background: 'rgba(10,15,30,0.6)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                  <HistogramSVG data={RAW_DATA} color="#8b5cf6" upperFence={49.5} />
                </div>

                {/* SCATTER */}
                <h4 style={{ color: '#a5b4fc', marginBottom: '0.5rem', fontSize: '1rem' }}>🔵 Scatter Plot</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>Dots far from the main horizontal cloud are outliers. The value 400 appears completely isolated on the right.</p>
                <div style={{ background: 'rgba(10,15,30,0.6)', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                  <ScatterSVG data={RAW_DATA} color="#06b6d4" upperFence={49.5} />
                </div>

                <Code color="#64748b" code={`import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# Box Plot
sns.boxplot(x=df['salary'], ax=axes[0], color='#6366f1')
axes[0].set_title('Box Plot')

# Histogram
df['salary'].hist(ax=axes[1], bins=20, color='#8b5cf6')
axes[1].set_title('Histogram')

# Scatter Plot
axes[2].scatter(df.index, df['salary'], color='#06b6d4')
axes[2].set_title('Scatter Plot')

plt.tight_layout()
plt.show()`} />
              </div>
            </div>

            {/* Z-Score */}
            <div className="premium-card" style={{ borderTop: '4px solid #6366f1', marginBottom: '1.5rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: '#6366f120', color: '#6366f1' }}><Filter size={20} /></div>
                  <h3>Method 1: Z-Score (Normal Distributions)</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: '#6366f120', color: '#6366f1', fontWeight: 700, marginLeft: 'auto' }}>Normal Only</span>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc">Measures how many standard deviations a value is from the mean. Rule: |Z| &gt; 3 = outlier.</p>
                <div className="formula-box" style={{ borderColor: '#6366f1', boxShadow: '0 0 20px rgba(99,102,241,0.15)', margin: '1rem 0' }}>
                  <div className="formula-box-title" style={{ color: '#6366f1' }}>Formula</div>
                  <div className="formula-visual">
                    <span className="fv-left">Z =</span>
                    <div className="fraction-block">
                      <div className="frac-top">X − μ</div>
                      <div className="frac-line"></div>
                      <div className="frac-bot">σ</div>
                    </div>
                  </div>
                  <div className="formula-vars" style={{ marginTop: '0.75rem' }}>
                    {[['X', 'Data point value'], ['μ', 'Mean of all values'], ['σ', 'Standard deviation'], ['|Z| > 3', 'Considered an outlier']].map(([s, d], i) => (
                      <div key={i} className="formula-var-row"><code className="var-sym" style={{ color: i === 3 ? '#f43f5e' : '#6366f1' }}>{s}</code><span className="var-desc">= {d}</span></div>
                    ))}
                  </div>
                </div>
                {/* Mini boxplot for Z-Score context */}
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Boxplot of dataset — Z-Score method flags values more than 3σ from mean:</p>
                <div style={{ background: 'rgba(10,15,30,0.6)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(99,102,241,0.15)', marginBottom: '1rem' }}>
                  <BoxplotSVG data={RAW_DATA} color="#6366f1" showLabels={false} compact />
                </div>
                <Code color="#6366f1" code={`from scipy import stats
import numpy as np

df['salary'] = [30, 35, 40, 38, 36, 42, 33, 400]

# Calculate Z-scores
z_scores = stats.zscore(df['salary'])
print(z_scores.round(2))
# [ 0.36  0.43  0.51  0.49  0.44  0.53  0.40  -3.15]  ← 400 has |Z|>3

# Detect outliers
outliers = df[abs(z_scores) > 3]

# Handle: Trimming
df_trimmed = df[abs(z_scores) <= 3]

# Handle: Capping
mean, std = df['salary'].mean(), df['salary'].std()
df['salary'] = np.clip(df['salary'], mean - 3*std, mean + 3*std)`} />
              </div>
            </div>

            {/* IQR */}
            <div className="premium-card" style={{ borderTop: '4px solid #f59e0b', marginBottom: '1.5rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: '#f59e0b20', color: '#f59e0b' }}><Filter size={20} /></div>
                  <h3>Method 2: IQR Method (Most Popular)</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: '#f59e0b20', color: '#f59e0b', fontWeight: 700, marginLeft: 'auto' }}>Skewed &amp; All Data</span>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc">Uses the interquartile range (spread of the middle 50%). More robust than Z-Score because it avoids the mean, which itself gets distorted by outliers.</p>
                <div className="formula-box" style={{ borderColor: '#f59e0b', margin: '1rem 0' }}>
                  <div className="formula-box-title" style={{ color: '#f59e0b' }}>Formulas</div>
                  <div style={{ fontFamily: 'monospace', color: '#fcd34d', lineHeight: 2, fontSize: '0.9rem' }}>
                    IQR = Q3 − Q1<br />
                    Lower Fence = Q1 − 1.5 × IQR<br />
                    Upper Fence = Q3 + 1.5 × IQR<br />
                    <span style={{ color: '#f43f5e' }}>Outlier: value &lt; Lower OR value &gt; Upper</span>
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>The boxplot whiskers <em>are</em> the IQR fences — outliers are dots beyond them:</p>
                <div style={{ background: 'rgba(10,15,30,0.6)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '1rem' }}>
                  <BoxplotSVG data={RAW_DATA} color="#f59e0b" showLabels={true} />
                </div>
                <Code color="#f59e0b" code={`import numpy as np, pandas as pd

df = pd.DataFrame({'salary': [30, 35, 40, 38, 36, 42, 33, 400]})

Q1 = df['salary'].quantile(0.25)   # ≈ 34.5
Q3 = df['salary'].quantile(0.75)   # ≈ 40.5
IQR = Q3 - Q1                      # ≈ 6.0

lower = Q1 - 1.5 * IQR             # ≈ 25.5
upper = Q3 + 1.5 * IQR             # ≈ 49.5

# Detect
outliers = df[(df['salary'] < lower) | (df['salary'] > upper)]
# → 400 is the outlier

# Handle: Trimming
df_trimmed = df[(df['salary'] >= lower) & (df['salary'] <= upper)]

# Handle: Capping
df['salary'] = np.clip(df['salary'], lower, upper)`} />
              </div>
            </div>

            {/* Percentile */}
            <div className="premium-card" style={{ borderTop: '4px solid #10b981', marginBottom: '1.5rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: '#10b98120', color: '#10b981' }}><Filter size={20} /></div>
                  <h3>Method 3: Percentile Method</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: '#10b98120', color: '#10b981', fontWeight: 700, marginLeft: 'auto' }}>Large Datasets</span>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc">Define a percentage cutoff at each tail (e.g. bottom 5% and top 5%). More flexible — you control the aggressiveness.</p>
                <div style={{ background: 'rgba(10,15,30,0.6)', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(16,185,129,0.15)', marginBottom: '1rem' }}>
                  <HistogramSVG data={[...RAW_DATA, 2, 5, 380, 390]} color="#10b981" lowerFence={5} upperFence={370} />
                </div>
                <Code color="#10b981" code={`import numpy as np, pandas as pd

df = pd.DataFrame({'salary': [30, 35, 40, 38, 36, 42, 33, 400]})

lower = df['salary'].quantile(0.05)   # 5th percentile
upper = df['salary'].quantile(0.95)   # 95th percentile

# Detect
outliers = df[(df['salary'] < lower) | (df['salary'] > upper)]

# Handle: Capping (Winsorization)
df['salary'] = np.clip(df['salary'], lower, upper)`} />
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB 3: HANDLING ══════════════════════════════════════════════ */}
        {activeTab === 'handle' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Handling Techniques</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>Once outliers are detected, use one of these three strategies.</p>

            {/* Trimming */}
            <div className="premium-card" style={{ borderTop: '4px solid #f43f5e', marginBottom: '1.5rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: '#f43f5e20', color: '#f43f5e' }}><Scissors size={20} /></div>
                  <h3>Technique 1: Trimming (Removal)</h3>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc" style={{ marginBottom: '1rem' }}>Deletes rows that contain outlier values. Dataset becomes smaller but purer.</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Before (400 is outlier):</p>
                    <BoxplotSVG data={RAW_DATA} color="#f43f5e" showLabels={false} compact />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>After Trimming (400 removed):</p>
                    <BoxplotSVG data={[30, 35, 40, 38, 36, 42, 33]} color="#10b981" showLabels={false} compact />
                  </div>
                </div>
                <div className="pros-cons-row">
                  <div className="pros-block"><div className="pros-title text-emerald">✅ Pros</div><ul><li>Cleaner, purer data</li><li>Removes noise entirely</li></ul></div>
                  <div className="cons-block"><div className="cons-title text-rose">❌ Cons</div><ul><li>Data loss — dangerous for small sets</li><li>Bias if outliers are not MCAR</li></ul></div>
                </div>
                <Code color="#f43f5e" code={`Q1, Q3 = df['salary'].quantile([0.25, 0.75])
IQR = Q3 - Q1
lower, upper = Q1 - 1.5*IQR, Q3 + 1.5*IQR

# Remove outlier rows entirely
df_trimmed = df[(df['salary'] >= lower) & (df['salary'] <= upper)]
print(f"Rows: {len(df)} → {len(df_trimmed)}")`} />
              </div>
            </div>

            {/* Capping */}
            <div className="premium-card" style={{ borderTop: '4px solid #6366f1', marginBottom: '1.5rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: '#6366f120', color: '#6366f1' }}><Shield size={20} /></div>
                  <h3>Technique 2: Capping (Clipping)</h3>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc" style={{ marginBottom: '1rem' }}>Keeps all rows but replaces extreme values with the fence boundary.</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Before (400 is far outlier):</p>
                    <BoxplotSVG data={RAW_DATA} color="#f43f5e" showLabels={false} compact />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>After Capping (400 → 49.5):</p>
                    <BoxplotSVG data={[30, 35, 40, 38, 36, 42, 33, 49.5]} color="#6366f1" showLabels={false} compact />
                  </div>
                </div>
                <div className="pros-cons-row">
                  <div className="pros-block"><div className="pros-title text-emerald">✅ Pros</div><ul><li>No data loss</li><li>Best for small/medium datasets</li></ul></div>
                  <div className="cons-block"><div className="cons-title text-rose">❌ Cons</div><ul><li>Introduces artificial boundary values</li></ul></div>
                </div>
                <Code color="#6366f1" code={`import numpy as np

# Most concise way — np.clip
df['salary'] = np.clip(df['salary'], lower, upper)
# 400 → 49.5 (the upper fence value)`} />
              </div>
            </div>

            {/* Winsorization */}
            <div className="premium-card" style={{ borderTop: '4px solid #ec4899', marginBottom: '1.5rem' }}>
              <div className="premium-card-header">
                <div className="premium-card-title">
                  <div className="premium-icon-wrap" style={{ background: '#ec489920', color: '#ec4899' }}><Shield size={20} /></div>
                  <h3>Technique 3: Winsorization</h3>
                  <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: '#ec489920', color: '#ec4899', fontWeight: 700, marginLeft: 'auto' }}>Industry Favourite</span>
                </div>
              </div>
              <div className="premium-card-body">
                <p className="premium-desc" style={{ marginBottom: '1rem' }}>Percentile-based capping — clips a fixed % from each tail. Used heavily in finance and production ML.</p>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Before Winsorization:</p>
                    <BoxplotSVG data={RAW_DATA} color="#f43f5e" showLabels={false} compact />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>After Winsorize (5%–95%):</p>
                    <BoxplotSVG data={[30, 35, 40, 38, 36, 42, 33, 42]} color="#ec4899" showLabels={false} compact />
                  </div>
                </div>
                <Code color="#ec4899" code={`from scipy.stats.mstats import winsorize

# Clip bottom 5% and top 5%
df['salary'] = winsorize(df['salary'], limits=[0.05, 0.05])

# Alternative Pandas approach
lower = df['salary'].quantile(0.05)
upper = df['salary'].quantile(0.95)
df['salary'] = df['salary'].clip(lower=lower, upper=upper)`} />
              </div>
            </div>

            <h3 className="section-title-sub">Comparison Table</h3>
            <div className="table-wrapper">
              <table className="compare-table">
                <thead><tr><th>Property</th><th style={{ color: '#f43f5e' }}>Trimming</th><th style={{ color: '#6366f1' }}>Capping</th><th style={{ color: '#ec4899' }}>Winsorization</th></tr></thead>
                <tbody>
                  {[
                    ['Removes rows?', '✅ Yes', '❌ No', '❌ No'],
                    ['Data loss', 'High', 'None', 'None'],
                    ['Boundary defined by', 'Method fence', 'Method fence', 'Percentile %'],
                    ['Best for', '>1 lakh rows', 'Small datasets', 'Financial / production'],
                    ['Risk', 'Bias if MNAR', 'Artificial values', 'Artificial values'],
                  ].map(([p, t, c, w], i) => (
                    <tr key={i}><td>{p}</td><td style={{ color: '#f43f5e' }}>{t}</td><td style={{ color: '#6366f1' }}>{c}</td><td style={{ color: '#ec4899' }}>{w}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ TAB 4: INTERACTIVE DEMO ══════════════════════════════════════ */}
        {activeTab === 'interactive' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Interactive Outlier Demo</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '1.5rem' }}>
              Dataset: <code>[30, 35, 40, 38, 36, 42, 33, <span style={{ color: '#f43f5e', fontWeight: 700 }}>400</span>]</code>
            </p>

            <div className="calc-layout">
              <div className="calc-left">
                <div className="calc-section">
                  <label className="calc-label">Detection Method:</label>
                  <div className="calc-scaler-grid">
                    {[{ k: 'zscore', l: 'Z-Score', c: '#6366f1' }, { k: 'iqr', l: 'IQR', c: '#f59e0b' }, { k: 'percentile', l: 'Percentile (5–95)', c: '#10b981' }].map(m => (
                      <button key={m.k} className={`calc-scaler-btn ${demoMethod === m.k ? 'active' : ''}`} style={{ '--sc-color': m.c }} onClick={() => setDemoMethod(m.k)}>{m.l}</button>
                    ))}
                  </div>
                </div>
                <div className="calc-section" style={{ marginTop: '1.5rem' }}>
                  <label className="calc-label">Handling Strategy:</label>
                  <div className="calc-scaler-grid">
                    {[{ k: 'cap', l: 'Capping', c: '#6366f1' }, { k: 'trim', l: 'Trimming', c: '#f43f5e' }].map(m => (
                      <button key={m.k} className={`calc-scaler-btn ${handleMode === m.k ? 'active' : ''}`} style={{ '--sc-color': m.c }} onClick={() => setHandleMode(m.k)}>{m.l}</button>
                    ))}
                  </div>
                </div>
                <div className="calc-section" style={{ marginTop: '1.5rem' }}>
                  <label className="calc-label">Computed Stats:</label>
                  <div className="stats-grid">
                    {[['Q1', demo.Q1], ['Q3', demo.Q3], ['IQR', demo.IQR], ['Lower Fence', demo.lb], ['Upper Fence', demo.ub], ['Outliers Found', String(demo.outlierIdx.length)]].map(([k, v], i) => (
                      <div key={i} className="stat-item"><span>{k}</span><strong style={{ color: i >= 3 ? '#f59e0b' : 'inherit' }}>{v}</strong></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="calc-right">
                <div className="live-formula-box" style={{ borderColor: '#8b5cf6', padding: '1.25rem' }}>
                  <div className="live-formula-title" style={{ color: '#8b5cf6', marginBottom: '1rem' }}>
                    Live Boxplot — Before vs After
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Before ({demo.outlierIdx.length} outlier{demo.outlierIdx.length !== 1 ? 's' : ''} detected — shown in red):</p>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(244,63,94,0.2)' }}>
                      <BoxplotSVG data={demo.data} color="#f43f5e" showLabels={false} compact />
                    </div>
                  </div>

                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>After {handleMode === 'trim' ? 'Trimming' : 'Capping'}:</p>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '0.75rem', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <BoxplotSVG data={demo.handled.length > 1 ? demo.handled : [0, 1]} color="#8b5cf6" showLabels={false} compact />
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {demo.data.map((v, i) => {
                      const isOut = demo.outlierIdx.includes(i);
                      const after = handleMode === 'trim' ? (isOut ? null : v) : Number(demo.handled[i]).toFixed(1);
                      return (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{ padding: '0.3rem 0.6rem', background: isOut ? 'rgba(244,63,94,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isOut ? '#f43f5e' : 'rgba(255,255,255,0.08)'}`, borderRadius: '6px', color: isOut ? '#f43f5e' : '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace' }}>{v}</div>
                          <div style={{ color: '#475569', fontSize: '0.6rem', margin: '2px 0' }}>↓</div>
                          <div style={{ padding: '0.3rem 0.6rem', background: isOut ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isOut ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`, borderRadius: '6px', color: isOut ? '#c4b5fd' : '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace' }}>{after === null ? '✂️' : after}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB 5: DECISION GUIDE ════════════════════════════════════════ */}
        {activeTab === 'decision' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Decision Guide & Interview Cheat Sheet</h2>
            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', color: '#cbd5e1', lineHeight: '1.8', fontSize: '0.95rem', overflowX: 'auto', whiteSpace: 'pre', marginBottom: '2rem' }}>
{`Numerical Feature
       │
       ▼
Visualise First (Boxplot!)
       │
       ▼
Check Distribution
       │
 ┌─────┴─────┐
Normal     Skewed
 │           │
Z-Score    IQR Method
 │           │
 └─────┬─────┘
       ▼
 Dataset Size?
       │
 ┌─────┴──────┐
Small/Med   Large (>1L)
 │             │
CAPPING     TRIMMING
(keep rows) (remove rows)

Financial / Production Data?
→ Winsorization (5–95%)`}
            </div>

            <div className="section-block">
              <h3 className="section-title-sub">When to Use What</h3>
              <div className="table-wrapper">
                <table className="compare-table">
                  <thead><tr><th>Situation</th><th>Detection</th><th>Handling</th></tr></thead>
                  <tbody>
                    {[
                      ['Normal distribution', 'Z-Score (|Z| > 3)', 'Trimming or Capping'],
                      ['Skewed / real-world data', 'IQR method', 'Capping preferred'],
                      ['Large dataset (>1 lakh rows)', 'Percentile', 'Trimming OK'],
                      ['Small / medium dataset', 'IQR', 'Capping (no data loss)'],
                      ['Financial / production data', 'Percentile', 'Winsorization'],
                    ].map(([s, d, h], i) => <tr key={i}><td>{s}</td><td style={{ color: '#f59e0b' }}>{d}</td><td style={{ color: '#10b981' }}>{h}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="section-block">
              <h3 className="section-title-sub">Top Interview Questions</h3>
              <div className="algo-list">
                {[
                  ['Which method is most used in industry?', 'IQR-based detection with Capping (Winsorization). Real-world data is almost always skewed, and capping preserves sample size while neutralizing extreme values.'],
                  ['Z-Score vs IQR — which is better?', 'IQR is more robust. Z-Score uses mean and std dev, which are themselves distorted by outliers. IQR uses median and quartiles that are resistant to extreme values.'],
                  ['When should you NOT remove outliers?', 'In fraud detection, anomaly detection, or medical diagnostics — the outliers ARE the signal you want to learn. Removing them would destroy your model\'s ability to detect rare events.'],
                  ['What is Winsorization?', 'A form of percentile capping where you clip a fixed percentage (e.g. 5%) from each tail to the boundary value. All rows are kept, only extreme values are replaced.'],
                ].map(([q, a], i) => (
                  <div key={i} className="algo-row expanded" style={{ cursor: 'default', marginBottom: '0.75rem' }}>
                    <div className="algo-row-header"><div className="algo-row-left"><span className="algo-row-name" style={{ color: '#a5b4fc' }}>Q: {q}</span></div></div>
                    <div className="algo-row-body"><p className="algo-why">{a}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
