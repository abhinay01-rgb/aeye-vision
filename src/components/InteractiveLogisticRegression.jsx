import React, { useState, useEffect, useRef } from 'react';

// ── Deterministic point generation (blue = class 0, green = class 1) ────────────────────────
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generatePoints() {
  const rand = seededRand(42);
  const pts = [];
  // class 0 (blue) – left side
  for (let i = 0; i < 55; i++) {
    const x = -3.5 + rand() * 2.5 + (rand() - 0.5) * 0.6;
    const y = -1.5 + rand() * 3.5;
    pts.push({ x, y, label: 0 });
  }
  // class 1 (green) – right side
  for (let i = 0; i < 55; i++) {
    const x = 0.5 + rand() * 2.5 + (rand() - 0.5) * 0.6;
    const y = -1.5 + rand() * 3.5;
    pts.push({ x, y, label: 1 });
  }
  return pts;
}

const POINTS = generatePoints();

// ── SVG helpers ───────────────────────────────────────────────────────────────────────
const VIEW_W = 500,
      VIEW_H = 340,
      PAD = 40;
const X_MIN = -7, X_MAX = 4, Y_MIN = -3.5, Y_MAX = 2.5;
const toSVGX = x => PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (VIEW_W - 2 * PAD);
const toSVGY = y => VIEW_H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (VIEW_H - 2 * PAD);

// ── Sigmoid ───────────────────────────────────────────────────────────────────────
function sigmoid(z) {
  // Clamp to avoid overflow
  const cz = Math.max(-500, Math.min(500, z));
  return 1 / (1 + Math.exp(-cz));
}

