import React from 'react';
import {
  Layers, GitBranch, GitMerge, Hash, Cpu, BarChart2, Scissors, ToggleLeft, 
  Activity, Heart, ChevronRight, Zap, BookOpen, CheckCircle2, ArrowRight
} from 'lucide-react';

import Roadmap from '../components/Roadmap';

export default function Dashboard({ onNavigate }) {
  return (
    <div className="dashboard fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Hero Header */}
      <div className="dash-hero">
        <div className="dash-hero-inner" style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
          <div className="dash-hero-badge">
            <Zap size={12} /> 🚀 Learn AI Through Interactive Visualizations
          </div>
          
          <h1 className="dash-hero-title">
            Master AI with Interactive<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a5b4fc, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 850
            }}>Visual Learning</span>
          </h1>
          
          <div style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#8b5cf6',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Machine Learning • Deep Learning • Generative AI • Agentic AI
          </div>

          <p className="dash-hero-sub">
            Learn complex AI concepts through intuitive visualizations, interactive playgrounds, real-world projects, animations, and hands-on coding. From fundamentals to advanced AI systems—all in one place.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
              <span>🚀 Start Learning</span>
            </button>
            
            <button
              onClick={() => document.getElementById('roadmap-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.85rem 1.75rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            >
              <span>📚 Explore Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div id="roadmap-section" style={{ marginTop: '3rem' }}>
        <Roadmap />
      </div>

      {/* Interview Question Bank Callout */}
      <div
        onClick={() => onNavigate('question_bank')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(56,189,248,0.03))',
          border: '1px solid rgba(99,102,241,0.12)',
          borderRadius: '20px',
          padding: '1.5rem 2rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginTop: '2.5rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)';
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.09), rgba(56,189,248,0.05))';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)';
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(56,189,248,0.03))';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', color: '#6366f1' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>Placement Interview Question Bank 📚</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>Real company-wise & topic-wise questions from Nile, Intelliwings, Meridian Solutions, FLAM, Scopely, and more.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700 }}>
          <span>Practice Questions</span>
          <ChevronRight size={14} />
        </div>
      </div>

      {/* Motivation Callout */}
      <div
        onClick={() => onNavigate('support')}
        className="motivation-callout"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(236,72,153,0.1)', borderRadius: '12px', color: '#ec4899' }}>
            <Heart size={24} fill="#ec4899" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>Meet the Creator (IITian Data Scientist)</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>Connect with Abhinay Yadav, learn about his AI background, and get inspired to work hard.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 700 }}>
          <span>View Profile & Motivation</span>
          <ChevronRight size={14} />
        </div>
      </div>

    </div>
  );
}
