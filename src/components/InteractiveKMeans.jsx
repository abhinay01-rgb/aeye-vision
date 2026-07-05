import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, FastForward, Shuffle } from 'lucide-react';

export default function InteractiveKMeans() {
  const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.9rem' };
  const sectionTitle = (text, emoji) => <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>{emoji && <span style={{ marginRight: '0.4rem' }}>{emoji}</span>}{text}</h4>;

  const clusterColors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

  const [kValue, setKValue] = useState(3);
  const [dataPoints, setDataPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [iteration, setIteration] = useState(0);
  const [isConverged, setIsConverged] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [sse, setSse] = useState(0);

  // Initialize Data
  const generateData = useCallback(() => {
    const newPoints = [];
    const centers = [
      { x: 150, y: 150 },
      { x: 450, y: 150 },
      { x: 300, y: 400 },
      { x: 150, y: 450 }
    ];
    centers.forEach(center => {
      const numPoints = 15 + Math.floor(Math.random() * 10);
      for (let i = 0; i < numPoints; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 80 + 20;
        newPoints.push({
          x: Math.max(20, Math.min(580, center.x + Math.cos(angle) * radius)),
          y: Math.max(20, Math.min(580, center.y + Math.sin(angle) * radius))
        });
      }
    });
    setDataPoints(newPoints);
    return newPoints;
  }, []);

  const initializeCentroids = useCallback((pts, k) => {
    const newCentroids = [];
    for (let i = 0; i < k; i++) {
      newCentroids.push({
        x: 50 + Math.random() * 500,
        y: 50 + Math.random() * 500,
        color: clusterColors[i % clusterColors.length]
      });
    }
    setCentroids(newCentroids);
    setAssignments(new Array(pts.length).fill(-1));
    setIteration(0);
    setIsConverged(false);
    setIsRunning(false);
    setSse(0);
  }, []);

  // Initial load
  useEffect(() => {
    const pts = generateData();
    initializeCentroids(pts, kValue);
  }, [generateData, initializeCentroids]);

  const distance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

  const stepAlgorithm = () => {
    if (isConverged || isRunning) return;

    if (iteration === 0 || iteration % 2 === 0) {
      // Assign points
      let changed = false;
      const newAssignments = [...assignments];
      let newSse = 0;

      for (let i = 0; i < dataPoints.length; i++) {
        let minDist = Infinity;
        let nearest = 0;
        for (let j = 0; j < centroids.length; j++) {
          const dist = distance(dataPoints[i], centroids[j]);
          if (dist < minDist) {
            minDist = dist;
            nearest = j;
          }
        }
        if (newAssignments[i] !== nearest) {
          changed = true;
          newAssignments[i] = nearest;
        }
        newSse += minDist * minDist;
      }
      
      setAssignments(newAssignments);
      setSse(newSse);
      setIteration(prev => prev + 1);
      if (!changed && iteration > 0) setIsConverged(true);
    } else {
      // Update centroids
      const sums = centroids.map(() => ({ x: 0, y: 0, count: 0 }));
      dataPoints.forEach((pt, i) => {
        const cIdx = assignments[i];
        if (cIdx >= 0) {
          sums[cIdx].x += pt.x;
          sums[cIdx].y += pt.y;
          sums[cIdx].count++;
        }
      });

      let moved = false;
      const newCentroids = centroids.map((c, i) => {
        if (sums[i].count > 0) {
          const nx = sums[i].x / sums[i].count;
          const ny = sums[i].y / sums[i].count;
          if (Math.abs(c.x - nx) > 1 || Math.abs(c.y - ny) > 1) moved = true;
          return { ...c, x: nx, y: ny };
        }
        return c;
      });

      setCentroids(newCentroids);
      setIteration(prev => prev + 1);
      if (!moved) setIsConverged(true);
    }
  };

  // Run to completion effect loop
  useEffect(() => {
    let timer;
    if (isRunning && !isConverged) {
      timer = setTimeout(() => {
        // We have to directly use functional updates or duplicate logic if we rely on state
        // To keep it simple, we just toggle stepAlgorithm by using refs if needed, but since
        // we use state, we can simulate step by updating.
        
        // Let's implement the step inside the timeout to access latest state via functional updates
        setIteration(currentIter => {
          if (currentIter === 0 || currentIter % 2 === 0) {
            // Assign
            let changed = false;
            let newSse = 0;
            setAssignments(prevAss => {
              const newAss = [...prevAss];
              for (let i = 0; i < dataPoints.length; i++) {
                let minDist = Infinity;
                let nearest = 0;
                for (let j = 0; j < centroids.length; j++) {
                  const dist = distance(dataPoints[i], centroids[j]);
                  if (dist < minDist) { minDist = dist; nearest = j; }
                }
                if (newAss[i] !== nearest) { changed = true; newAss[i] = nearest; }
                newSse += minDist * minDist;
              }
              setSse(newSse);
              return newAss;
            });
            
            if (!changed && currentIter > 0) {
              setIsConverged(true);
              setIsRunning(false);
            }
            return currentIter + 1;
          } else {
            // Update centroids
            let moved = false;
            setCentroids(prevCentroids => {
              const sums = prevCentroids.map(() => ({ x: 0, y: 0, count: 0 }));
              setAssignments(currentAss => {
                dataPoints.forEach((pt, i) => {
                  const cIdx = currentAss[i];
                  if (cIdx >= 0) { sums[cIdx].x += pt.x; sums[cIdx].y += pt.y; sums[cIdx].count++; }
                });
                return currentAss;
              });

              return prevCentroids.map((c, i) => {
                if (sums[i].count > 0) {
                  const nx = sums[i].x / sums[i].count;
                  const ny = sums[i].y / sums[i].count;
                  if (Math.abs(c.x - nx) > 1 || Math.abs(c.y - ny) > 1) moved = true;
                  return { ...c, x: nx, y: ny };
                }
                return c;
              });
            });

            if (!moved) {
              setIsConverged(true);
              setIsRunning(false);
            }
            return currentIter + 1;
          }
        });
      }, 500);
    } else if (isConverged) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, isConverged, centroids, dataPoints]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'linear-gradient(160deg, rgba(15,23,42,0.98), rgba(9,14,30,0.98))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem', color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.6' }}>
      
      <div style={cardStyle}>
        {sectionTitle("What is K-Means Clustering?", "🧠")}
        <p style={{ marginBottom: '0.5rem' }}>
          K-Means Clustering is an unsupervised machine learning algorithm that groups similar data points into clusters without needing labeled data. It is used to uncover hidden patterns when the goal is to organize data based on similarity.
        </p>
        <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
          <li>Helps identify natural groupings in unlabeled datasets.</li>
          <li>Works by grouping points based on their distance to cluster centers (centroids).</li>
          <li>Commonly used in customer segmentation, anomaly detection, and image compression.</li>
        </ul>
      </div>

      <div style={{ ...cardStyle, background: 'rgba(56,189,248,0.04)', borderColor: 'rgba(56,189,248,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          {sectionTitle("Interactive K-Means Visualization", "✨")}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
            <label style={{ color: '#cbd5e1', fontWeight: 600 }}>K (Clusters):</label>
            <input 
              type="range" min="2" max="8" value={kValue} 
              onChange={(e) => {
                const newK = parseInt(e.target.value);
                setKValue(newK);
                initializeCentroids(dataPoints, newK);
              }}
              style={{ flex: 1, accentColor: '#38bdf8' }}
              disabled={isRunning}
            />
            <span style={{ color: '#38bdf8', fontWeight: 'bold', width: '20px' }}>{kValue}</span>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => { const pts = generateData(); initializeCentroids(pts, kValue); }}
              disabled={isRunning}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: isRunning ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Shuffle size={14} /> New Data
            </button>
            <button 
              onClick={() => initializeCentroids(dataPoints, kValue)}
              disabled={isRunning}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: isRunning ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={stepAlgorithm}
              disabled={isConverged || isRunning}
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: (isConverged || isRunning) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}
            >
              <Play size={14} /> Next Step
            </button>
            <button 
              onClick={() => setIsRunning(true)}
              disabled={isConverged || isRunning}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: (isConverged || isRunning) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}
            >
              <FastForward size={14} /> Run to Completion
            </button>
          </div>
        </div>
        
        {/* Status Bar */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 500,
          background: isConverged ? 'rgba(16, 185, 129, 0.1)' : (isRunning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(56, 189, 248, 0.1)'),
          color: isConverged ? '#34d399' : (isRunning ? '#fbbf24' : '#7dd3fc'),
          border: `1px solid ${isConverged ? 'rgba(16, 185, 129, 0.2)' : (isRunning ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)')}`
        }}>
          <div>
            {isConverged ? `✅ Converged! Algorithm completed in ${iteration} iterations.` : 
             (iteration === 0 ? "Click 'Next Step' or 'Run to Completion' to begin." : 
             `Iteration ${iteration}: ${iteration % 2 === 1 ? 'Assigned points to nearest centroids' : 'Updated centroids to cluster means'}`)}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <span><strong>Iter:</strong> {iteration}</span>
             <span><strong>SSE:</strong> {iteration > 0 ? sse.toFixed(1) : '-'}</span>
          </div>
        </div>

        <div style={{ width: '100%', height: '400px', background: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }}>
            {/* Draw lines from points to their assigned centroid */}
            {iteration > 0 && dataPoints.map((pt, i) => {
              const cIdx = assignments[i];
              if (cIdx >= 0 && centroids[cIdx]) {
                const c = centroids[cIdx];
                return <line key={`l-${i}`} x1={pt.x} y1={pt.y} x2={c.x} y2={c.y} stroke={c.color} strokeWidth="0.5" opacity="0.3" />;
              }
              return null;
            })}

            {/* Data Points */}
            {dataPoints.map((pt, i) => {
              let color = '#475569';
              if (iteration > 0 && assignments[i] >= 0) {
                color = centroids[assignments[i]].color;
              }
              return <circle key={`pt-${i}`} cx={pt.x} cy={pt.y} r="5" fill={color} opacity="0.9" stroke="#0f172a" strokeWidth="1" />;
            })}

            {/* Centroids */}
            {centroids.map((c, i) => (
              <g key={`c-${i}`} transform={`translate(${c.x}, ${c.y})`}>
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#fff" strokeWidth="6" />
                <line x1="0" y1="-12" x2="0" y2="12" stroke="#fff" strokeWidth="6" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke={c.color} strokeWidth="3" />
                <line x1="0" y1="-12" x2="0" y2="12" stroke={c.color} strokeWidth="3" />
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={cardStyle}>
          {sectionTitle("How K-Means Clustering Works", "⚙️")}
          <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li><strong>Initialize:</strong> Select K random points as initial cluster centroids.</li>
            <li><strong>Assign:</strong> Calculate the Euclidean distance of each data point to the centroids. Assign each point to the closest centroid, forming K clusters.</li>
            <li><strong>Update:</strong> Move each centroid to the center (mean) of all the data points assigned to its cluster.</li>
            <li><strong>Repeat:</strong> Continue steps 2 and 3 until the centroids stop moving significantly (convergence).</li>
          </ol>
          <p style={{ marginTop: '0.8rem', fontSize: '0.75rem', fontStyle: 'italic', color: '#64748b' }}>
            The algorithm seeks to minimize the Sum of Squared Errors (SSE), which is the sum of the squared distances from each point to its cluster centroid.
          </p>
        </div>

        <div style={cardStyle}>
          {sectionTitle("Choosing the Right K (Elbow Method)", "📐")}
          <p style={{ marginBottom: '0.5rem' }}>
            A common challenge in K-Means is determining the optimal number of clusters (K). The <strong>Elbow Method</strong> is a popular technique for this:
          </p>
          <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
            <li>Run K-Means for a range of K values (e.g., 1 to 10).</li>
            <li>For each K, calculate the Within-Cluster Sum of Squares (WCSS or SSE).</li>
            <li>Plot K against the WCSS. The plot will look like an arm.</li>
            <li>The "elbow" of the arm—where the rate of decrease sharply shifts—represents the optimal K.</li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={cardStyle}>
          {sectionTitle("Pros", "✅")}
          <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#4ade80', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <li>Simple to understand and implement.</li>
            <li>Scales well to large datasets (computationally efficient).</li>
            <li>Guarantees convergence (although it may be a local optimum).</li>
            <li>Easily adapts to new data points.</li>
          </ul>
        </div>
        <div style={cardStyle}>
          {sectionTitle("Cons", "❌")}
          <ul style={{ paddingLeft: '1.2rem', margin: 0, color: '#f43f5e', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <li>Requires specifying K (number of clusters) in advance.</li>
            <li>Sensitive to outliers, which can skew the centroids.</li>
            <li>Sensitive to initial centroid placement (random initialization trap).</li>
            <li>Struggles with clusters of varying sizes, densities, or non-spherical shapes.</li>
          </ul>
        </div>
      </div>

      <div style={cardStyle}>
        {sectionTitle("Python Implementation (scikit-learn)", "🐍")}
        <pre style={{ margin: 0, padding: '1rem', background: '#0f172a', borderRadius: '8px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.75rem' }}>
          <code>
<span style={{ color: '#c678dd' }}>from</span> sklearn.cluster <span style={{ color: '#c678dd' }}>import</span> KMeans{'\n'}
<span style={{ color: '#c678dd' }}>from</span> sklearn.datasets <span style={{ color: '#c678dd' }}>import</span> make_blobs{'\n\n'}
<span style={{ color: '#6a9955' }}># 1. Generate synthetic data</span>{'\n'}
X, y = make_blobs(n_samples=<span style={{ color: '#d19a66' }}>300</span>, centers=<span style={{ color: '#d19a66' }}>4</span>, cluster_std=<span style={{ color: '#d19a66' }}>0.60</span>, random_state=<span style={{ color: '#d19a66' }}>0</span>){'\n\n'}
<span style={{ color: '#6a9955' }}># 2. Initialize and fit the KMeans model</span>{'\n'}
kmeans = KMeans(n_clusters=<span style={{ color: '#d19a66' }}>4</span>, init=<span style={{ color: '#98c379' }}>'k-means++'</span>, random_state=<span style={{ color: '#d19a66' }}>42</span>){'\n'}
kmeans.fit(X){'\n\n'}
<span style={{ color: '#6a9955' }}># 3. Retrieve centroids and cluster labels</span>{'\n'}
centroids = kmeans.cluster_centers_{'\n'}
labels = kmeans.labels_{'\n\n'}
<span style={{ color: '#6a9955' }}># 4. Predict cluster for new data points</span>{'\n'}
new_points = [[<span style={{ color: '#d19a66' }}>0</span>, <span style={{ color: '#d19a66' }}>0</span>], [<span style={{ color: '#d19a66' }}>12</span>, <span style={{ color: '#d19a66' }}>3</span>]]{'\n'}
predictions = kmeans.predict(new_points){'\n'}
          </code>
        </pre>
      </div>

    </div>
  );
}
