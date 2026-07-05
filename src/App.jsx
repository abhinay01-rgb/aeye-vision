import React, { useState, useEffect } from 'react';
import {
  Layers, Zap, Search, Activity, TrendingDown, GitMerge, ToggleLeft, 
  GitBranch, Heart, ChevronLeft, ChevronRight, LayoutDashboard, Scissors, BookOpen, ChevronDown, Palette, Brain, Network
} from 'lucide-react';
import Scaling from './components/Scaling';
import MissingValues from './components/MissingValues';
import Pipeline from './components/Pipeline';
import MLPipeline from './components/MLPipeline';
import Encoding from './components/Encoding';
import OutlierHandling from './components/OutlierHandling';
import MixedVariables from './components/MixedVariables';
import Binarization from './components/Binarization';
import DimensionalityReduction from './components/DimensionalityReduction';
import Support from './components/Support';
import QuestionBank from './components/QuestionBank';
import EDA from './components/EDA';
import DeepLearning from './components/DeepLearning';
import NeuralNetworksGuide from './components/NeuralNetworksGuide';
import PerceptronGuide from './components/PerceptronGuide';
import FFNGuide from './components/FFNGuide';
import CNNGuide from './components/CNNGuide';
import MLAlgorithms from './components/MLAlgorithms';
import { ML_ALGORITHMS, ML_ALGORITHM_IDS } from './data/mlAlgorithms';
import Dashboard from './pages/Dashboard';
import './App.css'; 

