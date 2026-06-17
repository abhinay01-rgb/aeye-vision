import React, { useState } from 'react';
import { Sparkles, ArrowRight, HelpCircle, Layers, Maximize, BrainCircuit, Binary, Scissors, Grid, Filter, Cpu } from 'lucide-react';

// Definitions mapping for interactive explorer
const DEFINITIONS = {
  root: {
    title: 'Feature Engineering',
    category: 'Core Concept',
    icon: BrainCircuit,
    color: '#6366f1',
    desc: 'The process of selecting, transforming, constructing, and extracting features from raw data to build robust inputs for Machine Learning models. It is the single most critical factor determining the accuracy of ML predictions.',
    why: 'Raw data is often noisy, incomplete, or incompatible with models. Feature engineering extracts the hidden predictive signals, improves learning efficiency, and boosts overall model stability.',
    examples: ['Creating date-part features from timestamps', 'Handling missing records safely', 'Reducing dimensionality to speed up training time.']
  },
  transformation: {
    title: 'Feature Transformation',
    category: 'Major Branch',
    icon: Layers,
    color: '#38bdf8',
    desc: 'Modifying existing features by changing their mathematical representation, format, or distribution without altering the fundamental underlying information. This prepares features for optimal learning by specific model types.',
    why: 'Different algorithms require data in specific formats. For instance, distance-based models need scaled values, while linear models require normal/Gaussian data distributions.',
    examples: ['Applying log transformations to skewed numeric columns', 'Converting text labels to integers', 'Clipping outliers to prevent distribution distortion.']
  },
  imputation: {
    title: 'Missing Value Imputation',
    category: 'Transformation Step',
    icon: HelpCircle,
    color: '#fbbf24',
    desc: 'The process of identifying missing values (NaN, null, or blanks) and substituting them with plausible values to prevent data loss or model crashes.',
    why: 'Many ML algorithms cannot handle missing entries natively. Dropping rows with missing values wastes valuable data, while improper imputation can introduce statistical bias.',
    examples: ['Mean/Median imputation for normal/skewed numerical fields', 'Mode imputation for categorical levels', 'Advanced KNN or MICE imputation for complex relationships.']
  },
  categorical: {
    title: 'Handling Categorical Features',
    category: 'Transformation Step',
    icon: Binary,
    color: '#06b6d4',
    desc: 'Encoding non-numeric text variables (categories, flags, or groups) into numerical representations so they can be processed by mathematical algorithms.',
    why: 'ML models are fundamentally mathematical calculators that require numerical matrices. If you don\'t convert text columns to numbers, the algorithm cannot execute.',
    examples: ['One-Hot Encoding for low cardinality nominal variables', 'Ordinal Encoding for variables with rank (e.g. High/Med/Low)', 'Target encoding for high-cardinality values.']
  },
  outliers: {
    title: 'Outlier Detection & Handling',
    category: 'Transformation Step',
    icon: Scissors,
    color: '#ec4899',
    desc: 'Identifying extreme values that sit far outside the general distribution of a feature, and applying trimming, capping, or winsorization strategies.',
    why: 'Outliers heavily distort calculations of mean and variance, pull linear regression lines away from the true relationship, and lead to poor generalizability.',
    examples: ['Z-Score method (for normally distributed variables)', 'IQR (Interquartile Range) method (for skewed datasets)', 'Capping values at the 99th percentile.']
  },
  scaling: {
    title: 'Feature Scaling',
    category: 'Transformation Step',
    icon: Maximize,
    color: '#6366f1',
    desc: 'Transforming numerical variables to have similar scales or ranges, ensuring that no single feature dominates the model weights due to its magnitude.',
    why: 'Distance-based algorithms (like KNN, SVM) and gradient-descent algorithms (like Neural Networks) converge much faster and perform better when features are scaled equally.',
    examples: ['Standardization (StandardScaler: mean=0, std=1)', 'Normalization (MinMaxScaler: range [0, 1])', 'Robust scaling (using median and IQR for outliers).']
  },
  construction: {
    title: 'Feature Construction',
    category: 'Major Branch',
    icon: Grid,
    color: '#10b981',
    desc: 'Creating entirely new, highly predictive features by combining or manipulating one or more existing raw variables in the dataset.',
    why: 'Helps the model capture non-linear interactions and real-world relationships that it might otherwise struggle to learn from single features alone.',
    examples: ['Combining SibSp and Parch to create "FamilySize" in Titanic', 'Calculating "PricePerSquareFoot" from total price and area', 'Creating "IsWeekend" from date stamps.']
  },
  selection: {
    title: 'Feature Selection',
    category: 'Major Branch',
    icon: Filter,
    color: '#f43f5e',
    desc: 'Selecting the most relevant subset of features from the engineered dataset, and dropping redundant, highly correlated, or noisy variables.',
    why: 'Reduces model complexity, prevents the Curse of Dimensionality, reduces overfitting risk, and speeds up training and inference times.',
    examples: ['Correlation matrices to drop redundant variables', 'Recursive Feature Elimination (RFE)', 'L1 regularization (Lasso regression) to zero out weights.']
  },
  extraction: {
    title: 'Feature Extraction',
    category: 'Major Branch',
    icon: Cpu,
    color: '#8b5cf6',
    desc: 'Projecting high-dimensional data into a completely new, lower-dimensional space while preserving as much of the original variance and information as possible.',
    why: 'Particularly valuable for dense, high-dimensional datasets like images, audio signals, or textual tf-idf vectors where individual feature interpretations are less critical than overall patterns.',
    examples: ['PCA (Principal Component Analysis)', 'LDA (Linear Discriminant Analysis)', 't-SNE (t-Distributed Stochastic Neighbor Embedding).']
  }
};

