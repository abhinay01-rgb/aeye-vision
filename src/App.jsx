import React, { useState } from 'react';
import {
  Layers, Zap, Search, Activity, TrendingDown, GitMerge, ToggleLeft, 
  GitBranch, Coffee, Home, ChevronLeft, ChevronRight, LayoutDashboard
} from 'lucide-react';
import Scaling from './components/Scaling';
import MissingValues from './components/MissingValues';
import Pipeline from './components/Pipeline';
import MLPipeline from './components/MLPipeline';
import Encoding from './components/Encoding';
import OutlierHandling from './components/OutlierHandling';
import MixedVariables from './components/MixedVariables';
import Binarization from './components/Binarization';
import Support from './components/Support';
import Dashboard from './pages/Dashboard';
import './App.css'; 

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState('dashboard');

  const mainTabs = [
    { id: 'dashboard',    label: 'Dashboard',        icon: LayoutDashboard },
    { id: 'pipeline',     label: 'FE Hierarchy',     icon: GitBranch },
    { id: 'missing',      label: 'Missing Values',    icon: Search },
    { id: 'encoding',     label: 'Encoding',          icon: Layers },
    { id: 'mixed',        label: 'Mixed Variables',   icon: GitMerge },
    { id: 'outlier',      label: 'Outlier Handling',  icon: TrendingDown },
    { id: 'scaling',      label: 'Feature Scaling',   icon: Zap },
    { id: 'binarization', label: 'Binarization',      icon: ToggleLeft },
    { id: 'ml_pipeline',  label: 'ML Pipeline',      icon: Activity },
    { id: 'support',      label: 'Buy Me Chai ☕',    icon: Coffee },
  ];

  // Pipeline flow steps (excluding dashboard and support)
  const flowSteps = [
    'pipeline',
    'missing',
    'encoding',
    'mixed',
    'outlier',
    'scaling',
    'binarization',
    'ml_pipeline'
  ];

  const currentFlowIdx = flowSteps.indexOf(activeMainTab);
  const isFlowActive = currentFlowIdx !== -1;

  const handleNext = () => {
    if (currentFlowIdx < flowSteps.length - 1) {
      setActiveMainTab(flowSteps[currentFlowIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveMainTab('support');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentFlowIdx > 0) {
      setActiveMainTab(flowSteps[currentFlowIdx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveMainTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => setActiveMainTab('dashboard')}>
          <div className="logo-icon"><Layers size={22} /></div>
          <div>
            <h1 className="logo-text">Feature Engineering Studio</h1>
            <div className="logo-tagline">Data Prep, Imputation & Scaling</div>
          </div>
        </div>
        <nav className="nav-links">
          {mainTabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`nav-link ${activeMainTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveMainTab(t.id)}
              >
                {t.id === 'missing' || t.id === 'outlier' ? (
                  t.id === 'missing' ? <span style={{ marginRight: '6px', fontSize: '14px', display: 'inline-block', verticalAlign: 'middle' }}>🔍</span> :
                  <span style={{ marginRight: '6px', fontSize: '14px', display: 'inline-block', verticalAlign: 'middle' }}>📉</span>
                ) : (
                  <Icon size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}/>
                )}
                <span style={{ verticalAlign: 'middle' }}>{t.label}</span>
              </button>
            )
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="main-content single-pane">
        
        {/* Active tab view */}
        {activeMainTab === 'dashboard'     && <Dashboard onNavigate={id => setActiveMainTab(id)} />}
        {activeMainTab === 'pipeline'      && <Pipeline />}
        {activeMainTab === 'missing'       && <MissingValues />}
        {activeMainTab === 'encoding'      && <Encoding />}
        {activeMainTab === 'mixed'         && <MixedVariables />}
        {activeMainTab === 'outlier'       && <OutlierHandling />}
        {activeMainTab === 'scaling'       && <Scaling />}
        {activeMainTab === 'binarization'  && <Binarization />}
        {activeMainTab === 'ml_pipeline'   && <MLPipeline />}
        {activeMainTab === 'support'       && <Support />}

        {/* Unified Step Navigation Footer (Only shown when viewing a step in the pipeline) */}
        {isFlowActive && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Back Button */}
            <button
              onClick={handleBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '0.65rem 1.25rem',
                color: '#94a3b8',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <ChevronLeft size={16} />
              <span>{currentFlowIdx === 0 ? 'Back to Dashboard' : 'Previous Step'}</span>
            </button>

            {/* Stepper Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
              color: '#64748b',
              fontWeight: 600
            }}>
              <span>Step</span>
              <span style={{ color: '#818cf8', fontWeight: 800 }}>{currentFlowIdx + 1}</span>
              <span>of</span>
              <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{flowSteps.length}</span>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem 1.25rem',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.2)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.2)'; }}
            >
              <span>{currentFlowIdx === flowSteps.length - 1 ? 'Support Creator ❤️' : 'Next Step'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Feature Engineering Studio · Made with ❤️ by Abhinay Yadav · Based on ML standard practices</p>
      </footer>
    </div>
  );
}
