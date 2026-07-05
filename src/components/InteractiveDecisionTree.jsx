import React, { useState, useMemo } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function InteractiveDecisionTree() {
  const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.9rem' };
  const sectionTitle = (text, emoji) => <h4 style={{ color: '#e2e8f0', fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>{emoji && <span style={{ marginRight: '0.4rem' }}>{emoji}</span>}{text}</h4>;

  const [step, setStep] = useState(0);

  // Generate synthetic fixed data for predictable splits
  const dataPoints = useMemo(() => {
    const pts = [];
    // Class A (Cyan) mostly left
    for (let i = 0; i < 40; i++) pts.push({ x: 50 + Math.random() * 230, y: 50 + Math.random() * 500, class: 'A' });
    // Class A outliers on right
    for (let i = 0; i < 5; i++) pts.push({ x: 320 + Math.random() * 200, y: 350 + Math.random() * 200, class: 'A' });
    
    // Class B (Pink) mostly right
    for (let i = 0; i < 40; i++) pts.push({ x: 320 + Math.random() * 230, y: 50 + Math.random() * 500, class: 'B' });
    // Class B outliers on left
    for (let i = 0; i < 5; i++) pts.push({ x: 100 + Math.random() * 150, y: 50 + Math.random() * 200, class: 'B' });
    return pts;
  }, []);

  const splits = [
    { axis: 'x', value: 300, minX: 0, maxX: 600, minY: 0, maxY: 600 },
    { axis: 'y', value: 280, minX: 0, maxX: 300, minY: 0, maxY: 600 },
    { axis: 'y', value: 320, minX: 300, maxX: 600, minY: 0, maxY: 600 }
  ];

  const currentSplits = splits.slice(0, step);

  // Math helper
  const calculateImpurity = (pts) => {
    const total = pts.length;
    if (total === 0) return { entropy: 0, gini: 0, pA: 0, pB: 0 };
    const countA = pts.filter(p => p.class === 'A').length;
    const countB = total - countA;
    const pA = countA / total;
    const pB = countB / total;

    const entropy = (pA === 0 ? 0 : -pA * Math.log2(pA)) + (pB === 0 ? 0 : -pB * Math.log2(pB));
    const gini = 1 - (pA * pA + pB * pB);
    return { entropy, gini, pA, pB, countA, countB, total };
  };

  const parentImpurity = calculateImpurity(dataPoints);

  // Compute regions based on current splits
  const regions = useMemo(() => {
    let currentRegions = [{ id: 'root', minX: 0, maxX: 600, minY: 0, maxY: 600, pts: dataPoints }];
    
    for (let i = 0; i < step; i++) {
      const split = splits[i];
      const nextRegions = [];
      
      currentRegions.forEach(reg => {
        // Check if this region intersects the split
        if (split.axis === 'x' && split.value > reg.minX && split.value < reg.maxX) {
          const leftPts = reg.pts.filter(p => p.x <= split.value);
          const rightPts = reg.pts.filter(p => p.x > split.value);
          nextRegions.push({ ...reg, id: reg.id + 'L', maxX: split.value, pts: leftPts });
          nextRegions.push({ ...reg, id: reg.id + 'R', minX: split.value, pts: rightPts });
        } else if (split.axis === 'y' && split.value > reg.minY && split.value < reg.maxY) {
          const topPts = reg.pts.filter(p => p.y <= split.value);
          const bottomPts = reg.pts.filter(p => p.y > split.value);
          nextRegions.push({ ...reg, id: reg.id + 'T', maxY: split.value, pts: topPts });
          nextRegions.push({ ...reg, id: reg.id + 'B', minY: split.value, pts: bottomPts });
        } else {
          nextRegions.push(reg);
        }
      });
      currentRegions = nextRegions;
    }
    return currentRegions;
  }, [step, dataPoints]);

  // Calculate Weighted Impurity of children
  let weightedEntropy = 0;
  let weightedGini = 0;
  regions.forEach(r => {
    const imp = calculateImpurity(r.pts);
    const weight = r.pts.length / dataPoints.length;
    weightedEntropy += weight * imp.entropy;
    weightedGini += weight * imp.gini;
  });

  const igEntropy = parentImpurity.entropy - weightedEntropy;
  const igGini = parentImpurity.gini - weightedGini;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'linear-gradient(160deg, rgba(15,23,42,0.98), rgba(9,14,30,0.98))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem', color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.6' }}>
      
      <div style={cardStyle}>
        {sectionTitle("1. The Intuition (Categorical Data)", "🧠")}
        <p style={{ marginBottom: '1rem' }}>
          A powerful feature of Decision Trees is that they work natively on both <strong style={{color:'#a855f7'}}>Categorical data</strong> and <strong style={{color:'#38bdf8'}}>Numerical data</strong>! At its core, a Decision Tree is just a flowchart of questions. For categorical data, it simply acts as a nested <code style={{color:'#a855f7'}}>if-else</code> structure to make predictions.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Table */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            <h5 style={{ color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Dataset</h5>
            <table style={{ width: '100%', fontSize: '0.8rem', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.5rem' }}>Gender</th>
                  <th style={{ padding: '0.5rem' }}>Occupation</th>
                  <th style={{ padding: '0.5rem', color: '#fbbf24' }}>Suggestion</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '0.5rem' }}>F</td><td style={{ padding: '0.5rem' }}>Student</td><td style={{ padding: '0.5rem', color: '#fbbf24' }}>PUBG</td></tr>
                <tr><td style={{ padding: '0.5rem' }}>F</td><td style={{ padding: '0.5rem' }}>Programmer</td><td style={{ padding: '0.5rem', color: '#fbbf24' }}>Github</td></tr>
                <tr><td style={{ padding: '0.5rem' }}>M</td><td style={{ padding: '0.5rem' }}>Programmer</td><td style={{ padding: '0.5rem', color: '#fbbf24' }}>Whatsapp</td></tr>
                <tr><td style={{ padding: '0.5rem' }}>M</td><td style={{ padding: '0.5rem' }}>Student</td><td style={{ padding: '0.5rem', color: '#fbbf24' }}>PUBG</td></tr>
              </tbody>
            </table>
          </div>

          {/* Logic & Tree */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h5 style={{ color: '#cbd5e1', fontSize: '0.8rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Code Equivalent</h5>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.75rem', color: '#a5b4fc', lineHeight: '1.4' }}>
                <span style={{ color: '#cbd5e1' }}>if</span> occupation == <span style={{ color: '#fca5a5' }}>student</span>:<br/>
                &nbsp;&nbsp;print(<span style={{ color: '#38bdf8' }}>PUBG</span>)<br/>
                <span style={{ color: '#cbd5e1' }}>else</span>:<br/>
                &nbsp;&nbsp;<span style={{ color: '#cbd5e1' }}>if</span> gender == <span style={{ color: '#fca5a5' }}>female</span>:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: '#38bdf8' }}>Github</span>)<br/>
                &nbsp;&nbsp;<span style={{ color: '#cbd5e1' }}>else</span>:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;print(<span style={{ color: '#38bdf8' }}>Whatsapp</span>)
              </pre>
            </div>
          </div>
        </div>

        {/* Tree Diagram SVG */}
        <div style={{ background: '#080c1c', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 400 220" style={{ width: '100%', maxWidth: '400px', height: 'auto' }}>
            {/* Lines */}
            <line x1="200" y1="40" x2="100" y2="120" stroke="#475569" strokeWidth="2" />
            <line x1="200" y1="40" x2="300" y2="120" stroke="#475569" strokeWidth="2" />
            <line x1="300" y1="140" x2="240" y2="200" stroke="#475569" strokeWidth="2" />
            <line x1="300" y1="140" x2="360" y2="200" stroke="#475569" strokeWidth="2" />

            {/* Labels */}
            <text x="135" y="70" fill="#94a3b8" fontSize="10">Yes</text>
            <text x="265" y="70" fill="#94a3b8" fontSize="10">No</text>
            <text x="255" y="165" fill="#94a3b8" fontSize="10">Yes</text>
            <text x="345" y="165" fill="#94a3b8" fontSize="10">No</text>

            {/* Nodes */}
            <ellipse cx="200" cy="30" rx="70" ry="20" fill="rgba(255,255,255,0.9)" stroke="#cbd5e1" />
            <text x="200" y="34" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Is occupation student?</text>

            <ellipse cx="300" cy="130" rx="60" ry="20" fill="rgba(255,255,255,0.9)" stroke="#cbd5e1" />
            <text x="300" y="134" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Is gender female?</text>

            {/* Leaves */}
            <rect x="70" y="115" width="60" height="20" rx="4" fill="#38bdf8" />
            <text x="100" y="129" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">PUBG</text>

            <rect x="210" y="195" width="60" height="20" rx="4" fill="#38bdf8" />
            <text x="240" y="209" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Github</text>

            <rect x="330" y="195" width="60" height="20" rx="4" fill="#38bdf8" />
            <text x="360" y="209" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Whatsapp</text>
          </svg>
        </div>
      </div>

      <div style={cardStyle}>
        {sectionTitle("2. Handling Complex Queries (Play Tennis Dataset)", "🎾")}
        <p style={{ marginBottom: '1rem' }}>
          When given a new input query, the algorithm simply traces down the tree to find the prediction. Let's look at the famous "Play Tennis" dataset where we predict if we should play tennis based on the weather.
        </p>
        
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 'bold' }}>Input Query Point:</span><br/>
            <code style={{ fontSize: '0.9rem', color: '#fca5a5' }}>[Outlook=Rainy, Temp=Mild, Humidity=High, Wind=Strong]</code>
          </div>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            Result: <strong>Play = No</strong>
          </div>
        </div>

        <div style={{ background: '#080c1c', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 500 250" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
            {/* Lines */}
            <line x1="250" y1="30" x2="100" y2="80" stroke="#475569" strokeWidth="2" />
            <line x1="250" y1="30" x2="250" y2="80" stroke="#475569" strokeWidth="2" />
            <line x1="250" y1="30" x2="400" y2="80" stroke="#ec4899" strokeWidth="3" /> {/* Highlighted Path */}
            
            <line x1="100" y1="100" x2="50" y2="150" stroke="#475569" strokeWidth="2" />
            <line x1="100" y1="100" x2="150" y2="150" stroke="#475569" strokeWidth="2" />

            <line x1="400" y1="100" x2="350" y2="150" stroke="#ec4899" strokeWidth="3" /> {/* Highlighted Path */}
            <line x1="400" y1="100" x2="450" y2="150" stroke="#475569" strokeWidth="2" />

            {/* Labels */}
            <text x="160" y="50" fill="#94a3b8" fontSize="10">Sunny</text>
            <text x="255" y="65" fill="#94a3b8" fontSize="10">Overcast</text>
            <text x="330" y="50" fill="#ec4899" fontSize="10" fontWeight="bold">Rainy</text>
            
            <text x="70" y="120" fill="#94a3b8" fontSize="10">High</text>
            <text x="130" y="120" fill="#94a3b8" fontSize="10">Low</text>
            
            <text x="365" y="120" fill="#ec4899" fontSize="10" fontWeight="bold">High</text>
            <text x="430" y="120" fill="#94a3b8" fontSize="10">Low</text>

            {/* Nodes */}
            <rect x="210" y="10" width="80" height="25" rx="4" fill="#bfdbfe" stroke="#3b82f6" />
            <text x="250" y="27" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Outlook</text>

            <rect x="60" y="80" width="80" height="25" rx="4" fill="#bfdbfe" stroke="#3b82f6" />
            <text x="100" y="97" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Windy</text>
            
            <rect x="210" y="80" width="80" height="25" rx="4" fill="#fed7aa" stroke="#f97316" />
            <text x="250" y="97" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Play=Yes</text>

            <rect x="360" y="80" width="80" height="25" rx="4" fill="#bfdbfe" stroke="#ec4899" strokeWidth="2" />
            <text x="400" y="97" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Humidity</text>

            {/* Leaves */}
            <rect x="20" y="150" width="60" height="25" rx="4" fill="#fed7aa" stroke="#f97316" />
            <text x="50" y="167" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Play=No</text>
            <rect x="120" y="150" width="60" height="25" rx="4" fill="#fed7aa" stroke="#f97316" />
            <text x="150" y="167" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Play=Yes</text>
            
            <rect x="320" y="150" width="60" height="25" rx="4" fill="#fed7aa" stroke="#ec4899" strokeWidth="2" />
            <text x="350" y="167" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Play=No</text>
            <rect x="420" y="150" width="60" height="25" rx="4" fill="#fed7aa" stroke="#f97316" />
            <text x="450" y="167" fill="#0f172a" fontSize="11" textAnchor="middle" fontWeight="bold">Play=Yes</text>
          </svg>
        </div>
      </div>

      <div style={cardStyle}>
        {sectionTitle("3. What if we have Numerical Data?", "🔢")}
        <p style={{ marginBottom: '0.5rem' }}>
          Categorical data is easy to split (e.g., "Is it Rainy or Sunny?"). But what if we have continuous numerical data like the <strong>Iris dataset</strong> (Petal Length, Sepal Length)?
        </p>
        <p style={{ marginBottom: 0 }}>
          Decision Trees handle numerical data by finding a specific <strong style={{color:'#38bdf8'}}>threshold</strong> (e.g., "Is Petal Length &gt; 2.45?") that best splits the data. Geometrically, each split creates an <strong style={{color:'#e2e8f0'}}>axis-aligned (orthogonal) boundary</strong> in the feature space.
        </p>
      </div>

      <div style={{ ...cardStyle, background: 'rgba(56,189,248,0.04)', borderColor: 'rgba(56,189,248,0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          {sectionTitle("Interactive Split Visualizer", "✂️")}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setStep(Math.min(3, step + 1))}
              disabled={step === 3}
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: step === 3 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}
            >
              <Play size={14} /> Add Split (Depth: {step})
            </button>
            <button 
              onClick={() => setStep(0)}
              disabled={step === 0}
              style={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: step === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '350px', background: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }}>
            {/* Draw Region Backgrounds */}
            {regions.map((r, i) => {
              const imp = calculateImpurity(r.pts);
              const isCyanDom = imp.countA > imp.countB;
              const purityColor = isCyanDom ? 'rgba(34, 211, 238, 0.1)' : 'rgba(244, 114, 182, 0.1)';
              return <rect key={`bg-${i}`} x={r.minX} y={r.minY} width={r.maxX - r.minX} height={r.maxY - r.minY} fill={purityColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            })}

            {/* Draw Splits */}
            {currentSplits.map((s, i) => (
              s.axis === 'x' 
                ? <line key={`s-${i}`} x1={s.value} y1={s.minY} x2={s.value} y2={s.maxY} stroke="#fbbf24" strokeWidth="4" />
                : <line key={`s-${i}`} x1={s.minX} y1={s.value} x2={s.maxX} y2={s.value} stroke="#fbbf24" strokeWidth="4" />
            ))}

            {/* Data Points */}
            {dataPoints.map((pt, i) => (
              <circle key={`pt-${i}`} cx={pt.x} cy={pt.y} r="5" fill={pt.class === 'A' ? '#22d3ee' : '#f472b6'} opacity="0.9" stroke="#0f172a" strokeWidth="1" />
            ))}
          </svg>
        </div>

        {/* Live Math Stats */}
        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Parent Node (Base)</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>Entropy:</span> <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{parentImpurity.entropy.toFixed(3)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>Gini:</span> <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{parentImpurity.gini.toFixed(3)}</span>
            </div>
          </div>
          <div style={{ background: 'rgba(56,189,248,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.2)' }}>
            <div style={{ color: '#38bdf8', fontSize: '0.75rem', marginBottom: '0.4rem', fontWeight: 'bold', textTransform: 'uppercase' }}>After Split {step}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>Info Gain (Entropy):</span> <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}>{igEntropy.toFixed(3)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>Info Gain (Gini):</span> <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 'bold' }}>{igGini.toFixed(3)}</span>
            </div>
          </div>
        </div>

      </div>

      <div style={cardStyle}>
        {sectionTitle("Terminology", "📖")}
        <div style={{ background: '#080c1c', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', display: 'flex', justifyContent: 'center', marginBottom: '0' }}>
          <svg viewBox="0 0 500 250" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
            {/* Subtree outline */}
            <path d="M 230 110 C 350 90, 420 180, 360 240 C 250 250, 180 230, 160 170 C 150 130, 190 120, 230 110 Z" fill="rgba(245, 158, 11, 0.05)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
            <text x="400" y="155" fill="#f59e0b" fontSize="12" fontWeight="bold">Branch / Subtree</text>
            <line x1="320" y1="150" x2="390" y2="150" stroke="#f59e0b" strokeWidth="1" />

            {/* Lines */}
            <line x1="200" y1="40" x2="120" y2="100" stroke="#475569" strokeWidth="2" />
            <line x1="200" y1="40" x2="280" y2="100" stroke="#475569" strokeWidth="2" />
            
            <line x1="280" y1="120" x2="220" y2="180" stroke="#475569" strokeWidth="2" />
            <line x1="280" y1="120" x2="340" y2="180" stroke="#475569" strokeWidth="2" />

            {/* Labels */}
            <text x="140" y="60" fill="#94a3b8" fontSize="11">Yes</text>
            <text x="250" y="60" fill="#94a3b8" fontSize="11">No</text>
            <text x="235" y="145" fill="#94a3b8" fontSize="11">Yes</text>
            <text x="315" y="145" fill="#94a3b8" fontSize="11">No</text>

            {/* Nodes */}
            <ellipse cx="200" cy="30" rx="60" ry="20" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="200" y="34" fill="#0f172a" fontSize="12" textAnchor="middle" fontWeight="bold">PL &lt; 2.0</text>
            
            <text x="400" y="35" fill="#e2e8f0" fontSize="12" fontWeight="bold">Root Node</text>
            <line x1="260" y1="30" x2="390" y2="30" stroke="#94a3b8" strokeWidth="1" />

            <text x="400" y="85" fill="#e2e8f0" fontSize="12" fontWeight="bold">Splitting</text>
            <line x1="240" y1="70" x2="390" y2="80" stroke="#94a3b8" strokeWidth="1" />

            <ellipse cx="280" cy="110" rx="60" ry="20" fill="#e2e8f0" stroke="#94a3b8" />
            <text x="280" y="114" fill="#0f172a" fontSize="12" textAnchor="middle" fontWeight="bold">SL &lt; 1.5</text>

            <text x="400" y="115" fill="#e2e8f0" fontSize="12" fontWeight="bold">Decision Node</text>
            <line x1="340" y1="110" x2="390" y2="110" stroke="#94a3b8" strokeWidth="1" />

            {/* Leaves */}
            <text x="120" y="115" fill="#cbd5e1" fontSize="12" textAnchor="middle">Setosa</text>
            <text x="220" y="195" fill="#cbd5e1" fontSize="12" textAnchor="middle">Versicolor</text>
            <text x="340" y="195" fill="#cbd5e1" fontSize="12" textAnchor="middle">Virginica</text>

            <text x="400" y="195" fill="#e2e8f0" fontSize="12" fontWeight="bold">Leaf Node</text>
            <line x1="375" y1="190" x2="390" y2="190" stroke="#94a3b8" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <div style={{ ...cardStyle, background: 'rgba(234, 179, 8, 0.05)', borderColor: 'rgba(234, 179, 8, 0.2)' }}>
        <h4 style={{ color: '#facc15', fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem' }}>❓ The Unanswered Questions</h4>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#fef08a', marginBottom: '0' }}>
          <li style={{ marginBottom: '0.4rem' }}>How to decide which column should be considered as the <strong>root node</strong>?</li>
          <li style={{ marginBottom: '0.4rem' }}>How to select subsequent <strong>decision nodes</strong>?</li>
          <li>How to decide the exact <strong>splitting criteria</strong> (threshold) in case of numerical columns?</li>
        </ul>
        <p style={{ marginTop: '1rem', marginBottom: 0, color: '#e2e8f0' }}>
          <strong>The Answer:</strong> We use mathematical metrics like <strong>Entropy</strong>, <strong>Information Gain</strong>, or <strong>Gini Impurity</strong> to evaluate every possible split and choose the one that creates the purest leaves!
        </p>
      </div>


      <div style={{ ...cardStyle, marginTop: '1rem' }}>
        {sectionTitle("Deep Dive: What is Entropy?", "🧊")}
        <p style={{ marginBottom: '1rem' }}>
          In layman's terms, Entropy is the measure of <strong>disorder</strong> or <strong>impurity</strong> in a system.
        </p>
        
        {/* Ice / Water / Vapor graphic */}
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem', background: '#080c1c', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🧊</div>
            <strong style={{ color: '#bae6fd' }}>Ice</strong>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Low Entropy<br/>(Structured)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>💧</div>
            <strong style={{ color: '#bae6fd' }}>Water</strong>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Medium Entropy<br/>(Fluid)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>☁️</div>
            <strong style={{ color: '#bae6fd' }}>Vapor</strong>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>High Entropy<br/>(Disordered)</div>
          </div>
        </div>

        <p style={{ marginBottom: '1rem' }}>
          When looking at data (like a scatterplot), <strong>more knowledge (purity) means less entropy</strong>. A dataset with perfectly mixed classes (e.g., 50% Red, 50% Green) has maximum entropy. A dataset with only one class (100% Red) has zero entropy!
        </p>

        <h4 style={{ color: '#a5b4fc', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>How to Calculate Entropy</h4>
        <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '6px', color: '#a5b4fc', marginBottom: '1.5rem', border: '1px solid rgba(165, 180, 252, 0.2)' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            E(S) = -∑ Pᵢ · log₂(Pᵢ)
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
            Where <code style={{ color: '#e2e8f0' }}>Pᵢ</code> is the frequentist probability of class <em>i</em>. For a binary Yes/No dataset:<br/>
            <code style={{ color: '#e2e8f0' }}>E(D) = -P_yes · log₂(P_yes) - P_no · log₂(P_no)</code>
          </div>
        </div>

        <h4 style={{ color: '#a5b4fc', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Examples in Action</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#22c55e' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#22c55e' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
            </div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>2 Yes, 3 No (Mixed)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#a5b4fc' }}>
              H = -(2/5)log₂(2/5) - (3/5)log₂(3/5)<br/>
              <strong style={{ fontSize: '1rem' }}>H = 0.97</strong>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#22c55e' }}></div>
            </div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>1 Yes, 4 No (Purer)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#a5b4fc' }}>
              H = -(1/5)log₂(1/5) - (4/5)log₂(4/5)<br/>
              <strong style={{ fontSize: '1rem' }}>H = 0.72</strong>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '0.5rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
              <div style={{ width: '16px', height: '16px', borderRadius: '2px', background: '#ef4444' }}></div>
            </div>
            <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>0 Yes, 5 No (Pure)</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#a5b4fc' }}>
              H = -0 - (5/5)log₂(5/5)<br/>
              <strong style={{ fontSize: '1rem' }}>H = 0</strong>
            </div>
          </div>
        </div>
        <h4 style={{ color: '#a5b4fc', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: '1.5rem' }}>Observations</h4>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#e2e8f0', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          <li>The more the uncertainty, the more the entropy.</li>
          <li>For a 2-class problem, the min entropy is 0 and the max is 1.</li>
          <li>For more than 2 classes, the min entropy is 0 but the max can be greater than 1.</li>
          <li>Both <code style={{ color: '#93c5fd' }}>log₂</code> or <code style={{ color: '#93c5fd' }}>logₑ (ln)</code> can be used to calculate entropy.</li>
        </ul>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h5 style={{ color: '#93c5fd', fontSize: '0.9rem', marginBottom: '1rem' }}>Entropy vs Probability</h5>
            <svg viewBox="0 -10 100 60" style={{ width: '100%', maxWidth: '250px', overflow: 'visible' }}>
              <path d="M 0 40 Q 50 -40 100 40" fill="none" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#475569" strokeWidth="1" />
              <line x1="0" y1="40" x2="0" y2="0" stroke="#475569" strokeWidth="1" />
              <circle cx="0" cy="40" r="2" fill="#ef4444" />
              <circle cx="50" cy="0" r="2" fill="#ef4444" />
              <circle cx="100" cy="40" r="2" fill="#ef4444" />
              <text x="0" y="48" fill="#94a3b8" fontSize="6" textAnchor="middle">0.0</text>
              <text x="50" y="48" fill="#94a3b8" fontSize="6" textAnchor="middle">0.5</text>
              <text x="100" y="48" fill="#94a3b8" fontSize="6" textAnchor="middle">1.0</text>
              <text x="-8" y="20" fill="#94a3b8" fontSize="6" transform="rotate(-90 -8,20)" textAnchor="middle">Entropy</text>
              <text x="50" y="56" fill="#94a3b8" fontSize="6" textAnchor="middle">p(+)</text>
              
              {/* Mixed bubble at peak */}
              <circle cx="50" cy="8" r="7" fill="#fff" stroke="#000" strokeWidth="0.5" />
              <text x="50" y="11" fill="#000" fontSize="8" textAnchor="middle" fontWeight="bold">+-</text>

              {/* Pure bubbles at edges */}
              <circle cx="20" cy="30" r="6" fill="#fff" stroke="#000" strokeWidth="0.5" />
              <text x="20" y="32" fill="#000" fontSize="7" textAnchor="middle" fontWeight="bold">--</text>

              <circle cx="80" cy="30" r="6" fill="#fff" stroke="#000" strokeWidth="0.5" />
              <text x="80" y="32" fill="#000" fontSize="7" textAnchor="middle" fontWeight="bold">++</text>
            </svg>
          </div>

          <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid #22c55e', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h5 style={{ color: '#4ade80', fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Information Gain</h5>
            <p style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.8rem' }}>
              Information Gain measures the quality of a split by checking the <strong>decrease in entropy</strong> after splitting a dataset. Constructing a decision tree is all about finding the attribute that returns the highest information gain!
            </p>
            <div style={{ background: '#22c55e', color: '#fff', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85rem', textAlign: 'center', fontWeight: 'bold' }}>
              IG = E(Parent) - {'{Weighted Average}'} * E(Children)
            </div>
          </div>
        </div>

        <h4 style={{ color: '#a5b4fc', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Quiz: Entropy for Continuous Variables 📊</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: '#080c1c', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '4px' }}>
              <span>Area</span><span>Built in</span><span>Price</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.8rem' }}><span>1200</span><span>1999</span><span>3.5</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.8rem' }}><span>1800</span><span>2011</span><span>5.6</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.8rem' }}><span>1400</span><span>2000</span><span>7.3</span></div>
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}><strong>Dataset 1</strong></div>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '4px' }}>
              <span>Area</span><span>Built in</span><span>Price</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.8rem' }}><span>2200</span><span>1989</span><span>4.6</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.8rem' }}><span>800</span><span>2018</span><span>6.5</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '0.8rem' }}><span>1100</span><span>2005</span><span>12.8</span></div>
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}><strong>Dataset 2</strong></div>
          </div>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#fef08a' }}>Question: Which of the above datasets has higher entropy?</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px', background: '#fff', borderRadius: '4px', padding: '10px' }}>
              <svg viewBox="0 0 100 50" style={{ width: '100%' }}>
                {/* Flatter distribution */}
                <path d="M 0 40 Q 50 -10 100 40" fill="none" stroke="#0ea5e9" strokeWidth="2" />
                {/* Peaked distribution */}
                <path d="M 20 40 Q 50 -50 80 40" fill="none" stroke="#94a3b8" strokeWidth="1" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#000" strokeWidth="0.5" />
                <line x1="50" y1="45" x2="50" y2="5" stroke="#000" strokeWidth="0.5" />
              </svg>
            </div>
            <div style={{ flex: 2, minWidth: '200px' }}>
              <p style={{ margin: 0, color: '#e2e8f0' }}><strong>Answer:</strong> Whichever is <strong>less peaked</strong>! A flatter continuous distribution means the data is more spread out and uncertain (higher variance). Therefore, the flatter distribution has <strong>higher entropy</strong>.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>

        <div style={cardStyle}>
          {sectionTitle("Gini Impurity", "⚖️")}
          <p style={{ marginBottom: '0.5rem' }}>
            <strong style={{color:'#e2e8f0'}}>Gini Impurity</strong> is an alternative to Entropy. It measures the probability of incorrectly classifying a randomly chosen element if it were randomly labeled according to the distribution of classes in the node.
          </p>
          <div style={{ background: '#0f172a', padding: '0.5rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#fca5a5', marginBottom: '0.8rem', textAlign: 'center' }}>
            Gini(S) = 1 - ∑ pᵢ²
          </div>
          <p style={{ marginBottom: 0 }}>
            <strong>Entropy vs. Gini:</strong> Gini is computationally faster because it doesn't require computing logarithmic functions. Scikit-learn's <code style={{color:'#fca5a5'}}>DecisionTreeClassifier</code> uses Gini by default. In practice, they produce very similar trees.
          </p>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: '1rem' }}>
        {sectionTitle("Algorithm Pseudo Code", "📝")}
        <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', color: '#e2e8f0', marginBottom: 0, lineHeight: '1.6' }}>
          <li style={{ marginBottom: '0.5rem' }}>Begin with your training dataset, which should have some feature variables and classification or regression output.</li>
          <li style={{ marginBottom: '0.5rem' }}>Determine the <strong>"best feature"</strong> in the dataset to split the data on (as defined by Information Gain or Gini).</li>
          <li style={{ marginBottom: '0.5rem' }}>Split the data into subsets that contain the correct values for this best feature. This splitting basically defines a node on the tree, i.e., each node is a splitting point based on a certain feature from our data.</li>
          <li>Recursively generate new tree nodes by using the subset of data created from the previous step.</li>
        </ol>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '0' }}>
        <div style={{ ...cardStyle, borderColor: 'rgba(52, 211, 153, 0.2)', background: 'rgba(52, 211, 153, 0.02)' }}>
          <h4 style={{ color: '#34d399', fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', textAlign: 'center' }}>Advantages</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#a7f3d0', marginBottom: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Intuitive and easy to understand</li>
            <li style={{ marginBottom: '0.5rem' }}>Minimal data preparation is required</li>
            <li>The cost of using the tree for inference is <strong>logarithmic</strong> in the number of data points used to train the tree</li>
          </ul>
        </div>
        <div style={{ ...cardStyle, borderColor: 'rgba(248, 113, 113, 0.2)', background: 'rgba(248, 113, 113, 0.02)' }}>
          <h4 style={{ color: '#f87171', fontSize: '1rem', fontWeight: 700, marginBottom: '0.8rem', textAlign: 'center' }}>Disadvantages</h4>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#fecaca', marginBottom: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Prone to <strong>Overfitting</strong></li>
            <li>Prone to errors for imbalanced datasets</li>
          </ul>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '0' }}>
        {/* CART */}
        <div style={cardStyle}>
          {sectionTitle("CART", "📊")}
          <p style={{ marginBottom: 0 }}>
            The logic of decision trees can also be applied to regression problems (predicting continuous numerical values), hence the common name <strong>CART (Classification and Regression Trees)</strong>.
          </p>
        </div>

        {/* Conclusion */}
        <div style={{ ...cardStyle, background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
          {sectionTitle("Conclusion", "🎯")}
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Programatically speaking</strong>, Decision Trees are nothing but a giant structure of nested <code style={{color:'#38bdf8'}}>if-else</code> conditions.
          </p>
          <p style={{ marginBottom: 0 }}>
            <strong>Mathematically speaking</strong>, Decision Trees use <span style={{ color: '#f87171' }}>hyperplanes</span> which run <span style={{ color: '#4ade80' }}>parallel to any one of the axes</span> to cut your coordinate system into <span style={{ color: '#f87171' }}>hyper cuboids</span>.
          </p>
        </div>
      </div>

    </div>
  );
}
