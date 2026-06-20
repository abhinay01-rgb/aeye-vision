import React from 'react';
import { Database, LineChart, Hash, BarChart3, ExternalLink, Play, Sparkles } from 'lucide-react';

const EDA_LIBRARIES = [
  {
    name: 'Pandas',
    description: 'Data manipulation and analysis library. Essential for cleaning, filtering, grouping, and exploring structured datasets using DataFrames.',
    color: '#ff6b6b',
    glow: 'rgba(255, 107, 107, 0.15)',
    icon: Database,
    notebooks: [
      { label: 'DataFrame Operations & Imputation', url: 'https://colab.research.google.com/drive/1Te483lmZDDKzzU0YFnuHiSy87AHquJKF' },
      { label: 'Data Cleaning & Grouping Tutorial', url: 'https://colab.research.google.com/drive/1k_CV931NE4_jMxmu3k2ASPMmIA4g5Wcn' }
    ]
  },
  {
    name: 'NumPy',
    description: 'The fundamental package for scientific computing in Python. Provides powerful N-dimensional array objects, vectorization, and mathematical tools.',
    color: '#4ade80',
    glow: 'rgba(74, 222, 128, 0.15)',
    icon: Hash,
    notebooks: [
      { label: 'ND-Array Operations & Matrix Math', url: 'https://colab.research.google.com/drive/1GEkNfxnCPfzX8TCymkZJvWbkpGKZRgiK' },
      { label: 'Numerical Analysis & Random Generation', url: 'https://colab.research.google.com/drive/1RVe07-2VU4Jft8GLFyf10PrQIOVfffaR' }
    ]
  },
  {
    name: 'Matplotlib',
    description: 'A comprehensive library for creating static, animated, and interactive visualizations in Python. The foundation of plotting in data science.',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.15)',
    icon: LineChart,
    notebooks: [
      { label: 'Core Visualizations & Plot Anatomy', url: 'https://colab.research.google.com/drive/1ksmroQtN_KoCeJzpzPgGAbLv0UG_6G_a' },
      { label: 'Advanced Plotting & Subplots Control', url: 'https://colab.research.google.com/drive/14TP6tNzUT5M0YfgzwTMF_6WBuQkLUgXp' }
    ]
  },
  {
    name: 'Seaborn',
    description: 'A statistical data visualization library built on top of Matplotlib. Offers high-level interfaces for drawing attractive and informative plots.',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.15)',
    icon: BarChart3,
    notebooks: [
      { label: 'Statistical Distributions & Density Plots', url: 'https://colab.research.google.com/drive/1kZiyz4lt4TNCE1g98rj3uzCKW-mPmJZ8' },
      { label: 'Multi-plot Grids & Relationship Analytics', url: 'https://colab.research.google.com/drive/18GuhOaBBhaBJ9RtVNHRJQzNxNPPSKBrD' }
    ]
  }
];

export default function EDA() {
  return (
    <div className="tab-content fade-in" style={{ position: 'relative', zIndex: 1 }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
        top: '-5%',
        left: '10%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Header section */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.2)',
          color: '#38bdf8',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '50px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          <Sparkles size={12} />
          <span>Exploratory Data Analysis</span>
        </div>
        <h2 className="section-title-main" style={{ fontSize: '2.2rem', fontWeight: 850, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Data Exploration & Visualization
        </h2>
        <p className="tutorial-paragraph" style={{ maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.92rem', color: '#94a3b8' }}>
          Understand your dataset distribution, statistics, correlations, and clean variables using interactive Google Colab notebooks.
        </p>
      </div>

      {/* Grid of Libraries */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {EDA_LIBRARIES.map((lib) => {
          const Icon = lib.icon;
          return (
            <div
              key={lib.name}
              style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '20px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = `${lib.color}35`;
                e.currentTarget.style.background = `${lib.color}03`;
                e.currentTarget.style.boxShadow = `0 10px 30px ${lib.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: `${lib.color}15`,
                  color: lib.color,
                  border: `1px solid ${lib.color}25`
                }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                  {lib.name}
                </h3>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.82rem',
                color: '#94a3b8',
                lineHeight: '1.6',
                margin: 0,
                flex: 1
              }}>
                {lib.description}
              </p>

              {/* Notebooks List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Interactive Google Colabs:
                </div>
                {lib.notebooks.map((nb, i) => (
                  <a
                    key={i}
                    href={nb.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(8, 12, 28, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = lib.color;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = 'rgba(8, 12, 28, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.color = '#cbd5e1';
                      e.currentTarget.style.background = 'rgba(8, 12, 28, 0.5)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Play size={10} style={{ color: lib.color, fill: lib.color }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{nb.label}</span>
                    </div>
                    <ExternalLink size={12} style={{ flexShrink: 0, opacity: 0.6 }} />
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
