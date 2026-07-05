import React, { useState, useMemo } from 'react';

// ── Softmax function ─────────────────────────────────────────────────────────
function softmax(scores) {
  const max = Math.max(...scores);
  const exps = scores.map(s => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

// ── Deterministic data generation ────────────────────────────────────────────
function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function generateData() {
  const rng = seededRand(77);
  const pts = [];
  // Class 0 (blue) – bottom-left cluster
  for (let i = 0; i < 30; i++) {
    pts.push({ x: -2.5 + rng() * 2.0, y: -2.5 + rng() * 2.0, label: 0 });
  }
  // Class 1 (green) – top cluster
  for (let i = 0; i < 30; i++) {
    pts.push({ x: -1.0 + rng() * 2.0, y: 1.0 + rng() * 2.0, label: 1 });
  }
  // Class 2 (orange) – right cluster
  for (let i = 0; i < 30; i++) {
    pts.push({ x: 1.5 + rng() * 2.0, y: -1.0 + rng() * 2.0, label: 2 });
  }
  return pts;
}

const POINTS = generateData();
const CLASS_COLORS = ['#3b82f6', '#22c55e', '#f59e0b'];
const CLASS_NAMES  = ['Class 0', 'Class 1', 'Class 2'];
const NUM_CLASSES  = 3;
const NUM_FEATURES = 2; // x, y

// ── SVG helpers ──────────────────────────────────────────────────────────────
const W = 460, H = 340, PAD = 42;
const X_MIN = -4, X_MAX = 5, Y_MIN = -4, Y_MAX = 4.5;
const toSX = x => PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
const toSY = y => H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD);

// ── Softmax Probability Bar ──────────────────────────────────────────────────
function ProbBar({ probs }) {
  return (
    <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden', height: '18px', width: '100%', border: '1px solid rgba(255,255,255,0.06)' }}>
      {probs.map((p, i) => (
        <div key={i} style={{
          width: `${p * 100}%`,
          background: CLASS_COLORS[i],
          opacity: 0.85,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6rem', color: '#fff', fontWeight: 700,
          transition: 'width 0.3s ease',
          minWidth: p > 0.04 ? '20px' : '0',
        }}>
          {p > 0.08 ? `${(p * 100).toFixed(0)}%` : ''}
        </div>
      ))}
    </div>
  );
}

// ── Interactive Softmax Demo ─────────────────────────────────────────────────
function SoftmaxDemo() {
  const [scores, setScores] = useState([2.0, 1.0, 0.5]);
  const probs = softmax(scores);
  const predicted = probs.indexOf(Math.max(...probs));

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <strong style={{ color: '#e2e8f0', fontSize: '0.88rem' }}>🔬 Softmax Explorer — adjust raw scores (logits) and see probabilities</strong>

      {scores.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ color: CLASS_COLORS[i], fontWeight: 700, fontSize: '0.78rem', minWidth: '55px' }}>{CLASS_NAMES[i]}</span>
          <span style={{ color: '#64748b', fontSize: '0.72rem', minWidth: '28px' }}>z={s.toFixed(1)}</span>
          <input type="range" min={-5} max={5} step={0.1} value={s}
            onChange={e => { const v = [...scores]; v[i] = parseFloat(e.target.value); setScores(v); }}
            style={{ flex: 1, accentColor: CLASS_COLORS[i] }}
          />
          <span style={{
            fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 700,
            color: predicted === i ? CLASS_COLORS[i] : '#64748b',
            background: predicted === i ? `${CLASS_COLORS[i]}18` : 'rgba(0,0,0,0.2)',
            padding: '2px 8px', borderRadius: '6px', minWidth: '52px', textAlign: 'center',
            border: predicted === i ? `1px solid ${CLASS_COLORS[i]}44` : '1px solid transparent',
          }}>
            {(probs[i] * 100).toFixed(1)}%
          </span>
        </div>
      ))}

      <ProbBar probs={probs} />

      <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
        Prediction: <strong style={{ color: CLASS_COLORS[predicted] }}>{CLASS_NAMES[predicted]}</strong> &nbsp;|&nbsp;
        All probabilities sum to <strong style={{ color: '#facc15' }}>{probs.reduce((a, b) => a + b, 0).toFixed(3)}</strong> (always 1.0)
      </div>
    </div>
  );
}

