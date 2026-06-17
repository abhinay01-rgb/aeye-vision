import React, { useState } from 'react';
import { Database, AlertTriangle, Activity, List, ArrowRight, Copy, Check } from 'lucide-react';

const NUMERICAL_DATA = [20, 22, null, 25, 30, null, 35];
const CATEGORICAL_DATA = ['Delhi', 'Mumbai', 'Delhi', null, 'Pune', null];

const MISSING_METHODS = {
  mean: {
    name: 'Mean Imputation',
    type: 'Numerical',
    desc: 'Replaces missing values with the average of all available values.',
    bestFor: 'Normally distributed data without extreme outliers.',
    python: `import pandas as pd
from sklearn.impute import SimpleImputer

# Method 1: Pandas approach
df['Age'] = df['Age'].fillna(df['Age'].mean())

# Method 2: Scikit-Learn approach
imputer = SimpleImputer(strategy='mean')
df[['Age']] = imputer.fit_transform(df[['Age']])`,
    calc: (arr) => {
      const valid = arr.filter(x => x !== null);
      const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
      return arr.map(x => x === null ? Number(mean.toFixed(2)) : x);
    }
  },
  median: {
    name: 'Median Imputation',
    type: 'Numerical',
    desc: 'Replaces missing values with the middle value when sorted.',
    bestFor: 'Data with extreme outliers or skewed distribution.',
    python: `import pandas as pd
from sklearn.impute import SimpleImputer

# Method 1: Pandas approach
df['Age'] = df['Age'].fillna(df['Age'].median())

# Method 2: Scikit-Learn approach
imputer = SimpleImputer(strategy='median')
df[['Age']] = imputer.fit_transform(df[['Age']])`,
    calc: (arr) => {
      const valid = arr.filter(x => x !== null).sort((a, b) => a - b);
      const mid = Math.floor(valid.length / 2);
      const median = valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
      return arr.map(x => x === null ? Number(median.toFixed(2)) : x);
    }
  },
  mode_num: {
    name: 'Mode Imputation (Num)',
    type: 'Numerical',
    desc: 'Replaces missing values with the most frequent value.',
    bestFor: 'Discrete numerical values or features with a high-frequency constant.',
    python: `import pandas as pd
from sklearn.impute import SimpleImputer

# Method 1: Pandas approach
df['Age'] = df['Age'].fillna(df['Age'].mode()[0])

# Method 2: Scikit-Learn approach
imputer = SimpleImputer(strategy='most_frequent')
df[['Age']] = imputer.fit_transform(df[['Age']])`,
    calc: (arr) => {
      const valid = arr.filter(x => x !== null);
      const freqs = {};
      let maxF = 0, mode = valid[0];
      valid.forEach(v => {
        freqs[v] = (freqs[v] || 0) + 1;
        if(freqs[v] > maxF) { maxF = freqs[v]; mode = v; }
      });
      return arr.map(x => x === null ? mode : x);
    }
  },
  constant_num: {
    name: 'Constant Value',
    type: 'Numerical',
    desc: 'Replaces missing values with a specific predefined constant (e.g., 0, -1).',
    bestFor: 'When missing means a specific state (e.g., missing salary means 0 income).',
    python: `import pandas as pd
from sklearn.impute import SimpleImputer

# Method 1: Pandas approach
df['Salary'] = df['Salary'].fillna(-1)

# Method 2: Scikit-Learn approach
imputer = SimpleImputer(strategy='constant', fill_value=-1)
df[['Salary']] = imputer.fit_transform(df[['Salary']])`,
    calc: (arr) => arr.map(x => x === null ? -1 : x) 
  },
  mode_cat: {
    name: 'Mode Imputation (Cat)',
    type: 'Categorical',
    desc: 'Replaces missing categories with the most frequently occurring category.',
    bestFor: 'Standard categorical variables.',
    python: `import pandas as pd
from sklearn.impute import SimpleImputer

# Method 1: Pandas approach
df['City'] = df['City'].fillna(df['City'].mode()[0])

# Method 2: Scikit-Learn approach
imputer = SimpleImputer(strategy='most_frequent')
df[['City']] = imputer.fit_transform(df[['City']])`,
    calc: (arr) => {
      const valid = arr.filter(x => x !== null);
      const freqs = {};
      let maxF = 0, mode = valid[0];
      valid.forEach(v => {
        freqs[v] = (freqs[v] || 0) + 1;
        if(freqs[v] > maxF) { maxF = freqs[v]; mode = v; }
      });
      return arr.map(x => x === null ? mode : x);
    }
  },
  new_cat: {
    name: 'New Category',
    type: 'Categorical',
    desc: 'Treats the missing status as a new, distinct category itself (e.g., "Unknown").',
    bestFor: 'When the fact that data is missing carries its own information.',
    python: `import pandas as pd
from sklearn.impute import SimpleImputer

# Method 1: Pandas approach
df['City'] = df['City'].fillna('Unknown')

# Method 2: Scikit-Learn approach
imputer = SimpleImputer(strategy='constant', fill_value='Unknown')
df[['City']] = imputer.fit_transform(df[['City']])`,
    calc: (arr) => arr.map(x => x === null ? 'Unknown' : x)
  },
  ffill: {
    name: 'Forward Fill',
    type: 'Advanced / Time Series',
    desc: 'Propagates the last observed non-null value forward.',
    bestFor: 'Time series data where the state remains constant until changed.',
    python: `import pandas as pd

# Forward fill (propagate last valid observation forward)
df['Temperature'] = df['Temperature'].ffill()`,
    calc: (arr) => {
      let last = arr[0] || 0;
      return arr.map(x => {
        if(x !== null) last = x;
        return x === null ? last : x;
      });
    }
  },
  bfill: {
    name: 'Backward Fill',
    type: 'Advanced / Time Series',
    desc: 'Uses the next valid observation to fill the gap.',
    bestFor: 'Time series data, similar to forward fill but in reverse.',
    python: `import pandas as pd

# Backward fill (use next valid observation to fill gap)
df['Temperature'] = df['Temperature'].bfill()`,
    calc: (arr) => {
      let res = [...arr];
      let next = res[res.length-1] || 0;
      for(let i=res.length-1; i>=0; i--) {
        if(res[i] !== null) next = res[i];
        if(res[i] === null) res[i] = next;
      }
      return res;
    }
  },
  interpolate: {
    name: 'Interpolation',
    type: 'Advanced / Time Series',
    desc: 'Estimates missing values by connecting dots between adjacent data points.',
    bestFor: 'Continuous time-series data with linear trends.',
    python: `import pandas as pd

# Linear interpolation (draws a straight line between points)
df['Stock_Price'] = df['Stock_Price'].interpolate(method='linear')

# Time-based interpolation (if index is DateTime)
df['Stock_Price'] = df['Stock_Price'].interpolate(method='time')`,
    calc: (arr) => {
       let res = [...arr];
       for(let i=0; i<res.length; i++) {
         if(res[i] === null) {
           let prevIdx = i - 1; while(prevIdx >= 0 && res[prevIdx] === null) prevIdx--;
           let nextIdx = i + 1; while(nextIdx < res.length && res[nextIdx] === null) nextIdx++;
           let prev = prevIdx >= 0 ? res[prevIdx] : (res[nextIdx] || 0);
           let next = nextIdx < res.length ? res[nextIdx] : prev;
           if(prevIdx >= 0 && nextIdx < res.length) {
             let step = (next - prev) / (nextIdx - prevIdx);
             res[i] = Number((prev + step * (i - prevIdx)).toFixed(2));
           } else {
             res[i] = prev;
           }
         }
       }
       return res;
    }
  },
  knn: {
    name: 'KNN Imputer',
    type: 'Advanced / Time Series',
    desc: 'Uses K-Nearest Neighbors to find similar rows and estimates the missing value based on those neighbors.',
    bestFor: 'Datasets where similar rows share similar values across multiple features.',
    python: `import pandas as pd
from sklearn.impute import KNNImputer

# Initialize KNN imputer with k=3
imputer = KNNImputer(n_neighbors=3, weights='uniform')

# Fit and transform the data
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)`,
    calc: (arr) => arr // Placeholder for demo
  },
  mice: {
    name: 'Iterative Imputer (MICE)',
    type: 'Advanced / Time Series',
    desc: 'Models each feature with missing values as a function of other features, predicting the missing values in a round-robin fashion.',
    bestFor: 'Complex datasets with multiple correlated features.',
    python: `import pandas as pd
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer

# Initialize Iterative Imputer
imputer = IterativeImputer(max_iter=10, random_state=0)

# Fit and transform
df_imputed = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)`,
    calc: (arr) => arr // Placeholder for demo
  }
};