export default function App() {
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [activeDropdown, setActiveDropdown] = useState(null); // 'fe' | 'ml' | null
  
  // Theme state initialized from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'deep-cosmos';
  });

  // Sync theme with body class
  useEffect(() => {
    document.body.className = theme === 'neon-dusk' ? 'neon-dusk-theme' : 'deep-cosmos-theme';
  }, [theme]);

  // Click-Outside-to-Close listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-dropdown')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'deep-cosmos' ? 'neon-dusk' : 'deep-cosmos';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  // Dropdown options lists
  const feDropdownItems = [
    { id: 'pipeline',                 label: 'FE Hierarchy',      icon: GitBranch },
    { id: 'mixed',                    label: 'Mixed Variables',    icon: GitMerge },
    { id: 'missing',                  label: 'Missing Values',     icon: Search, isEmoji: true },
    { id: 'encoding',                 label: 'Categorical Encoding', icon: Layers },
    { id: 'outlier',                  label: 'Outlier Treatment',  icon: TrendingDown, isEmoji: true },
    { id: 'scaling',                  label: 'Feature Scaling',    icon: Zap },
    { id: 'binarization',             label: 'Binarization',       icon: ToggleLeft },
    { id: 'dimensionality_reduction', label: 'Curse of Dim / DR',  icon: Scissors },
    { id: 'ml_pipeline',              label: 'ML Pipeline',       icon: Activity },
  ];

  const mlDropdownItems = ML_ALGORITHMS.map((item) => ({
    id: item.id,
    label: item.name,
  }));

  const dlDropdownItems = [
    { id: 'deep_learning', label: 'Introduction to DL', icon: Brain },
    { id: 'perceptron', label: 'How Perceptron Works', icon: Activity },
    { id: 'nn_guide', label: 'Neural Networks Guide', icon: Network },
    { id: 'ffn_guide', label: 'Feed Forward Networks (FFN)', icon: GitMerge },
    { id: 'cnn_guide', label: 'Convolutional NN (CNN)', icon: Layers },
  ];

  // Pipeline flow steps
  const flowSteps = [
    'pipeline',
    'mixed',
    'missing',
    'encoding',
    'outlier',
    'scaling',
    'binarization',
    'dimensionality_reduction',
    'ml_pipeline'
  ];

  const mlAlgoSteps = ML_ALGORITHM_IDS;

  const currentFlowIdx = flowSteps.indexOf(activeMainTab);
  const isFlowActive = currentFlowIdx !== -1;
  const isMLAlgoActive = mlAlgoSteps.includes(activeMainTab);

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

  // Helper to check active states
  const isFEDropdownActive = flowSteps.includes(activeMainTab);
  const isDLDropdownActive = activeMainTab === 'deep_learning' || activeMainTab === 'nn_guide' || activeMainTab === 'perceptron' || activeMainTab === 'ffn_guide' || activeMainTab === 'cnn_guide';

  return (
    <div className={`app-container ${theme}-theme`}>
      {/* Navigation Custom Dropdown & Theme Switcher Styles */}
      <style>{`
        .nav-links-container {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        @media (max-width: 1024px) {
          .nav-links-container {
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            max-width: 100%;
            padding-bottom: 0.35rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
          }
        }
        .nav-dropdown {
          position: relative;
          display: inline-block;
        }
        .nav-dropdown-trigger {
          background: transparent;
          border: 1px solid transparent;
          color: #64748b;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .nav-dropdown-trigger:hover, .nav-dropdown-trigger.active {
          color: #e2e8f0;
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.2);
        }
        .nav-dropdown-trigger.active {
          color: #a5b4fc;
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.35);
        }
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: rgba(8, 12, 28, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(14px);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          z-index: 1000;
          min-width: 220px;
          margin-top: 0.5rem;
          animation: dropdownFade 0.15s ease;
        }
        .nav-dropdown-menu::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          height: 10px;
          background: transparent;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-dropdown-item {
          background: transparent;
          border: 1px solid transparent;
          color: #94a3b8;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-dropdown-item:hover {
          color: #fff;
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.15);
        }
        .nav-dropdown-item.active {
          color: #a5b4fc;
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
        }
        
        /* Theme Toggle Button */
        .theme-toggle-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #818cf8;
          transition: all 0.25s ease;
          box-shadow: 0 0 10px rgba(99,102,241,0.1);
        }
        .theme-toggle-btn:hover {
          background: rgba(99,102,241,0.1);
          border-color: rgba(99,102,241,0.3);
          color: #fff;
          transform: rotate(15deg);
        }
        .neon-dusk-theme .theme-toggle-btn {
          color: #ff007f !important;
          border-color: rgba(255,0,127,0.2) !important;
          background: rgba(255,0,127,0.03) !important;
          box-shadow: 0 0 10px rgba(255,0,127,0.15) !important;
        }
        .neon-dusk-theme .theme-toggle-btn:hover {
          background: rgba(255,0,127,0.08) !important;
          border-color: rgba(255,0,127,0.35) !important;
          color: #fff !important;
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <div className="logo-section" style={{ cursor: 'pointer' }} onClick={() => { setActiveMainTab('dashboard'); setActiveDropdown(null); }}>
          <div className="logo-icon"><Layers size={22} /></div>
          <div>
            <h1 className="logo-text">Mastering ML with Viz</h1>
            <div className="logo-tagline">Mastering Machine Learning with Visualization</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <nav className="nav-links-container">
            {/* Dashboard Link */}
            <button
              className={`nav-link ${activeMainTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => { setActiveMainTab('dashboard'); setActiveDropdown(null); }}
            >
              Dashboard
            </button>

            {/* EDA Link */}
            <button
              className={`nav-link ${activeMainTab === 'eda' ? 'active' : ''}`}
              onClick={() => { setActiveMainTab('eda'); setActiveDropdown(null); }}
            >
              EDA 📊
            </button>

            {/* Feature Engineering Dropdown */}
            <div className="nav-dropdown">
              <button 
                className={`nav-dropdown-trigger ${isFEDropdownActive ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'fe' ? null : 'fe')}
              >
                <span>Feature Engineering</span>
                <ChevronDown 
                  size={12} 
                  style={{ 
                    transform: activeDropdown === 'fe' ? 'rotate(180deg)' : 'rotate(0deg)', 
                    transition: 'transform 0.2s ease' 
                  }} 
                />
              </button>
              
              {activeDropdown === 'fe' && (
                <div className="nav-dropdown-menu">
                  {feDropdownItems.map(item => {
                    const Icon = item.icon;
                    const isSelected = activeMainTab === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`nav-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setActiveMainTab(item.id);
                          setActiveDropdown(null);
                        }}
                      >
                        {item.isEmoji ? (
                          item.id === 'missing' ? <span style={{ fontSize: '13px' }}>🔍</span> : <span style={{ fontSize: '13px' }}>📉</span>
                        ) : (
                          <Icon size={12} />
                        )}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ML Algorithms Dropdown */}
            <div className="nav-dropdown">
              <button 
                className={`nav-dropdown-trigger ${isMLAlgoActive ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'ml' ? null : 'ml')}
              >
                <span>ML Algorithms</span>
                <ChevronDown 
                  size={12} 
                  style={{ 
                    transform: activeDropdown === 'ml' ? 'rotate(180deg)' : 'rotate(0deg)', 
                    transition: 'transform 0.2s ease' 
                  }} 
                />
              </button>
              
              {activeDropdown === 'ml' && (
                <div className="nav-dropdown-menu">
                  {mlDropdownItems.map(item => {
                    const isSelected = activeMainTab === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`nav-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setActiveMainTab(item.id);
                          setActiveDropdown(null);
                        }}
                      >
                        <Activity size={12} style={{ color: '#818cf8' }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Deep Learning Dropdown */}
            <div className="nav-dropdown">
              <button 
                className={`nav-dropdown-trigger ${isDLDropdownActive ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === 'dl' ? null : 'dl')}
              >
                <span>Deep Learning</span>
                <ChevronDown 
                  size={12} 
                  style={{ 
                    transform: activeDropdown === 'dl' ? 'rotate(180deg)' : 'rotate(0deg)', 
                    transition: 'transform 0.2s ease' 
                  }} 
                />
              </button>
              
              {activeDropdown === 'dl' && (
                <div className="nav-dropdown-menu">
                  {dlDropdownItems.map(item => {
                    const Icon = item.icon;
                    const isSelected = activeMainTab === item.id;
                    return (
                      <button
                        key={item.id}
                        className={`nav-dropdown-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          setActiveMainTab(item.id);
                          setActiveDropdown(null);
                        }}
                      >
                        <Icon size={12} style={{ color: '#ec4899' }} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Question Bank Link */}
            <button
              className={`nav-link ${activeMainTab === 'question_bank' ? 'active' : ''}`}
              onClick={() => { setActiveMainTab('question_bank'); setActiveDropdown(null); }}
            >
              Question Bank 📚
            </button>

            {/* AEye Link */}
            <a
              href="https://aeye-vision.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              style={{ textDecoration: 'none' }}
            >
              AEye 👁️
            </a>
          </nav>

          {/* Theme Toggle Switcher Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title="Switch Theme Vibe"
          >
            <Palette size={14} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content single-pane">
        
        {/* Active tab view */}
        {activeMainTab === 'dashboard'     && <Dashboard onNavigate={id => setActiveMainTab(id)} />}
        {activeMainTab === 'eda'           && <EDA />}
        {activeMainTab === 'deep_learning' && <DeepLearning />}
        {activeMainTab === 'perceptron'    && <PerceptronGuide />}
        {activeMainTab === 'nn_guide'      && <NeuralNetworksGuide />}
        {activeMainTab === 'ffn_guide'     && <FFNGuide />}
        {activeMainTab === 'cnn_guide'     && <CNNGuide />}
        {activeMainTab === 'pipeline'      && <Pipeline />}
        {activeMainTab === 'missing'       && <MissingValues />}
        {activeMainTab === 'encoding'      && <Encoding />}
        {activeMainTab === 'mixed'         && <MixedVariables />}
        {activeMainTab === 'outlier'       && <OutlierHandling />}
        {activeMainTab === 'scaling'       && <Scaling />}
        {activeMainTab === 'binarization'  && <Binarization />}
        {activeMainTab === 'dimensionality_reduction' && <DimensionalityReduction />}
        {activeMainTab === 'ml_pipeline'   && <MLPipeline />}
        {isMLAlgoActive                    && <MLAlgorithms key={activeMainTab} initialSelected={activeMainTab} />}
        {activeMainTab === 'question_bank' && <QuestionBank />}
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
              <span>{currentFlowIdx === flowSteps.length - 1 ? 'Meet the Creator 🎓' : 'Next Step'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 Mastering Machine Learning with Visualization · Made with ❤️ by an IITian Data Scientist (Abhinay Yadav) · Based on ML standard practices</p>
      </footer>
    </div>
  );
}
