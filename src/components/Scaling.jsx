import React, { useState, useMemo } from 'react';
import { Check, Copy, AlertCircle, ChevronDown, ChevronRight, BookOpen, Target, Cpu } from 'lucide-react';
import { getMean, getStdDev, getMedian, getPercentile, scalers } from '../utils/scalers';

const SAMPLE_DATA = [10, 20, 30, 40, 50];
const SAMPLE_WITH_OUTLIER = [10, 20, 30, 40, 500];

const SCALER_CONFIG = {
  standard: {
    name: 'StandardScaler',
    label: 'Z-Score Standardization',
    color: '#6366f1',
    glowColor: 'rgba(99,102,241,0.25)',
    badge: 'badge-indigo',
    usedFor: ['KNN', 'K-Means', 'SVM', 'PCA', 'Neural Networks', 'Logistic Regression'],
    avoidWhen: 'Dataset has extreme outliers',
    range: 'No fixed range (typically -3 to +3)',
    whenToUse: 'Normal distribution, no severe outliers. **Default choice for 90% of cases.**',
    pros: ['Handles negative values', 'Works with gradient descent', 'No bounded range constraint'],
    cons: ['Distorted by outliers', 'Resulting range is not fixed'],
    formulaDesc: 'Subtract mean, divide by standard deviation',
    formulaVars: [
      { sym: 'X', desc: 'Original value' },
      { sym: 'μ', desc: 'Mean (average) of all values' },
      { sym: 'σ', desc: 'Standard deviation (spread)' },
      { sym: 'Z', desc: 'Standardized value (Z-score)' },
    ],
    code: `from sklearn.preprocessing import StandardScaler\n\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\n# After scaling: mean ≈ 0, std = 1`,
    workedDataset: [10, 20, 30, 40, 50],
  },
  minmax: {
    name: 'MinMaxScaler',
    label: 'Min-Max Normalization',
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.25)',
    badge: 'badge-cyan',
    usedFor: ['Neural Networks', 'Image Pixel Normalization', 'Gradient Descent', 'RNN / LSTM'],
    avoidWhen: 'Dataset has outliers (they squash all other values)',
    range: 'Exactly 0 to 1',
    whenToUse: 'Need bounded [0,1] range; data has no outliers',
    pros: ['Bounded output [0,1]', 'Preserves data distribution shape'],
    cons: ['Highly sensitive to outliers', 'Outliers compress all other points'],
    formulaDesc: 'Subtract minimum, divide by range (max − min)',
    formulaVars: [
      { sym: "X'", desc: 'Scaled value' },
      { sym: 'X', desc: 'Original value' },
      { sym: 'X_min', desc: 'Minimum value in dataset' },
      { sym: 'X_max', desc: 'Maximum value in dataset' },
    ],
    code: `from sklearn.preprocessing import MinMaxScaler\n\nscaler = MinMaxScaler()\nX_scaled = scaler.fit_transform(X)\n\n# After scaling: all values in [0, 1]`,
    workedDataset: [10, 20, 30, 40, 50],
  },
  robust: {
    name: 'RobustScaler',
    label: 'Robust Scaling (IQR)',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.25)',
    badge: 'badge-amber',
    usedFor: ['Regression with outliers', 'Any algorithm when data has heavy-tailed distribution'],
    avoidWhen: 'No outliers present (StandardScaler works better)',
    range: 'No fixed range (arbitrary, centered around 0)',
    whenToUse: 'Data has **extreme outliers** — most robust to distortion',
    pros: ['Resistant to outliers', 'Uses median (not mean)', 'Uses IQR (not std)'],
    cons: ['No fixed output range', 'Less intuitive than MinMax'],
    formulaDesc: 'Subtract median, divide by Interquartile Range (IQR = Q3 − Q1)',
    formulaVars: [
      { sym: "X'", desc: 'Scaled value' },
      { sym: 'X', desc: 'Original value' },
      { sym: 'Median', desc: 'Middle value (not affected by outliers)' },
      { sym: 'IQR', desc: 'Q3 − Q1 (Interquartile Range)' },
    ],
    code: `from sklearn.preprocessing import RobustScaler\n\nscaler = RobustScaler()\nX_scaled = scaler.fit_transform(X)\n\n# Uses median & IQR — outlier resistant!`,
    workedDataset: [10, 20, 30, 40, 500],
  },
  maxabs: {
    name: 'MaxAbsScaler',
    label: 'Absolute Maximum Scaling',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.25)',
    badge: 'badge-purple',
    usedFor: ['TF-IDF text features', 'Sparse matrices', 'Already centered data'],
    avoidWhen: 'Data is not already centered around 0',
    range: '-1 to 1 (zero remains zero)',
    whenToUse: 'Sparse data (like TF-IDF). Preserves zero entries.',
    pros: ['Preserves sparsity (zeros stay zeros)', 'Scales to [-1, 1]'],
    cons: ['Not centered — does not subtract mean', 'Sensitive to outliers'],
    formulaDesc: 'Divide by maximum absolute value in dataset',
    formulaVars: [
      { sym: "X'", desc: 'Scaled value' },
      { sym: 'X', desc: 'Original value' },
      { sym: '|X_max|', desc: 'Maximum absolute value in dataset' },
    ],
    code: `from sklearn.preprocessing import MaxAbsScaler\n\nscaler = MaxAbsScaler()\nX_scaled = scaler.fit_transform(X)\n\n# Scales to [-1, 1], preserves zero entries`,
    workedDataset: [10, 20, 30, 40, 50],
  },
  normalizer: {
    name: 'Normalizer',
    label: 'L2 Normalization (Row-wise)',
    color: '#ec4899',
    glowColor: 'rgba(236,72,153,0.25)',
    badge: 'badge-pink',
    usedFor: ['Cosine Similarity', 'Text clustering', 'Recommendation Systems'],
    avoidWhen: 'You need column-wise scaling (use the others above)',
    range: 'Unit norm (L2 norm = 1 per row)',
    whenToUse: 'Row-wise scaling for similarity-based models',
    pros: ['Makes each row a unit vector', 'Ideal for cosine similarity'],
    cons: ['Scales rows, not columns', 'May not improve distance-based models'],
    formulaDesc: 'Divide each feature value by the L2 norm of the sample row',
    formulaVars: [
      { sym: "x'", desc: 'Scaled value' },
      { sym: 'x', desc: 'Original value' },
      { sym: '‖x‖', desc: 'L2 norm = √(x₁² + x₂² + ... + xₙ²)' },
    ],
    code: `from sklearn.preprocessing import Normalizer\n\nscaler = Normalizer(norm='l2')\nX_scaled = scaler.fit_transform(X)\n\n# Each row becomes a unit-length vector`,
    workedDataset: [3, 4, 0],
  },
};