export default function Pipeline() {
  const [selectedKey, setSelectedKey] = useState('root');
  const details = DEFINITIONS[selectedKey] || DEFINITIONS.root;
  const ActiveIcon = details.icon;

  return (
    <div className="tab-layout-container fade-in">
      {/* Hero Title */}
      <div className="hero-section" style={{ paddingBottom: '1.5rem' }}>
        <div className="hero-badge">
          <Sparkles size={12} />
          <span>Interactive Hierarchy Map</span>
        </div>
        <h2 className="hero-title">Feature Engineering Framework</h2>
        <p className="hero-subtitle">
          Explore the structural hierarchy of Feature Engineering. Hover or click on the nodes in the map below to view details and definitions.
        </p>
      </div>

      {/* Grid: Tree diagram + Detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Left: Tree Diagram Container */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <h3 className="section-title-sub" style={{ alignSelf: 'flex-start', marginBottom: '1.5rem' }}>Interactive Process Hierarchy</h3>

          <div style={{ width: '100%', maxWidth: '750px', background: '#070b14', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', padding: '1.5rem 0.5rem', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
            
            {/* SVG Tree rendering */}
            <svg width="720" height="420" viewBox="0 0 720 420" style={{ display: 'block' }}>
              <defs>
                <marker id="branch-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
                <marker id="sub-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* Connecting Lines: Root to 4 main branches */}
              <path d="M 360,50 L 140,110" stroke={selectedKey === 'transformation' ? '#38bdf8' : '#334155'} strokeWidth={selectedKey === 'transformation' ? '2.5' : '1.5'} fill="none" />
              <path d="M 360,50 L 300,110" stroke={selectedKey === 'construction' ? '#10b981' : '#334155'} strokeWidth={selectedKey === 'construction' ? '2.5' : '1.5'} fill="none" />
              <path d="M 360,50 L 460,110" stroke={selectedKey === 'selection' ? '#f43f5e' : '#334155'} strokeWidth={selectedKey === 'selection' ? '2.5' : '1.5'} fill="none" />
              <path d="M 360,50 L 620,110" stroke={selectedKey === 'extraction' ? '#8b5cf6' : '#334155'} strokeWidth={selectedKey === 'extraction' ? '2.5' : '1.5'} fill="none" />

              {/* Connecting Lines: Transformation to its 4 sub-items */}
              {/* Vertical line extending down */}
              <line x1="80" y1="150" x2="80" y2="370" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Horizontal arrows to items */}
              <path d="M 80,200 L 110,200" stroke="#38bdf8" strokeWidth="1.5" fill="none" markerEnd="url(#sub-arrow)" />
              <path d="M 80,250 L 110,250" stroke="#38bdf8" strokeWidth="1.5" fill="none" markerEnd="url(#sub-arrow)" />
              <path d="M 80,300 L 110,300" stroke="#38bdf8" strokeWidth="1.5" fill="none" markerEnd="url(#sub-arrow)" />
              <path d="M 80,350 L 110,350" stroke="#38bdf8" strokeWidth="1.5" fill="none" markerEnd="url(#sub-arrow)" />

              {/* ROOT: Feature Engineering */}
              <g 
                onClick={() => setSelectedKey('root')}
                onMouseEnter={() => setSelectedKey('root')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="260" y="10" width="200" height="40" rx="8" 
                  fill={selectedKey === 'root' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.8)'} 
                  stroke={selectedKey === 'root' ? '#6366f1' : '#475569'} 
                  strokeWidth={selectedKey === 'root' ? '2.5' : '1.5'} 
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x="360" y="34" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle">Feature Engineering</text>
              </g>

              {/* BRANCH 1: Feature Transformation */}
              <g 
                onClick={() => setSelectedKey('transformation')}
                onMouseEnter={() => setSelectedKey('transformation')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="30" y="110" width="165" height="40" rx="6" 
                  fill={selectedKey === 'transformation' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(15, 23, 42, 0.8)'} 
                  stroke={selectedKey === 'transformation' ? '#38bdf8' : '#475569'} 
                  strokeWidth={selectedKey === 'transformation' ? '2' : '1.5'} 
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x="112.5" y="134" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle">Feature Transformation</text>
              </g>

              {/* Sub-item 1.1: Missing Value Imputation */}
              <g 
                onClick={() => setSelectedKey('imputation')}
                onMouseEnter={() => setSelectedKey('imputation')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="115" y="182" width="170" height="35" rx="5" 
                  fill={selectedKey === 'imputation' ? 'rgba(251, 191, 36, 0.2)' : 'rgba(15, 23, 42, 0.6)'} 
                  stroke={selectedKey === 'imputation' ? '#fbbf24' : 'rgba(255,255,255,0.08)'} 
                  strokeWidth="1.5"
                />
                <text x="200" y="203" fill="#cbd5e1" fontSize="10" fontWeight="600" textAnchor="middle">Missing Value Imputation</text>
              </g>

              {/* Sub-item 1.2: Handling Categorical Features */}
              <g 
                onClick={() => setSelectedKey('categorical')}
                onMouseEnter={() => setSelectedKey('categorical')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="115" y="232" width="170" height="35" rx="5" 
                  fill={selectedKey === 'categorical' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(15, 23, 42, 0.6)'} 
                  stroke={selectedKey === 'categorical' ? '#06b6d4' : 'rgba(255,255,255,0.08)'} 
                  strokeWidth="1.5"
                />
                <text x="200" y="253" fill="#cbd5e1" fontSize="10" fontWeight="600" textAnchor="middle">Handling Categorical Features</text>
              </g>

              {/* Sub-item 1.3: Outlier Detection */}
              <g 
                onClick={() => setSelectedKey('outliers')}
                onMouseEnter={() => setSelectedKey('outliers')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="115" y="282" width="170" height="35" rx="5" 
                  fill={selectedKey === 'outliers' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(15, 23, 42, 0.6)'} 
                  stroke={selectedKey === 'outliers' ? '#ec4899' : 'rgba(255,255,255,0.08)'} 
                  strokeWidth="1.5"
                />
                <text x="200" y="303" fill="#cbd5e1" fontSize="10" fontWeight="600" textAnchor="middle">Outlier Detection & Handling</text>
              </g>

              {/* Sub-item 1.4: Feature Scaling */}
              <g 
                onClick={() => setSelectedKey('scaling')}
                onMouseEnter={() => setSelectedKey('scaling')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="115" y="332" width="170" height="35" rx="5" 
                  fill={selectedKey === 'scaling' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)'} 
                  stroke={selectedKey === 'scaling' ? '#6366f1' : 'rgba(255,255,255,0.08)'} 
                  strokeWidth="1.5"
                />
                <text x="200" y="353" fill="#cbd5e1" fontSize="10" fontWeight="600" textAnchor="middle">Feature Scaling</text>
              </g>

              {/* BRANCH 2: Feature Construction */}
              <g 
                onClick={() => setSelectedKey('construction')}
                onMouseEnter={() => setSelectedKey('construction')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="215" y="110" width="140" height="40" rx="6" 
                  fill={selectedKey === 'construction' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.8)'} 
                  stroke={selectedKey === 'construction' ? '#10b981' : '#475569'} 
                  strokeWidth={selectedKey === 'construction' ? '2' : '1.5'} 
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x="285" y="134" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle">Feature Construction</text>
              </g>

              {/* BRANCH 3: Feature Selection */}
              <g 
                onClick={() => setSelectedKey('selection')}
                onMouseEnter={() => setSelectedKey('selection')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="375" y="110" width="140" height="40" rx="6" 
                  fill={selectedKey === 'selection' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(15, 23, 42, 0.8)'} 
                  stroke={selectedKey === 'selection' ? '#f43f5e' : '#475569'} 
                  strokeWidth={selectedKey === 'selection' ? '2' : '1.5'} 
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x="445" y="134" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle">Feature Selection</text>
              </g>

              {/* BRANCH 4: Feature Extraction */}
              <g 
                onClick={() => setSelectedKey('extraction')}
                onMouseEnter={() => setSelectedKey('extraction')}
                style={{ cursor: 'pointer' }}
              >
                <rect 
                  x="535" y="110" width="140" height="40" rx="6" 
                  fill={selectedKey === 'extraction' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(15, 23, 42, 0.8)'} 
                  stroke={selectedKey === 'extraction' ? '#8b5cf6' : '#475569'} 
                  strokeWidth={selectedKey === 'extraction' ? '2' : '1.5'} 
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text x="605" y="134" fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle">Feature Extraction</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Definition & Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="definition-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease' }}>
            
            {/* Header info */}
            <div>
              <span style={{ fontSize: '0.72rem', background: `${details.color}20`, color: details.color, padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {details.category}
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.50rem', borderRadius: '8px', background: `${details.color}15`, color: details.color }}>
                  <ActiveIcon size={20} />
                </div>
                <h3 className="section-title-sub" style={{ margin: 0, fontSize: '1.3rem', color: '#fff' }}>{details.title}</h3>
              </div>

              {/* Main Definition Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Definition</label>
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6' }}>{details.desc}</p>
              </div>

              {/* Why it is necessary */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Why it matters</label>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>{details.why}</p>
              </div>
            </div>

            {/* Techniques/Examples */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Common Examples / Techniques</label>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem' }}>
                {details.examples.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#e2e8f0' }}>
                    <ArrowRight size={12} style={{ color: details.color, marginTop: '4px', flexShrink: 0 }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
