import React from 'react';
import { roadmapData } from '../data/roadmapData';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

export default function Roadmap() {
  return (
    <div className="roadmap-container" style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
          🚀 AI Engineer Roadmap (2026)
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px', margin: '1rem auto' }}>
          A complete learning progression from Python fundamentals to production-ready Agentic AI systems.
        </p>
      </div>

      <div className="roadmap-timeline" style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '28px',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />

        {roadmapData.map((section, index) => (
          <div key={section.id} style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
            {/* Timeline Marker */}
            <div style={{ 
              width: '58px', 
              height: '58px', 
              borderRadius: '50%', 
              background: '#0f172a', 
              border: `2px solid ${section.color}`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
              boxShadow: `0 0 15px ${section.color}30`
            }}>
              {section.icon}
            </div>

            {/* Content Card */}
            <div style={{ 
              flex: 1, 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px', 
              padding: '1.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = `${section.color}40`;
              e.currentTarget.style.background = `${section.color}05`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: section.color, marginBottom: '1rem' }}>
                {section.title}
              </h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {section.items.map((item, idx) => (
                  <span key={idx} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: '#e2e8f0'
                  }}>
                    <CheckCircle2 size={12} style={{ color: section.color }} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Final Destination */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: '58px', 
            height: '58px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0,
            boxShadow: '0 0 20px rgba(236,72,153,0.5)'
          }}>
            👨‍💻
          </div>

          <div style={{ 
            flex: 1, 
            background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))',
            border: '1px solid rgba(236,72,153,0.3)',
            borderRadius: '16px', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              Production AI Engineer
            </h3>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
              You are now ready to build, scale, and deploy cutting-edge Agentic AI systems in production!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
