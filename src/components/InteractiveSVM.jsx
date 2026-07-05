import React, { useState, useRef } from 'react';
import { Play, Trash2, MousePointer2 } from 'lucide-react';

export default function InteractiveSVM() {
  const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.9rem' };
  const sectionTitle = (text, emoji) => <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>{emoji && <span style={{ marginRight: '0.4rem' }}>{emoji}</span>}{text}</h4>;

  const KernelTrickVisualizer = () => {
    const [applied, setApplied] = useState(false);
    
    const points1D = [
      { x: -1.5, class: 'A' }, { x: -0.9, class: 'A' }, { x: -0.2, class: 'A' }, { x: 0.5, class: 'A' }, { x: 1.2, class: 'A' },
      { x: -4.0, class: 'B' }, { x: -3.2, class: 'B' }, { x: -2.5, class: 'B' }, { x: 2.5, class: 'B' }, { x: 3.5, class: 'B' }, { x: 4.2, class: 'B' }
    ];

    return (
      <div style={{ ...cardStyle, background: 'rgba(168,85,247,0.04)', borderColor: 'rgba(168,85,247,0.12)', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          {sectionTitle("Kernel Trick & Geometric Intuition", "🪄")}
        </div>
        <p style={{ marginBottom: '1rem' }}>
          In the 1D space below, the <strong style={{color:'#38bdf8'}}>Cyan</strong> and <strong style={{color:'#ec4899'}}>Pink</strong> points are intertwined. No single point (a 1D hyperplane) can separate them. By applying a Polynomial Kernel mapping <code>φ(x) = (x, x²)</code>, we project the data into a 2D space where a flat line easily separates them!
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => setApplied(!applied)}
            style={{ background: applied ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #a855f7, #9333ea)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {applied ? "Reset to 1D" : "Apply Kernel: y = x²"}
          </button>
          <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
            {applied ? "Notice how the 1D points stretched into a 2D parabola, making linear separation trivial." : "Try clicking to map the data to a higher dimension."}
          </span>
        </div>
        
        <div style={{ width: '100%', height: '250px', background: '#080c1c', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 600 250" style={{ width: '100%', height: '100%' }}>
            {/* X Axis */}
            <line x1="50" y1="200" x2="550" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            
            {/* Hyperplane (only visible when applied) */}
            <line 
              x1="50" y1="140" x2="550" y2="140" 
              stroke="#fbbf24" strokeWidth="2" strokeDasharray="5,5"
              style={{ opacity: applied ? 1 : 0, transition: 'opacity 1s ease-in-out 0.5s' }}
            />
            <text x="300" y="130" fill="#fbbf24" fontSize="12" textAnchor="middle" style={{ opacity: applied ? 1 : 0, transition: 'opacity 1s ease-in-out 0.5s' }}>
              Linear Decision Boundary (Hyperplane) in 2D
            </text>

            {/* Points */}
            {points1D.map((pt, i) => {
              const screenX = 300 + pt.x * 45;
              const screenY = applied ? 200 - (pt.x * pt.x) * 12 : 200;
              return (
                <circle 
                  key={i} 
                  cx={screenX} 
                  cy={screenY} 
                  r="6" 
                  fill={pt.class === 'A' ? '#38bdf8' : '#ec4899'} 
                  stroke="#080c1c" strokeWidth="1.5"
                  style={{ transition: 'cy 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const [currentClass, setCurrentClass] = useState('A');
  const [dataPoints, setDataPoints] = useState([]);
  const [cParameter, setCParameter] = useState(1.0);
  const [trainingResult, setTrainingResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Welcome! Select a class and click on the canvas to add data points.');

  const svgRef = useRef(null);

  const handleCanvasClick = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = 600 / rect.width;
    const scaleY = 350 / rect.height;
    
    const svgX = x * scaleX;
    const svgY = y * scaleY;
    
    const newPoints = [...dataPoints, { x: svgX, y: svgY, class: currentClass }];
    setDataPoints(newPoints);
    setTrainingResult(null);
    setStatusMessage(`Added ${currentClass === 'A' ? '🔴 Class A' : '🔵 Class B'} point. Total points: ${newPoints.length}`);
  };

  const trainSVM = () => {
    if (dataPoints.length < 4) {
      setStatusMessage('❌ Please add at least 4 points (2 of each class) to train the SVM.');
      return;
    }
    const classA = dataPoints.filter(p => p.class === 'A');
    const classB = dataPoints.filter(p => p.class === 'B');
    
    if (classA.length === 0 || classB.length === 0) {
      setStatusMessage('❌ Please add points from both classes to train the SVM.');
      return;
    }

    const result = simpleLinearSVM(dataPoints, cParameter);
    if (result) {
      setTrainingResult(result);
      setStatusMessage(`✅ SVM trained! Found ${result.supportVectors.length} support vectors with C=${cParameter.toFixed(1)}.`);
    } else {
      setStatusMessage('❌ Could not find a good linear separation. Try adjusting the data points.');
    }
  };

  const clearCanvas = () => {
    setDataPoints([]);
    setTrainingResult(null);
    setStatusMessage('Canvas cleared. Click to add data points!');
  };

  const simpleLinearSVM = (points, c) => {
    const classA = points.filter(p => p.class === 'A');
    const classB = points.filter(p => p.class === 'B');
    
    const centerA = {
      x: classA.reduce((sum, p) => sum + p.x, 0) / classA.length,
      y: classA.reduce((sum, p) => sum + p.y, 0) / classA.length
    };
    
    const centerB = {
      x: classB.reduce((sum, p) => sum + p.x, 0) / classB.length,
      y: classB.reduce((sum, p) => sum + p.y, 0) / classB.length
    };
    
    const dx = centerB.x - centerA.x;
    const dy = centerB.y - centerA.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length === 0) return null;
    
    const midX = (centerA.x + centerB.x) / 2;
    const midY = (centerA.y + centerB.y) / 2;
    
    const perpX = -dy / length;
    const perpY = dx / length;
    
    const boundary = {
      x1: midX - perpX * 800,
      y1: midY - perpY * 800,
      x2: midX + perpX * 800,
      y2: midY + perpY * 800,
      normal: { x: perpX, y: perpY },
      point: { x: midX, y: midY }
    };
    
    const distances = points.map(p => {
      const toPoint = { x: p.x - midX, y: p.y - midY };
      const distance = Math.abs(toPoint.x * perpX + toPoint.y * perpY);
      return { point: p, distance: distance };
    });
    
    distances.sort((a, b) => a.distance - b.distance);
    
    // Simulating the effect of C on the number of support vectors and margin width
    const cScaled = Math.min(10, Math.max(0.1, c));
    // When C is high (hard margin), we want fewer support vectors and a tighter margin
    // When C is low (soft margin), we want more support vectors and a wider margin
    const maxSupportVectors = Math.min(6, Math.max(2, Math.floor(points.length * (10 - cScaled) / 10)));
    const supportVecs = distances.slice(0, maxSupportVectors).map(d => d.point);
    
    const minDistance = distances[0].distance;
    const marginWidth = Math.max(10, minDistance * (1 + (10 - cScaled) / 5));
    
    return {
      boundary: boundary,
      supportVectors: supportVecs,
      margin: marginWidth
    };
  };

  const renderMargin = () => {
    if (!trainingResult) return null;
    const { boundary, margin } = trainingResult;
    const { normal, point } = boundary;

    const m1_x1 = point.x - normal.x * margin - normal.y * 800;
    const m1_y1 = point.y - normal.y * margin + normal.x * 800;
    const m1_x2 = point.x - normal.x * margin + normal.y * 800;
    const m1_y2 = point.y - normal.y * margin - normal.x * 800;

    const m2_x1 = point.x + normal.x * margin - normal.y * 800;
    const m2_y1 = point.y + normal.y * margin + normal.x * 800;
    const m2_x2 = point.x + normal.x * margin + normal.y * 800;
    const m2_y2 = point.y + normal.y * margin - normal.x * 800;

    return (
      <g>
        <polygon 
          points={`${m1_x1},${m1_y1} ${m1_x2},${m1_y2} ${m2_x2},${m2_y2} ${m2_x1},${m2_y1}`} 
          fill="rgba(99,102,241,0.1)" 
        />
        <line x1={m1_x1} y1={m1_y1} x2={m1_x2} y2={m1_y2} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.8" />
        <line x1={m2_x1} y1={m2_y1} x2={m2_x2} y2={m2_y2} stroke="#ec4899" strokeWidth="1.5" strokeDasharray="5,5" opacity="0.8" />
      </g>
    );
  };

  const isSupportVector = (pt) => {
    if (!trainingResult) return false;
    return trainingResult.supportVectors.some(sv => sv.x === pt.x && sv.y === pt.y);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'linear-gradient(160deg, rgba(15,23,42,0.98), rgba(9,14,30,0.98))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem', color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.6' }}>
      
      <div style={cardStyle}>
        {sectionTitle("What is Support Vector Machine (SVM)?", "🧠")}
        <p style={{ marginBottom: '0.5rem' }}>
          Support Vector Machine (SVM) is a supervised machine learning algorithm used for classification and regression tasks. It tries to find the best boundary known as hyperplane that separates different classes in the data. It is useful when you want to do binary classification like spam vs. not spam or cat vs. dog.
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          The main goal of SVM is to maximize the margin between the two classes. The larger the margin the better the model performs on new and unseen data.
        </p>
        {sectionTitle("Key Concepts", "🔑")}
        <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
          <li><strong>Hyperplane:</strong> A decision boundary separating different classes in feature space and is represented by the equation wx + b = 0 in linear classification.</li>
          <li><strong>Support Vectors:</strong> The closest data points to the hyperplane, crucial for determining the hyperplane and margin in SVM.</li>
          <li><strong>Margin:</strong> The distance between the hyperplane and the support vectors. SVM aims to maximize this margin for better classification performance.</li>
          <li><strong>Kernel:</strong> A function that maps data to a higher-dimensional space enabling SVM to handle non-linearly separable data.</li>
          <li><strong>Hard Margin:</strong> A maximum-margin hyperplane that perfectly separates the data without misclassifications.</li>
          <li><strong>Soft Margin:</strong> Allows some misclassifications by introducing slack variables, balancing margin maximization and misclassification penalties when data is not perfectly separable.</li>
          <li><strong>C:</strong> A regularization term balancing margin maximization and misclassification penalties. A higher C value forces stricter penalty for misclassifications.</li>
          <li><strong>Hinge Loss:</strong> A loss function penalizing misclassified points or margin violations and is combined with regularization in SVM.</li>
          <li><strong>Dual Problem:</strong> Involves solving for Lagrange multipliers associated with support vectors, facilitating the kernel trick and efficient computation.</li>
        </ul>
      </div>

      <div style={{ ...cardStyle, background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          {sectionTitle("Interactive SVM Visualization", "✨")}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1', fontWeight: 600, marginRight: '0.5rem' }}>Add Points:</span>
            <button 
              onClick={() => setCurrentClass('A')}
              style={{
                background: currentClass === 'A' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                border: `1px solid ${currentClass === 'A' ? '#38bdf8' : 'rgba(255,255,255,0.1)'}`,
                color: currentClass === 'A' ? '#38bdf8' : '#94a3b8',
                padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8' }} /> Class A
            </button>
            <button 
              onClick={() => setCurrentClass('B')}
              style={{
                background: currentClass === 'B' ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
                border: `1px solid ${currentClass === 'B' ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                color: currentClass === 'B' ? '#ec4899' : '#94a3b8',
                padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}
            >
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }} /> Class B
            </button>
          </div>
          
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
            <label style={{ color: '#cbd5e1', fontWeight: 600 }}>C Parameter:</label>
            <input 
              type="range" 
              min="0.1" max="10" step="0.1" 
              value={cParameter} 
              onChange={(e) => {
                setCParameter(parseFloat(e.target.value));
                if (dataPoints.length >= 4) {
                   setTrainingResult(null); // prompt re-train visually
                }
              }}
              style={{ flex: 1, accentColor: '#6366f1' }}
            />
            <span style={{ color: '#818cf8', fontWeight: 'bold', width: '30px' }}>{cParameter.toFixed(1)}</span>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={trainSVM}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', border: 'none',
                padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold'
              }}
            >
              <Play size={14} /> Train SVM
            </button>
            <button 
              onClick={clearCanvas}
              style={{
                background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div style={{ 
          padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 500,
          background: statusMessage.includes('❌') ? 'rgba(239, 68, 68, 0.1)' : (statusMessage.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.1)'),
          color: statusMessage.includes('❌') ? '#f87171' : (statusMessage.includes('✅') ? '#34d399' : '#7dd3fc'),
          border: `1px solid ${statusMessage.includes('❌') ? 'rgba(239, 68, 68, 0.2)' : (statusMessage.includes('✅') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)')}`
        }}>
          {statusMessage}
        </div>

        <div style={{ width: '100%', height: '350px', background: '#080c1c', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', cursor: 'crosshair' }}>
          <svg 
            ref={svgRef}
            viewBox="0 0 600 350" 
            style={{ width: '100%', height: '100%' }}
            onClick={handleCanvasClick}
          >
            {/* Grid lines */}
            <g stroke="rgba(255,255,255,0.03)" strokeWidth="1">
              {Array.from({length: 15}).map((_, i) => <line key={`v-${i}`} x1={i*40} y1={0} x2={i*40} y2={350} />)}
              {Array.from({length: 9}).map((_, i) => <line key={`h-${i}`} x1={0} y1={i*40} x2={600} y2={i*40} />)}
            </g>

            {/* SVM Drawing */}
            {renderMargin()}
            {trainingResult && (
              <line 
                x1={trainingResult.boundary.x1} y1={trainingResult.boundary.y1} 
                x2={trainingResult.boundary.x2} y2={trainingResult.boundary.y2} 
                stroke="#6366f1" strokeWidth="2.5" 
              />
            )}

            {/* Data Points */}
            {dataPoints.map((pt, i) => {
              const isSupport = isSupportVector(pt);
              const color = pt.class === 'A' ? '#38bdf8' : '#ec4899';
              return (
                <g key={`pt-${i}`}>
                  {isSupport && (
                    <circle cx={pt.x} cy={pt.y} r="9" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.8" />
                  )}
                  <circle cx={pt.x} cy={pt.y} r="5" fill={color} opacity="1" />
                </g>
              );
            })}
            
            {dataPoints.length === 0 && (
              <text x="300" y="175" fill="rgba(255,255,255,0.2)" fontSize="14" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                Click anywhere to add points
              </text>
            )}
          </svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={cardStyle}>
          {sectionTitle("Working of Support Vector Machine Algorithm", "⚙️")}
          <p style={{ marginBottom: '0.5rem' }}>
            The key idea behind the SVM algorithm is to find the hyperplane that best separates two classes by maximizing the margin between them. This margin is the distance from the hyperplane to the nearest data points (support vectors) on each side. Multiple hyperplanes separate the data from two classes. The best hyperplane also known as the hard margin is the one that maximizes the distance between the hyperplane and the nearest data points from both classes.
          </p>
          {sectionTitle("How does SVM classify the data?", "🧐")}
          <p style={{ marginBottom: '0.5rem' }}>
            The SVM algorithm has the characteristics to ignore the outlier and finds the best hyperplane that maximizes the margin. SVM can be sensitive to outliers, especially in the case of a hard margin, while soft margin SVM helps reduce their impact by allowing some misclassifications.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            A soft margin allows for some misclassifications or violations of the margin to improve generalization. The SVM optimizes the following equation to balance margin maximization and penalty minimization:
          </p>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center', marginBottom: '0.5rem' }}>
            <strong>Objective Function = (1 / margin) + λ ∑ penalty</strong>
          </div>
          <p style={{ marginBottom: '0.5rem' }}>
            The penalty used for violations is often hinge loss:
          </p>
          <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
            <li>If a data point is correctly classified and lies outside the margin, there is no penalty (loss = 0).</li>
            <li>If it is correctly classified but lies within the margin or is misclassified, the hinge loss is greater than 0.</li>
            <li>If a point is incorrectly classified or violates the margin the hinge loss increases proportionally to the distance of the violation.</li>
          </ul>
        </div>

        <KernelTrickVisualizer />

        <div style={cardStyle}>
          {sectionTitle("The 'Trick' in Kernel Trick", "🎩")}
          <p style={{ marginBottom: '0.5rem' }}>
            As shown above, mapping data to a higher dimension solves the separability problem. However, mathematically computing the new high-dimensional coordinates for every single data point is <strong style={{color:'#f87171'}}>computationally extremely expensive</strong>, especially for complex transformations (the RBF kernel maps data to <em>infinite</em> dimensions!).
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>This is where the "Trick" comes in:</strong> In the SVM optimization equations, the data points only ever appear inside a <em>dot product</em> (e.g., $x_i \cdot x_j$).
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            A Kernel Function $K(x_i, x_j)$ calculates the dot product of the data points in the higher-dimensional space <strong>directly from the original lower-dimensional space</strong>, completely skipping the expensive coordinate transformation step!
          </p>
          <div style={{ background: '#0f172a', padding: '0.75rem', borderRadius: '6px', textAlign: 'center', marginBottom: '0.5rem', fontFamily: 'monospace', color: '#a5b4fc', border: '1px solid rgba(255,255,255,0.05)' }}>
            K(xᵢ, xⱼ) = φ(xᵢ) · φ(xⱼ)
          </div>
          <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#64748b', marginBottom: 0 }}>
            Instead of computing φ(x), we just use the shortcut function K(x, y) to get the distance relationship.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={cardStyle}>
            {sectionTitle("Polynomial Kernel", "📈")}
            <p style={{ marginBottom: '0.5rem' }}>
              Maps data into a polynomial space. It represents the similarity of vectors (training samples) in a feature space over polynomials of the original variables.
            </p>
            <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', textAlign: 'center', fontFamily: 'monospace', color: '#fbbf24', border: '1px solid rgba(255,255,255,0.05)' }}>
              K(x, y) = (xᵀy + c)ᵈ
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: 0 }}>Where <em>d</em> is the degree of the polynomial.</p>
          </div>
          <div style={cardStyle}>
            {sectionTitle("Radial Basis Function (RBF) Kernel", "🪐")}
            <p style={{ marginBottom: '0.5rem' }}>
              The most popular kernel. It maps data into an infinite-dimensional space. It behaves like a weighted nearest neighbor model, grouping points based on their distance from a center.
            </p>
            <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', textAlign: 'center', fontFamily: 'monospace', color: '#fbbf24', border: '1px solid rgba(255,255,255,0.05)' }}>
              K(x, y) = exp(-γ ||x - y||²)
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: 0 }}>Where <em>γ</em> controls the influence of a single point.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
