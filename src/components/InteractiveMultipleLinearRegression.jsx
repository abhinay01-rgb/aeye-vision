import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Target, RefreshCw, Calculator } from 'lucide-react';

export default function InteractiveMultipleLinearRegression() {
  const [points, setPoints] = useState([]);
  const svgRef = useRef(null);
  const [b0, setB0] = useState(20);
  const [b1, setB1] = useState(0.5);
  const [b2, setB2] = useState(0.3);
  const [axis, setAxis] = useState('x1');

  const width = 400;
  const height = 250;
  const padding = 30;

  const generateData = () => {
    const trueB0 = Math.random() * 50 + 5;
    const trueB1 = Math.random() * 0.8 + 0.2;
    const trueB2 = Math.random() * 0.8 + 0.2;
    const newPoints = [];

    for (let i = 0; i < 20; i++) {
      const x1 = Math.random() * 100;
      const x2 = Math.random() * 100;
      const noise = (Math.random() - 0.5) * 20;
      const y = trueB0 + trueB1 * x1 + trueB2 * x2 + noise;
      newPoints.push({ x1, x2, y: Math.max(0, Math.min(100, y)) });
    }

    setPoints(newPoints);
    setB0(trueB0 + (Math.random() - 0.5) * 10);
    setB1(trueB1 + (Math.random() - 0.5) * 0.2);
    setB2(trueB2 + (Math.random() - 0.5) * 0.2);
  };

  useEffect(() => {
    generateData();
  }, []);

  const predictY = (x1, x2) => b0 + b1 * x1 + b2 * x2;

  const calculateOptimal = () => {
    if (points.length === 0) return;

    let sumX1 = 0;
    let sumX2 = 0;
    let sumY = 0;
    let sumX1X1 = 0;
    let sumX2X2 = 0;
    let sumX1X2 = 0;
    let sumX1Y = 0;
    let sumX2Y = 0;
    const n = points.length;

    points.forEach(({ x1, x2, y }) => {
      sumX1 += x1;
      sumX2 += x2;
      sumY += y;
      sumX1X1 += x1 * x1;
      sumX2X2 += x2 * x2;
      sumX1X2 += x1 * x2;
      sumX1Y += x1 * y;
      sumX2Y += x2 * y;
    });

    const A = [
      [n, sumX1, sumX2],
      [sumX1, sumX1X1, sumX1X2],
      [sumX2, sumX1X2, sumX2X2],
    ];
    const B = [sumY, sumX1Y, sumX2Y];

    const det = (m) =>
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

    const replaceCol = (m, col, vec) => m.map((row, i) => {
      const next = [...row];
      next[col] = vec[i];
      return next;
    });

    const d = det(A);
    if (Math.abs(d) < 1e-9) return;
    const d0 = det(replaceCol(A, 0, B));
    const d1 = det(replaceCol(A, 1, B));
    const d2 = det(replaceCol(A, 2, B));

    setB0(d0 / d);
    setB1(d1 / d);
    setB2(d2 / d);
  };

  const metrics = useMemo(() => {
    if (points.length === 0) return { mse: 0, rmse: 0, mae: 0, r2: 0 };

    let sse = 0;
    let sae = 0;
    let sumY = 0;

    points.forEach(({ x1, x2, y }) => {
      const pred = predictY(x1, x2);
      const err = y - pred;
      sse += err * err;
      sae += Math.abs(err);
      sumY += y;
    });

    const meanY = sumY / points.length;
    let sst = 0;
    points.forEach(({ y }) => {
      sst += (y - meanY) ** 2;
    });

    const mse = sse / points.length;
    const rmse = Math.sqrt(mse);
    const mae = sae / points.length;
    const r2 = sst === 0 ? 0 : 1 - (sse / sst);

    return { mse, rmse, mae, r2 };
  }, [points, b0, b1, b2]);

  const scaleX = (x) => padding + (x / 100) * (width - 2 * padding);
  const scaleY = (y) => height - padding - (y / 100) * (height - 2 * padding);

  const addPointFromCoords = (clientX, clientY) => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    const dataX = ((svgP.x - padding) / (width - 2 * padding)) * 100;
    const dataY = ((height - padding - svgP.y) / (height - 2 * padding)) * 100;

    if (dataX >= -10 && dataX <= 110 && dataY >= -10 && dataY <= 110) {
      const newPoint = {
        x1: Math.max(0, Math.min(100, dataX)),
        x2: Math.max(0, Math.min(100, dataY)),
        y: Math.max(0, Math.min(100, 50 + b1 * dataX + b2 * dataY + (Math.random() - 0.5) * 15)),
      };
      setPoints((prev) => [...prev, newPoint]);
    }
  };

  const handleSvgClick = (e) => addPointFromCoords(e.clientX, e.clientY);
  const handleSvgTouch = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    e.preventDefault();
    addPointFromCoords(touch.clientX, touch.clientY);
  };

  const axisPoint = axis === 'x1' ? 0 : 1;
  const lineFromAxis = (axisValue) => {
    if (axis === 'x1') {
      const y = b0 + b1 * axisValue + b2 * 50;
      return [axisValue, 50, y];
    }
    const y = b0 + b1 * 50 + b2 * axisValue;
    return [50, axisValue, y];
  };

  const lineCoords = lineFromAxis(0);
  const lineCoords2 = lineFromAxis(100);

  return (
    <div className="interactive-regression">
      <div className="interactive-regression-plot-wrap">
        <p className="interactive-regression-hint">Tap or click the plot to add a data point (x₁ horizontal, x₂ vertical)</p>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          onClick={handleSvgClick}
          onTouchEnd={handleSvgTouch}
          className="interactive-regression-svg"
        >
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />

          {points.map((p, i) => {
            const predY = predictY(p.x1, p.x2);
            return (
              <line
                key={`err-${i}`}
                x1={scaleX(p.x1)}
                y1={scaleY(p.x2)}
                x2={scaleX(p.x1)}
                y2={scaleY(p.x2)}
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
            );
          })}

          <line
            x1={scaleX(lineCoords[0])}
            y1={scaleY(lineCoords[1])}
            x2={scaleX(lineCoords2[0])}
            y2={scaleY(lineCoords2[1])}
            stroke="#6366f1"
            strokeWidth="3"
          />

          {points.map((p, i) => (
            <circle
              key={`pt-${i}`}
              cx={scaleX(p.x1)}
              cy={scaleY(p.x2)}
              r="4"
              fill="#38bdf8"
              stroke="#0f172a"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="interactive-regression-grid">
        <div className="interactive-regression-controls">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Intercept (β₀)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{b0.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="0.5"
              value={b0}
              onChange={(e) => setB0(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Weight β₁ (x₁)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{b1.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.02"
              value={b1}
              onChange={(e) => setB1(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Weight β₂ (x₂)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{b2.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.02"
              value={b2}
              onChange={(e) => setB2(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#a5b4fc', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            y = {b0.toFixed(1)} + {b1.toFixed(2)} x₁ + {b2.toFixed(2)} x₂
          </div>
        </div>

        <div className="interactive-regression-metrics-panel">
          <h4 className="interactive-regression-metrics-title">
            <Calculator size={14} /> Live Error Metrics
          </h4>
          <div className="interactive-regression-metrics-grid">
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

      <div className="interactive-regression-actions">
        <button onClick={calculateOptimal} className="interactive-regression-btn interactive-regression-btn-primary">
          <Target size={16} /> Optimal Fit
        </button>
        <button onClick={generateData} className="interactive-regression-btn interactive-regression-btn-secondary">
          <RefreshCw size={16} /> New Data
        </button>
      </div>
    </div>
  );
}