function computeWorkedExample(scalerKey) {
  const cfg = SCALER_CONFIG[scalerKey];
  const data = cfg.workedDataset;
  const n = data.length;

  if (scalerKey === 'standard') {
    const mean = getMean(data);
    const std = getStdDev(data, mean);
    const scaled = scalers.standard(data);
    return { data, mean, std, scaled, steps: [
      { label: 'Step 1: Calculate Mean (μ)', math: `(${data.join(' + ')}) / ${n} = ${mean.toFixed(2)}` },
      { label: 'Step 2: Calculate Std Dev (σ)', math: `√[ Σ(xᵢ - μ)² / n ] = ${std.toFixed(2)}` },
      { label: 'Step 3: Apply Formula Z = (X - μ) / σ', math: data.map((x, i) => `Z${i+1} = (${x} - ${mean.toFixed(2)}) / ${std.toFixed(2)} = ${scaled[i].toFixed(2)}`).join('\n') },
    ]};
  }
  if (scalerKey === 'minmax') {
    const min = Math.min(...data); const max = Math.max(...data);
    const scaled = scalers.minmax(data);
    return { data, min, max, scaled, steps: [
      { label: 'Step 1: Find Min & Max', math: `Min = ${min}, Max = ${max}` },
      { label: "Step 2: Apply Formula X' = (X - Min) / (Max - Min)", math: data.map((x, i) => `X'${i+1} = (${x} - ${min}) / (${max} - ${min}) = ${scaled[i].toFixed(3)}`).join('\n') },
    ]};
  }
  if (scalerKey === 'robust') {
    const median = getMedian(data);
    const q1 = getPercentile(data, 25);
    const q3 = getPercentile(data, 75);
    const iqr = q3 - q1;
    const scaled = scalers.robust(data);
    return { data, median, q1, q3, iqr, scaled, steps: [
      { label: 'Step 1: Find Median', math: `Median = ${median}` },
      { label: 'Step 2: Calculate IQR = Q3 - Q1', math: `Q1 = ${q1.toFixed(1)}, Q3 = ${q3.toFixed(1)}, IQR = ${iqr.toFixed(1)}` },
      { label: "Step 3: Apply Formula X' = (X - Median) / IQR", math: data.map((x, i) => `X'${i+1} = (${x} - ${median}) / ${iqr.toFixed(1)} = ${scaled[i].toFixed(3)}`).join('\n') },
    ]};
  }
  if (scalerKey === 'maxabs') {
    const maxabs = Math.max(...data.map(x => Math.abs(x)));
    const scaled = scalers.maxabs(data);
    return { data, maxabs, scaled, steps: [
      { label: 'Step 1: Find Maximum Absolute Value', math: `|X_max| = max(${data.map(x => `|${x}|`).join(', ')}) = ${maxabs}` },
      { label: "Step 2: Apply Formula X' = X / |X_max|", math: data.map((x, i) => `X'${i+1} = ${x} / ${maxabs} = ${scaled[i].toFixed(3)}`).join('\n') },
    ]};
  }
  if (scalerKey === 'normalizer') {
    const mag = Math.sqrt(data.reduce((s, v) => s + v*v, 0));
    const scaled = scalers.normalizer(data);
    return { data, mag, scaled, steps: [
      { label: 'Step 1: Compute L2 Norm ‖x‖', math: `‖x‖ = √(${data.map(v => `${v}²`).join(' + ')}) = √${data.reduce((s,v) => s+v*v, 0)} = ${mag.toFixed(3)}` },
      { label: "Step 2: Apply Formula x' = x / ‖x‖", math: data.map((x, i) => `x'${i+1} = ${x} / ${mag.toFixed(3)} = ${scaled[i].toFixed(3)}`).join('\n') },
    ]};
  }
  return null;
}