// ── Gradient Descent Visualizer (Feature space + Probability space) ───────────────────
function GradientDescentViz() {
  const [w, setW] = useState(-4);
  const [b, setB] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [running, setRunning] = useState(false);
  const [trail, setTrail] = useState([]); // past boundary positions
  const timerRef = useRef(null);
  const LR = 0.08;
  const MAX_EPOCH = 120;

  // Perform one GD step and return updated weights
  const gdStep = (pw, pb) => {
    let dw = 0, db = 0;
    for (const p of POINTS) {
      const pred = sigmoid(pw * p.x + pb);
      const err = pred - p.label;
      dw += err * p.x;
      db += err;
    }
    dw /= POINTS.length;
    db /= POINTS.length;
    return { w: pw - LR * dw, b: pb - LR * db };
  };

  // Main loop – runs while `running` is true
  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setEpoch(e => {
        if (e >= MAX_EPOCH) { setRunning(false); clearInterval(timerRef.current); return e; }
        return e + 1;
      });
      setW(pw => {
        const { w: newW, b: newB } = gdStep(pw, b);
        // Store snapshot before updating
        setTrail(prev => {
          const snap = { w: pw, b };
          return prev.length >= 6 ? [...prev.slice(-5), snap] : [...prev, snap];
        });
        setB(newB);
        return newW;
      });
    }, 200);
    return () => clearInterval(timerRef.current);
  }, [running, b]);

  const reset = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setW(-4);
    setB(0);
    setEpoch(0);
    setTrail([]);
  };

  // Decision boundary (x where w·x + b = 0)
  const boundaryX = w !== 0 ? -b / w : 0;
  const boundarySVGX = toSVGX(Math.max(X_MIN, Math.min(X_MAX, boundaryX)));

  // ── Chart 1 – Feature space (no sigmoid overlay) ────────────────────────────────
  const FeatureChart = () => (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: 'auto', background: '#060a18', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Grid */}
      {[-6, -4, -2, 0, 2].map(v => (
        <line key={`gx${v}`} x1={toSVGX(v)} y1={PAD} x2={toSVGX(v)} y2={VIEW_H - PAD} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      ))}
      {[-2, -1, 0, 1, 2].map(v => (
        <line key={`gy${v}`} x1={PAD} y1={toSVGY(v)} x2={VIEW_W - PAD} y2={toSVGY(v)} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      ))}
      {/* Axis labels */}
      {[-6, -4, -2, 0, 2].map(v => (
        <text key={`ax${v}`} x={toSVGX(v)} y={VIEW_H - PAD + 14} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">{v}</text>
      ))}
      {[-2, -1, 0, 1, 2].map(v => (
        <text key={`ay${v}`} x={PAD - 6} y={toSVGY(v) + 3} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">{v}</text>
      ))}
      {/* Axes */}
      <line x1={PAD} y1={PAD} x2={PAD} y2={VIEW_H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1={PAD} y1={VIEW_H - PAD} x2={VIEW_W - PAD} y2={VIEW_H - PAD} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      {/* Past boundary trail */}
      {trail.map((t, i) => {
        const bx = toSVGX(Math.max(X_MIN, Math.min(X_MAX, t.w !== 0 ? -t.b / t.w : 0)));
        const alpha = ((i + 1) / (trail.length + 1)) * 0.4;
        return <line key={i} x1={bx} y1={PAD} x2={bx} y2={VIEW_H - PAD} stroke={`rgba(239,68,68,${alpha})`} strokeWidth={1.5} strokeDasharray="4,3" />;
      })}
      {/* Current decision boundary */}
      <line x1={boundarySVGX} y1={PAD} x2={boundarySVGX} y2={VIEW_H - PAD} stroke="#ef4444" strokeWidth={2.5} />
      {/* Shaded regions */}
      <rect x={PAD} y={PAD} width={Math.max(0, boundarySVGX - PAD)} height={VIEW_H - 2 * PAD} fill="rgba(59,130,246,0.04)" />
      <rect x={boundarySVGX} y={PAD} width={Math.max(0, VIEW_W - PAD - boundarySVGX)} height={VIEW_H - 2 * PAD} fill="rgba(34,197,94,0.04)" />
      {/* Points */}
      {POINTS.map((p, i) => (
        <circle key={i} cx={toSVGX(p.x)} cy={toSVGY(p.y)} r={4.5} fill={p.label === 0 ? '#3b82f6' : '#22c55e'} opacity={0.85} />
      ))}
      {/* Labels */}
      <text x={toSVGX(-5.5)} y={toSVGY(2.2)} fontSize="11" fill="#93c5fd" fontWeight="bold">Class 0</text>
      <text x={toSVGX(1.5)} y={toSVGY(2.2)} fontSize="11" fill="#86efac" fontWeight="bold">Class 1</text>
      {/* Boundary annotation */}
      <text x={boundarySVGX + 6} y={PAD + 18} fontSize="9" fill="#ef4444" fontWeight="bold">x = {boundaryX.toFixed(2)}</text>
      <text x={boundarySVGX + 6} y={PAD + 30} fontSize="9" fill="rgba(239,68,68,0.7)">σ(z)=0.5 here</text>
    </svg>
  );

  // ── Chart 2 – Probability space (sigmoid curve) ──────────────────────────────────
  const PROB_W = 520, PROB_H = 200, PROB_PAD = 40;
  const Z_MIN = -8, Z_MAX = 8;
  const toPX = z => PROB_PAD + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (PROB_W - 2 * PROB_PAD);
  const toPY = p => PROB_H - PROB_PAD - p * (PROB_H - 2 * PROB_PAD);

  const ProbChart = () => (
    <svg viewBox={`0 0 ${PROB_W} ${PROB_H}`} style={{ width: '100%', height: 'auto', background: '#060a18', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(v => (
        <line key={v} x1={PROB_PAD} y1={toPY(v)} x2={PROB_W - PROB_PAD} y2={toPY(v)}
          stroke={v === 0.5 ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.04)'} strokeWidth={v === 0.5 ? 1.5 : 1} strokeDasharray={v === 0.5 ? '5,3' : ''} />
      ))}
      {[-6, -4, -2, 0, 2, 4, 6].map(v => (
        <line key={v} x1={toPX(v)} y1={PROB_PAD} x2={toPX(v)} y2={PROB_H - PROB_PAD} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
      ))}
      {/* Axes */}
      <line x1={PROB_PAD} y1={PROB_PAD} x2={PROB_PAD} y2={PROB_H - PROB_PAD} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      <line x1={PROB_PAD} y1={PROB_H - PROB_PAD} x2={PROB_W - PROB_PAD} y2={PROB_H - PROB_PAD} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      {/* Axis labels */}
      {[-6, -4, -2, 0, 2, 4, 6].map(v => (
        <text key={v} x={toPX(v)} y={PROB_H - PROB_PAD + 12} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">{v}</text>
      ))}
      {[0, 0.25, 0.5, 0.75, 1].map(v => (
        <text key={v} x={PROB_PAD - 5} y={toPY(v) + 3} textAnchor="end" fontSize="8"
          fill={v === 0.5 ? 'rgba(250,204,21,0.8)' : 'rgba(255,255,255,0.3)'}>{v}</text>
      ))}
      {/* Titles */}
      <text x={PROB_W / 2} y={PROB_H - 5} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)">z = W·X + b (weighted sum)</text>
      <text x={12} y={PROB_H / 2} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.25)" transform={`rotate(-90,12,${PROB_H / 2})`}>σ(z) probability</text>
      <text x={PROB_W / 2} y={16} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)" fontStyle="italic">Probability Space — σ(z) = 1/(1+e⁻ᶻ)</text>
      {/* Shaded regions */}
      <rect x={PROB_PAD} y={toPY(1)} width={toPX(0) - PROB_PAD} height={toPY(0.5) - toPY(1)} fill="rgba(59,130,246,0.07)" />
      <rect x={toPX(0)} y={toPY(1)} width={PROB_W - PROB_PAD - toPX(0)} height={toPY(0) - toPY(1)} fill="rgba(34,197,94,0.07)" />
      {/* Sigmoid curve */}
      <polyline fill="none" stroke="#facc15" strokeWidth={2.5}
        points={Array.from({ length: 200 }, (_, i) => {
          const z = Z_MIN + (i / 199) * (Z_MAX - Z_MIN);
          return `${toPX(z)},${toPY(sigmoid(z))}`;
        }).join(' ')} />
      {/* 0.5 threshold line */}
      <line x1={PROB_PAD} y1={toPY(0.5)} x2={PROB_W - PROB_PAD} y2={toPY(0.5)} stroke="rgba(250,204,21,0.5)" strokeWidth={1} strokeDasharray="5,3" />
      <text x={PROB_W - PROB_PAD - 2} y={toPY(0.5) - 5} textAnchor="end" fontSize="8" fill="rgba(250,204,21,0.9)">0.5 threshold → decision boundary</text>
      {/* z = 0 vertical line */}
      <line x1={toPX(0)} y1={PROB_PAD} x2={toPX(0)} y2={PROB_H - PROB_PAD} stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="3,2" />
      <text x={toPX(0) + 3} y={PROB_PAD + 11} fontSize="8" fill="rgba(255,255,255,0.4)">z = 0</text>
      {/* Region labels */}
      <text x={(PROB_PAD + toPX(0)) / 2} y={toPY(0.12)} textAnchor="middle" fontSize="9" fill="#93c5fd" fontWeight="bold">→ Class 0</text>
      <text x={(toPX(0) + PROB_W - PROB_PAD) / 2} y={toPY(0.12)} textAnchor="middle" fontSize="9" fill="#86efac" fontWeight="bold">→ Class 1</text>
    </svg>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Feature space chart */}
      <div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem', background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
          <strong style={{ color: '#93c5fd' }}>📊 Feature Space</strong> – data points with a moving decision boundary (red line). Past positions appear as faded red dashes.
        </div>
        <FeatureChart />
      </div>
      {/* Explanation box */}
      <div style={{ background: 'rgba(250,204,21,0.06)', border: '1px solid rgba(250,204,21,0.18)', borderRadius: '8px', padding: '0.85rem 1rem' }}>
        <p style={{ color: '#fde68a', fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>⚡ Why the boundary sits where σ(z)=0.5</p>
        <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.4rem' }}>
          At the boundary, <code>w·x + b = 0</code>. Plugging into the sigmoid yields <strong style={{ color: '#facc15' }}>σ(0)=0.5</strong>. Points left of the line have negative <code>z</code> → σ(z)≈0 (Class 0). Points right have positive <code>z</code> → σ(z)≈1 (Class 1).
        </p>
      </div>
      {/* Probability chart */}
      <div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem', background: 'rgba(250,204,21,0.04)', border: '1px solid rgba(250,204,21,0.1)', borderRadius: '8px', padding: '0.6rem 0.8rem' }}>
          <strong style={{ color: '#fde68a' }}>📈 Probability Space</strong> – X‑axis is the linear combination <code>z = w·x + b</code>, Y‑axis is the resulting probability σ(z). The yellow line at 0.5 marks the decision threshold.
        </div>
        <ProbChart />
      </div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setRunning(r => !r)} disabled={epoch >= MAX_EPOCH}
          style={{ background: running ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)', color: running ? '#f87171' : '#818cf8', border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : 'rgba(99,102,241,0.3)'}`, borderRadius: '8px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700, cursor: epoch >= MAX_EPOCH ? 'not-allowed' : 'pointer', opacity: epoch >= MAX_EPOCH ? 0.5 : 1 }}>
          {running ? '⏸ Pause' : epoch >= MAX_EPOCH ? '✓ Converged' : '▶ Run Gradient Descent'}
        </button>
        <button onClick={reset} style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>↺ Reset</button>
        <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#64748b' }}>
          Epoch: <strong style={{ color: '#a5b4fc' }}>{epoch}</strong> / {MAX_EPOCH} | w={w.toFixed(3)} | b={b.toFixed(3)} | Boundary x≈{boundaryX.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ── Exported component ───────────────────────────────────────────────────────────────
export default function InteractiveLogisticRegression() {
  return (
    <div style={{ background: 'linear-gradient(160deg, rgba(15,23,42,0.98), rgba(9,14,30,0.98))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.5rem' }}>
      <h3 style={{ color: '#e2e8f0', marginBottom: '0.8rem' }}>Logistic Regression – Interactive Demo</h3>
      <GradientDescentViz />
    </div>
  );
}
