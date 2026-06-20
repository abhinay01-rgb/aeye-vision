import React, { useState, useMemo, useEffect } from 'react';
import { Check, Copy, AlertCircle, ChevronDown, ChevronRight, BookOpen, Target, Cpu, Scissors, Layers, Info } from 'lucide-react';

const RED_COLOR = '#ff7f0e';
const BLUE_COLOR = '#1f77b4';
const GREEN_COLOR = '#2ca02c';

// Fixed dataset for PCA vs LDA projection (2D)
const DATA_POINTS = [
  // Class 0 (Orange) - bottom left cluster
  { id: 1, x: 22, y: 24, label: 0, color: RED_COLOR },
  { id: 2, x: 28, y: 32, label: 0, color: RED_COLOR },
  { id: 3, x: 18, y: 38, label: 0, color: RED_COLOR },
  { id: 4, x: 34, y: 28, label: 0, color: RED_COLOR },
  { id: 5, x: 26, y: 44, label: 0, color: RED_COLOR },
  { id: 6, x: 15, y: 20, label: 0, color: RED_COLOR },
  { id: 7, x: 38, y: 36, label: 0, color: RED_COLOR },

  // Class 1 (Blue) - top middle cluster
  { id: 8, x: 48, y: 65, label: 1, color: BLUE_COLOR },
  { id: 9, x: 54, y: 72, label: 1, color: BLUE_COLOR },
  { id: 10, x: 42, y: 78, label: 1, color: BLUE_COLOR },
  { id: 11, x: 58, y: 60, label: 1, color: BLUE_COLOR },
  { id: 12, x: 50, y: 82, label: 1, color: BLUE_COLOR },
  { id: 13, x: 38, y: 68, label: 1, color: BLUE_COLOR },
  { id: 14, x: 62, y: 74, label: 1, color: BLUE_COLOR },

  // Class 2 (Green) - bottom right cluster
  { id: 15, x: 74, y: 38, label: 2, color: GREEN_COLOR },
  { id: 16, x: 80, y: 46, label: 2, color: GREEN_COLOR },
  { id: 17, x: 85, y: 32, label: 2, color: GREEN_COLOR },
  { id: 18, x: 68, y: 48, label: 2, color: GREEN_COLOR },
  { id: 19, x: 88, y: 42, label: 2, color: GREEN_COLOR },
  { id: 20, x: 72, y: 26, label: 2, color: GREEN_COLOR },
  { id: 21, x: 92, y: 35, label: 2, color: GREEN_COLOR }
];

