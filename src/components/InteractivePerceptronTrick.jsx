import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Target } from 'lucide-react';

export default function InteractivePerceptronTrick() {
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(100);
  const [weights, setWeights] = useState({ w1: 1, w2: 1, b: 0 }); // Start with arbitrary line
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [converged, setConverged] = useState(false);
  
  const timerRef = useRef(null);
  
  // Data points: [x1, x2, label (1 for P, -1 for N)]
  // We want to make them linearly separable
  const initialData = [
    { id: 1, x1: 2, x2: 3, label: 1 },
    { id: 2, x1: 3, x2: 2, label: 1 },
    { id: 3, x1: 4, x2: 4, label: 1 },
    { id: 4, x1: 3, x2: 5, label: 1 },
    { id: 5, x1: 1, x2: 1, label: -1 },
    { id: 6, x1: 2, x2: 0.5, label: -1 },
    { id: 7, x1: 0.5, x2: 2, label: -1 },
    { id: 8, x1: 1.5, x2: 1.5, label: -1 },
  ];

  const reset = useCallback((randomize = false) => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setConverged(false);
    
    let newW = { w1: 1, w2: -1, b: 0 };
    if (randomize) {
      newW = {
        w1: (Math.random() - 0.5) * 4,
        w2: (Math.random() - 0.5) * 4,
        b: (Math.random() - 0.5) * 4
      };
    }
    setWeights(newW);
    setHistory([{ epoch: 0, weights: { ...newW } }]);
  }, []);

  useEffect(() => {
    reset();
    return () => clearInterval(timerRef.current);
  }, [reset]);

  const runEpoch = useCallback(() => {
    setHistory(prev => {
      const currentEpoch = prev.length;
      if (currentEpoch > epochs) {
        setConverged(true);
        setIsRunning(false);
        clearInterval(timerRef.current);
        return prev;
      }

      let currentW = { ...prev[prev.length - 1].weights };
      let misclassifiedCount = 0;
      
      // Shuffle data for stochastic nature
      const shuffledData = [...initialData].sort(() => Math.random() - 0.5);

      for (let point of shuffledData) {
        const sum = currentW.w1 * point.x1 + currentW.w2 * point.x2 + currentW.b;
        
        // If misclassified
        if ((point.label === 1 && sum < 0) || (point.label === -1 && sum >= 0)) {
          misclassifiedCount++;
          // Update weights
          currentW.w1 = currentW.w1 + learningRate * point.label * point.x1;
          currentW.w2 = currentW.w2 + learningRate * point.label * point.x2;
          currentW.b = currentW.b + learningRate * point.label;
        }
      }

      if (misclassifiedCount === 0) {
        setConverged(true);
        setIsRunning(false);
        clearInterval(timerRef.current);
      }

      setWeights({ ...currentW });
      return [...prev, { epoch: currentEpoch, weights: { ...currentW } }];
    });
  }, [epochs, learningRate]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(runEpoch, 150);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, runEpoch]);

  const W = 540;
  const H = 300;
  const PAD = { l: 40, r: 20, t: 30, b: 40 };
  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;

  const toSvgX = (x) => PAD.l + (x / 6) * plotW;
  const toSvgY = (y) => PAD.t + plotH - (y / 6) * plotH;

  // Decision boundary: w1*x1 + w2*x2 + b = 0 => x2 = -(w1*x1 + b)/w2
  const getLinePoints = (w) => {
    if (Math.abs(w.w2) < 0.001) {
      // Vertical line
      const x = -w.b / w.w1;
      return { x1: toSvgX(x), y1: toSvgY(0), x2: toSvgX(x), y2: toSvgY(6) };
    }
    const x1_line = 0;
    const y1_line = -(w.w1 * x1_line + w.b) / w.w2;
    const x2_line = 6;
    const y2_line = -(w.w1 * x2_line + w.b) / w.w2;
    return {
      x1: toSvgX(x1_line),
      y1: toSvgY(y1_line),
      x2: toSvgX(x2_line),
      y2: toSvgY(y2_line)
    };
  };

  const linePts = getLinePoints(weights);
  
  // Calculate misclassified points currently
  let currentMisclassified = 0;
  initialData.forEach(point => {
    const sum = weights.w1 * point.x1 + weights.w2 * point.x2 + weights.b;
    if ((point.label === 1 && sum < 0) || (point.label === -1 && sum >= 0)) {
      currentMisclassified++;
    }
  });

  const cardStyle = {
    background: 'rgba(255,255,255,0.015)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
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
  const primaryBtn = { ...btnBase, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none', boxShadow: '0 3px 10px rgba(99,102,241,0.25)' };
  const ghostBtn = { ...btnBase, background: 'rgba(255,255,255,0.03)', color: '#94a3b8' };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'rgba(99,102,241,0.15)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Target size={16} style={{ color: '#818cf8' }} />
          </div>
          <span style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 700 }}>
            Interactive Perceptron Visualizer
          </span>
        </div>
        {converged && (
          <span style={{
            background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: '0.72rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.2)', animation: 'pulse 1.5s infinite',
          }}>
            ✓ Converged!
          </span>
        )}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.25rem'
      }}>
        <div>
          <strong style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>Case 1: Misclassified Blue Point</strong>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
            Suppose the blue point on the positive side has coordinates (5, 2). We represent it as (5, 2, 1) (adding bias term).<br/>
            We <strong>subtract</strong> the point coordinates from the line's coefficients (<code>2x + 3y + 5 = 0</code>):<br/>
            <code style={{ color: '#38bdf8' }}>[2, 3, 5] - [5, 2, 1] ➞ -3x + y + 4 = 0</code><br/>
            This changes the position of the line such that it now moves toward the negative region, correctly classifying the blue point.
          </p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
          <strong style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>Case 2: Misclassified Green Point</strong>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
            Now consider a green point at (-3, -2) that lies on the negative side. We again represent it as (-3, -2, 1).<br/>
            Here, we <strong>add</strong> the point coordinates to the line's coefficients to move the line toward the positive region:<br/>
            <code style={{ color: '#4ade80' }}>[2, 3, 5] + [-3, -2, 1] ➞ -x + y + 6 = 0</code><br/>
            After this transformation, the green point now lies correctly in the positive region.
          </p>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto', overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', background: '#060a18', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Axes */}
          <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke="#334155" strokeWidth="1" />
          <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke="#334155" strokeWidth="1" />

          {/* Decision Boundary */}
          <line 
            x1={linePts.x1} 
            y1={linePts.y1} 
            x2={linePts.x2} 
            y2={linePts.y2} 
            stroke="#6366f1" 
            strokeWidth="2.5" 
            strokeDasharray={isRunning ? "4" : ""}
          />
          
          {/* Data Points */}
          {initialData.map(pt => {
            const sum = weights.w1 * pt.x1 + weights.w2 * pt.x2 + weights.b;
            const isMisclassified = (pt.label === 1 && sum < 0) || (pt.label === -1 && sum >= 0);
            return (
              <g key={pt.id}>
                {isMisclassified && (
                  <circle cx={toSvgX(pt.x1)} cy={toSvgY(pt.x2)} r="8" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="2" />
                )}
                <circle 
                  cx={toSvgX(pt.x1)} 
                  cy={toSvgY(pt.x2)} 
                  r="5" 
                  fill={pt.label === 1 ? "#ec4899" : "#38bdf8"} 
                />
              </g>
            );
          })}
          
          {/* Shade regions */}
          {/* A simple trick to show regions: we can compute angle of normal vector */}
        </svg>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            if (converged || history.length >= epochs) { reset(); return; }
            setIsRunning(!isRunning);
          }}
          style={primaryBtn}
        >
          {converged ? <><RotateCcw size={13} /> Reset</> : isRunning ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Start Training</>}
        </button>

        <button onClick={() => reset(false)} style={ghostBtn}>
          <RotateCcw size={13} /> Reset
        </button>

        <button onClick={() => reset(true)} style={ghostBtn}>
          <Shuffle size={13} /> Randomize Weights
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Learning Rate (η):
        </span>
        <input
          type="range" min="0.01" max="0.5" step="0.01"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          style={{ flex: 1, minWidth: 120, accentColor: '#6366f1' }}
        />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 700, background: 'rgba(99,102,241,0.1)', padding: '3px 10px', borderRadius: '6px', minWidth: '55px', textAlign: 'center' }}>
          {learningRate.toFixed(2)}
        </span>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem',
      }}>
        {[
          { label: 'Epoch', value: history.length - 1, color: '#94a3b8' },
          { label: 'w1', value: weights.w1.toFixed(3), color: '#fbbf24' },
          { label: 'w2', value: weights.w2.toFixed(3), color: '#818cf8' },
          { label: 'Bias (b)', value: weights.b.toFixed(3), color: '#4ade80' },
          { label: 'Misclassified', value: currentMisclassified, color: currentMisclassified > 0 ? '#f43f5e' : '#4ade80' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.55rem 0.7rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
          </div>
        ))}
      </div>
      
      <div style={{
        background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start', flexDirection: 'column'
      }}>
        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          <strong style={{ color: '#a5b4fc' }}>Perceptron Trick:</strong> Points in red dashed circles are <span style={{color: '#f43f5e'}}>misclassified</span>. For each misclassified point <em>Xᵢ</em> with label <em>yᵢ ∈ {'{'}1, -1{'}'}</em>, the weights are updated using <code>w = w + η * yᵢ * Xᵢ</code>. Over repeated epochs, this pushes the decision boundary towards optimal separation until all points are correctly classified.
        </div>
        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6, marginTop: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', width: '100%' }}>
          <strong style={{ color: '#4ade80' }}>Pull & Push Effect (Fit Line Change):</strong>
          <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
            <li style={{ marginBottom: '0.25rem' }}><strong>Pull (+ve point in -ve region):</strong> The point "pulls" the line towards itself. The weights are updated by <em>adding</em> the point's coordinates (e.g., <code>W_new = [2,3,5] + [1,3,1] = [3,6,6]</code> ➞ <code>3x + 6y + 6 = 0</code>).</li>
            <li><strong>Push (-ve point in +ve region):</strong> The point "pushes" the line away from itself. The weights are updated by <em>subtracting</em> the point's coordinates (e.g., <code>W_new = [2,3,5] - [4,5,1] = [-2,-2,4]</code> ➞ <code>-2x - 2y + 4 = 0</code>).</li>
          </ul>
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'
      }}>
        <div>
          <strong style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Training Algorithm</strong>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6, marginTop: '0.5rem' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>Let’s now see how the perceptron updates its coefficients:</p>
            <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
              <li>Choose a number of epochs (say 1000).</li>
              <li>Set a learning rate η (usually 0.01).</li>
              <li>For each epoch, pick one training example (a student record).</li>
              <li>Check whether the point is correctly classified.</li>
            </ul>
            <ul style={{ margin: '0 0 0.5rem 1.25rem', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>If it lies in the negative region but the computed value is ≥ 0 (model says placed, but actually not placed), update:<br/>
                <code style={{ color: '#38bdf8' }}>W_new = W_old − η × X_i</code>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>If it lies in the positive region but the computed value is {'<'} 0 (model says not placed, but actually placed), update:<br/>
                <code style={{ color: '#ec4899' }}>W_new = W_old + η × X_i</code>
              </li>
              <li>If classification is correct, no change is made.</li>
            </ul>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
          <strong style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Simplified Update Rule</strong>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.5rem 0 0.5rem 0', lineHeight: 1.6 }}>
            The perceptron’s update step can also be written in a single general form:<br/>
            <code style={{ color: '#fbbf24' }}>W_new = W_old + η × (Y_i − Ŷ_i) × X_i</code><br/>
            <code style={{ color: '#fbbf24' }}>b_new = b_old + η × (Y_i − Ŷ_i)</code>
          </p>

          <table style={{ width: '100%', maxWidth: '300px', borderCollapse: 'collapse', fontSize: '0.78rem', margin: '0.75rem 0', fontFamily: "'JetBrains Mono', monospace" }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>Y_i</th>
                <th style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>Ŷ_i</th>
                <th style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>(Y_i − Ŷ_i)</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center', color: '#cbd5e1' }}>
              <tr><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>1</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>1</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>0</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>0</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>0</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>0</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>1</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>0</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>1</td></tr>
              <tr><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>0</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>1</td><td style={{ padding: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>-1</td></tr>
            </tbody>
          </table>

          <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6 }}>
            <li style={{ marginBottom: '0.25rem' }}>We apply this rule for every data point in each epoch.</li>
            <li style={{ marginBottom: '0.25rem' }}>If the model correctly classifies a point, the difference <code>(Y_i − Ŷ_i)</code> becomes zero, so no change occurs in the weights.</li>
            <li style={{ marginBottom: '0.25rem' }}>If the model misclassifies, the term <code>(Y_i − Ŷ_i)</code> becomes positive or negative. This automatically adjusts the weights in the correct direction—thus <strong>wrong points actively help correct the position of the fit line!</strong></li>
            <li>Over multiple iterations, this process finds the best line that correctly separates all points — achieving accurate classification through gradual, data-driven updates.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
