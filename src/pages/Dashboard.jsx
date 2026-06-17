import React from 'react';
import {
  Layers, GitBranch, GitMerge, Hash, Cpu, BarChart2, Scissors, ToggleLeft, 
  Activity, Coffee, ChevronRight, Zap, BookOpen, CheckCircle2, ArrowRight
} from 'lucide-react';

const flowSteps = [
  {
    id: 'pipeline',
    stepNumber: 'Step 1',
    icon: GitBranch,
    title: 'FE Hierarchy Map',
    subtitle: 'Core Taxonomy',
    desc: 'Explore the theoretical taxonomy of feature transformation, construction, selection, and extraction in data science.',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.15)',
  },
  {
    id: 'missing',
    stepNumber: 'Step 2',
    icon: Search => <span>🔍</span>, // search icon fallback
    title: 'Missing Values',
    subtitle: 'Imputation Strategies',
    desc: 'Safely handle nulls and NaNs using mean, median, mode, or categorical flag replacement without introducing bias.',
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.15)',
  },
  {
    id: 'encoding',
    stepNumber: 'Step 3',
    icon: Layers,
    title: 'Categorical Encoding',
    subtitle: 'Text to Numerical',
    desc: 'Convert labels and categories into math-ready formats using One-Hot Encoding and Ordinal Encoding.',
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    id: 'mixed',
    stepNumber: 'Step 4',
    icon: GitMerge,
    title: 'Mixed Variables',
    subtitle: 'Feature Extraction',
    desc: 'Extract numbers or categories from columns containing mixed data formats (e.g., ticket codes, address details).',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.15)',
  },
  {
    id: 'outlier',
    stepNumber: 'Step 5',
    icon: TrendingDown => <span>📉</span>,
    title: 'Outlier Treatment',
    subtitle: 'Clipping & Winsorization',
    desc: 'Detect and trim extreme distribution tails using Z-Score, IQR, or percentile capping methods.',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.15)',
  },
  {
    id: 'scaling',
    stepNumber: 'Step 6',
    icon: Zap,
    title: 'Feature Scaling',
    subtitle: 'Normalization & Standard',
    desc: 'Equalize feature magnitudes to optimize gradient descent using StandardScaler and MinMaxScaler.',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.15)',
  },
  {
    id: 'binarization',
    stepNumber: 'Step 7',
    icon: ToggleLeft,
    title: 'Binarization',
    subtitle: 'Thresholding Rules',
    desc: 'Convert continuous features into boolean flags based on specific threshold value criteria.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    id: 'ml_pipeline',
    stepNumber: 'Step 8',
    icon: Activity,
    title: 'ML Pipeline',
    subtitle: 'End-to-End Predictor',
    desc: 'Chain all transformations and a model into one single exportable, leak-proof sklearn Pipeline.',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.18)',
  }
];

const stats = [
  { value: '8', label: 'Interactive Steps', icon: BookOpen },
  { value: '100%', label: 'Hands-on Code', icon: CheckCircle2 },
  { value: '5+', label: 'Worked Datasets', icon: Layers },
  { value: 'Colab', label: 'Notebooks Included', icon: Cpu },
];

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Hero Header */}
      <div className="dash-hero" style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(8,12,28,0.95), rgba(15,23,42,0.85))',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '24px',
        padding: '3.5rem 3rem',
        overflow: 'hidden',
        marginBottom: '3.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div className="dash-hero-inner" style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div className="dash-hero-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem'
          }}>
            <Zap size={12} /> Interactive ML Pipeline Studio
          </div>
          
          <h1 className="dash-hero-title" style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '3.2rem',
            fontWeight: 850,
            lineHeight: 1.15,
            color: '#fff',
            marginBottom: '1.25rem',
            letterSpacing: '-0.03em'
          }}>
            Master Feature<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a5b4fc, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 850
            }}>Engineering Flow</span>
          </h1>
          
          <p className="dash-hero-sub" style={{
            fontSize: '1rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Learn how raw data is cleaned, encoded, scaled, and packed into deployable 
            Scikit-Learn ML pipelines. Tap any step below to explore interactive calculators and codes.
          </p>

          <button
            onClick={() => onNavigate('pipeline')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: '#fff',
              border: 'none',
              padding: '0.85rem 1.75rem',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(99,102,241,0.35)'; }}
          >
            <span>Start Learning Flow</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '2rem',
          marginTop: '2.5rem',
          position: 'relative',
          zIndex: 2
        }}>
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>{s.value}</span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pipeline Flow Stepper Section */}
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', marginBottom: '0.35rem' }}>Logical Pipeline Flow</h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Data preprocessing steps should be executed in this sequence to maintain model integrity.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                onClick={() => onNavigate(step.id)}
                style={{
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.border = `1px solid ${step.color}35`;
                  e.currentTarget.style.background = `${step.color}05`;
                  e.currentTarget.style.boxShadow = `0 8px 30px ${step.glow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Step badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: step.color,
                  background: `${step.color}15`,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                }}>
                  {step.stepNumber}
                </div>

                {/* Icon Wrap */}
                <div style={{
                  display: 'inline-flex',
                  padding: '0.6rem',
                  borderRadius: '10px',
                  background: `${step.color}15`,
                  color: step.color,
                  marginBottom: '1rem',
                }}>
                  {typeof Icon === 'function' && idx === 1 ? Icon() : typeof Icon === 'function' && idx === 4 ? Icon() : <Icon size={20} />}
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{step.title}</h3>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.75rem' }}>{step.subtitle}</h4>
                
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {step.desc}
                </p>

                {/* Footer indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: '1.25rem', color: step.color, fontSize: '0.78rem', fontWeight: 700 }}>
                  <span>Explore step</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Callout */}
      <div
        onClick={() => onNavigate('support')}
        style={{
          marginTop: '3.5rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(236,72,153,0.04))',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.35)'; }}
        onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.18)'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.12)', borderRadius: '12px', color: '#818cf8' }}>
            <Coffee size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>Like this project? Support the Creator!</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>Made with love by Abhinay Yadav. Buy me a chai + sutta for just ₹35!</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700 }}>
          <span>Show Support</span>
          <ChevronRight size={14} />
        </div>
      </div>

    </div>
  );
}