const CodeSnippet = ({ code, color }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-snippet-box" style={{ marginTop: '1rem', border: `1px solid ${color}40` }}>
      <div className="code-header" style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
        <span style={{ color: color, fontWeight: 600 }}>Python (Pandas & Scikit-Learn)</span>
        <button
          className={`btn btn-copy ${copied ? 'copied' : ''}`}
          onClick={copyToClipboard}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="pre-code" style={{ margin: 0, border: 'none', background: 'transparent' }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

const MethodCard = ({ methodKey, color, icon: Icon }) => {
  const meth = MISSING_METHODS[methodKey];
  return (
    <div className="premium-card" style={{ borderTop: `4px solid ${color}`, marginBottom: '1.5rem' }}>
      <div className="premium-card-header">
        <div className="premium-card-title">
          <div className="premium-icon-wrap" style={{ background: `${color}20`, color: color }}>
            <Icon size={20} />
          </div>
          <h3>{meth.name}</h3>
        </div>
      </div>
      <div className="premium-card-body">
        <p className="premium-desc">{meth.desc}</p>
        <div className="algo-rec" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
          <span>Best For: </span>
          <strong style={{ color: color }}>{meth.bestFor}</strong>
        </div>
        <CodeSnippet code={meth.python} color={color} />
      </div>
    </div>
  )
}

export default function MissingValues() {
  const [activeTab, setActiveTab] = useState('numerical');
  const [imputerType, setImputerType] = useState('numerical');
  const [selectedMethod, setSelectedMethod] = useState('mean');

  const tabs = [
    { id: 'overview', label: '1. Overview & Concepts' },
    { id: 'numerical', label: '2. Numerical Imputation' },
    { id: 'categorical', label: '3. Categorical Imputation' },
    { id: 'advanced', label: '4. Advanced Methods' },
    { id: 'interactive', label: '5. Interactive Demo' },
  ];

  const handleTypeSwitch = (type) => {
    setImputerType(type);
    if(type === 'numerical') setSelectedMethod('mean');
    else setSelectedMethod('mode_cat');
  };

  const getActiveData = () => imputerType === 'numerical' ? NUMERICAL_DATA : CATEGORICAL_DATA;
  const rawData = getActiveData();
  const resultData = MISSING_METHODS[selectedMethod].calc(rawData);

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
            TAB 1: OVERVIEW
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="tab-content fade-in">
            <div className="hero-section" style={{ paddingTop: '0' }}>
              <h2 className="hero-title">Handling Missing Data</h2>
              <p className="hero-subtitle">
                Missing values (represented as <code>NaN</code>, <code>null</code>, or <code>None</code>) 
                can drastically reduce model accuracy and cause algorithms to fail.
              </p>
            </div>

            <div className="section-block">
              <h3 className="section-title-sub">Types of Missing Data (Missingness Mechanisms)</h3>
              <div className="analysis-grid">
                <div className="analysis-card" style={{ borderLeft: '3px solid #6366f1' }}>
                  <div className="analysis-name" style={{ color: '#6366f1' }}>MCAR (Missing Completely at Random)</div>
                  <div className="analysis-note">
                    The probability of missing data is exactly the same for all observations. There is no relationship between the missing data and any other values.
                    <br/><br/><strong>Example:</strong> A sensor occasionally fails due to random power glitches.
                  </div>
                </div>
                <div className="analysis-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                  <div className="analysis-name" style={{ color: '#f59e0b' }}>MAR (Missing at Random)</div>
                  <div className="analysis-note">
                    The probability of missing data depends on observed data but not on the unobserved data itself.
                    <br/><br/><strong>Example:</strong> Men might be less likely to fill in a "depression survey" than women, but it doesn't depend on their actual depression level.
                  </div>
                </div>
                <div className="analysis-card" style={{ borderLeft: '3px solid #f31260' }}>
                  <div className="analysis-name" style={{ color: '#f31260' }}>MNAR (Missing Not at Random)</div>
                  <div className="analysis-note">
                    The missing value depends on the unobserved value itself. This is the hardest to handle.
                    <br/><br/><strong>Example:</strong> People with very high salaries are less likely to reveal their income on a survey.
                  </div>
                </div>
              </div>
            </div>

            <div className="section-block">
              <h3 className="section-title-sub">Why do we handle them?</h3>
              <ul style={{ color: '#cbd5e1', listStyleType: 'disc', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                <li><strong>Algorithm Compatibility:</strong> Most algorithms (like Linear Regression, SVM) throw errors if passed NaN values.</li>
                <li><strong>Bias Prevention:</strong> Simply dropping all rows with missing values can introduce selection bias if the data is not MCAR.</li>
                <li><strong>Data Retention:</strong> Dropping rows causes loss of valuable information in other columns.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: NUMERICAL IMPUTATION
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'numerical' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Numerical Imputation Code</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              Techniques specifically designed for continuous or discrete numerical features like Age, Salary, or Temperature.
            </p>
            
            {['mean', 'median', 'mode_num', 'constant_num'].map(k => (
              <MethodCard key={k} methodKey={k} color="#06b6d4" icon={Database} />
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: CATEGORICAL IMPUTATION
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'categorical' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Categorical Imputation Code</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              Techniques used for text-based or discrete category features like City, Gender, or Department.
            </p>
            
            {['mode_cat', 'new_cat'].map(k => (
              <MethodCard key={k} methodKey={k} color="#f59e0b" icon={List} />
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: ADVANCED METHODS
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'advanced' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Advanced & Time Series Code</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              For sequential data (time-series) or using ML models to predict missing values.
            </p>
            
            {['ffill', 'bfill', 'interpolate', 'knn', 'mice'].map(k => (
              <MethodCard key={k} methodKey={k} color="#ec4899" icon={Activity} />
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 5: INTERACTIVE DEMO
        ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'interactive' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Interactive Imputation</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '1.5rem' }}>
              Select an imputation method to see how it replaces the <code>NaN</code> values in the array.
            </p>

            <div className="calc-layout">
              <div className="calc-left">
                <div className="calc-section">
                  <label className="calc-label">Data Type:</label>
                  <div className="scaler-tabs-row" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
                    <button className={`scaler-tab-btn ${imputerType === 'numerical' ? 'active' : ''}`} style={{ '--scaler-color': '#06b6d4' }} onClick={() => handleTypeSwitch('numerical')}>Numerical</button>
                    <button className={`scaler-tab-btn ${imputerType === 'categorical' ? 'active' : ''}`} style={{ '--scaler-color': '#f59e0b' }} onClick={() => handleTypeSwitch('categorical')}>Categorical</button>
                  </div>

                  <label className="calc-label">Imputation Method:</label>
                  <div className="calc-scaler-grid">
                    {Object.entries(MISSING_METHODS)
                      .filter(([_, m]) => m.type.toLowerCase().includes(imputerType) || (imputerType === 'numerical' && m.type.includes('Advanced')))
                      .map(([key, meth]) => {
                      if(key === 'knn' || key === 'mice') return null; // Exclude non-interactive from demo
                      return (
                      <button
                        key={key}
                        className={`calc-scaler-btn ${selectedMethod === key ? 'active' : ''}`}
                        style={{ '--sc-color': imputerType === 'numerical' ? '#06b6d4' : '#f59e0b' }}
                        onClick={() => setSelectedMethod(key)}
                      >
                        {meth.name}
                      </button>
                    )})}
                  </div>
                </div>

                <div className="usage-card" style={{ borderColor: '#6366f1', marginTop: '1.5rem' }}>
                  <div className="usage-title" style={{ color: '#6366f1' }}>Code Snippet</div>
                  <pre className="pre-code" style={{ background: 'transparent', padding: '0', margin: '0' }}>
                    <code>{MISSING_METHODS[selectedMethod].python}</code>
                  </pre>
                </div>
              </div>

              <div className="calc-right">
                <div className="live-formula-box" style={{ borderColor: '#8b5cf6' }}>
                  <div className="live-formula-title" style={{ color: '#8b5cf6' }}>
                    {MISSING_METHODS[selectedMethod].name} — Effect
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
                    {MISSING_METHODS[selectedMethod].desc}
                  </p>

                  <div className="bar-compare-section" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    
                    <div className="bar-row-label" style={{ marginBottom: '0.5rem' }}>
                      <span style={{ color: '#94a3b8' }}>Original Array:</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      {rawData.map((val, idx) => (
                        <div key={idx} style={{ 
                          padding: '0.5rem 1rem', 
                          background: val === null ? 'rgba(243, 18, 96, 0.1)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${val === null ? '#f31260' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '8px',
                          color: val === null ? '#f31260' : '#e2e8f0',
                          fontWeight: val === null ? 'bold' : 'normal'
                        }}>
                          {val === null ? 'NaN' : val}
                        </div>
                      ))}
                    </div>

                    <div className="bar-row-label" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ArrowRight size={14} style={{ color: '#8b5cf6' }}/>
                      <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>After Imputation:</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {resultData.map((val, idx) => {
                        const isImputed = rawData[idx] === null;
                        return (
                          <div key={idx} style={{ 
                            padding: '0.5rem 1rem', 
                            background: isImputed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isImputed ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '8px',
                            color: isImputed ? '#10b981' : '#e2e8f0',
                            fontWeight: isImputed ? 'bold' : 'normal',
                            boxShadow: isImputed ? '0 0 10px rgba(16,185,129,0.2)' : 'none',
                            transition: 'all 0.3s ease'
                          }}>
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {imputerType === 'numerical' && (
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '1rem' }}>
                      <span>Mean: {MISSING_METHODS['mean'].calc(rawData)[2]}</span>
                      <span>Median: {MISSING_METHODS['median'].calc(rawData)[2]}</span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
