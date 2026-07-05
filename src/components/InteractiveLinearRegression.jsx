import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Target, RefreshCw, Calculator } from 'lucide-react';

export default function InteractiveLinearRegression() {
  const [points, setPoints] = useState([]);
  const svgRef = useRef(null);
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);

  // Constants for drawing
  const width = 400;
  const height = 250;
  const padding = 30;

  // Generate random data points that roughly follow a line
  const generateData = () => {
    const newPoints = [];
    // Random true parameters
    const trueM = Math.random() * 2 - 1; // -1 to 1
    const trueB = Math.random() * 40 + 10; // 10 to 50
    
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 100;
      // Add noise
      const noise = (Math.random() - 0.5) * 30; 
      const y = trueM * x + trueB + noise;
      newPoints.push({ x, y: Math.max(0, Math.min(100, y)) }); // clamp to 0-100 for display
    }
    setPoints(newPoints);
    
    // Start with a slightly "off" line so user has to adjust it
    setSlope(trueM + (Math.random() - 0.5) * 0.5);
    setIntercept(trueB + (Math.random() - 0.5) * 20);
  };

  useEffect(() => {
    generateData();
  }, []);

  // Calculate Optimal line using Ordinary Least Squares
  const calculateOptimal = () => {
    if (points.length === 0) return;
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    points.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
    });

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    setSlope(m);
    setIntercept(b);
  };

  // Compute metrics based on current line
  const metrics = useMemo(() => {
    if (points.length === 0) return { mse: 0, rmse: 0, mae: 0, r2: 0 };
    
    let sse = 0; // Sum of Squared Errors
    let sae = 0; // Sum of Absolute Errors
    let sumY = 0;

    points.forEach(p => {
      sumY += p.y;
      const predictedY = slope * p.x + intercept;
      const error = p.y - predictedY;
      sse += error * error;
      sae += Math.abs(error);
    });

    const meanY = sumY / points.length;
    let sst = 0; // Total Sum of Squares
    points.forEach(p => {
      sst += Math.pow(p.y - meanY, 2);
    });

    const mse = sse / points.length;
    const rmse = Math.sqrt(mse);
    const mae = sae / points.length;
    const r2 = sst === 0 ? 0 : 1 - (sse / sst);

    return { mse, rmse, mae, r2 };
  }, [points, slope, intercept]);

  // Coordinate scales (mapping data 0-100 to SVG pixels)
  const scaleX = (x) => padding + (x / 100) * (width - 2 * padding);
  // Y is inverted in SVG (0 is top)
  const scaleY = (y) => height - padding - (y / 100) * (height - 2 * padding);

  // Handle clicking on the SVG to add a new data point
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
      setPoints((prev) => [
        ...prev,
        { x: Math.max(0, Math.min(100, dataX)), y: Math.max(0, Math.min(100, dataY)) },
      ]);
    }
  };

  const handleSvgClick = (e) => addPointFromCoords(e.clientX, e.clientY);

  const handleSvgTouch = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    e.preventDefault();
    addPointFromCoords(touch.clientX, touch.clientY);
  };

  // Line endpoints for SVG
  const x1 = 0;
  const y1 = slope * x1 + intercept;
  const x2 = 100;
  const y2 = slope * x2 + intercept;

  return (
    <div className="interactive-regression">
      
      {/* Top section: SVG Plot */}
      <div className="interactive-regression-plot-wrap">
        <p className="interactive-regression-hint">Tap or click the plot to add a data point</p>
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
          
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />

          {/* Error lines (dashed) */}
          {points.map((p, i) => {
            const predY = slope * p.x + intercept;
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

          {/* Regression Line */}
          <line 
            x1={scaleX(x1)} 
            y1={scaleY(y1)} 
            x2={scaleX(x2)} 
            y2={scaleY(y2)} 
            stroke="#6366f1" 
            strokeWidth="3" 
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
      <div className="interactive-regression-grid">
        
        {/* Sliders */}
        <div className="interactive-regression-controls">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Slope (m)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{slope.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="-3" max="3" step="0.05" 
              value={slope} 
              onChange={(e) => setSlope(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Intercept (b)</label>
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, background: 'rgba(99,102,241,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{intercept.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="-50" max="150" step="1" 
              value={intercept} 
              onChange={(e) => setIntercept(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem', color: '#a5b4fc', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            y = {slope.toFixed(2)}x {intercept >= 0 ? '+' : '-'} {Math.abs(intercept).toFixed(2)}
          </div>
        </div>

        {/* Live Metrics */}
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

      {/* Action Buttons */}
      <div className="interactive-regression-actions">
        <button 
          onClick={calculateOptimal}
          className="interactive-regression-btn interactive-regression-btn-primary"
        >
          <Target size={16} /> Optimal Fit
        </button>
        <button 
          onClick={generateData}
          className="interactive-regression-btn interactive-regression-btn-secondary"
        >
          <RefreshCw size={16} /> New Data
        </button>
      </div>

    </div>
  );
}
