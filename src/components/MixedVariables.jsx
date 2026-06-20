import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRight, GitMerge, RefreshCw, Layers, Sparkles, HelpCircle, Code, ListFilter, Play } from 'lucide-react';

/* ── Code Snippet Component ───────────────────────────────────────────────── */
const CodeSnippet = ({ code, color = '#6366f1' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-snippet-box" style={{ marginTop: '1rem', border: `1px solid ${color}40` }}>
      <div className="code-header" style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
        <span style={{ color, fontWeight: 600 }}>Python Code + Output</span>
        <button className={`btn btn-copy ${copied ? 'copied' : ''}`} onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="pre-code" style={{ margin: 0, border: 'none', background: 'transparent' }}><code>{code}</code></pre>
    </div>
  );
};

/* ── Before / After Table Component ──────────────────────────────────────── */
const BeforeAfter = ({ before, after, color }) => (
  <div style={{ display: 'flex', gap: '1.5rem', margin: '1.2rem 0', flexWrap: 'wrap' }}>
    <div style={{ flex: 1, minWidth: '180px' }}>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Before</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <tbody>
          {before.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', background: 'rgba(255,255,255,0.03)', fontWeight: j === 0 && row.length > 1 ? 600 : 'normal' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', color: color }}>
      <ArrowRight size={24} />
    </div>
    <div style={{ flex: 1, minWidth: '180px' }}>
      <div style={{ fontSize: '0.75rem', color: color, marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>After Transformation</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <tbody>
          {after.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                const isNaNValue = cell === 'NaN';
                return (
                  <td key={j} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: i === 0 ? '#cbd5e1' : isNaNValue ? '#ef4444' : color, background: i === 0 ? 'rgba(255,255,255,0.06)' : `${color}10`, fontWeight: i === 0 || isNaNValue ? 700 : 'normal' }}>{cell}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function MixedVariables() {
  const [activeTab, setActiveTab] = useState('overview');
  const [demoDataset, setDemoDataset] = useState('noorfatima_number');
  const [demoAction, setDemoAction] = useState('split_rows');
  const [customInput, setCustomInput] = useState('A/5 21171, PC 17599, 113803, STON/O2. 3101282, 373450');

  // Interactive Demo Data Handling
  const demoData = useMemo(() => {
    if (demoDataset === 'noorfatima_cabin') {
      return [
        { id: 1, raw: 'C123' },
        { id: 2, raw: 'E46' },
        { id: 3, raw: 'C85' },
        { id: 4, raw: 'Unknown' },
        { id: 5, raw: 'D26' },
        { id: 6, raw: 'A10' }
      ];
    } else if (demoDataset === 'ratings') {
      return [
        { id: 1, raw: '4' },
        { id: 2, raw: '5' },
        { id: 3, raw: 'Unknown' },
        { id: 4, raw: '3' },
        { id: 5, raw: 'N/A' },
        { id: 6, raw: '1' }
      ];
    } else if (demoDataset === 'noorfatima_number') {
      return [
        { id: 1, raw: '1' },
        { id: 2, raw: '2' },
        { id: 3, raw: '3' },
        { id: 4, raw: 'A' },
        { id: 5, raw: 'B' },
        { id: 6, raw: 'C' },
        { id: 7, raw: 'Missing' }
      ];
    } else {
      // Custom Alphanumeric
      return customInput.split(',').map((val, idx) => ({ id: idx + 1, raw: val.trim() }));
    }
  }, [demoDataset, customInput]);

  const transformedData = useMemo(() => {
    if (demoDataset === 'noorfatima_number') {
      return demoData.map(item => {
        const str = item.raw || '';
        const isNum = !isNaN(parseFloat(str)) && isFinite(str);
        return {
          original: str,
          col1: isNum ? parseFloat(str).toFixed(1) : 'NaN',
          col2: isNum ? 'NaN' : str
        };
      });
    }

    if (demoAction === 'split') {
      return demoData.map(item => {
        const str = item.raw || '';
        let prefix = 'None';
        let numVal = 'NaN';

        if (demoDataset === 'noorfatima_cabin') {
          // Classic Cabin splitting: first letter = deck, rest = room
          if (str && str !== 'Unknown') {
            prefix = str.charAt(0);
            const numPart = str.substring(1);
            numVal = numPart ? parseInt(numPart, 10).toString() : 'NaN';
          } else {
            prefix = 'Missing';
          }
        } else {
          // Standard Alphanumeric split
          const letters = str.replace(/[0-9]/g, '').trim();
          const digits = str.replace(/[^0-9]/g, '').trim();
          prefix = letters ? letters : 'Numeric Only';
          numVal = digits ? digits : 'NaN';
        }

        return {
          original: str,
          col1: prefix,
          col2: numVal
        };
      });
    } else {
      // Coerce & Impute Strategy
      // First pass: extract numerical value, determine median of valid values
      const parsedValues = demoData.map(item => {
        const val = parseFloat(item.raw);
        return isNaN(val) ? null : val;
      });

      const validVals = parsedValues.filter(v => v !== null);
      validVals.sort((a, b) => a - b);
      let median = 0;
      if (validVals.length > 0) {
        const mid = Math.floor(validVals.length / 2);
        median = validVals.length % 2 !== 0 ? validVals[mid] : (validVals[mid - 1] + validVals[mid]) / 2;
      }

      return demoData.map((item, idx) => {
        const orig = item.raw || '';
        const parsed = parsedValues[idx];
        const isMissing = parsed === null ? 1 : 0;
        const imputed = parsed === null ? median : parsed;

        return {
          original: orig,
          col1: imputed.toString(),
          col2: isMissing.toString()
        };
      });
    }
  }, [demoData, demoAction, demoDataset]);

  const generatedCode = useMemo(() => {
    if (demoDataset === 'noorfatima_number') {
      return `import pandas as pd
import numpy as np

# Column containing mixed datatypes across rows (Noor Fatima example)
df = pd.DataFrame({'number': ['1', '2', '3', 'A', 'B', 'C', 'Missing']})

# 1. Extract Numerical component using pd.to_numeric (coerce errors to NaN)
df['number_numerical'] = pd.to_numeric(df['number'], errors='coerce', downcast='integer')

# 2. Extract Categorical component (place NaN where numerical exists)
df['number_categorical'] = np.where(df['number_numerical'].isnull(), df['number'], np.nan)

print(df)
# Output:
#     number  number_numerical number_categorical
# 0        1               1.0                NaN
# 1        2               2.0                NaN
# 2        3               3.0                NaN
# 3        A               NaN                  A
# 4        B               NaN                  B
# 5        C               NaN                  C
# 6  Missing               NaN            Missing`;
    }

    if (demoAction === 'split') {
      if (demoDataset === 'noorfatima_cabin') {
        return `import pandas as pd
import numpy as np

# Titanic cabin column (Noor Fatima example)
df = pd.DataFrame({'Cabin': ['C123', 'E46', 'C85', np.nan, 'D26', 'A10']})

# 1. Extract room numbers (numerical suffix)
df['cabin_num'] = df['Cabin'].str.extract(r'(\\d+)')

# 2. Extract deck prefix (first letter)
df['cabin_cat'] = df['Cabin'].str[0]

print(df)
# Output:
#    Cabin cabin_num cabin_cat
# 0   C123       123         C
# 1    E46        46         E
# 2    C85        85         C
# 3    NaN       NaN       NaN
# 4    D26        26         D
# 5    A10        10         A`;
      } else {
        return `import pandas as pd
import re

# Alphanumeric text data
data = ['A/5 21171', 'PC 17599', '113803', 'STON/O2. 3101282', '373450']
df = pd.DataFrame({'Ticket': data})

# Extract text part (prefix) and numbers using regular expressions
df['Ticket_Prefix'] = df['Ticket'].apply(lambda x: re.sub(r'\\d+', '', x).strip())
df['Ticket_Prefix'] = df['Ticket_Prefix'].apply(lambda x: 'Numeric_Only' if x == '' else x)

df['Ticket_Num'] = df['Ticket'].str.extract(r'(\\d+)')
df['Ticket_Num'] = pd.to_numeric(df['Ticket_Num'])

print(df)
# Output:
#              Ticket Ticket_Prefix  Ticket_Num
# 0         A/5 21171           A/5       21171
# 1          PC 17599            PC       17599
# 2            113803  Numeric_Only      113803
# 3  STON/O2. 3101282      STON/O2.     3101282
# 4            373450  Numeric_Only      373450`;
      }
    } else {
      // Coerce & Impute code
      return `import pandas as pd
import numpy as np

# Mixed ratings with non-numeric labels
df = pd.DataFrame({'Rating': ['4', '5', 'Unknown', '3', 'N/A', '1']})

# 1. Coerce values to numeric, turning strings into NaN
df['Rating_Numeric'] = pd.to_numeric(df['Rating'], errors='coerce')

# 2. Create missingness indicator
df['Rating_Was_Missing'] = df['Rating_Numeric'].isnull().astype(int)

# 3. Impute missing values with Median
median_rating = df['Rating_Numeric'].median()
df['Rating_Numeric'] = df['Rating_Numeric'].fillna(median_rating)

print(df)
# Output:
#     Rating  Rating_Numeric  Rating_Was_Missing
# 0        4             4.0                   0
# 1        5             5.0                   0
# 2  Unknown             3.5                   1
# 3        3             3.0                   0
# 4      N/A             3.5                   1
# 5        1             1.0                   0`;
    }
  }, [demoAction, demoDataset]);

  return (
    <div className="tab-layout-container fade-in">
      {/* Hero Header */}
      <div className="hero-section" style={{ paddingBottom: '1.5rem' }}>
        <div className="hero-badge">
          <GitMerge size={12} />
          <span>Mixed Variables Preprocessing</span>
        </div>
        <h2 className="hero-title">Handling Mixed Variables</h2>
        <p className="hero-subtitle">
          Based on <strong>Noor Fatima's</strong> publication <em>"Handling Mixed Data in Machine Learning"</em>. Learn to extract numeric and category features cleanly.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="tabs-nav-container" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="tabs-nav" style={{ display: 'inline-flex', padding: '0.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { id: 'overview', label: '1. Overview', icon: Layers },
            { id: 'strategies', label: '2. Strategies', icon: ListFilter },
            { id: 'demo', label: '3. Interactive Demo', icon: Play },
            { id: 'faq', label: '4. Decision Guide & Q&A', icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#a5b4fc' : '#64748b',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Main concept card - spanning full width */}
          <div className="info-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                <Layers size={20} />
              </div>
              <h3 className="section-title-sub" style={{ margin: 0 }}>What is a Mixed Variable?</h3>
            </div>
            <p className="tutorial-paragraph" style={{ marginBottom: '1rem' }}>
              As discussed by **Noor Fatima** in her technical article, a <strong>Mixed Variable</strong> is a column in a dataset containing both <strong>numerical</strong> and <strong>categorical</strong> values. Leaving these unprocessed will cause model fitting errors.
            </p>
            <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <li>
                <strong style={{ color: '#cbd5e1' }}>Combined (Alphanumeric strings):</strong> Values combine text and numbers in the same cell (e.g. Titanic <code>Cabin</code> value <code>C123</code>, which contains categorical deck prefix <code>C</code> and numerical room <code>123</code>).
              </li>
              <li>
                <strong style={{ color: '#cbd5e1' }}>Mixed (Across rows):</strong> Individual cells are either purely categorical or purely numerical (e.g. a column <code>number</code> containing values like <code>1, 2, 3, A, B, C</code>).
              </li>
            </ul>
            <div className="callout callout-warning" style={{ background: 'rgba(239,68,68,0.05)', borderLeft: '4px solid #ef4444', padding: '1rem', borderRadius: '0 8px 8px 0', fontSize: '0.85rem', color: '#f87171' }}>
              <strong>Pre-processing standard:</strong> Models require split, type-safe structures. Category elements must be isolated and encoded, while numeric elements must be isolated, imputed, and scaled.
            </div>
          </div>

          <div className="two-col-cards">
            {/* Card 2: Graphical Concept of Splitting */}
            <div className="info-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 className="section-title-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: '#a5b4fc' }} />
                <span>Alphanumeric Cabin Splitting</span>
              </h3>
              <p className="tutorial-paragraph" style={{ marginBottom: '1rem' }}>
                We convert <code>Cabin</code> into <code>cabin_cat</code> (deck letter) and <code>cabin_num</code> (room number) using string extraction.
              </p>

              {/* SVG Demonstration */}
              <div style={{ background: '#080c18', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'center' }}>
                <svg width="340" height="150" viewBox="0 0 340 150">
                  {/* Raw Input Box */}
                  <rect x="10" y="50" width="80" height="50" rx="8" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="2" />
                  <text x="50" y="80" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle">C123</text>
                  <text x="50" y="35" fill="#94a3b8" fontSize="11" textAnchor="middle">Cabin Column</text>

                  {/* Split Arrows */}
                  <path d="M 100,60 L 160,35" stroke="#a5b4fc" strokeWidth="2" fill="none" markerEnd="url(#arrow)" strokeDasharray="3,3" />
                  <path d="M 100,90 L 160,115" stroke="#6366f1" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                  {/* SVG Markers */}
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#a5b4fc" />
                    </marker>
                  </defs>

                  {/* Target 1: Deck Letter */}
                  <rect x="170" y="10" width="145" height="40" rx="6" fill="rgba(165, 180, 252, 0.1)" stroke="#a5b4fc" strokeWidth="1.5" />
                  <text x="242.5" y="34" fill="#a5b4fc" fontSize="13" fontWeight="600" textAnchor="middle">cabin_cat: 'C'</text>
                  <text x="315" y="34" fill="#a5b4fc" fontSize="10" fontWeight="bold"></text>

                  {/* Target 2: Room Number */}
                  <rect x="170" y="95" width="145" height="40" rx="6" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" strokeWidth="1.5" />
                  <text x="242.5" y="119" fill="#e0e7ff" fontSize="13" fontWeight="600" textAnchor="middle">cabin_num: 123</text>
                  <text x="315" y="119" fill="#6366f1" fontSize="10" fontWeight="bold"></text>
                </svg>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', fontStyle: 'italic', textAlign: 'center' }}>
                Split using Pandas: <code>str.extract(r'(\d+)')</code> & <code>str[0]</code>
              </div>
            </div>

            {/* Card 3: Splitting Mixed Rows (Matching handwriting user image) */}
            <div className="info-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 className="section-title-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: '#10b981' }} />
                <span>Splitting Rows: Categ. vs Num.</span>
              </h3>
              <p className="tutorial-paragraph" style={{ marginBottom: '1rem' }}>
                We convert <code>number</code> into <code>number_numerical</code> and <code>number_categorical</code> using pd.to_numeric and np.where.
              </p>

              {/* Handdrawn Style Rendered in Premium SVG */}
              <div style={{ background: '#080c18', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'center' }}>
                <svg width="340" height="150" viewBox="0 0 340 150">
                  <defs>
                    <marker id="green-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                  </defs>

                  {/* Left Column X1 (Green outline) */}
                  <rect x="10" y="5" width="65" height="20" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="1.5" rx="3" />
                  <text x="42.5" y="19" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">number</text>

                  <rect x="10" y="29" width="65" height="116" fill="rgba(16, 185, 129, 0.05)" stroke="#10b981" strokeWidth="1.5" rx="4" />
                  <text x="42.5" y="44" fill="#a5b4fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">1</text>
                  <text x="42.5" y="59" fill="#a5b4fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">2</text>
                  <text x="42.5" y="74" fill="#a5b4fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">3</text>
                  <text x="42.5" y="89" fill="#fff" fontSize="9.5" fontWeight="600" textAnchor="middle">A</text>
                  <text x="42.5" y="104" fill="#fff" fontSize="9.5" fontWeight="600" textAnchor="middle">B</text>
                  <text x="42.5" y="119" fill="#fff" fontSize="9.5" fontWeight="600" textAnchor="middle">C</text>
                  <text x="42.5" y="134" fill="#cbd5e1" fontSize="9" fontWeight="600" textAnchor="middle">Missing</text>

                  {/* Center Green Curved Arrow */}
                  <path d="M 85,75 Q 112,50 135,75" fill="none" stroke="#10b981" strokeWidth="3" markerEnd="url(#green-arrow)" />

                  {/* Right Orange Table: Categ. & Num. */}
                  {/* Headers */}
                  <rect x="150" y="5" width="85" height="20" fill="rgba(249, 115, 22, 0.25)" stroke="#f97316" strokeWidth="1.5" rx="3" />
                  <text x="192.5" y="19" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">num_numerical</text>

                  <rect x="240" y="5" width="85" height="20" fill="rgba(249, 115, 22, 0.25)" stroke="#f97316" strokeWidth="1.5" rx="3" />
                  <text x="282.5" y="19" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">num_categorical</text>

                  {/* Body Container */}
                  <rect x="150" y="29" width="175" height="116" fill="rgba(249, 115, 22, 0.05)" stroke="#f97316" strokeWidth="1.5" rx="4" />
                  <line x1="237" y1="29" x2="237" y2="145" stroke="#f97316" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Num Numerical values */}
                  <text x="192.5" y="44" fill="#a5b4fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">1.0</text>
                  <text x="192.5" y="59" fill="#a5b4fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">2.0</text>
                  <text x="192.5" y="74" fill="#a5b4fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">3.0</text>
                  <text x="192.5" y="89" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">NaN</text>
                  <text x="192.5" y="104" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">NaN</text>
                  <text x="192.5" y="119" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">NaN</text>
                  <text x="192.5" y="134" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">NaN</text>

                  {/* Num Categorical values */}
                  <text x="282.5" y="44" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">NaN</text>
                  <text x="282.5" y="59" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">NaN</text>
                  <text x="282.5" y="74" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle">NaN</text>
                  <text x="282.5" y="89" fill="#fff" fontSize="9.5" fontWeight="600" textAnchor="middle">A</text>
                  <text x="282.5" y="104" fill="#fff" fontSize="9.5" fontWeight="600" textAnchor="middle">B</text>
                  <text x="282.5" y="119" fill="#fff" fontSize="9.5" fontWeight="600" textAnchor="middle">C</text>
                  <text x="282.5" y="134" fill="#cbd5e1" fontSize="9" fontWeight="600" textAnchor="middle">Missing</text>
                </svg>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem', fontStyle: 'italic', textAlign: 'center' }}>
                Split using: <code>pd.to_numeric()</code> & <code>np.where()</code>
              </div>
            </div>
          </div>

          {/* Example Cases Table */}
          <div className="section-block" style={{ marginTop: 0 }}>
            <h3 className="section-title-sub">Standard Real-World Cases</h3>
            <div className="table-responsive" style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '0.75rem 1rem', color: '#cbd5e1', fontWeight: 600 }}>Feature Name</th>
                    <th style={{ padding: '0.75rem 1rem', color: '#cbd5e1', fontWeight: 600 }}>Raw Sample</th>
                    <th style={{ padding: '0.75rem 1rem', color: '#cbd5e1', fontWeight: 600 }}>Type of Mixed Data</th>
                    <th style={{ padding: '0.75rem 1rem', color: '#cbd5e1', fontWeight: 600 }}>Standard Resolution Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: 'Cabin (Titanic)',
                      sample: 'C123, B45, E8, NaN',
                      type: 'Alphanumeric String (Combined in cell)',
                      solution: 'Extract the first character into a "cabin_cat" feature (Categorical) and numbers into a "cabin_num" feature (Numerical).'
                    },
                    {
                      name: 'number (Mixed values)',
                      sample: '1, 2, 3, A, B, C, Missing',
                      type: 'Mixed Data Types (Across rows)',
                      solution: 'Extract numbers using pd.to_numeric into "number_numerical" and text values into "number_categorical" using np.where.'
                    },
                    {
                      name: 'Ticket (Titanic)',
                      sample: 'A/5 21171, PC 17599, 113803',
                      type: 'Mixed (Pure Numbers & Alphanumeric Text)',
                      solution: 'Separate text prefixes from the ticket number. Map pure numerical tickets to "Numeric_Only" prefix.'
                    },
                    {
                      name: 'Customer Survey Ratings',
                      sample: '1, 3, 5, "N/A", "Missing"',
                      type: 'Mixed numeric values & Text placeholders',
                      solution: 'Coerce values to float (turning strings to NaN). Impute missing values with Median. Generate a binary indicator column.'
                    }
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#a5b4fc', fontWeight: 600 }}>{row.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#e2e8f0' }}><code>{row.sample}</code></td>
                      <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>{row.type}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>{row.solution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Strategies */}
      {activeTab === 'strategies' && (
        <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Strategy 1: Splitting / Regex Extraction */}
            <div className="strategy-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>STRATEGY 1</span>
                <h3 className="section-title-sub" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Alphanumeric Splitting</h3>
                <p className="tutorial-paragraph" style={{ fontSize: '0.85rem' }}>
                  Ideal for columns combining string categories and numbers in a single cell (e.g. <code>Cabin</code>). We extract the room numbers and the first letter using string slicing/extraction.
                </p>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Python pandas code:</div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <li>Extract Number: <code>Cabin.str.extract(r'(\d+)')</code></li>
                    <li>Extract Deck Letter: <code>Cabin.str[0]</code></li>
                  </ul>
                </div>
              </div>
              <BeforeAfter
                before={[['Cabin'], ['C123'], ['E46'], ['D26']]}
                after={[['cabin_num', 'cabin_cat'], ['123', 'C'], ['46', 'E'], ['26', 'D']]}
                color="#a5b4fc"
              />
            </div>

            {/* Strategy 2: Splitting Row Datatypes */}
            <div className="strategy-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>STRATEGY 2</span>
                <h3 className="section-title-sub" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Splitting Across Rows</h3>
                <p className="tutorial-paragraph" style={{ fontSize: '0.85rem' }}>
                  When data types are mixed across rows (some cells numbers, some text), split the column into Category and Numeric fields using pd.to_numeric and np.where.
                </p>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Pandas implementation:</div>
                  <code style={{ fontSize: '0.8rem', color: '#34d399' }}>pd.to_numeric(df['number'], errors='coerce')</code>
                </div>
              </div>
              <BeforeAfter
                before={[['number'], ['1'], ['2'], ['A'], ['B']]}
                after={[['num_numerical', 'num_categorical'], ['1.0', 'NaN'], ['2.0', 'NaN'], ['NaN', 'A'], ['NaN', 'B']]}
                color="#34d399"
              />
            </div>

            {/* Strategy 3: Type Coercion & Imputation */}
            <div className="strategy-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(249,115,22,0.15)', color: '#f97316', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>STRATEGY 3</span>
                <h3 className="section-title-sub" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Coercion & Imputation</h3>
                <p className="tutorial-paragraph" style={{ fontSize: '0.85rem' }}>
                  For fields containing numeric ratings with textual labels indicating missing data (e.g. <code>"Unknown"</code>, <code>"N/A"</code>). We force the column to numeric, parse text to <code>NaN</code>, and fill gaps with Median or Mode.
                </p>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Pandas implementation:</div>
                  <code style={{ fontSize: '0.8rem', color: '#f97316' }}>pd.to_numeric(df['Rating'], errors='coerce')</code>
                </div>
              </div>
              <BeforeAfter
                before={[['Rating'], ['4'], ['Unknown'], ['5']]}
                after={[['Rating_Num', 'Rating_is_Missing'], ['4.0', '0'], ['4.5 (Median)', '1'], ['5.0', '0']]}
                color="#f97316"
              />
            </div>

            {/* Strategy 4: Binary Presence Flags */}
            <div className="strategy-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>STRATEGY 4</span>
                <h3 className="section-title-sub" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>Binary Presence Indicators</h3>
                <p className="tutorial-paragraph" style={{ fontSize: '0.85rem' }}>
                  Sometimes the absolute specific room number is meaningless, but *whether* the passenger had a cabin or not is highly predictive (e.g., indicating class/wealth). We generate a simple binary column flag.
                </p>
                <div style={{ margin: '1rem 0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Pandas implementation:</div>
                  <code style={{ fontSize: '0.8rem', color: '#fbbf24' }}>df['Has_Cabin'] = df['Cabin'].notnull().astype(int)</code>
                </div>
              </div>
              <BeforeAfter
                before={[['Cabin'], ['C123'], ['NaN'], ['D26']]}
                after={[['Has_Cabin'], ['1'], ['0'], ['1']]}
                color="#fbbf24"
              />
            </div>

          </div>
        </div>
      )}

      {/* Tab 3: Interactive Demo */}
      {activeTab === 'demo' && (
        <div className="tab-content">
          <div className="grid-1-12">
            
            {/* Left controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="control-box" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
                <h4 className="section-title-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ListFilter size={16} />
                  <span>Configure Preprocessing</span>
                </h4>

                {/* Dataset Selector */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Demo Column Type:</label>
                  <div className="grid-3-col-buttons">
                    {[
                      { id: 'noorfatima_cabin', label: 'Cabin (Alphanumeric String)' },
                      { id: 'noorfatima_number', label: 'number (Mixed Datatypes)' },
                      { id: 'ratings', label: 'Ratings (Numeric & Text)' },
                      { id: 'custom', label: 'Custom Alphanumeric' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setDemoDataset(opt.id);
                          setDemoAction(opt.id === 'ratings' ? 'coerce' : opt.id === 'noorfatima_number' ? 'split_rows' : 'split');
                        }}
                        style={{
                          padding: '0.5rem 0.5rem',
                          borderRadius: '8px',
                          border: demoDataset === opt.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                          background: demoDataset === opt.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.01)',
                          color: demoDataset === opt.id ? '#a5b4fc' : '#94a3b8',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input box (if selected) */}
                {demoDataset === 'custom' && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Comma Separated Values:</label>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.2)',
                        color: '#fff',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                      }}
                    />
                  </div>
                )}

                {/* Method selector */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Select Transformation Strategy:</label>
                  <div className="grid-2-col">
                    {demoDataset === 'noorfatima_number' ? (
                      <button
                        onClick={() => setDemoAction('split_rows')}
                        style={{
                          gridColumn: 'span 2',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #10b981',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#34d399',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Split Categorical vs Numerical (Rows)
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setDemoAction('split')}
                          disabled={demoDataset === 'ratings'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            border: demoAction === 'split' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                            background: demoAction === 'split' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.01)',
                            color: demoAction === 'split' ? '#a5b4fc' : '#94a3b8',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: demoDataset === 'ratings' ? 'not-allowed' : 'pointer',
                            opacity: demoDataset === 'ratings' ? 0.3 : 1
                          }}
                        >
                          Split Prefix & Numbers
                        </button>
                        <button
                          onClick={() => setDemoAction('coerce')}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            border: demoAction === 'coerce' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                            background: demoAction === 'coerce' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.01)',
                            color: demoAction === 'coerce' ? '#34d399' : '#94a3b8',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Coerce to Numeric & Impute
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Dynamic before/after table */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
                <h4 className="section-title-sub">Interactive DataFrame View</h4>
                <div className="table-responsive" style={{ border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px', overflow: 'hidden', marginTop: '1rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <th style={{ padding: '0.5rem 0.75rem', color: '#cbd5e1' }}>Original</th>
                        <th style={{ padding: '0.5rem 0.75rem', color: demoDataset === 'noorfatima_number' ? '#10b981' : demoAction === 'split' ? '#a5b4fc' : '#34d399' }}>
                          {demoDataset === 'noorfatima_number' ? 'number_numerical' : demoDataset === 'noorfatima_cabin' ? 'cabin_num' : demoAction === 'split' ? 'Feature_Prefix' : 'Feature_Imputed'}
                        </th>
                        <th style={{ padding: '0.5rem 0.75rem', color: demoDataset === 'noorfatima_number' ? '#10b981' : demoAction === 'split' ? '#818cf8' : '#10b981' }}>
                          {demoDataset === 'noorfatima_number' ? 'number_categorical' : demoDataset === 'noorfatima_cabin' ? 'cabin_cat' : demoAction === 'split' ? 'Feature_Numeric' : 'Feature_Was_Missing'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transformedData.map((row, idx) => {
                        const isCol1NaN = row.col1 === 'NaN';
                        const isCol2NaN = row.col2 === 'NaN';
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8', fontFamily: 'monospace' }}>{row.original || 'NaN'}</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: isCol1NaN ? '#ef4444' : demoDataset === 'noorfatima_number' ? '#a5b4fc' : demoAction === 'split' ? '#a5b4fc' : '#34d399', fontWeight: 600, fontFamily: 'monospace' }}>{row.col1}</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: isCol2NaN ? '#ef4444' : demoDataset === 'noorfatima_number' ? '#fff' : demoAction === 'split' ? '#818cf8' : '#10b981', fontWeight: 600, fontFamily: 'monospace' }}>{row.col2}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Python Code block */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 className="section-title-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code size={16} />
                    <span>Dynamic Python Code Implementation</span>
                  </h4>
                  <p className="tutorial-paragraph" style={{ fontSize: '0.85rem' }}>
                    The Python code below updates dynamically based on your chosen strategy and input. It shows exactly how to process these mixed features using Pandas.
                  </p>
                </div>
                <CodeSnippet code={generatedCode} color={demoDataset === 'noorfatima_number' ? '#10b981' : demoAction === 'split' ? '#6366f1' : '#10b981'} />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: FAQ & Decision Guide */}
      {activeTab === 'faq' && (
        <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Decision Guide Block */}
          <div className="info-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 className="section-title-sub" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitMerge size={18} style={{ color: '#a5b4fc' }} />
              <span>Mixed Variables Preprocessing Decision Guide</span>
            </h3>
            
            <div style={{ background: '#080c18', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', marginTop: '1rem', overflowX: 'auto' }}>
              <pre style={{ margin: 0, color: '#a5b4fc', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.4' }}>
{`Is the feature combining categories & numbers in a single string (e.g. C123)?
 ├── YES ──> Are both components likely to hold predictive value?
 │            ├── YES ──> Apply REGEX SPLITTING to extract two distinct columns.
 │            └── NO  ──> Extract only the prefix/suffix (e.g., Cabin Deck) & drop numerical noise.
 │
 └── NO  ──> Are values mixed across rows (e.g., A, B, C, 1, 2, 3)?
              ├── YES ──> Split Category & Numeric components into two columns, mapping missing rows to NaN.
              └── NO  ──> Are text labels indicating missing values (e.g., "N/A", "Unknown")?
                           ├── YES ──> Use TYPE COERCION (pd.to_numeric) + MEDIAN IMPUTATION + MISSINGNESS FLAG.
                           └── NO  ──> Clean string inputs, extract numeric elements, scale accordingly.`}
              </pre>
            </div>
          </div>

          {/* Interview Questions list */}
          <div className="section-block" style={{ marginTop: 0 }}>
            <h3 className="section-title-sub">Top Interview Questions & Answers</h3>
            <div className="qa-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                {
                  q: "What is a mixed variable in machine learning, and why does it represent a challenge?",
                  a: "A mixed variable is a feature containing both numerical and categorical components (either within the same cell like 'C123' or across rows like ratings mixed with 'Unknown'). They pose a challenge because algorithms expect homogeneous data types (pure floats or integers) and will crash or learn incorrect patterns if text labels are left inside numeric columns."
                },
                {
                  q: "How do you handle a column like 'Ticket' in Titanic that has both pure integers and alphanumeric values using Pandas?",
                  a: "You can split this column by using regular expressions. We can strip out the text prefix into a new categorical column (replacing blanks with 'Numeric_Only') and extract the numeric suffix into a new integer column. This ensures no information is lost while maintaining data compatibility with ML models."
                },
                {
                  q: "What is the standard procedure when you have a column with values like [A, B, C, 1, 2, 3] mixed across rows?",
                  a: "The standard strategy is to split the column into two separate columns: Categ. (keeps string categories A, B, C and places NaN for numbers) and Num. (keeps numerical elements 1, 2, 3 and places NaN for text). This is achieved using pd.to_numeric with errors='coerce' to create the numeric feature, and filtering out the numbers to create the categorical feature."
                },
                {
                  q: "What does pd.to_numeric(..., errors='coerce') do, and how is it used in mixed data?",
                  a: "It converts string-formatted numbers to floats, but if it encounters a non-numeric string (like 'Unknown' or 'N/A'), it converts it into a NaN (Not a Number) instead of throwing an error. This isolates the true numeric values, allowing us to impute the NaNs later while creating a binary missingness indicator column."
                },
                {
                  q: "Why should you create a missingness indicator column when coercing and imputing mixed variables?",
                  a: "Imputing values (e.g. replacing 'Unknown' ratings with the median rating of 3.5) changes the data. By creating a binary indicator column (1 if missing/unknown, 0 otherwise), we allow the machine learning model to learn if the *fact that the information was missing* is itself predictive (e.g. users who don't report ratings behave differently)."
                }
              ].map((qa, i) => (
                <div key={i} className="qa-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div className="qa-q" style={{ color: '#a5b4fc', fontWeight: 600, fontSize: '0.95rem' }}>Q: {qa.q}</div>
                  <div className="qa-a" style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.6' }}>{qa.a}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
