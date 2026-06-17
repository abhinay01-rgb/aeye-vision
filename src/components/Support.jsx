import React, { useState } from 'react';
import { Coffee, Heart, Check, Copy, Sparkles, MessageSquareHeart } from 'lucide-react';

export default function Support() {
  const [copied, setCopied] = useState(false);
  const upiId = '7080218556@ptyes';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tab-layout-container fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem 1rem' }}>
      
      {/* Glow Effects */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        top: '20%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        bottom: '20%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Support Card */}
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        textAlign: 'center',
        backdropFilter: 'blur(16px)'
      }}>
        
        {/* Heart Icon Badge */}
        <div style={{
          display: 'inline-flex',
          padding: '1rem',
          borderRadius: '50%',
          background: 'rgba(236, 72, 153, 0.1)',
          color: '#ec4899',
          marginBottom: '1.5rem',
          boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)',
          animation: 'pulse 2s infinite'
        }}>
          <Heart size={28} fill="#ec4899" />
        </div>

        <h2 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#fff',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em'
        }}>
          Support the Creator
        </h2>

        <p style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
          marginBottom: '1.5rem',
          lineHeight: '1.6'
        }}>
          Made with ❤️ by <strong style={{ color: '#fff' }}>Abhinay Yadav</strong>. If this project helped you learn pipelines or save development time, consider showing some love!
        </p>

        {/* Highlighted box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: 700, fontSize: '1rem' }}>
            <Coffee size={18} />
            <span>Buy me a Chai + Sutta</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>
            just ₹35 ☕🚬
          </div>
        </div>

        {/* UPI QR Code Container */}
        <div style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '20px',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src="/paytm_qr.jpg"
            alt="Paytm UPI QR Code"
            style={{
              width: '100%',
              maxWidth: '260px',
              height: 'auto',
              borderRadius: '12px'
            }}
          />
        </div>

        <p style={{
          fontSize: '0.75rem',
          color: '#64748b',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>
          Scan QR with any UPI app
        </p>

        {/* UPI ID display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '12px',
          padding: '0.6rem 1rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.82rem',
          color: '#cbd5e1'
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {upiId}
          </span>
          <button
            onClick={copyToClipboard}
            style={{
              background: 'transparent',
              border: 'none',
              color: copied ? '#10b981' : '#6366f1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '0.5rem'
            }}
            title="Copy UPI ID"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
