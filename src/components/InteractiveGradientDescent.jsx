import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Shuffle, TrendingDown, Zap } from 'lucide-react';

// ─── Cost functions & their derivatives ───────────────────────────────────────
const FUNCTIONS = {
  convex: {
    label: 'J(w) = w²  (Convex)',
    fn: (w) => w * w,
    dfn: (w) => 2 * w,
    xRange: [-6, 6],
    yRange: [0, 36],
    minW: 0,
    desc: 'Simple convex — always converges to global minimum at w = 0',
  },
  nonconvex: {
    label: 'J(w) = w⁴ − 4w² + w  (Non-Convex)',
    fn: (w) => w ** 4 - 4 * w * w + w,
    dfn: (w) => 4 * w ** 3 - 8 * w + 1,
    xRange: [-2.8, 2.8],
    yRange: [-6, 12],
    minW: null, // multiple minima
    desc: 'Non-convex — gradient descent may get trapped in a local minimum!',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function InteractiveGradientDescent() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [funcKey, setFuncKey] = useState('convex');
  const [learningRate, setLearningRate] = useState(0.1);
  const [wStart, setWStart] = useState(5);
  const [history, setHistory] = useState([]); // [{w, cost, grad}]
  const [isRunning, setIsRunning] = useState(false);
  const [converged, setConverged] = useState(false);

  const timerRef = useRef(null);
  const maxIter = 80;

  const costFn = FUNCTIONS[funcKey];

  // ── Initialise / reset ─────────────────────────────────────────────────────
  const reset = useCallback(
    (startW) => {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setConverged(false);
      const w0 = startW ?? wStart;
      setHistory([
        {
          iter: 0,
          w: w0,
          cost: costFn.fn(w0),
          grad: costFn.dfn(w0),
        },
      ]);
    },
    [costFn, wStart]
  );

  useEffect(() => {
    reset();
  }, [funcKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Single gradient step ───────────────────────────────────────────────────
  const step = useCallback(() => {
    setHistory((prev) => {
      if (prev.length >= maxIter) return prev;
      const last = prev[prev.length - 1];
      const grad = costFn.dfn(last.w);
      let newW = last.w - learningRate * grad;

      // Clamp to domain so the ball doesn't fly off
      newW = clamp(newW, costFn.xRange[0], costFn.xRange[1]);

      const newCost = costFn.fn(newW);
      const newGrad = costFn.dfn(newW);

      // Check convergence
      if (Math.abs(newGrad) < 0.005 || Math.abs(newW - last.w) < 1e-6) {
        setConverged(true);
        setIsRunning(false);
        clearInterval(timerRef.current);
      }

      return [
        ...prev,
        { iter: prev.length, w: newW, cost: newCost, grad: newGrad },
      ];
    });
  }, [costFn, learningRate]);

  // ── Play / pause loop ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(step, 350);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, step]);

  // ── Randomise start ────────────────────────────────────────────────────────
  const randomiseStart = () => {
    const [lo, hi] = costFn.xRange;
    const rw = lerp(lo + 0.5, hi - 0.5, Math.random());
    setWStart(parseFloat(rw.toFixed(2)));
    reset(rw);
  };

  // ── SVG coordinate mapping ────────────────────────────────────────────────
  const W = 540;
  const H = 300;
  const PAD = { l: 50, r: 20, t: 30, b: 40 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const toSvgX = (w) => {
    const [lo, hi] = costFn.xRange;
    return PAD.l + ((w - lo) / (hi - lo)) * plotW;
  };
  const toSvgY = (j) => {
    const [lo, hi] = costFn.yRange;
    return PAD.t + plotH - ((j - lo) / (hi - lo)) * plotH;
  };

  // ── Build curve path ──────────────────────────────────────────────────────
  const curvePts = [];
  const numPts = 200;
  for (let i = 0; i <= numPts; i++) {
    const w = lerp(costFn.xRange[0], costFn.xRange[1], i / numPts);
    const j = costFn.fn(w);
    curvePts.push({ sx: toSvgX(w), sy: toSvgY(j) });
  }
  const curvePath = curvePts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.sx.toFixed(1)},${p.sy.toFixed(1)}`)
    .join(' ');

  // Current position
  const curr = history[history.length - 1] || { w: wStart, cost: costFn.fn(wStart), grad: costFn.dfn(wStart) };
  const ballX = toSvgX(curr.w);
  const ballY = toSvgY(curr.cost);

  // ── Tangent line at current point ─────────────────────────────────────────
  const tangentLen = 1.2;
  const tangX1 = curr.w - tangentLen;
  const tangX2 = curr.w + tangentLen;
  const tangY1 = curr.cost + curr.grad * (tangX1 - curr.w);
  const tangY2 = curr.cost + curr.grad * (tangX2 - curr.w);

  // ── Gradient arrow (direction the gradient pushes) ────────────────────────
  const arrowLen = clamp(Math.abs(curr.grad) * 0.3, 0.15, 1.5);
  const arrowDir = curr.grad > 0 ? -1 : 1;
  const arrowEndW = curr.w + arrowDir * arrowLen;

  // ── Axis ticks ────────────────────────────────────────────────────────────
  const xTicks = [];
  for (let w = Math.ceil(costFn.xRange[0]); w <= Math.floor(costFn.xRange[1]); w += (funcKey === 'convex' ? 2 : 1)) {
    xTicks.push(w);
  }
  const yTicks = [];
  const yStep = funcKey === 'convex' ? 6 : 3;
  for (let j = Math.ceil(costFn.yRange[0] / yStep) * yStep; j <= costFn.yRange[1]; j += yStep) {
    yTicks.push(j);
  }

  // ── Inline styles ─────────────────────────────────────────────────────────
  const cardStyle = {
    background: 'rgba(255,255,255,0.015)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  };
  const controlRow = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
  };
  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '0.45rem 0.85rem',
    borderRadius: '8px',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.2s',
    fontFamily: "'Outfit', sans-serif",
  };
  const primaryBtn = {
    ...btnBase,
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 3px 10px rgba(99,102,241,0.25)',
  };
  const ghostBtn = {
    ...btnBase,
    background: 'rgba(255,255,255,0.03)',
    color: '#94a3b8',
  };
  const chipStyle = {
    fontSize: '0.72rem',
    padding: '0.3rem 0.65rem',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.2s',
    fontFamily: "'Outfit', sans-serif",
  };

  return (
    <div style={cardStyle}>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'rgba(99,102,241,0.15)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <TrendingDown size={16} style={{ color: '#818cf8' }} />
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 700 }}>
            Interactive Gradient Descent Visualizer
          </span>
        </div>
        {converged && (
          <span style={{
            background: 'rgba(74,222,128,0.1)',
            color: '#4ade80',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(74,222,128,0.2)',
            animation: 'pulse 1.5s infinite',
          }}>
            ✓ Converged!
          </span>
        )}
      </div>

      {/* ── Function Selector ─────────────────────────────────────────── */}
      <div style={controlRow}>
        <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>Cost Function:</span>
        {Object.entries(FUNCTIONS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => { setFuncKey(key); }}
            style={{
              ...chipStyle,
              background: funcKey === key ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
              color: funcKey === key ? '#a5b4fc' : '#64748b',
              borderColor: funcKey === key ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
        {costFn.desc}
      </p>

      {/* ── SVG Canvas ────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', background: '#060a18', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Grid lines */}
          {xTicks.map((w) => (
            <line key={`xg${w}`} x1={toSvgX(w)} y1={PAD.t} x2={toSvgX(w)} y2={H - PAD.b} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          ))}
          {yTicks.map((j) => (
            <line key={`yg${j}`} x1={PAD.l} y1={toSvgY(j)} x2={W - PAD.r} y2={toSvgY(j)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          ))}

          {/* Axes */}
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#334155" strokeWidth="1" />
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#334155" strokeWidth="1" />

          {/* Axis labels */}
          {xTicks.map((w) => (
            <text key={`xt${w}`} x={toSvgX(w)} y={H - PAD.b + 16} fill="#64748b" fontSize="8" textAnchor="middle">{w}</text>
          ))}
          {yTicks.map((j) => (
            <text key={`yt${j}`} x={PAD.l - 8} y={toSvgY(j) + 3} fill="#64748b" fontSize="8" textAnchor="end">{j}</text>
          ))}
          <text x={W / 2} y={H - 4} fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="600">w (parameter)</text>
          <text x={12} y={H / 2} fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="600" transform={`rotate(-90, 12, ${H / 2})`}>J(w) cost</text>

          {/* Cost curve */}
          <path d={curvePath} fill="none" stroke="url(#curveGrad)" strokeWidth="2.5" strokeLinejoin="round" />
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <radialGradient id="ballGlow">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* History trail */}
          {history.length > 1 && history.map((h, i) => {
            if (i === 0) return null;
            const prev = history[i - 1];
            return (
              <line
                key={`trail${i}`}
                x1={toSvgX(prev.w)}
                y1={toSvgY(prev.cost)}
                x2={toSvgX(h.w)}
                y2={toSvgY(h.cost)}
                stroke="rgba(251,191,36,0.35)"
                strokeWidth="1.5"
                strokeDasharray="3,2"
              />
            );
          })}

          {/* History dots */}
          {history.map((h, i) => {
            if (i === history.length - 1) return null;
            const opacity = 0.25 + 0.5 * (i / history.length);
            return (
              <circle
                key={`dot${i}`}
                cx={toSvgX(h.w)}
                cy={toSvgY(h.cost)}
                r={2}
                fill="#fbbf24"
                opacity={opacity}
              />
            );
          })}

          {/* Tangent line */}
          {history.length > 0 && (
            <line
              x1={toSvgX(tangX1)}
              y1={toSvgY(tangY1)}
              x2={toSvgX(tangX2)}
              y2={toSvgY(tangY2)}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              opacity="0.7"
            />
          )}

          {/* Gradient arrow (horizontal) */}
          {history.length > 0 && Math.abs(curr.grad) > 0.05 && (
            <g>
              <line
                x1={ballX}
                y1={ballY - 18}
                x2={toSvgX(arrowEndW)}
                y2={ballY - 18}
                stroke="#4ade80"
                strokeWidth="2"
                markerEnd="url(#arrowHead)"
              />
              <defs>
                <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 Z" fill="#4ade80" />
                </marker>
              </defs>
              <text
                x={(ballX + toSvgX(arrowEndW)) / 2}
                y={ballY - 24}
                fill="#4ade80"
                fontSize="7"
                textAnchor="middle"
                fontWeight="600"
              >
                step = −α·∇J
              </text>
            </g>
          )}

          {/* Current ball (glow + solid) */}
          <circle cx={ballX} cy={ballY} r="14" fill="url(#ballGlow)" />
          <circle cx={ballX} cy={ballY} r="6" fill="#fbbf24" filter="url(#glow)" />
          <circle cx={ballX} cy={ballY} r="4" fill="#fff" opacity="0.9" />

          {/* Label */}
          <text x={ballX} y={ballY + 20} fill="#fbbf24" fontSize="8" textAnchor="middle" fontWeight="700">
            w = {curr.w.toFixed(3)}
          </text>
        </svg>
      </div>

      {/* ── Controls Row ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            if (converged || history.length >= maxIter) { reset(); return; }
            setIsRunning(!isRunning);
          }}
          style={primaryBtn}
        >
          {converged ? <><RotateCcw size={13} /> Reset</> : isRunning ? <><Pause size={13} /> Pause</> : <><Play size={13} /> {history.length <= 1 ? 'Start Descent' : 'Resume'}</>}
        </button>

        <button
          onClick={step}
          disabled={isRunning || converged}
          style={{ ...ghostBtn, opacity: isRunning || converged ? 0.4 : 1 }}
        >
          <SkipForward size={13} /> Step
        </button>

        <button onClick={() => reset()} style={ghostBtn}>
          <RotateCcw size={13} /> Reset
        </button>

        <button onClick={randomiseStart} style={ghostBtn}>
          <Shuffle size={13} /> Random Start
        </button>
      </div>

      {/* ── Learning rate slider ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Learning Rate (α):
        </span>
        <input
          type="range"
          min="0.001"
          max="0.5"
          step="0.001"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          style={{ flex: 1, minWidth: 120, accentColor: '#6366f1' }}
        />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.82rem',
          color: '#a5b4fc',
          fontWeight: 700,
          background: 'rgba(99,102,241,0.1)',
          padding: '3px 10px',
          borderRadius: '6px',
          minWidth: '55px',
          textAlign: 'center',
        }}>
          {learningRate.toFixed(3)}
        </span>
      </div>

      {/* ── Start W slider ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Start Position (w₀):
        </span>
        <input
          type="range"
          min={costFn.xRange[0] + 0.2}
          max={costFn.xRange[1] - 0.2}
          step="0.1"
          value={wStart}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setWStart(v);
            reset(v);
          }}
          style={{ flex: 1, minWidth: 120, accentColor: '#fbbf24' }}
        />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.82rem',
          color: '#fbbf24',
          fontWeight: 700,
          background: 'rgba(251,191,36,0.08)',
          padding: '3px 10px',
          borderRadius: '6px',
          minWidth: '55px',
          textAlign: 'center',
        }}>
          {wStart.toFixed(1)}
        </span>
      </div>

      {/* ── Real-time stats row ───────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '0.5rem',
      }}>
        {[
          { label: 'Iteration', value: curr.iter, color: '#94a3b8' },
          { label: 'w', value: curr.w.toFixed(4), color: '#fbbf24' },
          { label: 'J(w)', value: curr.cost.toFixed(4), color: '#818cf8' },
          { label: '∇J (gradient)', value: curr.grad.toFixed(4), color: curr.grad > 0 ? '#f43f5e' : '#4ade80' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '8px',
            padding: '0.55rem 0.7rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Iteration log table ───────────────────────────────────────── */}
      {history.length > 1 && (
        <div style={{ maxHeight: 200, overflowY: 'auto', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ background: 'rgba(99,102,241,0.08)', position: 'sticky', top: 0 }}>
                <th style={{ padding: '0.45rem 0.6rem', color: '#818cf8', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Iter</th>
                <th style={{ padding: '0.45rem 0.6rem', color: '#fbbf24', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>w</th>
                <th style={{ padding: '0.45rem 0.6rem', color: '#a5b4fc', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>J(w)</th>
                <th style={{ padding: '0.45rem 0.6rem', color: '#4ade80', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>∇J</th>
                <th style={{ padding: '0.45rem 0.6rem', color: '#f43f5e', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Step (α·∇J)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    background: i === history.length - 1 ? 'rgba(251,191,36,0.04)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', color: '#94a3b8' }}>{h.iter}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', color: '#e2e8f0' }}>{h.w.toFixed(4)}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', color: '#cbd5e1' }}>{h.cost.toFixed(4)}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', color: h.grad > 0 ? '#f43f5e' : '#4ade80' }}>{h.grad.toFixed(4)}</td>
                  <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', color: '#94a3b8' }}>{(learningRate * h.grad).toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Key insight box ───────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(99,102,241,0.04)',
        border: '1px solid rgba(99,102,241,0.12)',
        borderRadius: '10px',
        padding: '0.85rem 1rem',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'flex-start',
      }}>
        <Zap size={14} style={{ color: '#818cf8', marginTop: 2, flexShrink: 0 }} />
        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          <strong style={{ color: '#a5b4fc' }}>How it works:</strong> At each step, we compute the
          derivative <strong style={{ color: '#f43f5e' }}>dJ/dw</strong> (the slope of the tangent line).
          Then we update: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#fbbf24' }}>
          w_new = w_old − α × dJ/dw</span>.
          The <span style={{ color: '#f43f5e' }}>red dashed tangent</span> shows the slope,
          the <span style={{ color: '#4ade80' }}>green arrow</span> shows the step direction,
          and the <span style={{ color: '#fbbf24' }}>yellow trail</span> shows the path taken.
          Try the <em>non-convex</em> function to see local minima traps!
        </div>
      </div>
    </div>
  );
}
