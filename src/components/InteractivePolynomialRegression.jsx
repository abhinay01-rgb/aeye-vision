import React, { useState, useEffect, useMemo } from 'react';
import { Target, RefreshCw, Calculator } from 'lucide-react';

export default function InteractivePolynomialRegression() {
  const [points, setPoints] = useState([]);
  // Polynomial: y = w2 * x^2 + w1 * x + w0
  const [w2, setW2] = useState(0);
  const [w1, setW1] = useState(1);
  const [w0, setW0] = useState(0);

  // Constants for drawing
  const width = 400;
  const height = 250;
  const padding = 30;

  // Generate random data points that roughly follow a parabola
  const generateData = () => {
    const newPoints = [];
    // Random true parameters
    // We map x from 0 to 10 for easier polynomial coefficients mathematically,
    // then scale back to 0-100 for display
    const trueW2 = (Math.random() - 0.5) * 1.5; // -0.75 to 0.75
    const trueW1 = (Math.random() - 0.5) * 10;  // -5 to 5
    const trueW0 = Math.random() * 40 + 10;     // 10 to 50
    
    for (let i = 0; i < 20; i++) {
      const xDisplay = Math.random() * 100;
      const x = xDisplay / 10; // scale down for stable polynomial math
      
      // Add noise
      const noise = (Math.random() - 0.5) * 20; 
      const yDisplay = (trueW2 * x * x) + (trueW1 * x) + trueW0 + noise;
      newPoints.push({ x: xDisplay, y: Math.max(0, Math.min(100, yDisplay)) }); 
    }
    setPoints(newPoints);
    
    // Start slightly off
    setW2(trueW2 + (Math.random() - 0.5) * 0.5);
    setW1(trueW1 + (Math.random() - 0.5) * 2);
    setW0(trueW0 + (Math.random() - 0.5) * 10);
  };

  useEffect(() => {
    generateData();
  }, []);

  // Calculate Optimal line using Ordinary Least Squares for Polynomial Degree 2
  const calculateOptimal = () => {
    if (points.length === 0) return;
    
    // Create design matrix X and target vector Y
    // For stability, work with x scaled down by 10
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0;
    const n = points.length;

    points.forEach(p => {
      const x = p.x / 10;
      const y = p.y;
      const x2 = x * x;
      
      sumX += x;
      sumX2 += x2;
      sumX3 += x2 * x;
      sumX4 += x2 * x2;
      
      sumY += y;
      sumXY += x * y;
      sumX2Y += x2 * y;
    });

    // Matrix A
    const A = [
      [n, sumX, sumX2],
      [sumX, sumX2, sumX3],
      [sumX2, sumX3, sumX4]
    ];
    // Vector B
    const B = [sumY, sumXY, sumX2Y];

    // Cramer's rule for 3x3
    const det = (m) => 
      m[0][0]*(m[1][1]*m[2][2] - m[1][2]*m[2][1]) -
      m[0][1]*(m[1][0]*m[2][2] - m[1][2]*m[2][0]) +
      m[0][2]*(m[1][0]*m[2][1] - m[1][1]*m[2][0]);

    const d = det(A);
    if (Math.abs(d) > 1e-10) {
      const replaceCol = (m, col, vec) => m.map((row, i) => {
        const newRow = [...row];
        newRow[col] = vec[i];
        return newRow;
      });

      const d0 = det(replaceCol(A, 0, B));
      const d1 = det(replaceCol(A, 1, B));
      const d2 = det(replaceCol(A, 2, B));

      setW0(d0 / d);
      setW1(d1 / d);
      setW2(d2 / d);
    }
  };

  const predictY = (xDisplay) => {
    const x = xDisplay / 10;
    return w2 * x * x + w1 * x + w0;
  };

  // Compute metrics based on current curve
  const metrics = useMemo(() => {
    if (points.length === 0) return { mse: 0, rmse: 0, mae: 0, r2: 0 };
    
    let sse = 0;
    let sae = 0;
    let sumY = 0;

    points.forEach(p => {
      sumY += p.y;
      const predictedY = predictY(p.x);
      const error = p.y - predictedY;
      sse += error * error;
      sae += Math.abs(error);
    });

    const meanY = sumY / points.length;
    let sst = 0;
    points.forEach(p => {
      sst += Math.pow(p.y - meanY, 2);
    });

    const mse = sse / points.length;
    const rmse = Math.sqrt(mse);
    const mae = sae / points.length;
    const r2 = sst === 0 ? 0 : 1 - (sse / sst);

    return { mse, rmse, mae, r2 };
  }, [points, w2, w1, w0]);

  // Coordinate scales
  const scaleX = (x) => padding + (x / 100) * (width - 2 * padding);
  const scaleY = (y) => height - padding - (y / 100) * (height - 2 * padding);

  // Generate path data for the polynomial curve
  const curvePath = useMemo(() => {
    let d = "";
    for (let xDisplay = 0; xDisplay <= 100; xDisplay += 2) {
      const yDisplay = predictY(xDisplay);
      const px = scaleX(xDisplay);
      const py = scaleY(yDisplay);
      if (xDisplay === 0) {
        d += `M ${px} ${py} `;
      } else {
        d += `L ${px} ${py} `;
      }
    }
    return d;
  }, [w2, w1, w0]);

  return (
    <div style={{
      background: 'transparent',
      padding: '0.5rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      fontFamily: 'Outfit, sans-serif',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* Top section: SVG Plot */}
      <div style={{ position: 'relative', width: '100%', height: `${height}px`, background: '#05010b', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />

          {/* Error lines (dashed) */}
          {points.map((p, i) => {
            const predY = predictY(p.x);
            return (
              <line 
                key={`err-${i}`}
                x1={scaleX(p.x)} 
                y1={scaleY(p.y)} 
                x2={scaleX(p.x)} 
                y2={scaleY(predY)} 
                stroke="#f43f5e" 
                strokeWidth="1" 
                strokeDasharray="4,4"
                opacity="0.6"
              />
            );
          })}

          {/* Regression Curve */}
          <path 
            d={curvePath}
            fill="none"
            stroke="#6366f1" 
            strokeWidth="3" 
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle 
              key={`pt-${i}`}
              cx={scaleX(p.x)} 
              cy={scaleY(p.y)} 
              r="4" 
              fill="#38bdf8" 
              stroke="#0f172a"
              strokeWidth="1"
            />
          ))}
          
        </svg>
      </div>

      {/* Controls & Metrics Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        
        {/* Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Quadratic (w₂)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{w2.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="-2" max="2" step="0.05" 
              value={w2} 
              onChange={(e) => setW2(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Linear (w₁)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{w1.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="-10" max="10" step="0.1" 
              value={w1} 
              onChange={(e) => setW1(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Intercept (w₀)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{w0.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="-50" max="150" step="1" 
              value={w0} 
              onChange={(e) => setW0(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#a5b4fc', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            y = {w2.toFixed(2)}x² {w1 >= 0 ? '+' : '-'} {Math.abs(w1).toFixed(2)}x {w0 >= 0 ? '+' : '-'} {Math.abs(w0).toFixed(2)}
          </div>
        </div>

        {/* Live Metrics */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem' }}>
          <h4 style={{ fontSize: '0.8rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 1rem 0' }}>
            <Calculator size={14} /> Live Error Metrics
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>MSE</div>
              <div style={{ fontSize: '1.1rem', color: '#f43f5e', fontWeight: 700 }}>{metrics.mse.toFixed(1)}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>RMSE</div>
              <div style={{ fontSize: '1.1rem', color: '#f43f5e', fontWeight: 700 }}>{metrics.rmse.toFixed(1)}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>MAE</div>
              <div style={{ fontSize: '1.1rem', color: '#fba918', fontWeight: 700 }}>{metrics.mae.toFixed(1)}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>R² Score</div>
              <div style={{ fontSize: '1.1rem', color: metrics.r2 > 0.7 ? '#4ade80' : '#e2e8f0', fontWeight: 700 }}>{metrics.r2.toFixed(3)}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button 
          onClick={calculateOptimal}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            padding: '0.75rem',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s'
          }}
        >
          <Target size={16} /> Optimal Fit
        </button>
        <button 
          onClick={generateData}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.75rem',
            borderRadius: '8px',
            color: '#e2e8f0',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={16} /> New Data
        </button>
      </div>

    </div>
  );
}