// ── Scatter Plot with Decision Regions ───────────────────────────────────────
function ScatterViz() {
  // Simple fixed weights for visualization (pre-trained)
  const weights = [
    { w: [-0.8, -0.7], b: 0.5 },   // class 0 weights
    { w: [-0.2,  0.9], b: -0.3 },   // class 1 weights
    { w: [ 0.9, -0.3], b: -0.4 },   // class 2 weights
  ];

  // Compute decision region coloring
  const regionSize = 30;
  const regions = useMemo(() => {
    const cells = [];
    for (let xi = 0; xi < regionSize; xi++) {
      for (let yi = 0; yi < regionSize; yi++) {
        const x = X_MIN + (xi / (regionSize - 1)) * (X_MAX - X_MIN);
        const y = Y_MIN + (yi / (regionSize - 1)) * (Y_MAX - Y_MIN);
        const scores = weights.map(w => w.w[0] * x + w.w[1] * y + w.b);
        const probs = softmax(scores);
        const cls = probs.indexOf(Math.max(...probs));
        cells.push({ xi, yi, x, y, cls, confidence: Math.max(...probs) });
      }
    }
    return cells;
  }, []);

  const cellW = (W - 2 * PAD) / regionSize;
  const cellH = (H - 2 * PAD) / regionSize;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', background: '#060a18', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Decision regions */}
      {regions.map((r, i) => (
        <rect key={i}
          x={PAD + r.xi * cellW} y={H - PAD - (r.yi + 1) * cellH}
          width={cellW + 0.5} height={cellH + 0.5}
          fill={CLASS_COLORS[r.cls]}
          opacity={0.06 + r.confidence * 0.08}
        />
      ))}
      {/* Grid */}
      {[-3, -2, -1, 0, 1, 2, 3, 4].map(v => (
        <line key={`gx${v}`} x1={toSX(v)} y1={PAD} x2={toSX(v)} y2={H - PAD} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      ))}
      {[-3, -2, -1, 0, 1, 2, 3, 4].map(v => (
        <line key={`gy${v}`} x1={PAD} y1={toSY(v)} x2={W - PAD} y2={toSY(v)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      ))}
      {/* Axes */}
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      {/* Axis labels */}
      {[-3, -1, 0, 1, 3, 5].map(v => (
        <text key={v} x={toSX(v)} y={H - PAD + 14} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">{v}</text>
      ))}
      {[-3, -1, 0, 1, 3].map(v => (
        <text key={v} x={PAD - 5} y={toSY(v) + 3} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.3)">{v}</text>
      ))}
      <text x={W / 2} y={H - PAD + 26} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">Feature 1</text>
      <text x={14} y={H / 2} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)" transform={`rotate(-90,14,${H / 2})`}>Feature 2</text>
      <text x={W / 2} y={16} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" fontStyle="italic">Multi-class Decision Regions (3 classes)</text>
      {/* Points */}
      {POINTS.map((p, i) => (
        <circle key={i} cx={toSX(p.x)} cy={toSY(p.y)} r={4.5}
          fill={CLASS_COLORS[p.label]} opacity={0.9} stroke="rgba(0,0,0,0.4)" strokeWidth={0.5} />
      ))}
      {/* Legend */}
      {CLASS_NAMES.map((name, i) => (
        <g key={i} transform={`translate(${W - PAD - 90}, ${PAD + 8 + i * 18})`}>
          <circle cx={5} cy={0} r={4} fill={CLASS_COLORS[i]} />
          <text x={14} y={3} fontSize="9" fill={CLASS_COLORS[i]} fontWeight="bold">{name}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function InteractiveSoftmaxRegression() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '1.25rem',
      background: 'linear-gradient(160deg, rgba(15,23,42,0.98), rgba(9,14,30,0.98))',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem',
    }}>

      {/* ── Logistic → Softmax intro ── */}
      <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '12px', padding: '0.9rem' }}>
        <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          From Logistic Regression → Softmax Regression
        </h4>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.65rem 0' }}>
          <strong style={{ color: '#e2e8f0' }}>Logistic Regression</strong> uses the <strong style={{ color: '#4ade80' }}>sigmoid function</strong> to classify between <strong>2 classes</strong>.
          <strong style={{ color: '#e2e8f0' }}> Softmax Regression</strong> (Multinomial Logistic Regression) generalizes this to <strong style={{ color: '#f59e0b' }}>K classes</strong> using the <strong style={{ color: '#f59e0b' }}>softmax function</strong>.
        </p>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Logistic (Sigmoid)', formula: 'σ(z) = 1/(1+e⁻ᶻ)', note: '2 classes → single probability', color: '#4ade80', bg: 'rgba(74,222,128,0.06)', bd: 'rgba(74,222,128,0.2)' },
            { label: 'Softmax', formula: 'P(yᵢ) = eᶻⁱ / Σ eᶻʲ', note: 'K classes → probability distribution', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', bd: 'rgba(245,158,11,0.2)' },
          ].map(c => (
            <div key={c.label} style={{ flex: 1, minWidth: '180px', background: c.bg, border: `1px solid ${c.bd}`, borderRadius: '10px', padding: '0.7rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: c.color, fontWeight: 700, marginBottom: '0.25rem' }}>{c.label}</div>
              <code style={{ fontSize: '0.82rem', color: '#e2e8f0', display: 'block', marginBottom: '0.2rem' }}>{c.formula}</code>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{c.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key Insight box ── */}
      <div style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.18)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
        <p style={{ color: '#fde68a', fontWeight: 700, fontSize: '0.85rem', margin: '0 0 0.4rem 0' }}>⚡ Why is Softmax a superset?</p>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
          When K = 2, the softmax function <strong style={{ color: '#facc15' }}>reduces exactly to the sigmoid function</strong>.
          With 2 classes, P(y=1) = e<sup>z₁</sup> / (e<sup>z₀</sup> + e<sup>z₁</sup>) = 1 / (1 + e<sup>−(z₁−z₀)</sup>) = σ(z).
          So logistic regression is just a <em>special case</em> of softmax with K = 2.
        </p>
      </div>

      {/* ── Softmax Flow Diagram (5.0, 2.5, 0.5 → 0.9, 0.1, 0.0) ── */}
      <div>
        <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>Softmax Regression — How It Transforms Scores to Probabilities</h4>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.65rem 0' }}>
          When we give an instance <em>x</em> to the Softmax Regression classifier, it first computes a score <em>sₖ(x)</em> for each class <em>k</em>,
          then estimates the probability of each class by applying the softmax function to the scores. The equation to compute softmax score
          sₖ(x) for class k is: <strong style={{ color: '#e2e8f0' }}>sₖ(x) = xᵀθ⁽ᵏ⁾</strong>
        </p>
        <svg viewBox="0 0 520 200" style={{ width: '100%', maxWidth: '520px', height: 'auto', margin: '0 auto', display: 'block' }}>
          {/* Left label */}
          <text x="20" y="90" fontSize="9" fill="#94a3b8" textAnchor="start">Model output</text>
          <text x="20" y="102" fontSize="9" fill="#94a3b8" textAnchor="start">for a particular</text>
          <text x="20" y="114" fontSize="9" fill="#94a3b8" textAnchor="start">input</text>
          {/* Brace */}
          <path d="M 90,45 Q 85,45 85,55 L 85,85 Q 85,95 80,95 Q 85,95 85,105 L 85,135 Q 85,145 90,145" fill="none" stroke="#94a3b8" strokeWidth="1.5" />

          {/* Input score circles */}
          {[
            { y: 45, score: '5.0' },
            { y: 95, score: '2.5' },
            { y: 145, score: '0.5' },
          ].map((item, i) => (
            <g key={i}>
              {/* Arrow from brace to circle */}
              <line x1="95" y1={item.y} x2="115" y2={item.y} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
              {/* Score circle */}
              <circle cx="145" cy={item.y} r="22" fill="#fde68a" stroke="#d4a50a" strokeWidth="1.5" />
              <text x="145" y={item.y + 4} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1a1a2e">{item.score}</text>
              {/* Arrow to softmax box */}
              <line x1="170" y1={item.y} x2="225" y2={item.y} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
            </g>
          ))}

          {/* Softmax box */}
          <rect x="230" y="25" width="70" height="145" rx="8" fill="rgba(74,222,128,0.15)" stroke="rgba(74,222,128,0.4)" strokeWidth="1.5" />
          <text x="265" y="93" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4ade80">Softmax</text>
          <text x="265" y="107" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4ade80">Function</text>

          {/* Output arrows and probability circles */}
          {[
            { y: 45, prob: '0.9', color: '#22c55e' },
            { y: 95, prob: '0.1', color: '#3b82f6' },
            { y: 145, prob: '0.0', color: '#94a3b8' },
          ].map((item, i) => (
            <g key={i}>
              <line x1="305" y1={item.y} x2="355" y2={item.y} stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrowGray)" />
              <circle cx="385" cy={item.y} r="22" fill={`${item.color}22`} stroke={item.color} strokeWidth="1.5" />
              <text x="385" y={item.y + 4} textAnchor="middle" fontSize="13" fontWeight="bold" fill={item.color}>{item.prob}</text>
            </g>
          ))}

          {/* Arrow marker definition */}
          <defs>
            <marker id="arrowGray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Caption */}
          <text x="260" y="192" textAnchor="middle" fontSize="10" fill="#64748b" fontStyle="italic">Softmax Regression</text>
        </svg>
        <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6, margin: '0.6rem 0 0 0', textAlign: 'center' }}>
          In logistic regression labels are binary: <em>y(i) ∈ {'{0, 1}'}</em>. Softmax handles <em>y(i) ∈ {'{1, …, K}'}</em> where K is the number of classes.
        </p>
      </div>

      {/* ── Iris Decision Boundary Example ── */}
      <div>
        <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>Decision Boundary — IRIS Dataset Example</h4>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.65rem 0' }}>
          Let's consider the IRIS dataset. When we use Softmax Regression to classify the iris flowers into all three classes, we get the following decision regions:
        </p>
        <svg viewBox="0 0 520 380" style={{ width: '100%', height: 'auto', background: '#060a18', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Background decision regions */}
          {/* Setosa region (yellow) – bottom-left */}
          <polygon points="42,340 42,140 180,42 220,340" fill="rgba(251,191,36,0.12)" />
          {/* Versicolor region (blue) – middle */}
          <polygon points="180,42 220,340 380,340 480,42" fill="rgba(96,165,250,0.1)" />
          {/* Virginica region (green) – top-right */}
          <polygon points="180,42 480,42 480,340 380,340" fill="rgba(74,222,128,0.08)" />

          {/* Decision boundary lines */}
          <line x1="180" y1="42" x2="220" y2="340" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line x1="220" y1="340" x2="480" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

          {/* Probability contour lines (curved, for Versicolor) */}
          <path d="M 200,42 Q 230,180 260,340" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
          <text x="205" y="130" fontSize="7" fill="rgba(239,68,68,0.5)" transform="rotate(-75,205,130)">0.150</text>
          <path d="M 220,42 Q 250,180 290,340" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
          <text x="225" y="130" fontSize="7" fill="rgba(239,68,68,0.5)" transform="rotate(-72,225,130)">0.300</text>
          <path d="M 245,42 Q 280,180 340,340" fill="none" stroke="rgba(239,68,68,0.35)" strokeWidth="1" />
          <text x="250" y="130" fontSize="7" fill="rgba(239,68,68,0.6)" transform="rotate(-68,250,130)">0.600</text>
          <path d="M 310,42 Q 350,180 410,340" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
          <text x="360" y="220" fontSize="7" fill="rgba(239,68,68,0.5)" transform="rotate(-55,360,220)">0.900</text>
          <path d="M 400,42 Q 420,180 450,340" fill="none" stroke="rgba(239,68,68,0.25)" strokeWidth="1" />
          <text x="420" y="220" fontSize="7" fill="rgba(239,68,68,0.4)" transform="rotate(-72,420,220)">0.450</text>

          {/* Axes */}
          <line x1="42" y1="340" x2="480" y2="340" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="42" y1="340" x2="42" y2="42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Axis labels */}
          {[0,1,2,3,4,5,6,7].map(v => (
            <g key={`xl${v}`}>
              <text x={42 + (v / 7) * 438} y={354} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)">{v}</text>
              <line x1={42 + (v / 7) * 438} y1={340} x2={42 + (v / 7) * 438} y2={343} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
            </g>
          ))}
          {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].map(v => (
            <g key={`yl${v}`}>
              <text x={36} y={340 - (v / 3.5) * 298 + 3} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.35)">{v.toFixed(1)}</text>
              <line x1={40} y1={340 - (v / 3.5) * 298} x2={42} y2={340 - (v / 3.5) * 298} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
            </g>
          ))}
          <text x={261} y={372} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">Petal length</text>
          <text x={16} y={190} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" transform="rotate(-90,16,190)">Petal width</text>

          {/* Iris-Setosa points (yellow circles, bottom-left) */}
          {[[80,305],[85,310],[90,308],[95,302],[100,312],[75,315],[88,318],[92,300],[70,320],[105,298],[78,322],[83,325],[96,295],[110,290]].map(([x,y],i) => (
            <circle key={`s${i}`} cx={x} cy={y} r={3.5} fill="#fbbf24" stroke="#a37200" strokeWidth="0.5" />
          ))}

          {/* Iris-Versicolor points (blue squares, middle) */}
          {[[240,260],[250,270],[260,255],[270,265],[280,250],[290,260],[300,240],[310,250],[320,245],[280,275],[295,248],[305,255],[315,238],[325,252],[270,280],[260,285]].map(([x,y],i) => (
            <rect key={`v${i}`} x={x - 3} y={y - 3} width={6} height={6} fill="#60a5fa" stroke="#2563eb" strokeWidth="0.5" />
          ))}

          {/* Iris-Virginica points (green triangles, top-right) */}
          {[[360,180],[370,170],[380,175],[390,165],[400,160],[410,155],[415,170],[420,158],[430,150],[440,145],[350,190],[375,185],[395,172],[405,168],[425,152],[435,148],[445,140],[360,195],[385,160],[395,155]].map(([x,y],i) => (
            <polygon key={`g${i}`} points={`${x},${y-4} ${x-4},${y+3} ${x+4},${y+3}`} fill="#22c55e" stroke="#15803d" strokeWidth="0.5" />
          ))}

          {/* Legend */}
          <rect x="65" y="165" width="120" height="68" rx="6" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Virginica */}
          <polygon points="78,180 74,187 82,187" fill="#22c55e" stroke="#15803d" strokeWidth="0.5" />
          <text x="90" y="185" fontSize="8" fill="#86efac">Iris-Virginica</text>
          {/* Versicolor */}
          <rect x="74" y="194" width="7" height="7" fill="#60a5fa" stroke="#2563eb" strokeWidth="0.5" />
          <text x="90" y="202" fontSize="8" fill="#93c5fd">Iris-Versicolor</text>
          {/* Setosa */}
          <circle cx="78" cy="215" r="3.5" fill="#fbbf24" stroke="#a37200" strokeWidth="0.5" />
          <text x="90" y="218" fontSize="8" fill="#fde68a">Iris-Setosa</text>

          {/* Title */}
          <text x="261" y="30" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)" fontStyle="italic">Softmax Regression decision boundaries (IRIS dataset)</text>
        </svg>

        {/* Explanation text */}
        <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '10px', padding: '0.85rem 1rem', marginTop: '0.65rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
            We can observe the resulting decision boundaries for three classes, represented by the background colors.
            The <strong style={{ color: '#e2e8f0' }}>decision boundaries between any two classes are linear</strong>.
            The probabilities for the Iris-Versicolor class are represented by the curved lines
            (e.g., the line labeled with 0.450 represents the 45% probability boundary).
            Notice that the model can predict a class that has an estimated probability below 50%.
            For example, <strong style={{ color: '#fde68a' }}>at the point where all decision boundaries meet,
            all classes have an equal estimated probability of 33%</strong>.
          </p>
        </div>
      </div>

      {/* ── Decision Regions Scatter ── */}
      <div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
          <strong style={{ color: '#fde68a' }}>📊 Multi-class Decision Regions</strong> — each shaded region shows which class the softmax model would predict for points in that area. The boundaries between regions are where the model is equally uncertain between two classes.
        </div>
        <ScatterViz />
      </div>

      {/* ── Interactive Softmax Explorer ── */}
      <SoftmaxDemo />

      {/* ── How Softmax Works ── */}
      <div>
        <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.65rem' }}>How Softmax Regression Works</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {[
            { n: 1, name: 'Compute Scores (Logits)', desc: 'For each class k, compute zₖ = Wₖ·X + bₖ. Each class has its own weight vector.', color: '#818cf8' },
            { n: 2, name: 'Apply Softmax', desc: 'Convert raw scores to probabilities: P(y=k) = eᶻᵏ / Σⱼ eᶻʲ. All probabilities sum to 1.', color: '#f59e0b' },
            { n: 3, name: 'Classify', desc: 'Predict the class with the highest probability: ŷ = argmax P(y=k).', color: '#4ade80' },
            { n: 4, name: 'Cross-Entropy Loss', desc: 'Loss = −Σ yₖ log(P̂ₖ). Penalizes the model when the predicted probability for the true class is low.', color: '#f87171' },
            { n: 5, name: 'Gradient Descent', desc: 'Update each class\'s weights: Wₖ = Wₖ − η × ∂Loss/∂Wₖ. Repeat for many epochs until convergence.', color: '#38bdf8' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.01)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div style={{ background: `${s.color}18`, color: s.color, borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>{s.n}</div>
              <div>
                <strong style={{ fontSize: '0.82rem', color: '#e2e8f0', display: 'block', marginBottom: '2px' }}>{s.name}</strong>
                <span style={{ fontSize: '0.77rem', color: '#94a3b8' }}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Comparison Table ── */}
      <div>
        <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.65rem' }}>Logistic vs Softmax — Side by Side</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Feature', 'Logistic Regression', 'Softmax Regression'].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '0.55rem 0.7rem', color: i === 0 ? '#94a3b8' : i === 1 ? '#4ade80' : '#f59e0b', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Classes', '2 (Binary)', 'K ≥ 2 (Multi-class)'],
                ['Activation', 'Sigmoid σ(z)', 'Softmax eᶻⁱ / Σeᶻʲ'],
                ['Output', 'Single probability', 'Probability distribution'],
                ['Loss Function', 'Binary Cross-Entropy', 'Categorical Cross-Entropy'],
                ['Weight Vectors', '1 vector (W, b)', 'K vectors (Wₖ, bₖ)'],
                ['When K=2', '—', 'Reduces to Logistic Regression'],
              ].map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '0.5rem 0.7rem', color: ci === 0 ? '#94a3b8' : '#e2e8f0' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Key Assumptions ── */}
      <div>
        <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.65rem' }}>Key Assumptions</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.55rem' }}>
          {[
            { name: 'Mutually Exclusive Classes', desc: 'Each sample belongs to exactly one class. No overlapping labels.' },
            { name: 'Linear Decision Boundaries', desc: 'Boundaries between classes are linear in feature space.' },
            { name: 'Independent Observations', desc: 'Training examples are independently and identically distributed (i.i.d.).' },
            { name: 'Sufficient Data per Class', desc: 'Needs enough samples per class for reliable probability estimation.' },
          ].map((a, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.7rem' }}>
              <strong style={{ fontSize: '0.78rem', color: '#f59e0b', display: 'block', marginBottom: '0.2rem' }}>{a.name}</strong>
              <span style={{ fontSize: '0.73rem', color: '#94a3b8' }}>{a.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
