import React from 'react';
import { Heart, Sparkles, Code, Target, Briefcase, GraduationCap, ExternalLink, Award } from 'lucide-react';

export default function Support() {
  return (
    <div className="creator-container fade-in">
      
      {/* Glow Effects */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        top: '10%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        bottom: '10%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div className="creator-card">
        
        {/* Made by IITian Badge */}
        <div className="iitian-badge">
          <Award size={12} />
          <span>Made by IITian</span>
        </div>

        {/* Profile Section (No Image) */}
        <div className="creator-profile">
          
          {/* Glowing Icon Badge in place of Image */}
          <div className="creator-avatar-badge">
            <GraduationCap size={36} style={{ color: '#fbbf24' }} />
          </div>

          <h2 className="creator-name">
            Abhinay Yadav
          </h2>

          <div className="creator-roles">
            <Briefcase size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
            <span style={{ verticalAlign: 'middle' }}>Data Scientist at 50 Star Technologies (US Office)</span>
            <span className="separator" style={{ color: '#475569' }}>•</span>
            <span style={{ verticalAlign: 'middle' }}>Ex-SDE, IIT Mandi</span>
          </div>

          <div className="creator-degree">
            <GraduationCap size={15} style={{ color: '#fbbf24' }} />
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>IIT Jodhpur M.Tech (AI & Data Science)</span>
            <span className="separator" style={{ color: '#475569' }}>|</span>
            <span>AI & Data Science Educator</span>
          </div>

        </div>

        {/* LinkedIn CTA */}
        <a 
          href="https://www.linkedin.com/in/abhinay01/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="creator-linkedin-cta"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ExternalLink size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 500 }}>LinkedIn Profile</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>linkedin.com/in/abhinay01</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>Connect on LinkedIn</span>
            <ExternalLink size={14} />
          </div>
        </a>

        {/* Bio & Details */}
        <div className="creator-bio-section">
          
          {/* Global Mentorship */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '16px', background: '#ec4899', borderRadius: '2px' }} />
              Global Educator & Mentor
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              As a freelance educator and corporate trainer, I have mentored students and professionals from India, USA, UK, Singapore, China, Taiwan, and other countries through leading EdTech organizations and training platforms. My expertise includes Generative AI, Large Language Models (LLMs), Machine Learning, Deep Learning, Data Science, Data Analytics, Python, RAG Systems, Agentic AI, and MLOps.
            </p>
          </div>

          {/* Teaching Philosophy */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '16px', background: '#fbbf24', borderRadius: '2px' }} />
              Teaching Philosophy
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
              My teaching methodology focuses on project-based learning, hands-on implementation, and real-world problem solving, enabling learners to build practical, industry-ready skills rather than just theoretical knowledge.
            </p>
          </div>

          {/* Lovely good message for students */}
          <div className="creator-inspiration-box">
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#0b0f19',
              padding: '2px 12px',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '20px',
              fontSize: '0.72rem',
              color: '#818cf8',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap'
            }}>
              <Sparkles size={12} />
              <span>Words of Inspiration</span>
            </div>
            <p style={{
              fontSize: '0.98rem',
              color: '#e2e8f0',
              fontWeight: 500,
              lineHeight: '1.6',
              margin: '0.25rem 0 0.5rem 0',
              fontStyle: 'italic'
            }}>
              "Take it step-by-step, build real projects, and experiment with the concepts. Your hard work, consistency, and curiosity will pave the way to your success."
            </p>
            <p style={{
              fontSize: '0.85rem',
              color: '#a5b4fc',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Keep working hard, stay curious, and shape the future! 🚀
            </p>
          </div>

          {/* Core Pillars */}
          <div className="creator-pillars-grid">
            <div style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                <Code size={16} />
                <span>Write Code Daily</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Consistency is your superpower. Small daily steps lead to massive gains over time.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ec4899', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.85rem' }}>
                <Target size={16} />
                <span>Embrace Failure</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Bugs are lessons in disguise. Every fixed error makes you a better engineer.
              </p>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .creator-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding: 2rem 1rem;
          width: 100%;
        }

        .creator-card {
          max-width: 680px;
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 3rem 2.5rem;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
        }

        .iitian-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #000;
          font-weight: 800;
          font-size: 0.72rem;
          padding: 4px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .creator-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2.5rem;
          margin-top: 1rem;
        }

        .creator-avatar-badge {
          display: inline-flex;
          padding: 1.2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.05));
          color: #818cf8;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.2);
          animation: pulse 3s infinite;
        }

        .creator-name {
          font-family: 'Outfit', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.25rem;
          letter-spacing: -0.02em;
        }

        .creator-roles {
          font-size: 0.95rem;
          color: #a5b4fc;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .creator-degree {
          font-size: 0.85rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          background: rgba(255,255,255,0.02);
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.04);
          margin-top: 0.5rem;
        }

        .creator-linkedin-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #0a66c2, #0077b5);
          border: none;
          border-radius: 16px;
          padding: 1.2rem 1.5rem;
          color: #fff;
          text-decoration: none;
          margin-bottom: 2.5rem;
          box-shadow: 0 8px 20px rgba(10, 102, 194, 0.25);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .creator-linkedin-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(10, 102, 194, 0.4);
        }

        .creator-bio-section {
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .creator-pillars-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          text-align: left;
        }

        .creator-inspiration-box {
          background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(236,72,153,0.03));
          border: 1px solid rgba(99,102,241,0.12);
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 0.5rem;
          text-align: center;
          position: relative;
        }

        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 25px rgba(99, 102, 241, 0.25); }
          50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(99, 102, 241, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 25px rgba(99, 102, 241, 0.25); }
        }

        @media (max-width: 768px) {
          .creator-card {
            padding: 2.5rem 1.25rem 2rem;
            border-radius: 20px;
          }
          .iitian-badge {
            position: static;
            margin-bottom: 1.25rem;
            display: inline-flex;
            justify-content: center;
            align-self: center;
          }
          .creator-profile {
            margin-top: 0;
            margin-bottom: 2rem;
          }
          .creator-name {
            font-size: 1.9rem;
          }
          .creator-roles {
            font-size: 0.85rem;
            flex-direction: column;
            gap: 6px;
          }
          .creator-roles .separator {
            display: none !important;
          }
          .creator-degree {
            font-size: 0.78rem;
            padding: 8px 12px;
            flex-direction: column;
            gap: 6px;
            border-radius: 12px;
          }
          .creator-degree .separator {
            display: none !important;
          }
          .creator-linkedin-cta {
            flex-direction: column;
            align-items: stretch;
            gap: 1.25rem;
            text-align: center;
            padding: 1.2rem 1rem;
            border-radius: 14px;
          }
          .creator-linkedin-cta > div {
            display: flex;
            flex-direction: column;
            align-items: center !important;
            text-align: center !important;
            gap: 0.5rem;
          }
          .creator-linkedin-cta > div:last-child {
            flex-direction: row;
            justify-content: center;
            gap: 4px;
          }
          .creator-pillars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
