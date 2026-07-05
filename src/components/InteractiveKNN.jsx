import React, { useState, useRef } from 'react';

const InteractiveKNN = () => {
  const [kValue, setKValue] = useState(3);
  const [targetPoint, setTargetPoint] = useState({ x: 150, y: 100 });
  const [distanceMetric, setDistanceMetric] = useState('euclidean');
  const svgRef = useRef(null);

  // Pre-defined dataset of Class A (Blue) and Class B (Orange)
  const dataPoints = [
    // Class A (Blue)
    { id: 1, x: 50, y: 150, class: 'A', color: '#3b82f6' },
    { id: 2, x: 80, y: 140, class: 'A', color: '#3b82f6' },
    { id: 3, x: 60, y: 120, class: 'A', color: '#3b82f6' },
    { id: 4, x: 90, y: 160, class: 'A', color: '#3b82f6' },
    { id: 5, x: 110, y: 130, class: 'A', color: '#3b82f6' },
    { id: 6, x: 70, y: 90, class: 'A', color: '#3b82f6' },
    { id: 7, x: 40, y: 110, class: 'A', color: '#3b82f6' },
    { id: 8, x: 100, y: 100, class: 'A', color: '#3b82f6' },
    // Class B (Orange)
    { id: 9, x: 200, y: 60, class: 'B', color: '#f59e0b' },
    { id: 10, x: 230, y: 80, class: 'B', color: '#f59e0b' },
    { id: 11, x: 250, y: 50, class: 'B', color: '#f59e0b' },
    { id: 12, x: 190, y: 40, class: 'B', color: '#f59e0b' },
    { id: 13, x: 210, y: 90, class: 'B', color: '#f59e0b' },
    { id: 14, x: 170, y: 70, class: 'B', color: '#f59e0b' },
    { id: 15, x: 260, y: 90, class: 'B', color: '#f59e0b' },
    { id: 16, x: 240, y: 120, class: 'B', color: '#f59e0b' },
    // Some mixed points in the middle
    { id: 17, x: 140, y: 140, class: 'A', color: '#3b82f6' },
    { id: 18, x: 160, y: 60, class: 'B', color: '#f59e0b' },
  ];

  // Calculate distances and find nearest neighbors
  const calculateDistance = (p1, p2) => {
    if (distanceMetric === 'euclidean') {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    } else {
      // Manhattan
      return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }
  };

  const distances = dataPoints.map(p => ({
    ...p,
    distance: calculateDistance(targetPoint, p)
  })).sort((a, b) => a.distance - b.distance);

  const nearestNeighbors = distances.slice(0, kValue);

  // Calculate majority vote
  const classCounts = nearestNeighbors.reduce((acc, p) => {
    acc[p.class] = (acc[p.class] || 0) + 1;
    return acc;
  }, {});

  const predictedClass = Object.keys(classCounts).reduce((a, b) => classCounts[a] > classCounts[b] ? a : b, '');
  const predictedColor = predictedClass === 'A' ? '#3b82f6' : '#f59e0b';
  const predictedName = predictedClass === 'A' ? 'Blue' : 'Orange';

  const countA = classCounts['A'] || 0;
  const countB = classCounts['B'] || 0;

  const handleSvgClick = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTargetPoint({ x, y });
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '0.9rem',
  };

  const sectionTitle = (text, emoji) => (
    <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>
      {emoji && <span style={{ marginRight: '0.4rem' }}>{emoji}</span>}{text}
    </h4>
  );

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '1.25rem',
      background: 'linear-gradient(160deg, rgba(15,23,42,0.98), rgba(9,14,30,0.98))',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem',
      color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.6'
    }}>
      
      {/* 1. What is KNN? */}
      <div style={cardStyle}>
        {sectionTitle('What is KNN?', '🤖')}
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>K-Nearest Neighbors (KNN)</strong> is a simple, supervised machine learning algorithm used for both classification and regression.
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '0' }}>
          <li style={{ marginBottom: '0.25rem' }}><strong>"Lazy Learner":</strong> It does not learn a model during the training phase. Instead, it stores the entire training dataset and performs computation only when making a prediction.</li>
          <li><strong>Non-parametric:</strong> It makes no underlying assumptions about the distribution of the data.</li>
        </ul>
      </div>

      {/* 2. Interactive KNN Visualization */}
      <div style={{ ...cardStyle, background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.12)' }}>
        {sectionTitle('Interactive KNN Visualization', '🔬')}
        <p style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
          Click anywhere on the plot to place a target point. Adjust K and the distance metric to see how the neighborhood changes.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Number of Neighbors (K): {kValue}
            </label>
            <input 
              type="range" 
              min="1" 
              max="9" 
              step="2" 
              value={kValue} 
              onChange={(e) => setKValue(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <span>1</span><span>3</span><span>5</span><span>7</span><span>9</span>
            </div>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', color: '#e2e8f0', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Distance Metric
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setDistanceMetric('euclidean')}
                style={{ 
                  flex: 1, padding: '0.5rem', borderRadius: '6px', cursor: 'pointer',
                  background: distanceMetric === 'euclidean' ? '#6366f1' : 'rgba(255,255,255,0.1)',
                  color: distanceMetric === 'euclidean' ? '#fff' : '#cbd5e1',
                  border: 'none'
                }}
              >
                Euclidean
              </button>
              <button 
                onClick={() => setDistanceMetric('manhattan')}
                style={{ 
                  flex: 1, padding: '0.5rem', borderRadius: '6px', cursor: 'pointer',
                  background: distanceMetric === 'manhattan' ? '#6366f1' : 'rgba(255,255,255,0.1)',
                  color: distanceMetric === 'manhattan' ? '#fff' : '#cbd5e1',
                  border: 'none'
                }}
              >
                Manhattan
              </button>
            </div>
          </div>
        </div>

        <svg 
          ref={svgRef}
          viewBox="0 0 300 200" 
          onClick={handleSvgClick}
          style={{ width: '100%', height: 'auto', background: '#080c1c', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'crosshair', userSelect: 'none' }}
        >
          {/* Nearest neighbor connections */}
          {nearestNeighbors.map(p => (
            <line 
              key={`line-${p.id}`} 
              x1={targetPoint.x} 
              y1={targetPoint.y} 
              x2={p.x} 
              y2={p.y} 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="1.5" 
              strokeDasharray={distanceMetric === 'manhattan' ? "2" : "0"}
            />
          ))}

          {/* Draw all points */}
          {dataPoints.map(p => {
            const isNeighbor = nearestNeighbors.find(n => n.id === p.id);
            return (
              <circle 
                key={p.id} 
                cx={p.x} 
                cy={p.y} 
                r={isNeighbor ? 6 : 4} 
                fill={p.color} 
                stroke={isNeighbor ? '#fff' : 'none'}
                strokeWidth={isNeighbor ? 1.5 : 0}
                opacity={isNeighbor ? 1 : 0.6}
              />
            );
          })}

          {/* Draw target point */}
          <circle 
            cx={targetPoint.x} 
            cy={targetPoint.y} 
            r={5} 
            fill="#fff" 
            stroke={predictedColor}
            strokeWidth="2.5"
          />
          <text x={targetPoint.x + 8} y={targetPoint.y - 8} fill="#fff" fontSize="10" fontWeight="bold">?</text>
        </svg>

        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: `4px solid ${predictedColor}` }}>
          <h4 style={{ color: '#e2e8f0', margin: '0 0 0.5rem 0' }}>Majority Vote Outcome</h4>
          <p style={{ margin: 0 }}>
            Out of {kValue} neighbors: <strong style={{ color: '#f59e0b' }}>{countB} are Orange</strong>, <strong style={{ color: '#3b82f6' }}>{countA} are Blue</strong>.
            <br/>
            Predicted class: <strong style={{ color: predictedColor }}>{predictedName}</strong>
          </p>
        </div>
      </div>

      {/* 3. How KNN Works (Step-by-Step) */}
      <div style={cardStyle}>
        {sectionTitle('How KNN Works (Step-by-Step)', '⚙️')}
        <ol style={{ paddingLeft: '1.5rem', margin: 0, fontSize: '0.78rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Select the number K of neighbors.</li>
          <li style={{ marginBottom: '0.5rem' }}>Calculate the distance between the new data point and all training data points.</li>
          <li style={{ marginBottom: '0.5rem' }}>Select the K closest data points.</li>
          <li>For classification: assign the class by <strong>majority vote</strong>. For regression: assign the value by <strong>average</strong>.</li>
        </ol>
      </div>

      {/* 4. Distance Metrics */}
      <div style={cardStyle}>
        {sectionTitle('Distance Metrics Used in KNN Algorithm', '📐')}
        <p style={{ marginBottom: '1.25rem', fontSize: '0.78rem' }}>
          KNN uses distance metrics to identify nearest neighbor, these neighbors are used for classification and regression task. To identify nearest neighbor we use below distance metrics:
        </p>

        {/* Distance Comparison Graph */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <svg viewBox="0 0 350 200" style={{ width: '100%', maxWidth: '450px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Grid Lines */}
            <g stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="5,5">
              <line x1="140" y1="20" x2="140" y2="180" />
              <line x1="190" y1="20" x2="190" y2="180" />
              <line x1="240" y1="20" x2="240" y2="180" />
              <line x1="290" y1="20" x2="290" y2="180" />
              <line x1="110" y1="160" x2="320" y2="160" />
              <line x1="110" y1="110" x2="320" y2="110" />
              <line x1="110" y1="60" x2="320" y2="60" />
            </g>

            {/* Paths */}
            {/* Manhattan Path (L-shape) */}
            <polyline points="140,160 290,160 290,60" fill="none" stroke="#94a3b8" strokeWidth="3" />
            
            {/* Euclidean Path (Straight diagonal) */}
            <line x1="140" y1="160" x2="290" y2="60" stroke="#3b82f6" strokeWidth="3" />
            
            {/* Minkowski Path (Curved for p between 1 and 2) */}
            <path d="M 140,160 Q 250,140 290,60" fill="none" stroke="#84cc16" strokeWidth="3" />
            
            {/* Points */}
            <circle cx="140" cy="160" r="4.5" fill="#e2e8f0" />
            <circle cx="290" cy="60" r="4.5" fill="#e2e8f0" />
            <circle cx="290" cy="160" r="4.5" fill="#475569" />

            {/* Legend Text & Lines */}
            <text x="25" y="65" fill="#94a3b8" fontSize="12" fontWeight="600">Manhattan</text>
            <line x1="100" y1="60" x2="125" y2="60" stroke="#94a3b8" strokeWidth="3" />
            
            <text x="25" y="115" fill="#3b82f6" fontSize="12" fontWeight="600">Euclidean</text>
            <line x1="100" y1="110" x2="125" y2="110" stroke="#3b82f6" strokeWidth="3" />
            
            <text x="25" y="155" fill="#84cc16" fontSize="12" fontWeight="600">Minkowski,</text>
            <text x="25" y="172" fill="#84cc16" fontSize="12" fontWeight="600">for p</text>
            <line x1="100" y1="160" x2="125" y2="160" stroke="#84cc16" strokeWidth="3" />
          </svg>
        </div>

        <h5 style={{ color: '#e2e8f0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>1. Euclidean Distance</h5>
        <p style={{ marginBottom: '0.5rem', fontSize: '0.78rem' }}>
          Euclidean distance is defined as the straight-line distance between two points in a plane or space. You can think of it like the shortest path you would walk if you were to go directly from one point to another.
        </p>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', margin: '0.5rem 0 1.25rem 0', fontFamily: 'monospace', fontSize: '0.95rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>d(x, X<sub>i</sub>) =</span>
          <span style={{ fontSize: '1.6em', fontWeight: 300, transform: 'translateY(2px)' }}>&radic;</span>
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: '0.65em' }}>n</span>
            <span style={{ fontSize: '1.2em' }}>&Sigma;</span>
            <span style={{ fontSize: '0.65em' }}>j=1</span>
          </span>
          <span>(x<sub>j</sub> - X<sub>ij</sub>)<sup>2</sup></span>
        </div>

        <h5 style={{ color: '#e2e8f0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>2. Manhattan Distance</h5>
        <p style={{ marginBottom: '0.5rem', fontSize: '0.78rem' }}>
          This is the total distance you would travel if you could only move along horizontal and vertical lines like a grid or city streets. It’s also called "taxicab distance" because a taxi can only drive along the grid-like streets of a city.
        </p>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', margin: '0.5rem 0 1.25rem 0', fontFamily: 'monospace', fontSize: '0.95rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>d(x, y) =</span>
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: '0.65em' }}>n</span>
            <span style={{ fontSize: '1.2em' }}>&Sigma;</span>
            <span style={{ fontSize: '0.65em' }}>i=1</span>
          </span>
          <span>|x<sub>i</sub> - y<sub>i</sub>|</span>
        </div>

        <h5 style={{ color: '#e2e8f0', fontSize: '0.85rem', marginBottom: '0.25rem' }}>3. Minkowski Distance</h5>
        <p style={{ marginBottom: '0.5rem', fontSize: '0.78rem' }}>
          Minkowski distance is like a family of distances, which includes both Euclidean and Manhattan distances as special cases.
        </p>
        <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', margin: '0.5rem 0 1rem 0', fontFamily: 'monospace', fontSize: '0.95rem', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>d(x, y) =</span>
          <span style={{ fontSize: '1.5em', fontWeight: 300 }}>(</span>
          <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
            <span style={{ fontSize: '0.65em' }}>n</span>
            <span style={{ fontSize: '1.2em' }}>&Sigma;</span>
            <span style={{ fontSize: '0.65em' }}>i=1</span>
          </span>
          <span>(x<sub>i</sub> - y<sub>i</sub>)<sup>p</sup></span>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5em', fontWeight: 300 }}>)</span>
            <sup style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.7em', marginLeft: '4px', transform: 'translateY(-6px)' }}>
              <span style={{ borderBottom: '1px solid currentColor', padding: '0 3px', lineHeight: 1.1 }}>1</span>
              <span style={{ lineHeight: 1.1 }}>p</span>
            </sup>
          </span>
        </div>
        <div style={{ padding: '1rem', background: '#cbd5e1', borderRadius: '16px', marginTop: '0.5rem', marginBottom: '1rem', color: '#0f766e', fontWeight: '600', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Minkowski when <code style={{ background: 'rgba(255,255,255,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#0f766e' }}>p = 1</code></span> 
            <span>&rarr;</span> 
            <span>Manhattan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Minkowski when <code style={{ background: 'rgba(255,255,255,0.4)', padding: '2px 6px', borderRadius: '4px', color: '#0f766e' }}>p = 2</code></span> 
            <span>&rarr;</span> 
            <span>Euclidean</span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.78rem' }}>
          Minkowski distance is essentially a flexible generalized formula that can represent either Euclidean or Manhattan distance depending on the value of p.
        </p>
      </div>

      {/* 5. Statistical Methods for Selecting k */}
      <div style={cardStyle}>
        {sectionTitle('Statistical Methods for Selecting k', '⚖️')}
        <ul style={{ paddingLeft: '1.5rem', margin: 0, fontSize: '0.78rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Cross-Validation:</strong> Cross-Validation is a good way to find the best value of k is by using k-fold cross-validation. This means dividing the dataset into k parts. The model is trained on some of these parts and tested on the remaining ones. This process is repeated for each part.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Elbow Method:</strong> In Elbow Method we draw a graph showing the error rate or accuracy for different k values. As k increases the error usually drops at first. But after a certain point error stops decreasing quickly. The point where the curve changes direction and looks like an "elbow" is usually the best choice for k.</li>
          <li><strong>Odd Values for k:</strong> It's a good idea to use an odd number for k especially in classification problems. This helps avoid ties when deciding which class is the most common among the neighbors.</li>
        </ul>
      </div>

      {/* 6. Pros and Cons */}
      <div style={cardStyle}>
        {sectionTitle('Pros and Cons', '🎭')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '10px', padding: '0.8rem' }}>
            <h4 style={{ color: '#4ade80', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 700 }}>✅ Pros</h4>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>Simple to understand and implement.</li>
              <li style={{ marginBottom: '0.25rem' }}>No training phase (fast training).</li>
              <li>Naturally handles multi-class classification.</li>
            </ul>
          </div>
          <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '10px', padding: '0.8rem' }}>
            <h4 style={{ color: '#f43f5e', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 700 }}>❌ Cons</h4>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>Computationally expensive at prediction time.</li>
              <li style={{ marginBottom: '0.25rem' }}>High memory requirement (stores all data).</li>
              <li>Sensitive to irrelevant features and scale (requires feature scaling/normalization).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7. Python Code Example */}
      <div style={cardStyle}>
        {sectionTitle('Python Implementation (sklearn)', '🐍')}
        <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '10px', overflowX: 'auto' }}>
          <pre style={{ margin: 0, fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace", fontSize: '0.73rem', color: '#94a3b8', lineHeight: 1.7 }}>
{`from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler

# Scaling is crucial for KNN!
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Initialize KNN
knn = KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)

# Fit and predict
knn.fit(X_scaled, y)
y_pred = knn.predict(X_test_scaled)`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default InteractiveKNN;