export default function Scaling() {
  const [activeTab, setActiveTab] = useState('scalers');
  const [activeScaler, setActiveScaler] = useState('standard');
  const [hasOutlier, setHasOutlier] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedAlgo, setExpandedAlgo] = useState('knn');

  const [val1, setVal1] = useState(10);
  const [val2, setVal2] = useState(25);
  const [val3, setVal3] = useState(50);
  const [calcScaler, setCalcScaler] = useState('standard');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const comparisonData = useMemo(() => {
    const raw = hasOutlier ? SAMPLE_WITH_OUTLIER : SAMPLE_DATA;
    return {
      raw,
      standard: scalers.standard(raw),
      minmax: scalers.minmax(raw),
      robust: scalers.robust(raw),
      maxabs: scalers.maxabs(raw),
      normalizer: scalers.normalizer(raw),
    };
  }, [hasOutlier]);

  const liveCalc = useMemo(() => {
    const raw = [val1, val2, val3];
    const mean = getMean(raw);
    const std = getStdDev(raw, mean);
    const median = getMedian(raw);
    const q1 = getPercentile(raw, 25);
    const q3 = getPercentile(raw, 75);
    const iqr = q3 - q1;
    const min = Math.min(...raw);
    const max = Math.max(...raw);
    const maxabs = Math.max(...raw.map(x => Math.abs(x)));
    const mag = Math.sqrt(raw.reduce((s, v) => s + v * v, 0));

    let scaled = [];
    if (calcScaler === 'standard') scaled = std === 0 ? [0,0,0] : raw.map(x => (x - mean) / std);
    else if (calcScaler === 'minmax') scaled = max === min ? [0,0,0] : raw.map(x => (x - min) / (max - min));
    else if (calcScaler === 'robust') scaled = iqr === 0 ? [0,0,0] : raw.map(x => (x - median) / iqr);
    else if (calcScaler === 'maxabs') scaled = maxabs === 0 ? [0,0,0] : raw.map(x => x / maxabs);
    else if (calcScaler === 'normalizer') scaled = mag === 0 ? [0,0,0] : raw.map(x => x / mag);

    return { raw, mean, std, median, iqr, min, max, maxabs, mag, scaled };
  }, [val1, val2, val3, calcScaler]);

  const workedEx = useMemo(() => computeWorkedExample(activeScaler), [activeScaler]);
  const cfg = SCALER_CONFIG[activeScaler];

  const algoData = {
    knn: { name: 'KNN', req: 'yes', rec: 'StandardScaler', why: 'KNN uses Euclidean distance. Salary (range 75,000) totally drowns out Age (range 10). Scaling gives each feature equal weight in distance calculations.' },
    kmeans: { name: 'K-Means', req: 'yes', rec: 'StandardScaler', why: 'K-Means assigns points to nearest centroid using distance. Without scaling, clusters form along the high-magnitude feature axis only.' },
    svm: { name: 'SVM', req: 'yes', rec: 'StandardScaler', why: 'SVM finds the maximum-margin hyperplane. Unscaled features shift this hyperplane toward the feature with the largest range.' },
    pca: { name: 'PCA', req: 'yes', rec: 'StandardScaler', why: 'PCA finds directions of maximum variance. Without scaling, features with large ranges dominate the principal components completely.' },
    lr: { name: 'Linear Regression', req: 'optional', rec: 'StandardScaler', why: "Doesn't affect accuracy in closed-form solutions, but scaling speeds up gradient descent and makes coefficients interpretable." },
    logistic: { name: 'Logistic Regression', req: 'yes', rec: 'StandardScaler', why: 'Regularization (L1/L2) penalizes coefficients equally. Unscaled features cause unequal penalization.' },
    nn: { name: 'Neural Network', req: 'yes', rec: 'StandardScaler or MinMaxScaler', why: 'Activation functions (sigmoid, tanh) saturate with large inputs. Scaling prevents vanishing/exploding gradients.' },
    dt: { name: 'Decision Tree / Random Forest / XGBoost', req: 'no', rec: 'Not Required', why: 'Tree algorithms use feature thresholds, not distances. They are completely scale-invariant.' },
    dbscan: { name: 'DBSCAN', req: 'yes', rec: 'StandardScaler', why: "DBSCAN uses epsilon-radius for density. If features have different scales, the search 'circle' becomes an elongated ellipse." },
  };

  const tabs = [
    { id: 'scalers', label: '1. All Scalers' },
    { id: 'compare', label: '2. Compare' },
    { id: 'calculator', label: '3. Calculator' },
    { id: 'algorithms', label: '4. When to Scale?' },
  ];

  return (
    <div className="tab-layout-container">
      <div className="sub-nav-links">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`sub-nav-link ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="sub-tab-content" style={{ marginTop: '1.5rem' }}>
        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: ALL SCALERS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'scalers' && (
          <div className="tab-content fade-in">
            <div className="scaler-tabs-row">
              {Object.entries(SCALER_CONFIG).map(([key, sc]) => (
                <button
                  key={key}
                  className={`scaler-tab-btn ${activeScaler === key ? 'active' : ''}`}
                  style={{ '--scaler-color': sc.color }}
                  onClick={() => setActiveScaler(key)}
                >
                  {sc.name}
                </button>
              ))}
            </div>

            <div className="scaler-detail-layout">
              <div className="scaler-detail-left">
                <div className="scaler-header-row">
                  <div className="scaler-dot" style={{ background: cfg.color, boxShadow: `0 0 12px ${cfg.color}` }}></div>
                  <div>
                    <h2 className="scaler-name">{cfg.name}</h2>
                    <div className="scaler-label">{cfg.label}</div>
                  </div>
                </div>

                <div className="formula-box" style={{ borderColor: cfg.color, boxShadow: `0 0 20px ${cfg.glowColor}` }}>
                  <div className="formula-box-title" style={{ color: cfg.color }}>Formula</div>
                  {activeScaler === 'standard' && (
                    <div className="formula-visual">
                      <span className="fv-left">Z =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X − μ</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">σ</div>
                      </div>
                    </div>
                  )}
                  {activeScaler === 'minmax' && (
                    <div className="formula-visual">
                      <span className="fv-left">X' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X − X<sub>min</sub></div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">X<sub>max</sub> − X<sub>min</sub></div>
                      </div>
                    </div>
                  )}
                  {activeScaler === 'robust' && (
                    <div className="formula-visual">
                      <span className="fv-left">X' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X − Median</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">IQR</div>
                      </div>
                    </div>
                  )}
                  {activeScaler === 'maxabs' && (
                    <div className="formula-visual">
                      <span className="fv-left">X' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">|X<sub>max</sub>|</div>
                      </div>
                    </div>
                  )}
                  {activeScaler === 'normalizer' && (
                    <div className="formula-visual">
                      <span className="fv-left">x' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">x</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">‖x‖</div>
                      </div>
                    </div>
                  )}
                  <div className="formula-desc">{cfg.formulaDesc}</div>

                  <div className="formula-vars">
                    {cfg.formulaVars.map((v, i) => (
                      <div key={i} className="formula-var-row">
                        <code className="var-sym" style={{ color: cfg.color }}>{v.sym}</code>
                        <span className="var-desc">= {v.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="worked-section">
                  <h4 className="worked-title">
                    <BookOpen size={14} style={{ color: cfg.color }} />
                    Worked Example
                  </h4>
                  <div className="worked-dataset">
                    <span className="worked-dataset-label">Dataset:</span>
                    <code>[{workedEx.data.join(', ')}]</code>
                  </div>

                  {workedEx.steps.map((step, i) => (
                    <div key={i} className="step-block">
                      <div className="step-label" style={{ color: cfg.color }}>{step.label}</div>
                      <pre className="step-math-block">{step.math}</pre>
                    </div>
                  ))}

                  <div className="worked-result-row">
                    <span>Scaled result:</span>
                    <span className="worked-result-values" style={{ color: cfg.color }}>
                      [{workedEx.scaled.map(v => v.toFixed(3)).join(', ')}]
                    </span>
                  </div>
                </div>

                <div className="pros-cons-row">
                  <div className="pros-block">
                    <div className="pros-title text-emerald">✅ Pros</div>
                    <ul>{cfg.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  </div>
                  <div className="cons-block">
                    <div className="cons-title text-rose">⚠️ Cons</div>
                    <ul>{cfg.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
                  </div>
                </div>
              </div>

              <div className="scaler-detail-right">
                <div className="usage-card" style={{ borderColor: cfg.color }}>
                  <div className="usage-title" style={{ color: cfg.color }}>
                    <Target size={14} /> When to Use
                  </div>
                  <p className="usage-text">{cfg.whenToUse}</p>

                  <div className="usage-row">
                    <div className="usage-section">
                      <div className="usage-section-title text-emerald">✅ Use with:</div>
                      {cfg.usedFor.map((u, i) => <div key={i} className="algo-chip">{u}</div>)}
                    </div>
                  </div>

                  <div className="usage-avoid">
                    <span className="text-rose">⚠️ Avoid when: </span>{cfg.avoidWhen}
                  </div>

                  <div className="range-badge">
                    <span>Output range: </span>
                    <strong style={{ color: cfg.color }}>{cfg.range}</strong>
                  </div>
                </div>

                <div className="code-snippet-box">
                  <div className="code-header">
                    <span>Python (scikit-learn)</span>
                    <button
                      className={`btn btn-copy ${copied ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(cfg.code)}
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="pre-code"><code>{cfg.code}</code></pre>
                </div>

                <div className="bar-compare-section">
                  <div className="bar-compare-title">Visual: Before vs After Scaling</div>
                  <div className="bar-row-label">
                    <span>Original: [{workedEx.data.join(', ')}]</span>
                  </div>
                  <div className="bar-group">
                    {workedEx.data.map((v, i) => {
                      const pct = ((v - Math.min(...workedEx.data)) / (Math.max(...workedEx.data) - Math.min(...workedEx.data))) * 100;
                      return (
                        <div key={i} className="bar-item">
                          <div className="bar-val-label">{v}</div>
                          <div className="bar-track">
                            <div className="bar-fill raw-bar" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bar-row-label">
                    <span>Scaled: [{workedEx.scaled.map(v => v.toFixed(2)).join(', ')}]</span>
                  </div>
                  <div className="bar-group">
                    {workedEx.scaled.map((v, i) => {
                      const minS = Math.min(...workedEx.scaled);
                      const maxS = Math.max(...workedEx.scaled);
                      const pct = maxS === minS ? 50 : ((v - minS) / (maxS - minS)) * 100;
                      return (
                        <div key={i} className="bar-item">
                          <div className="bar-val-label" style={{ color: cfg.color }}>{v.toFixed(2)}</div>
                          <div className="bar-track">
                            <div className="bar-fill scaled-bar" style={{ width: `${pct}%`, background: cfg.color }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: COMPARE
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'compare' && (
          <div className="tab-content fade-in">
            <div className="section-header-row">
              <h2 className="section-title-main">All Scalers Side-by-Side</h2>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={hasOutlier}
                  onChange={e => setHasOutlier(e.target.checked)}
                />
                <span className="slider-round"></span>
                <span className="toggle-lbl">Add Outlier (500)</span>
              </label>
            </div>

            <div className="card-note alert-indigo" style={{ marginBottom: '1.5rem' }}>
              <strong>Dataset:</strong> <code>[{comparisonData.raw.join(', ')}]</code>
              {hasOutlier && <span className="text-rose"> ← 500 is an extreme outlier!</span>}
            </div>

            <div className="table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Original</th>
                    {Object.entries(SCALER_CONFIG).map(([key, sc]) => (
                      <th key={key} style={{ color: sc.color }}>{sc.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.raw.map((v, idx) => (
                    <tr key={idx} className={v === 500 ? 'outlier-row' : ''}>
                      <td><strong>{v}</strong>{v === 500 && <span className="outlier-chip">outlier</span>}</td>
                      <td>{comparisonData.standard[idx].toFixed(3)}</td>
                      <td>{comparisonData.minmax[idx].toFixed(3)}</td>
                      <td>{comparisonData.robust[idx].toFixed(3)}</td>
                      <td>{comparisonData.maxabs[idx].toFixed(3)}</td>
                      <td>{comparisonData.normalizer[idx].toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hasOutlier && (
              <div className="outlier-analysis">
                <h4 className="section-title-sub">Outlier Impact Analysis</h4>
                <div className="analysis-grid">
                  {[
                    { key: 'standard', impact: 'High', note: 'Mean and std shift significantly; all values get distorted' },
                    { key: 'minmax', impact: 'Severe', note: 'Outlier becomes 1.0; all normal values collapse to near 0.00–0.06' },
                    { key: 'robust', impact: 'Low ✅', note: 'Uses median & IQR instead of mean & std; normal values stay spread' },
                    { key: 'maxabs', impact: 'High', note: 'Outlier becomes the reference (1.0); normal values crushed near 0' },
                    { key: 'normalizer', impact: 'High', note: 'Outlier dominates the L2 norm; all other values approach ~0' },
                  ].map(({ key, impact, note }) => {
                    const sc = SCALER_CONFIG[key];
                    const isGood = impact.includes('Low');
                    return (
                      <div key={key} className={`analysis-card ${isGood ? 'analysis-good' : 'analysis-bad'}`} style={{ borderLeft: `3px solid ${sc.color}` }}>
                        <div className="analysis-name" style={{ color: sc.color }}>{sc.name}</div>
                        <div className={`analysis-impact ${isGood ? 'text-emerald' : 'text-rose'}`}>
                          Impact: {impact}
                        </div>
                        <div className="analysis-note">{note}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: CALCULATOR
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'calculator' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Interactive Scaling Calculator</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '1.5rem' }}>
              Enter 3 values and select a scaler. Watch the formulas update in real time.
            </p>

            <div className="calc-layout">
              <div className="calc-left">
                <div className="calc-section">
                  <label className="calc-label">Choose Scaler:</label>
                  <div className="calc-scaler-grid">
                    {Object.entries(SCALER_CONFIG).map(([key, sc]) => (
                      <button
                        key={key}
                        className={`calc-scaler-btn ${calcScaler === key ? 'active' : ''}`}
                        style={{ '--sc-color': sc.color }}
                        onClick={() => setCalcScaler(key)}
                      >
                        {sc.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="calc-section">
                  <label className="calc-label">Input Values:</label>
                  {[
                    { label: 'X₁', val: val1, set: setVal1 },
                    { label: 'X₂', val: val2, set: setVal2 },
                    { label: 'X₃', val: val3, set: setVal3 },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="slider-group">
                      <div className="slider-top-row">
                        <span className="slider-lbl">{label}</span>
                        <input
                          type="number"
                          value={val}
                          onChange={e => set(parseInt(e.target.value) || 0)}
                          className="num-input"
                          min="-100" max="1000"
                        />
                      </div>
                      <input
                        type="range" min="-100" max="500" value={val}
                        onChange={e => set(parseInt(e.target.value))}
                        className="slider-input slider-feature-a"
                      />
                    </div>
                  ))}
                </div>

                <div className="calc-section">
                  <label className="calc-label">Computed Statistics:</label>
                  <div className="stats-grid">
                    <div className="stat-item"><span>Mean (μ)</span><strong>{liveCalc.mean.toFixed(3)}</strong></div>
                    <div className="stat-item"><span>Std Dev (σ)</span><strong>{liveCalc.std.toFixed(3)}</strong></div>
                    <div className="stat-item"><span>Median</span><strong>{liveCalc.median.toFixed(3)}</strong></div>
                    <div className="stat-item"><span>IQR</span><strong>{liveCalc.iqr.toFixed(3)}</strong></div>
                    <div className="stat-item"><span>Min</span><strong>{liveCalc.min}</strong></div>
                    <div className="stat-item"><span>Max</span><strong>{liveCalc.max}</strong></div>
                    <div className="stat-item"><span>|Max|</span><strong>{liveCalc.maxabs}</strong></div>
                    <div className="stat-item"><span>L2 Norm</span><strong>{liveCalc.mag.toFixed(3)}</strong></div>
                  </div>
                </div>
              </div>

              <div className="calc-right">
                <div className="live-formula-box" style={{ borderColor: SCALER_CONFIG[calcScaler].color }}>
                  <div className="live-formula-title" style={{ color: SCALER_CONFIG[calcScaler].color }}>
                    {SCALER_CONFIG[calcScaler].name} — Live Calculation
                  </div>

                  <div className="formula-visual" style={{ marginBottom: '1rem' }}>
                    {calcScaler === 'standard' && <>
                      <span className="fv-left">Z =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X − {liveCalc.mean.toFixed(2)}</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">{liveCalc.std.toFixed(2)}</div>
                      </div>
                    </>}
                    {calcScaler === 'minmax' && <>
                      <span className="fv-left">X' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X − {liveCalc.min}</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">{liveCalc.max} − {liveCalc.min}</div>
                      </div>
                    </>}
                    {calcScaler === 'robust' && <>
                      <span className="fv-left">X' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X − {liveCalc.median.toFixed(2)}</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">{liveCalc.iqr.toFixed(2)} (IQR)</div>
                      </div>
                    </>}
                    {calcScaler === 'maxabs' && <>
                      <span className="fv-left">X' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">X</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">{liveCalc.maxabs} (|max|)</div>
                      </div>
                    </>}
                    {calcScaler === 'normalizer' && <>
                      <span className="fv-left">x' =</span>
                      <div className="fraction-block">
                        <div className="frac-top">x</div>
                        <div className="frac-line"></div>
                        <div className="frac-bot">{liveCalc.mag.toFixed(3)} (‖x‖)</div>
                      </div>
                    </>}
                  </div>

                  <div className="live-rows">
                    {liveCalc.raw.map((x, i) => (
                      <div key={i} className="live-row">
                        <span className="live-x">X{i+1} = {x}</span>
                        <span className="live-arrow">→</span>
                        <span className="live-result" style={{ color: SCALER_CONFIG[calcScaler].color }}>
                          {liveCalc.scaled[i].toFixed(4)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mini-bars" style={{ marginTop: '1rem' }}>
                    {['Before', 'After'].map(label => {
                      const arr = label === 'Before' ? liveCalc.raw : liveCalc.scaled;
                      const mn = Math.min(...arr); const mx = Math.max(...arr);
                      return (
                        <div key={label}>
                          <div className="mini-bar-label">{label}:</div>
                          {arr.map((v, i) => {
                            const pct = mx === mn ? 50 : ((v - mn) / (mx - mn)) * 100;
                            return (
                              <div key={i} className="bar-item" style={{ marginBottom: '4px' }}>
                                <div className="bar-val-label" style={{ color: label === 'After' ? SCALER_CONFIG[calcScaler].color : '#94a3b8' }}>
                                  {v.toFixed(2)}
                                </div>
                                <div className="bar-track">
                                  <div className="bar-fill" style={{
                                    width: `${pct}%`,
                                    background: label === 'After' ? SCALER_CONFIG[calcScaler].color : 'rgba(148,163,184,0.4)'
                                  }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="card-note alert-amber" style={{ marginTop: '1rem' }}>
                  <strong>⚠️ Train-Test Leak Warning:</strong> Always <code>fit()</code> the scaler on <strong>training data only</strong>.
                  Then <code>transform()</code> both train and test. Never fit on test data!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: ALGORITHMS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'algorithms' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Which Algorithm Needs Scaling?</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '1.5rem' }}>
              Click any algorithm below to see why scaling matters (or doesn't).
            </p>

            <div className="algo-list">
              {Object.entries(algoData).map(([key, algo]) => (
                <div key={key}
                  className={`algo-row ${expandedAlgo === key ? 'expanded' : ''}`}
                  onClick={() => setExpandedAlgo(expandedAlgo === key ? null : key)}
                >
                  <div className="algo-row-header">
                    <div className="algo-row-left">
                      <Cpu size={15} className="algo-icon" />
                      <span className="algo-row-name">{algo.name}</span>
                    </div>
                    <div className="algo-row-right">
                      <span className={`badge-req badge-req-${algo.req}`}>
                        {algo.req === 'yes' ? '✅ Scaling Required' :
                         algo.req === 'optional' ? '⚡ Recommended' : '🚫 Not Required'}
                      </span>
                      {expandedAlgo === key ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                  {expandedAlgo === key && (
                    <div className="algo-row-body">
                      <p className="algo-why">{algo.why}</p>
                      <div className="algo-rec">
                        <span>Recommended: </span>
                        <strong style={{ color: '#6366f1' }}>{algo.rec}</strong>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