export default function DimensionalityReduction() {
  const [activeTab, setActiveTab] = useState('curse');
  const [dimensions, setDimensions] = useState(2);
  const [rotationAngle, setRotationAngle] = useState(0); // For rotating 3D cube
  const [projectionType, setProjectionType] = useState('none'); // none, pca, lda
  const [copied, setCopied] = useState(false);

  // Rotate the 3D cube in background when 3D is active
  useEffect(() => {
    let animId;
    if (activeTab === 'curse' && dimensions === 3) {
      const tick = () => {
        setRotationAngle(prev => (prev + 0.5) % 360);
        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [activeTab, dimensions]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate stable random points for the Curse of Dimensionality demo
  const cursePoints = useMemo(() => {
    const pts = [];
    const count = 35;
    const seedRandom = (i) => {
      const x = Math.sin(i * 9274.238) * 10000;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      pts.push({
        x: seedRandom(i * 3 + 1) * 80 + 10,
        y: seedRandom(i * 3 + 2) * 80 + 10,
        z: seedRandom(i * 3 + 3) * 80 + 10,
      });
    }
    return pts;
  }, []);

  // Compute metrics for Curse of Dimensionality based on selected dimension
  const curseMetrics = useMemo(() => {
    // Calculate pairwise distances
    let totalDist = 0;
    let pairs = 0;
    const pts = cursePoints;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        let sqSum = 0;
        sqSum += Math.pow(pts[i].x - pts[j].x, 2);
        if (dimensions >= 2) sqSum += Math.pow(pts[i].y - pts[j].y, 2);
        if (dimensions === 3) sqSum += Math.pow(pts[i].z - pts[j].z, 2);
        totalDist += Math.sqrt(sqSum);
        pairs++;
      }
    }
    const avgDist = totalDist / pairs;

    // Estimate sparsity (arbitrary metric for visualization)
    const densityPct = dimensions === 1 ? 85 : dimensions === 2 ? 40 : 12;

    return {
      avgDistance: avgDist.toFixed(1),
      density: densityPct,
      emptySpace: 100 - densityPct
    };
  }, [dimensions, cursePoints]);

  // Project 3D coordinate to 2D screen coordinate for SVG rendering
  const project3D = (x, y, z, angleDegrees) => {
    const rad = (angleDegrees * Math.PI) / 180;
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);

    // Rotate around Y axis
    const rx = x * cosVal - z * sinVal;
    const rz = x * sinVal + z * cosVal;

    // Rotate around X axis slightly for perspective (pitch)
    const pitch = 0.5;
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);

    // Perspective projection onto 2D viewport
    const scale = 250 / (250 + rz * 0.5);
    const screenX = 200 + rx * scale * 1.5;
    const screenY = 200 - ry * scale * 1.5;

    return { x: screenX, y: screenY };
  };

  // Define projection lines for PCA and LDA
  // Mean of DATA_POINTS is roughly (49.5, 48.0)
  const meanX = 49.5;
  const meanY = 48.0;

  // PCA Unit vector (direction of maximum variance, slope ~0.75, angle ~37 deg)
  const pcaAngleRad = (37 * Math.PI) / 180;
  const pcaVector = { x: Math.cos(pcaAngleRad), y: Math.sin(pcaAngleRad) };

  // LDA Unit vector (separates orange/green from blue best, slope ~-1.2, angle ~-50 deg)
  const ldaAngleRad = (-50 * Math.PI) / 180;
  const ldaVector = { x: Math.cos(ldaAngleRad), y: Math.sin(ldaAngleRad) };

  // Project the 2D dataset points depending on the selection
  const projectedDataPoints = useMemo(() => {
    return DATA_POINTS.map(p => {
      if (projectionType === 'none') {
        return { ...p, renderX: p.x, renderY: p.y };
      }
      
      const targetVector = projectionType === 'pca' ? pcaVector : ldaVector;
      // Subtract mean, project, add mean back
      const dx = p.x - meanX;
      const dy = p.y - meanY;
      const dotProduct = dx * targetVector.x + dy * targetVector.y;
      
      return {
        ...p,
        renderX: meanX + dotProduct * targetVector.x,
        renderY: meanY + dotProduct * targetVector.y
      };
    });
  }, [projectionType]);

  const pcaLdaCode = `import numpy as np
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
from sklearn.preprocessing import StandardScaler

# 1. Scale data (highly recommended before PCA/LDA)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 2. PCA: Unsupervised Reduction (retains max variance)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
print("PCA Explained Variance:", pca.explained_variance_ratio_)

# 3. LDA: Supervised Reduction (retains max class separability)
lda = LDA(n_components=2)
# Needs target labels 'y' because it is supervised
X_lda = lda.fit_transform(X_scaled, y)
print("LDA Separability Ratio:", lda.explained_variance_ratio_)`;

  return (
    <div className="scaling-container fade-in">
      {/* Component Title */}
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="step-icon-badge" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
            <Scissors size={22} />
          </div>
          <div>
            <h1 className="section-title">Curse of Dimensionality & Dimensionality Reduction</h1>
            <p className="section-subtitle">Feature Extraction: compressing high-dimensional spaces using PCA & LDA</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-buttons">
        <button
          className={`tab-btn ${activeTab === 'curse' ? 'active' : ''}`}
          onClick={() => setActiveTab('curse')}
        >
          <AlertCircle size={14} style={{ marginRight: '6px' }} />
          Curse of Dimensionality
        </button>
        <button
          className={`tab-btn ${activeTab === 'visualizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualizer')}
        >
          <Cpu size={14} style={{ marginRight: '6px' }} />
          PCA vs LDA Visualizer
        </button>
        <button
          className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <BookOpen size={14} style={{ marginRight: '6px' }} />
          Python Implementation
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 1: CURSE OF DIMENSIONALITY
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'curse' && (
        <div className="tab-content fade-in">
          <div className="grid-2-cols" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            
            {/* Visualizer Box */}
            <div className="interactive-card">
              <div className="card-header-row">
                <h3 className="card-title">Sparsity Visualizer ({dimensions}D)</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Dimensions:</span>
                  <div className="btn-group">
                    {[1, 2, 3].map(d => (
                      <button
                        key={d}
                        onClick={() => setDimensions(d)}
                        className={`btn btn-sm ${dimensions === d ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}
                      >
                        {d}D
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Render Area */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                height: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.04)',
                overflow: 'hidden'
              }}>
                <svg width="400" height="300" viewBox="0 0 400 300">
                  {/* Grid Lines/Background for context */}
                  {dimensions >= 2 && (
                    <>
                      <line x1="50" y1="50" x2="350" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                      <line x1="50" y1="250" x2="350" y2="250" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                      <line x1="50" y1="50" x2="50" y2="250" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                      <line x1="350" y1="50" x2="350" y2="250" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    </>
                  )}

                  {/* 1D Dimension Line */}
                  {dimensions === 1 && (
                    <>
                      <line x1="50" y1="150" x2="350" y2="150" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                      <text x="50" y="175" fill="#64748b" fontSize="10" textAnchor="middle">0.0</text>
                      <text x="350" y="175" fill="#64748b" fontSize="10" textAnchor="middle">1.0</text>
                      {cursePoints.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={50 + (p.x / 100) * 300}
                          cy={150}
                          r="5"
                          fill="#a5b4fc"
                          opacity="0.85"
                          stroke="#6366f1"
                          strokeWidth="1"
                        />
                      ))}
                    </>
                  )}

                  {/* 2D Dimension Plane */}
                  {dimensions === 2 && (
                    <>
                      <rect x="50" y="50" width="300" height="200" fill="rgba(99,102,241,0.03)" stroke="#6366f1" strokeWidth="2" rx="8" />
                      {cursePoints.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={50 + (p.x / 100) * 300}
                          cy={50 + (p.y / 100) * 200}
                          r="5"
                          fill="#818cf8"
                          opacity="0.85"
                          stroke="#6366f1"
                          strokeWidth="1.5"
                        />
                      ))}
                    </>
                  )}

                  {/* 3D Dimension Volume */}
                  {dimensions === 3 && (() => {
                    const size = 60;
                    // Corners of a 3D cube centered at (0,0,0)
                    const corners = [
                      { x: -size, y: -size, z: -size },
                      { x: size, y: -size, z: -size },
                      { x: size, y: size, z: -size },
                      { x: -size, y: size, z: -size },
                      { x: -size, y: -size, z: size },
                      { x: size, y: -size, z: size },
                      { x: size, y: size, z: size },
                      { x: -size, y: size, z: size }
                    ];

                    const projCorners = corners.map(c => project3D(c.x, c.y, c.z, rotationAngle));
                    
                    // Cube Edges connecting the projected corners
                    const edges = [
                      [0, 1], [1, 2], [2, 3], [3, 0], // back face
                      [4, 5], [5, 6], [6, 7], [7, 4], // front face
                      [0, 4], [1, 5], [2, 6], [3, 7]  // side connectors
                    ];

                    // Project scattered points
                    const projPts = cursePoints.map(p => {
                      // Center coordinates around (0,0,0) from range [10, 90]
                      const cx = (p.x - 50) * 1.5;
                      const cy = (p.y - 50) * 1.5;
                      const cz = (p.z - 50) * 1.5;
                      return project3D(cx, cy, cz, rotationAngle);
                    });

                    return (
                      <>
                        {/* Draw Cube Edges */}
                        {edges.map((e, idx) => (
                          <line
                            key={idx}
                            x1={projCorners[e[0]].x}
                            y1={projCorners[e[0]].y}
                            x2={projCorners[e[1]].x}
                            y2={projCorners[e[1]].y}
                            stroke="rgba(99,102,241,0.3)"
                            strokeWidth="1.5"
                          />
                        ))}
                        
                        {/* Draw Cube Corners as small dots */}
                        {projCorners.map((c, idx) => (
                          <circle key={idx} cx={c.x} cy={c.y} r="3" fill="#6366f1" />
                        ))}

                        {/* Draw 3D Scattered Points */}
                        {projPts.map((p, idx) => (
                          <circle
                            key={idx}
                            cx={p.x}
                            cy={p.y}
                            r="4.5"
                            fill="#ec4899"
                            opacity="0.85"
                            stroke="#fff"
                            strokeWidth="0.5"
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {dimensions === 3 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.68rem',
                    color: '#64748b',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span className="pulse-indicator" style={{ background: '#ec4899' }}></span> Auto-rotating 3D space
                  </div>
                )}
              </div>
            </div>

            {/* Info / Metrics Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card-note alert-indigo" style={{ margin: 0 }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Info size={16} className="text-indigo" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>The Curse Visualized</h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      We scattered <strong>{cursePoints.length} data points</strong> in a standard unit space. Observe how adding dimensions spreads them out!
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics Card */}
              <div className="interactive-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.03em' }}>Space Metrics</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#94a3b8' }}>Average Pairwise Distance</span>
                      <strong style={{ color: '#fff' }}>{curseMetrics.avgDistance} units</strong>
                    </div>
                    <div className="bar-track" style={{ height: '6px' }}>
                      <div className="bar-fill" style={{ width: `${(Number(curseMetrics.avgDistance) / 100) * 100}%`, background: '#6366f1' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#94a3b8' }}>Data Sparsity (Empty space)</span>
                      <strong style={{ color: '#f59e0b' }}>{curseMetrics.emptySpace}%</strong>
                    </div>
                    <div className="bar-track" style={{ height: '6px' }}>
                      <div className="bar-fill" style={{ width: `${curseMetrics.emptySpace}%`, background: '#f59e0b' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.8rem' }}>
                      <span style={{ color: '#94a3b8' }}>Effective Data Density</span>
                      <strong style={{ color: '#10b981' }}>{curseMetrics.density}%</strong>
                    </div>
                    <div className="bar-track" style={{ height: '6px' }}>
                      <div className="bar-fill" style={{ width: `${curseMetrics.density}%`, background: '#10b981' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intuition Box */}
              <div className="interactive-card" style={{ padding: '1.25rem', borderLeft: '3px solid #8b5cf6' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  <strong>Why does this happen?</strong> As dimensions grow, the volume of the space increases exponentially, making the data points extremely sparse. Distances between points increase and merge together, making algorithms like <strong>KNN, K-Means, or SVM</strong> struggle because "nearest neighbors" are no longer close!
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 2: PCA VS LDA INTERACTIVE PROJECTIONS
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'visualizer' && (
        <div className="tab-content fade-in">
          <div className="grid-2-cols" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            
            {/* Projection Chart Card */}
            <div className="interactive-card">
              <div className="card-header-row">
                <h3 className="card-title">Interactive Dimension Projection</h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setProjectionType('none')}
                    className={`btn btn-sm ${projectionType === 'none' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px' }}
                  >
                    Original 2D
                  </button>
                  <button
                    onClick={() => setProjectionType('pca')}
                    className={`btn btn-sm ${projectionType === 'pca' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px' }}
                  >
                    PCA (1D Line)
                  </button>
                  <button
                    onClick={() => setProjectionType('lda')}
                    className={`btn btn-sm ${projectionType === 'lda' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '6px' }}
                  >
                    LDA (1D Line)
                  </button>
                </div>
              </div>

              {/* Chart Plot Area */}
              <div style={{
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.04)',
                position: 'relative'
              }}>
                <svg width="100%" height="340" viewBox="0 0 500 340">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="50" y2="290" stroke="rgba(255,255,255,0.06)" />
                  <line x1="50" y1="290" x2="480" y2="290" stroke="rgba(255,255,255,0.06)" />
                  
                  {/* Grid Labels */}
                  <text x="45" y="295" fill="#64748b" fontSize="9" textAnchor="end">0</text>
                  <text x="45" y="155" fill="#64748b" fontSize="9" textAnchor="end">50</text>
                  <text x="45" y="25" fill="#64748b" fontSize="9" textAnchor="end">100</text>
                  
                  <text x="50" y="305" fill="#64748b" fontSize="9" textAnchor="middle">0</text>
                  <text x="265" y="305" fill="#64748b" fontSize="9" textAnchor="middle">50</text>
                  <text x="480" y="305" fill="#64748b" fontSize="9" textAnchor="middle">100</text>

                  {/* Axis Titles */}
                  <text x="265" y="325" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">Feature 1</text>
                  <text x="18" y="155" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 18 155)">Feature 2</text>

                  {/* Projection Axis Lines */}
                  {projectionType === 'pca' && (() => {
                    // Draw PCA Line
                    // y - 48 = 0.75 * (x - 49.5) -> y = 0.75x + 10.87
                    // X=0 -> Y=10.87, X=100 -> Y=85.87
                    const x1 = 50 + (0 / 100) * 430;
                    const y1 = 290 - (10.87 / 100) * 270;
                    const x2 = 50 + (100 / 100) * 430;
                    const y2 = 290 - (85.87 / 100) * 270;
                    return (
                      <>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a5b4fc" strokeWidth="2.5" strokeDasharray="5,3" opacity="0.8" />
                        <text x={x2 - 10} y={y2 - 10} fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="end">PCA Axis (PC1)</text>
                      </>
                    );
                  })()}

                  {projectionType === 'lda' && (() => {
                    // Draw LDA Line
                    // y - 48 = -1.2 * (x - 49.5) -> y = -1.2x + 107.4
                    // X=15 -> Y=89.4, X=85 -> Y=5.4
                    const x1 = 50 + (15 / 100) * 430;
                    const y1 = 290 - (89.4 / 100) * 270;
                    const x2 = 50 + (85 / 100) * 430;
                    const y2 = 290 - (5.4 / 100) * 270;
                    return (
                      <>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f472b6" strokeWidth="2.5" strokeDasharray="5,3" opacity="0.8" />
                        <text x={x2 - 10} y={y2 + 15} fill="#f472b6" fontSize="10" fontWeight="bold" textAnchor="end">LDA Axis (LD1)</text>
                      </>
                    );
                  })()}

                  {/* Draw Data Points (Animates transitions automatically) */}
                  {projectedDataPoints.map(p => {
                    const svgX = 50 + (p.renderX / 100) * 430;
                    const svgY = 290 - (p.renderY / 100) * 270;
                    const origX = 50 + (p.x / 100) * 430;
                    const origY = 290 - (p.y / 100) * 270;

                    return (
                      <g key={p.id}>
                        {/* Projection connector guide lines */}
                        {projectionType !== 'none' && (
                          <line
                            x1={origX}
                            y1={origY}
                            x2={svgX}
                            y2={svgY}
                            stroke={p.color}
                            strokeWidth="1"
                            strokeDasharray="2,2"
                            opacity="0.3"
                          />
                        )}
                        <circle
                          cx={svgX}
                          cy={svgY}
                          r="6.5"
                          fill={p.color}
                          stroke="#fff"
                          strokeWidth="1.5"
                          style={{
                            transition: 'cx 0.8s cubic-bezier(0.16, 1, 0.3, 1), cy 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Map Legends */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  marginTop: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: RED_COLOR, borderRadius: '50%' }}></span> Class 0 (Orange)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: BLUE_COLOR, borderRadius: '50%' }}></span> Class 1 (Blue)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: GREEN_COLOR, borderRadius: '50%' }}></span> Class 2 (Green)
                  </div>
                </div>

              </div>
            </div>

            {/* Explanation card side */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {projectionType === 'none' && (
                <div className="interactive-card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#fff' }}>Original 2D Dataset</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    We have three classes distributed in a 2D feature space. 
                    They are fairly distinct but spread out in different directions. Let's see what happens when we project them down to 1D (a single line)!
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, marginTop: '1rem' }}>
                    <span>Select "PCA" or "LDA" above to compare.</span>
                  </div>
                </div>
              )}

              {projectionType === 'pca' && (
                <div className="interactive-card" style={{ padding: '1.25rem', borderLeft: '3px solid #818cf8' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#818cf8', fontWeight: 700 }}>PCA: Unsupervised Projection</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    PCA is <strong>unsupervised</strong>. It finds the axis that maximizes the overall spread (variance) of the points, ignoring class labels.
                  </p>
                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    ⚠️ <strong>Limitation:</strong> Because PCA does not know about classes, the projected points of Class 0 (Orange) and Class 2 (Green) overlap significantly on the lower-left end of the PC1 line, making them hard to classify.
                  </div>
                </div>
              )}

              {projectionType === 'lda' && (
                <div className="interactive-card" style={{ padding: '1.25rem', borderLeft: '3px solid #f472b6' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', color: '#f472b6', fontWeight: 700 }}>LDA: Supervised Projection</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>
                    LDA is <strong>supervised</strong>. It finds an axis that explicitly maximizes class separability by separating the class means while keeping clusters tight.
                  </p>
                  <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                    ✅ <strong>Benefit:</strong> The projected points in 1D remain perfectly sorted and grouped by their class color. Classification on this 1D space will achieve 100% accuracy!
                  </div>
                </div>
              )}

              {/* Summary Table Card */}
              <div className="table-wrapper">
                <table className="compare-table" style={{ fontSize: '0.75rem' }}>
                  <thead>
                    <tr>
                      <th>Factor</th>
                      <th>PCA</th>
                      <th>LDA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Nature</strong></td>
                      <td>Unsupervised</td>
                      <td>Supervised</td>
                    </tr>
                    <tr>
                      <td><strong>Objective</strong></td>
                      <td>Max variance</td>
                      <td>Max class separation</td>
                    </tr>
                    <tr>
                      <td><strong>Labels</strong></td>
                      <td>Ignored</td>
                      <td>Required</td>
                    </tr>
                    <tr>
                      <td><strong>Use Case</strong></td>
                      <td>General compression</td>
                      <td>Classification prep</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 3: PYTHON CODE VIEW
      ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'code' && (
        <div className="tab-content fade-in">
          <div className="interactive-card">
            <div className="card-header-row">
              <h3 className="card-title">Scikit-Learn Implementation</h3>
              <button
                className={`btn btn-copy ${copied ? 'copied' : ''}`}
                onClick={() => copyToClipboard(pcaLdaCode)}
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <div className="code-snippet-box" style={{ marginTop: '0.5rem' }}>
              <pre className="pre-code"><code style={{ fontSize: '0.8rem' }}>{pcaLdaCode}</code></pre>
            </div>
          </div>
          
          <div className="card-note alert-indigo" style={{ marginTop: '1.5rem' }}>
            <strong>Rule of Thumb:</strong> Always scale your data using <code>StandardScaler</code> before applying PCA or LDA. Since PCA projects data onto axes of max variance, features with naturally larger scales (e.g., salary vs. age) will dominate the projection directions if not normalized first.
          </div>
        </div>
      )}

    </div>
  );
}
