import React from 'react';
import { roadmapData } from '../data/roadmapData';

export default function Roadmap() {
  return (
    <div style={{ 
      background: '#fafafa', 
      padding: '4rem 1rem', 
      width: '100vw', 
      marginLeft: 'calc(-50vw + 50%)', 
      borderTop: '2px solid #1e293b', 
      borderBottom: '2px solid #1e293b',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div className="roadmap-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000', margin: 0, letterSpacing: '-0.02em' }}>
            AI Engineer Roadmap
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', marginTop: '1rem' }}>
            A complete learning progression from Python fundamentals to production-ready Agentic AI systems.
          </p>
        </div>

        <div style={{ position: 'relative', paddingLeft: '20px' }}>
          {/* Main vertical blue line */}
          <div style={{
            position: 'absolute',
            left: '36px',
            top: '24px',
            bottom: '40px',
            width: '4px',
            background: '#2563eb', // Thick blue line
            zIndex: 0
          }} />

          {roadmapData.map((section, index) => (
            <div key={section.id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem', position: 'relative', zIndex: 1, alignItems: 'flex-start' }}>
              
              {/* Horizontal Connector from main line to box */}
              <div style={{
                position: 'absolute',
                left: '36px',
                top: '24px',
                width: '30px',
                height: '4px',
                background: '#2563eb',
                zIndex: -1
              }} />

              {/* Main Node (Bright Yellow Box) */}
              <div style={{
                background: '#ffeb3b',
                border: '2px solid #000',
                borderRadius: '4px',
                padding: '8px 20px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                color: '#000',
                marginLeft: '66px', // Offset from the blue line
                display: 'inline-block'
              }}>
                {section.title}
              </div>
              
              {/* Items List (Pale Yellow Boxes) */}
              <div style={{ 
                marginLeft: '66px',
                marginTop: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {section.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Checkbox */}
                    <div style={{ 
                      width: '18px', 
                      height: '18px', 
                      border: '2px solid #000', 
                      borderRadius: '3px',
                      background: '#fff',
                      flexShrink: 0
                    }}></div>
                    
                    {/* Item Box */}
                    <div style={{
                      background: '#fff9c4', // Very pale yellow
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '0.95rem',
                      color: '#000',
                      border: '1px solid transparent',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      minWidth: '280px',
                      maxWidth: '100%',
                      boxShadow: '1px 1px 0px rgba(0,0,0,0.05)'
                    }}>
                      <span>{item}</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#9333ea', // Purple text for the tag 
                        fontWeight: '600', 
                        marginLeft: '2rem' 
                      }}>
                        Concept
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
