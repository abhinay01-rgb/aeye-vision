import React, { useState, useEffect, useRef } from 'react';
import { Activity, Layers, ArrowRight, Play, RotateCcw, Code, Zap, Network, Box, Lock, Unlock, RefreshCw, Clock, MessageSquare, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function RNNGuide() {
  const [activeTab, setActiveTab] = useState('why_ann');

  // ── RNN Unfolding Animation ──
  const [unfoldStep, setUnfoldStep] = useState(-1);
  const [isUnfolding, setIsUnfolding] = useState(false);
  const unfoldRef = useRef(null);

  const playUnfolding = () => {
    if (isUnfolding) return;
    setIsUnfolding(true);
    setUnfoldStep(0);
    let step = 0;
    unfoldRef.current = setInterval(() => {
      step++;
      setUnfoldStep(step);
      if (step >= 4) {
        clearInterval(unfoldRef.current);
        setIsUnfolding(false);
      }
    }, 700);
  };

  const resetUnfolding = () => {
    clearInterval(unfoldRef.current);
    setIsUnfolding(false);
    setUnfoldStep(-1);
  };

  // ── Vanishing Gradient Animation ──
  const [gradStep, setGradStep] = useState(-1);
  const [isGradPlaying, setIsGradPlaying] = useState(false);
  const gradRef = useRef(null);

  const playGradient = () => {
    if (isGradPlaying) return;
    setIsGradPlaying(true);
    setGradStep(0);
    let step = 0;
    gradRef.current = setInterval(() => {
      step++;
      setGradStep(step);
      if (step >= 5) {
        clearInterval(gradRef.current);
        setIsGradPlaying(false);
      }
    }, 600);
  };

  const resetGradient = () => {
    clearInterval(gradRef.current);
    setIsGradPlaying(false);
    setGradStep(-1);
  };

  // ── LSTM Gate Animation ──
  const [lstmStep, setLstmStep] = useState(-1);
  const [isLstmPlaying, setIsLstmPlaying] = useState(false);
  const lstmRef = useRef(null);

  const playLstm = () => {
    if (isLstmPlaying) return;
    setIsLstmPlaying(true);
    setLstmStep(0);
    let step = 0;
    lstmRef.current = setInterval(() => {
      step++;
      setLstmStep(step);
      if (step >= 5) {
        clearInterval(lstmRef.current);
        setIsLstmPlaying(false);
      }
    }, 900);
  };

  const resetLstm = () => {
    clearInterval(lstmRef.current);
    setIsLstmPlaying(false);
    setLstmStep(-1);
  };

  // ── GRU Animation ──
  const [gruStep, setGruStep] = useState(-1);
  const [isGruPlaying, setIsGruPlaying] = useState(false);
  const gruRef = useRef(null);

  const playGru = () => {
    if (isGruPlaying) return;
    setIsGruPlaying(true);
    setGruStep(0);
    let step = 0;
    gruRef.current = setInterval(() => {
      step++;
      setGruStep(step);
      if (step >= 4) {
        clearInterval(gruRef.current);
        setIsGruPlaying(false);
      }
    }, 900);
  };

  const resetGru = () => {
    clearInterval(gruRef.current);
    setIsGruPlaying(false);
    setGruStep(-1);
  };

  // ── Sequence Prediction Demo ──
  const [seqInput, setSeqInput] = useState('');
  const [seqPredictions, setSeqPredictions] = useState([]);
  const [isSeqPredicting, setIsSeqPredicting] = useState(false);

  const demoSentences = {
    'The cat sat on the': ['mat', 'roof', 'chair', 'floor', 'bed'],
    'I love to eat': ['pizza', 'pasta', 'sushi', 'cake', 'fruit'],
    'The weather today is': ['sunny', 'cloudy', 'rainy', 'windy', 'cold'],
    'Machine learning is': ['amazing', 'powerful', 'complex', 'useful', 'evolving'],
  };

  const runSeqPrediction = (sentence) => {
    setSeqInput(sentence);
    setIsSeqPredicting(true);
    setSeqPredictions([]);
    const words = demoSentences[sentence] || ['word1', 'word2', 'word3'];
    const probs = [0.42, 0.25, 0.18, 0.10, 0.05];
    let idx = 0;
    const interval = setInterval(() => {
      setSeqPredictions(prev => [...prev, { word: words[idx], prob: probs[idx] }]);
      idx++;
      if (idx >= words.length) {
        clearInterval(interval);
        setIsSeqPredicting(false);
      }
    }, 400);
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      clearInterval(unfoldRef.current);
      clearInterval(gradRef.current);
      clearInterval(lstmRef.current);
      clearInterval(gruRef.current);
    };
  }, []);

  // ── Reusable Code Block ──
  const CodeBlock = ({ children }) => (
    <code style={{
      background: 'rgba(99,102,241,0.12)',
      color: '#818cf8',
      padding: '2px 8px',
      borderRadius: '6px',
      fontSize: '0.85rem',
      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    }}>{children}</code>
  );

  // ── RNN Sequence Visualization helper ──
  const SequenceCell = ({ label, color, isActive, delay = 0 }) => (
    <div style={{
      width: 60, height: 60,
      borderRadius: '12px',
      background: isActive ? color : 'rgba(148,163,184,0.1)',
      border: `2px solid ${isActive ? color : '#cbd5e1'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: isActive ? '#fff' : '#94a3b8',
      fontWeight: 700, fontSize: '0.75rem',
      transition: 'all 0.4s ease',
      transitionDelay: `${delay}ms`,
      transform: isActive ? 'scale(1.05)' : 'scale(1)',
      boxShadow: isActive ? `0 4px 20px ${color}44` : 'none',
    }}>
      {label}
    </div>
  );

  return (
    <div className="tab-layout-container fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="section-title-main" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={32} color="#06b6d4" />
          Recurrent Neural Networks (RNN)
        </h2>
        <p className="tutorial-paragraph">
          While CNNs are the <strong>eyes</strong> of AI, <strong>Recurrent Neural Networks (RNNs)</strong> are the <strong>memory</strong> of AI. They are designed specifically to process <strong>sequential data</strong> — data where order matters, like text, speech, time series, and music. An RNN remembers what it saw before to understand what it sees now!
        </p>
      </div>

      {/* ═══ Tabs ═══ */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'why_ann', label: 'Why Not ANN?', icon: AlertTriangle, color: '#e11d48' },
          { id: 'overview', label: 'Architecture & Theory', icon: Layers, color: '#06b6d4' },
          { id: 'unfolding', label: 'RNN Cell & Unfolding', icon: RefreshCw, color: '#8b5cf6' },
          { id: 'vanishing', label: 'Vanishing Gradient', icon: AlertTriangle, color: '#ef4444' },
          { id: 'lstm', label: 'LSTM', icon: Lock, color: '#f59e0b' },
          { id: 'gru', label: 'GRU', icon: Unlock, color: '#10b981' },
          { id: 'code', label: 'Code Walkthrough', icon: Code, color: '#ec4899' },
          { id: 'applications', label: 'Applications', icon: Zap, color: '#6366f1' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? tab.color : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#64748b',
              border: activeTab === tab.id ? 'none' : '1px solid #cbd5e1',
              padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer',
              fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s ease',
            }}>
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          TAB 0: WHY NOT ANN?
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'why_ann' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header */}
            <div style={{ background: '#fff1f2', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #e11d48', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#9f1239', margin: '0 0 1rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#e11d48', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>PROBLEM</span>
                Why ANN Fails at Sequential Data
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                An <strong>Artificial Neural Network (ANN)</strong> (also called a Feedforward Neural Network or Multi-Layer Perceptron) is generally <strong>not suitable for sequential data</strong> because it assumes every input feature is <strong>independent</strong> and does <strong>not remember previous inputs</strong>. Let's explore all the reasons why — and understand why RNNs were invented.
              </p>
            </div>

            {/* What is Sequential Data? */}
            <div style={{ background: '#eff6ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #2563eb' }}>
              <h3 style={{ color: '#1e40af', margin: '0 0 1rem 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📊 What is Sequential Data?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                Sequential data is data where <strong>order matters</strong>. If you shuffle the elements, the meaning changes completely.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { emoji: '💬', label: 'Sentences' },
                  { emoji: '🗣️', label: 'Speech' },
                  { emoji: '📈', label: 'Time Series' },
                  { emoji: '💹', label: 'Stock Prices' },
                  { emoji: '🌡️', label: 'Sensor Data' },
                  { emoji: '🌦️', label: 'Weather' },
                  { emoji: '🧬', label: 'DNA Sequence' },
                  { emoji: '🎬', label: 'Video Frames' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#fff', padding: '0.85rem', borderRadius: '10px',
                    border: '1px solid #bfdbfe', textAlign: 'center',
                    transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{item.emoji}</div>
                    <p style={{ color: '#1e40af', fontWeight: 600, margin: 0, fontSize: '0.8rem' }}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Order matters example */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#dcfce7', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Fira Code', monospace", color: '#15803d', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.3rem 0' }}>"I love AI"</p>
                  <p style={{ color: '#16a34a', margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>✅ Makes sense</p>
                </div>
                <div style={{ background: '#fef2f2', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Fira Code', monospace", color: '#991b1b', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.3rem 0' }}>"AI love I"</p>
                  <p style={{ color: '#dc2626', margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>❌ Same words, different meaning!</p>
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.75rem 0 0 0', textAlign: 'center', fontWeight: 600 }}>
                The model must understand <strong>order</strong>. ANN cannot do this naturally.
              </p>
            </div>

            {/* How ANN Processes Data */}
            <div style={{ background: '#faf5ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #7c3aed' }}>
              <h3 style={{ color: '#5b21b6', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
                ⚙️ How ANN Processes Data
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                ANN takes the <strong>whole input at once</strong>, computes <CodeBlock>y = f(WX + b)</CodeBlock> in a single forward pass, produces an output, and then <strong>forgets everything</strong>. There is <strong>no memory</strong>.
              </p>
              <div style={{ background: '#ede9fe', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ fontFamily: "'Fira Code', monospace", color: '#5b21b6', fontSize: '0.95rem', margin: 0, lineHeight: 2.2 }}>
                  [x₁, x₂, x₃, x₄] → <strong>y = f(WX + b)</strong> → Output → <span style={{ color: '#dc2626' }}>Memory = None ❌</span>
                </p>
              </div>
            </div>

            {/* ── The 10 Problems ── */}
            <div style={{ background: '#fef2f2', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #dc2626' }}>
              <h3 style={{ color: '#991b1b', margin: '0 0 1.5rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🚫 10 Reasons ANN Fails at Sequential Data
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Problem 1: No Memory */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>No Memory</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 0.75rem 0' }}>
                    Imagine reading a book. Sentence 1: <strong>"Rahul went to school."</strong> Sentence 2: <strong>"He studied Mathematics."</strong> — Who is "He"? A human remembers <strong>Rahul</strong>. ANN does not. Each input is treated <strong>independently</strong> with no information flowing between them.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.5rem', alignItems: 'center' }}>
                    <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Fira Code', monospace", color: '#991b1b', fontSize: '0.8rem', margin: 0 }}>Input 1 → Output</p>
                      <p style={{ color: '#dc2626', fontSize: '0.72rem', margin: '0.25rem 0 0 0', fontWeight: 600 }}>Memory = None</p>
                    </div>
                    <span style={{ color: '#dc2626', fontSize: '1.2rem' }}>→</span>
                    <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Fira Code', monospace", color: '#991b1b', fontSize: '0.8rem', margin: 0 }}>Input 2 → Output</p>
                      <p style={{ color: '#dc2626', fontSize: '0.72rem', margin: '0.25rem 0 0 0', fontWeight: 600 }}>Memory = None</p>
                    </div>
                  </div>
                </div>

                {/* Problem 2: Cannot Capture Order */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>2</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Cannot Capture Order</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, color: '#15803d', margin: 0, fontSize: '0.95rem' }}>"Dog bites man"</p>
                      <p style={{ color: '#16a34a', margin: '0.25rem 0 0 0', fontSize: '0.78rem' }}>🐕 bites 🧑 (normal news)</p>
                    </div>
                    <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, color: '#991b1b', margin: 0, fontSize: '0.95rem' }}>"Man bites dog"</p>
                      <p style={{ color: '#dc2626', margin: '0.25rem 0 0 0', fontSize: '0.78rem' }}>🧑 bites 🐕 (headline news!)</p>
                    </div>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                    ANN sees {'{'}Dog, Man, Bites{'}'} as just features — it doesn't naturally know <strong>which word came first</strong> unless you manually encode positional information.
                  </p>
                </div>

                {/* Problem 3: Fixed Input Size */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>3</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Fixed Input Size</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 0.75rem 0' }}>
                    ANN expects a fixed number of inputs [x₁, x₂, x₃, x₄]. But sequences vary in length:
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {[
                      { text: '"I love AI"', len: '3 words', color: '#2563eb' },
                      { text: '"I absolutely love learning Generative AI"', len: '6 words', color: '#7c3aed' },
                      { text: '"Hello"', len: '1 word', color: '#16a34a' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', flex: '1 1 auto', textAlign: 'center', minWidth: '140px' }}>
                        <p style={{ fontFamily: "'Fira Code', monospace", color: s.color, fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.2rem 0' }}>{s.text}</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: 0 }}>{s.len}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                    ANN requires <strong>padding/truncation</strong> which may lose information or add unnecessary tokens.
                  </p>
                </div>

                {/* Problem 4: No Context Learning */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>4</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>No Context Learning</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px' }}>
                      <p style={{ color: '#1e40af', fontSize: '0.88rem', margin: 0 }}>"The animal didn't cross the road because <strong>it</strong> was too <strong>tired</strong>."</p>
                      <p style={{ color: '#3b82f6', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>→ "it" = <strong>the animal</strong> 🐾</p>
                    </div>
                    <div style={{ background: '#faf5ff', padding: '1rem', borderRadius: '10px' }}>
                      <p style={{ color: '#5b21b6', fontSize: '0.88rem', margin: 0 }}>"The animal didn't cross the road because <strong>it</strong> was too <strong>wide</strong>."</p>
                      <p style={{ color: '#7c3aed', fontSize: '0.8rem', margin: '0.3rem 0 0 0' }}>→ "it" = <strong>the road</strong> 🛤️</p>
                    </div>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    Understanding depends on previous words. ANN has <strong>no mechanism</strong> to maintain this evolving context.
                  </p>
                </div>

                {/* Problem 5: Parameter Explosion */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>5</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Parameter Explosion</h4>
                  </div>
                  <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', textAlign: 'center' }}>
                      <div>
                        <p style={{ color: '#991b1b', fontWeight: 700, margin: '0 0 0.2rem 0', fontSize: '0.85rem' }}>100 words</p>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.75rem' }}>× 300 dim embedding</p>
                      </div>
                      <div>
                        <p style={{ color: '#991b1b', fontWeight: 700, margin: '0 0 0.2rem 0', fontSize: '0.85rem' }}>=  30,000 features</p>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.75rem' }}>× 1000 hidden neurons</p>
                      </div>
                      <div>
                        <p style={{ color: '#dc2626', fontWeight: 700, margin: '0 0 0.2rem 0', fontSize: '1rem' }}>= 30 Million</p>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.75rem' }}>weights! 😱</p>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    If the sentence becomes 200 words, parameters <strong>double</strong>. Hugely inefficient. RNNs use <strong>weight sharing</strong> across time steps, keeping parameters constant regardless of sequence length.
                  </p>
                </div>

                {/* Problem 6: No Long-Term Dependencies */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>6</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Cannot Learn Long-Term Dependencies</h4>
                  </div>
                  <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
                    <p style={{ color: '#1e40af', fontSize: '0.88rem', margin: 0 }}>
                      "The <span style={{ background: '#bfdbfe', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>movie</span> that I watched yesterday with my friends was absolutely <span style={{ background: '#bbf7d0', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>fantastic</span>."
                    </p>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    To predict <strong>"fantastic"</strong>, the model must remember <strong>"movie"</strong> which appeared many words earlier. ANN forgets immediately after processing.
                  </p>
                </div>

                {/* Problem 7: Independent Samples Assumption */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>7</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Independent Samples Assumption</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 0.75rem 0' }}>
                    ANN assumes Sample 1 is independent from Sample 2. But sequential data is: <strong>x₁ → x₂ → x₃ → x₄</strong> — every point depends on previous ones.
                  </p>
                  <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '10px' }}>
                    <p style={{ color: '#92400e', fontSize: '0.88rem', margin: 0 }}>
                      <strong>Weather example:</strong> Monday 🌤️ → Tuesday 🌧️ → Wednesday ❓<br/>
                      Today's weather depends on yesterday. ANN treats every day <strong>independently</strong>.
                    </p>
                  </div>
                </div>

                {/* Problem 8: Cannot Share Info Across Time */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>8</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Cannot Share Information Across Time</h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {['Word1', 'Word2', 'Word3', 'Word4'].map((w, i) => (
                      <React.Fragment key={i}>
                        <div style={{ background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'center' }}>
                          <p style={{ color: '#991b1b', fontWeight: 600, fontSize: '0.8rem', margin: '0 0 0.15rem 0' }}>{w}</p>
                          <p style={{ color: '#dc2626', fontSize: '0.65rem', margin: 0 }}>↓ Output</p>
                        </div>
                        {i < 3 && <span style={{ color: '#e2e8f0', fontSize: '1rem' }}>|</span>}
                      </React.Fragment>
                    ))}
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    Each word is processed in isolation — there is <strong>no temporal state</strong> or connection between them.
                  </p>
                </div>

                {/* Problem 9: Poor Time-Series Modeling */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>9</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Poor Time-Series Modeling</h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.35rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
                    {[100, 101, 102, 104, 105].map((val, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{val}</span>
                        <div style={{ width: 36, height: val - 80, background: 'linear-gradient(180deg, #3b82f6, #93c5fd)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                    ))}
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    Stock prices show clear <strong>trends</strong>. ANN simply maps inputs to outputs — it doesn't inherently model trend, seasonality, or temporal dependencies unless manually engineered.
                  </p>
                </div>

                {/* Problem 10: Feature Engineering Required */}
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', border: '1px solid #fecaca' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#dc2626', color: 'white', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>10</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.05rem' }}>Manual Feature Engineering Required</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 0.75rem 0' }}>
                    To predict today's weather using ANN, you must <strong>manually create history features</strong>:
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {['Temp yesterday', 'Temp 2 days ago', 'Temp 3 days ago', 'Humidity yesterday', 'Wind speed yesterday'].map((feat, i) => (
                      <span key={i} style={{ background: '#fef2f2', color: '#991b1b', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                        {feat}
                      </span>
                    ))}
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                    <strong>RNNs, LSTMs, GRUs, and Transformers</strong> learn these temporal relationships <strong>directly from raw sequences</strong> — no manual engineering needed!
                  </p>
                </div>

              </div>
            </div>

            {/* Why RNN Was Introduced */}
            <div style={{ background: '#f0fdf4', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #16a34a' }}>
              <h3 style={{ color: '#15803d', margin: '0 0 1rem 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ Why RNN Was Introduced
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1.5rem 0' }}>
                RNN adds a <strong>hidden state (memory)</strong> that carries information from previous time steps. Each step receives both the current input and the memory of everything seen so far:
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {['x₁', 'x₂', 'x₃'].map((x, i) => (
                  <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ background: '#dbeafe', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, color: '#1e40af', fontSize: '0.9rem' }}>{x}</div>
                      <span style={{ color: '#16a34a' }}>↓</span>
                      <div style={{ background: '#dcfce7', padding: '0.6rem 1rem', borderRadius: '10px', fontWeight: 700, color: '#15803d', fontSize: '0.82rem', border: '2px solid #16a34a' }}>h{i + 1}</div>
                    </div>
                    {i < 2 && <span style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700, paddingTop: '1.5rem' }}>→</span>}
                  </React.Fragment>
                ))}
                <span style={{ color: '#16a34a', fontSize: '1.5rem', fontWeight: 700, paddingTop: '1.5rem' }}>→</span>
                <div style={{ background: '#bbf7d0', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700, color: '#15803d', fontSize: '0.95rem', border: '2px solid #16a34a', marginTop: '1.5rem' }}>Output ✅</div>
              </div>
              <p style={{ color: '#16a34a', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, margin: '1rem 0 0 0' }}>
                Each hidden state carries information from <strong>all previous</strong> time steps!
              </p>
            </div>

            {/* ANN vs RNN Comparison Table */}
            <div style={{ background: '#faf5ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #7c3aed' }}>
              <h3 style={{ color: '#5b21b6', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
                ⚖️ ANN vs RNN — Comparison
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#ede9fe' }}>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#5b21b6', borderBottom: '2px solid #c4b5fd' }}>Feature</th>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#dc2626', borderBottom: '2px solid #c4b5fd' }}>ANN</th>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#16a34a', borderBottom: '2px solid #c4b5fd' }}>RNN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Memory', '❌ No', '✅ Yes (Hidden State)'],
                      ['Sequence Understanding', '❌ No', '✅ Yes'],
                      ['Order Awareness', '❌ No', '✅ Yes'],
                      ['Variable-Length Input', '❌ Limited (padding)', '✅ Natural'],
                      ['Context Learning', '❌ No', '✅ Yes'],
                      ['Time-Series Modeling', '❌ Weak', '✅ Designed for it'],
                      ['Long-Term Dependencies', '❌ No', '⚠️ Better (LSTM/GRU solve fully)'],
                    ].map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#faf5ff' : '#fff' }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: '0.75rem', color: j === 0 ? '#5b21b6' : '#475569', fontWeight: j === 0 ? 700 : 400, borderBottom: '1px solid #e9d5ff' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Can ANN ever work? */}
            <div style={{ background: '#fffbeb', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #ca8a04' }}>
              <h3 style={{ color: '#a16207', margin: '0 0 1rem 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🤔 Can ANN Ever Be Used for Sequential Data?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                <strong>Yes</strong>, but only after converting the sequence into a <strong>fixed-size feature vector</strong>:
              </p>
              <ul style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.9, margin: '0 0 1rem 0', paddingLeft: '1.5rem' }}>
                <li>Predicting tomorrow's temperature using the <strong>last 7 days</strong> as input.</li>
                <li>Using <strong>handcrafted lag features</strong> for time-series forecasting.</li>
                <li>Small or simple sequence problems where temporal dependencies are limited.</li>
              </ul>
              <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                However, for tasks like <strong>language modeling, speech recognition, machine translation, long time-series forecasting, or video understanding</strong>, architectures such as <strong>RNNs, LSTMs, GRUs, and Transformers</strong> are generally much more effective because they are designed to capture sequential relationships and context.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB 1: OVERVIEW & THEORY
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* WHY */}
            <div style={{ background: '#fff1f2', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #e11d48', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#9f1239', margin: '0 0 1rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#e11d48', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>WHY</span>
                Why do we need Recurrent Neural Networks?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                Standard Feed-Forward Networks and CNNs treat each input <strong>independently</strong>. They have no memory of previous inputs. But many real-world tasks involve <strong>sequences</strong> where the order and context matter:
              </p>
              <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.9, margin: '1rem 0 0 0', paddingLeft: '1.5rem' }}>
                <li><strong>Language:</strong> "I saw her <strong>duck</strong>" — Is "duck" a noun or a verb? You need context from previous words!</li>
                <li><strong>Stock Prices:</strong> Today's price depends on yesterday's and the day before.</li>
                <li><strong>Speech:</strong> The meaning of a sound depends on what sounds came before it.</li>
                <li><strong>Music:</strong> The next note depends on the melody played so far.</li>
              </ul>
            </div>

            {/* WHAT */}
            <div style={{ background: '#eff6ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #2563eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#1e40af', margin: '0 0 1rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#2563eb', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>WHAT</span>
                What is a Recurrent Neural Network (RNN)?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                An <strong>RNN</strong> is a neural network with a <strong>loop</strong>. At each time step, it takes two inputs: the <strong>current input</strong> (x<sub>t</sub>) and the <strong>hidden state from the previous step</strong> (h<sub>t-1</sub>). This hidden state acts as the network's <strong>"memory"</strong> — it encodes information about everything the network has seen so far.
              </p>
              <div style={{ background: '#dbeafe', padding: '1.25rem', borderRadius: '12px', marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ color: '#1e40af', fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>The Core RNN Equation</p>
                <p style={{ color: '#1e3a5f', fontFamily: "'Fira Code', monospace", fontSize: '1.05rem', margin: 0, letterSpacing: '0.5px' }}>
                  h<sub>t</sub> = tanh(W<sub>hh</sub> · h<sub>t-1</sub> + W<sub>xh</sub> · x<sub>t</sub> + b<sub>h</sub>)
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0.75rem 0 0 0' }}>
                  The new hidden state is a function of the previous hidden state and the current input, squashed by tanh to keep values between -1 and 1.
                </p>
              </div>
            </div>

            {/* HOW - Visual Diagram */}
            <div style={{ background: '#f0fdf4', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #16a34a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#15803d', margin: '0 0 1rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#16a34a', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>HOW</span>
                How does it process a sequence?
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1.5rem 0' }}>
                Think of reading a sentence word by word. As you read each word, you maintain a mental summary of what you've read so far. That summary is the <strong>hidden state</strong>. The RNN does the same thing — it reads each element of a sequence one at a time, updating its hidden state at each step.
              </p>

              {/* Analogy cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {[
                  { emoji: '📖', title: 'Reading a Book', desc: 'Each word updates your understanding of the story so far.' },
                  { emoji: '🎵', title: 'Listening to Music', desc: 'Each note makes sense because you remember the melody.' },
                  { emoji: '💬', title: 'Having a Conversation', desc: 'You respond based on the history of what was said.' },
                  { emoji: '📈', title: 'Tracking Stock Prices', desc: 'Each price point depends on the trend before it.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#fff', padding: '1.25rem', borderRadius: '12px',
                    border: '1px solid #bbf7d0', textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                    <p style={{ fontWeight: 700, color: '#15803d', margin: '0 0 0.3rem 0', fontSize: '0.95rem' }}>{item.title}</p>
                    <p style={{ color: '#64748b', margin: 0, fontSize: '0.82rem', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Differences Table */}
            <div style={{ background: '#faf5ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #7c3aed', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#5b21b6', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
                FFN vs CNN vs RNN — Key Differences
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#ede9fe' }}>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#5b21b6', borderBottom: '2px solid #c4b5fd' }}>Feature</th>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#5b21b6', borderBottom: '2px solid #c4b5fd' }}>FFN</th>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#5b21b6', borderBottom: '2px solid #c4b5fd' }}>CNN</th>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#5b21b6', borderBottom: '2px solid #c4b5fd' }}>RNN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Input Type', 'Fixed-size vector', 'Spatial (images)', 'Sequential (text, time)'],
                      ['Memory', '❌ None', '❌ None', '✅ Hidden State'],
                      ['Data Flow', 'Input → Output', 'Spatial scanning', 'Time-step loop'],
                      ['Parameter Sharing', 'Per layer', 'Shared filters', 'Shared across time'],
                      ['Key Operation', 'Matrix multiply', 'Convolution', 'Recurrence'],
                      ['Best For', 'Tabular data', 'Images, Video', 'Text, Speech, Time Series'],
                    ].map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#faf5ff' : '#fff' }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: '0.75rem', color: j === 0 ? '#5b21b6' : '#475569', fontWeight: j === 0 ? 700 : 400, borderBottom: '1px solid #e9d5ff' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Weight Sharing Concept */}
            <div style={{ background: '#fefce8', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #ca8a04', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#a16207', margin: '0 0 1rem 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔁 Weight Sharing Across Time Steps
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                A key feature of RNNs is that the <strong>same weights</strong> (W<sub>xh</sub>, W<sub>hh</sub>, W<sub>hy</sub>) are used at every time step. This is called <strong>weight sharing</strong>. It means:
              </p>
              <ul style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.9, margin: 0, paddingLeft: '1.5rem' }}>
                <li>The network can process sequences of <strong>any length</strong> with a fixed number of parameters.</li>
                <li>The same transformation is applied to every element, ensuring <strong>consistency</strong>.</li>
                <li>Similar to how CNN filters are shared across spatial positions, RNN weights are shared across <strong>temporal positions</strong>.</li>
              </ul>
            </div>

            {/* Types of RNN */}
            <div style={{ background: '#f0fdfa', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #0d9488', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#0f766e', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>
                Types of RNN Architectures
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { title: 'One-to-One', desc: 'Standard NN. Single input → single output.', example: 'Image classification', visual: '▢ → ▢' },
                  { title: 'One-to-Many', desc: 'Single input → sequence of outputs.', example: 'Image captioning', visual: '▢ → ▢▢▢' },
                  { title: 'Many-to-One', desc: 'Sequence input → single output.', example: 'Sentiment analysis', visual: '▢▢▢ → ▢' },
                  { title: 'Many-to-Many', desc: 'Sequence input → sequence output (same length).', example: 'POS tagging', visual: '▢▢▢ → ▢▢▢' },
                  { title: 'Seq-to-Seq', desc: 'Encode sequence → decode different length sequence.', example: 'Machine translation', visual: '▢▢ → ■ → ▢▢▢' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: '#fff', padding: '1.25rem', borderRadius: '12px',
                    border: '1px solid #99f6e4',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <p style={{ fontWeight: 700, color: '#0f766e', margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{item.title}</p>
                    <p style={{ color: '#0d9488', fontFamily: "'Fira Code', monospace", fontSize: '1.1rem', margin: '0 0 0.5rem 0', letterSpacing: 2 }}>{item.visual}</p>
                    <p style={{ color: '#475569', margin: '0 0 0.25rem 0', fontSize: '0.82rem', lineHeight: 1.5 }}>{item.desc}</p>
                    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.78rem', fontStyle: 'italic' }}>e.g. {item.example}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB 2: RNN CELL & UNFOLDING
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'unfolding' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Folded RNN */}
            <div style={{ background: '#faf5ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #7c3aed' }}>
              <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#5b21b6' }}>The RNN Cell — Folded View</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1.5rem 0' }}>
                The RNN cell has a <strong>self-loop</strong>: the output (hidden state) at each step is fed back as input to the next step. This is what gives the RNN its "memory". In the folded view, the loop is shown as a circular arrow.
              </p>

              <svg viewBox="0 0 500 280" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', display: 'block' }}>
                {/* Input x */}
                <rect x="50" y="200" width="80" height="45" rx="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
                <text x="90" y="228" textAnchor="middle" fill="#1e40af" fontSize="14" fontWeight="bold">x_t</text>
                <text x="90" y="265" textAnchor="middle" fill="#64748b" fontSize="11">Input</text>

                {/* RNN Cell */}
                <rect x="200" y="100" width="120" height="70" rx="14" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" />
                <text x="260" y="125" textAnchor="middle" fill="#5b21b6" fontSize="13" fontWeight="bold">RNN Cell</text>
                <text x="260" y="148" textAnchor="middle" fill="#7c3aed" fontSize="11" fontFamily="monospace">tanh(Wx + Wh + b)</text>

                {/* Self-loop arrow */}
                <path d="M 320 115 C 370 80, 370 170, 320 155" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5,3" />
                <polygon points="320,155 326,148 314,148" fill="#f59e0b" />
                <text x="375" y="130" fill="#ca8a04" fontSize="11" fontWeight="bold">h_t-1</text>

                {/* Arrow: input to cell */}
                <line x1="130" y1="215" x2="200" y2="145" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />

                {/* Output y */}
                <rect x="200" y="10" width="120" height="45" rx="10" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                <text x="260" y="38" textAnchor="middle" fill="#15803d" fontSize="14" fontWeight="bold">y_t</text>
                <text x="260" y="70" textAnchor="middle" fill="#64748b" fontSize="11" transform="translate(0,-2)">Output</text>

                {/* Arrow: cell to output */}
                <line x1="260" y1="100" x2="260" y2="60" stroke="#16a34a" strokeWidth="2" markerEnd="url(#arrowGreen)" />

                {/* Arrow markers */}
                <defs>
                  <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="#3b82f6" />
                  </marker>
                  <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
                    <polygon points="0 8, 4 0, 8 8" fill="#16a34a" />
                  </marker>
                </defs>
              </svg>
            </div>

            {/* Unfolding Animation */}
            <div style={{ background: '#f0fdfa', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #0d9488' }}>
              <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#0f766e' }}>
                🔓 Unfolding the RNN Across Time
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                When we "unfold" the RNN, we can see how the <strong>same cell</strong> is applied at each time step. The hidden state <strong>h</strong> flows from left to right, carrying information from the past. Click <strong>Play</strong> to watch the information flow through a 4-word sequence!
              </p>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={playUnfolding} disabled={isUnfolding}
                  style={{ background: isUnfolding ? '#cbd5e1' : '#0d9488', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: isUnfolding ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={16} /> {isUnfolding ? 'Processing...' : 'Play Unfolding'}
                </button>
                <button onClick={resetUnfolding}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>

              {/* Unfolded Diagram */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', padding: '1.5rem 0' }}>
                {['I', 'love', 'deep', 'learning'].map((word, i) => (
                  <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      {/* Output */}
                      <div style={{
                        width: 60, height: 36, borderRadius: '8px',
                        background: unfoldStep >= i + 1 ? '#dcfce7' : '#f1f5f9',
                        border: `2px solid ${unfoldStep >= i + 1 ? '#16a34a' : '#e2e8f0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, color: unfoldStep >= i + 1 ? '#15803d' : '#94a3b8',
                        transition: 'all 0.5s ease',
                      }}>
                        y_{i}
                      </div>

                      {/* Arrow up */}
                      <div style={{ color: unfoldStep >= i + 1 ? '#16a34a' : '#e2e8f0', transition: 'color 0.5s' }}>↑</div>

                      {/* RNN Cell */}
                      <div style={{
                        width: 70, height: 50, borderRadius: '12px',
                        background: unfoldStep >= i ? (unfoldStep === i ? '#c4b5fd' : '#ede9fe') : '#f8fafc',
                        border: `2.5px solid ${unfoldStep >= i ? '#7c3aed' : '#e2e8f0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700,
                        color: unfoldStep >= i ? '#5b21b6' : '#94a3b8',
                        transition: 'all 0.5s ease',
                        transform: unfoldStep === i ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: unfoldStep === i ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                      }}>
                        h_{i}
                      </div>

                      {/* Arrow up */}
                      <div style={{ color: unfoldStep >= i ? '#3b82f6' : '#e2e8f0', transition: 'color 0.5s' }}>↑</div>

                      {/* Input */}
                      <div style={{
                        width: 70, height: 36, borderRadius: '8px',
                        background: unfoldStep >= i ? '#dbeafe' : '#f8fafc',
                        border: `2px solid ${unfoldStep >= i ? '#3b82f6' : '#e2e8f0'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700,
                        color: unfoldStep >= i ? '#1e40af' : '#94a3b8',
                        transition: 'all 0.5s ease',
                      }}>
                        "{word}"
                      </div>
                    </div>

                    {/* Hidden state arrow between cells */}
                    {i < 3 && (
                      <div style={{
                        display: 'flex', alignItems: 'center', paddingTop: '0.5rem',
                        color: unfoldStep >= i + 1 ? '#f59e0b' : '#e2e8f0',
                        transition: 'color 0.5s',
                        fontSize: '1.5rem', fontWeight: 700,
                      }}>
                        →
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step description */}
              <div style={{
                background: '#fff', padding: '1rem 1.5rem', borderRadius: '12px',
                border: '1px solid #99f6e4', marginTop: '1rem', minHeight: '50px',
                transition: 'all 0.3s',
              }}>
                {unfoldStep === -1 && <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Click "Play Unfolding" to see the RNN process the sentence "I love deep learning" step by step.</p>}
                {unfoldStep === 0 && <p style={{ color: '#0f766e', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>⏱ Step 1: RNN reads <strong>"I"</strong>. The initial hidden state h₀ is usually zeros. The cell computes h₁ = tanh(W·x₁ + W·h₀ + b)</p>}
                {unfoldStep === 1 && <p style={{ color: '#0f766e', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>⏱ Step 2: RNN reads <strong>"love"</strong>. It uses h₁ (memory of "I") to compute h₂. Now it knows "I love".</p>}
                {unfoldStep === 2 && <p style={{ color: '#0f766e', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>⏱ Step 3: RNN reads <strong>"deep"</strong>. h₃ now encodes the context of "I love deep".</p>}
                {unfoldStep === 3 && <p style={{ color: '#0f766e', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>⏱ Step 4: RNN reads <strong>"learning"</strong>. h₄ captures the meaning of the full sentence "I love deep learning"!</p>}
                {unfoldStep >= 4 && <p style={{ color: '#16a34a', margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>✅ Complete! The final hidden state h₄ encodes the entire sentence's meaning. For many-to-one tasks (e.g. sentiment analysis), only this final state is used for prediction.</p>}
              </div>
            </div>

            {/* BPTT */}
            <div style={{ background: '#fff7ed', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #ea580c' }}>
              <h3 style={{ color: '#c2410c', margin: '0 0 1rem 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔙 Backpropagation Through Time (BPTT)
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                RNNs are trained using a modified version of backpropagation called <strong>Backpropagation Through Time (BPTT)</strong>. Since the RNN is "unfolded" across time steps, the error gradients must flow backwards through every single time step.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <p style={{ fontWeight: 700, color: '#c2410c', margin: '0 0 0.5rem 0' }}>1. Forward Pass</p>
                  <p style={{ color: '#475569', margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>Process the entire sequence from left to right, computing hidden states and outputs at each time step.</p>
                </div>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <p style={{ fontWeight: 700, color: '#c2410c', margin: '0 0 0.5rem 0' }}>2. Compute Loss</p>
                  <p style={{ color: '#475569', margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>Calculate the error (loss) at each time step and sum them up to get the total loss.</p>
                </div>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <p style={{ fontWeight: 700, color: '#c2410c', margin: '0 0 0.5rem 0' }}>3. Backward Pass</p>
                  <p style={{ color: '#475569', margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>Propagate gradients backwards through every time step. Since weights are shared, gradients from all time steps are accumulated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB 3: VANISHING GRADIENT PROBLEM
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'vanishing' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div style={{ background: '#fef2f2', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #dc2626' }}>
              <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#991b1b' }}>
                ⚠️ The Vanishing Gradient Problem
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                During BPTT, gradients must flow backwards through every time step. At each step, the gradient is <strong>multiplied by the weight matrix</strong>. If the weight values are less than 1, repeated multiplication causes the gradient to <strong>shrink exponentially</strong> — eventually becoming near zero. This means early time steps receive <strong>almost no learning signal</strong>.
              </p>
              <div style={{ background: '#fee2e2', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#991b1b', fontFamily: "'Fira Code', monospace", fontSize: '0.95rem', margin: 0 }}>
                  gradient = ∂L/∂h₁ = (∂h₅/∂h₄) × (∂h₄/∂h₃) × (∂h₃/∂h₂) × (∂h₂/∂h₁) × ...
                </p>
                <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0.5rem 0 0 0', fontWeight: 600 }}>
                  Each factor &lt; 1 → Product → 0 → ❌ No learning for early steps!
                </p>
              </div>
            </div>

            {/* Interactive Visualization */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #fecaca' }}>
              <h3 style={{ color: '#991b1b', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>Interactive Gradient Flow Visualization</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                Watch how the gradient magnitude shrinks as it flows backwards from the loss to earlier time steps:
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={playGradient} disabled={isGradPlaying}
                  style={{ background: isGradPlaying ? '#cbd5e1' : '#dc2626', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: isGradPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={16} /> {isGradPlaying ? 'Flowing...' : 'Show Gradient Flow'}
                </button>
                <button onClick={resetGradient}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>

              {/* Gradient bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '1rem', height: '200px', padding: '1rem 0', flexWrap: 'wrap' }}>
                {['t=5 (Loss)', 't=4', 't=3', 't=2', 't=1'].map((label, i) => {
                  const heights = [180, 140, 80, 30, 5];
                  const opacities = [1, 0.85, 0.6, 0.35, 0.1];
                  const isReached = gradStep >= i;
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: 50,
                        height: isReached ? heights[i] : 0,
                        background: `linear-gradient(180deg, #ef4444 0%, #fca5a5 100%)`,
                        borderRadius: '8px 8px 0 0',
                        opacity: isReached ? opacities[i] : 0,
                        transition: 'all 0.6s ease',
                        position: 'relative',
                      }}>
                        {isReached && (
                          <span style={{
                            position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)',
                            fontSize: '0.7rem', fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap',
                          }}>
                            {i === 0 ? '1.0' : i === 1 ? '0.75' : i === 2 ? '0.35' : i === 3 ? '0.08' : '0.001'}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div style={{ background: '#fef2f2', padding: '1rem 1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                {gradStep === -1 && <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Click "Show Gradient Flow" to see how gradients vanish over time.</p>}
                {gradStep >= 0 && gradStep < 5 && <p style={{ color: '#991b1b', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Gradient is flowing backward from the loss... Watch how the magnitude shrinks at each step!</p>}
                {gradStep >= 5 && <p style={{ color: '#dc2626', margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>❌ By time step t=1, the gradient is nearly 0.001! The network has essentially "forgotten" early inputs. This is why vanilla RNNs struggle with long sequences. LSTM and GRU solve this!</p>}
              </div>
            </div>

            {/* Exploding Gradients */}
            <div style={{ background: '#fffbeb', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #d97706' }}>
              <h3 style={{ color: '#92400e', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
                💥 The Exploding Gradient Problem
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                The opposite problem: if weights are greater than 1, repeated multiplication makes gradients <strong>grow exponentially</strong>, causing unstable training with <strong>NaN losses</strong>.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
                  <p style={{ fontWeight: 700, color: '#92400e', margin: '0 0 0.5rem 0' }}>Solution: Gradient Clipping</p>
                  <p style={{ color: '#475569', margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>If the gradient exceeds a threshold, scale it down. Simple but effective. <CodeBlock>torch.nn.utils.clip_grad_norm_(params, max_norm=1.0)</CodeBlock></p>
                </div>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fde68a' }}>
                  <p style={{ fontWeight: 700, color: '#92400e', margin: '0 0 0.5rem 0' }}>Solution: Use LSTM / GRU</p>
                  <p style={{ color: '#475569', margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>These architectures use <strong>gating mechanisms</strong> that allow gradients to flow through unimpeded — solving both vanishing and exploding gradient issues.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB 4: LSTM
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'lstm' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Intro */}
            <div style={{ background: '#fffbeb', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #f59e0b' }}>
              <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#92400e' }}>
                🔒 Long Short-Term Memory (LSTM)
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                The <strong>LSTM</strong> (Hochreiter & Schmidhuber, 1997) is the most popular RNN variant. It solves the vanishing gradient problem by introducing a separate <strong>Cell State (C<sub>t</sub>)</strong> — a "highway" that runs through the entire chain, allowing information to flow unchanged for long periods. Three <strong>gates</strong> control what information is added, removed, or output.
              </p>
              <div style={{ background: '#fef3c7', padding: '1.25rem', borderRadius: '12px' }}>
                <p style={{ color: '#92400e', fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Key Insight: Two State Vectors</p>
                <ul style={{ color: '#475569', margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', lineHeight: 1.8 }}>
                  <li><strong>Cell State (C<sub>t</sub>):</strong> Long-term memory. Like a conveyor belt that carries information across many time steps.</li>
                  <li><strong>Hidden State (h<sub>t</sub>):</strong> Short-term memory / working memory. The filtered output used for predictions.</li>
                </ul>
              </div>
            </div>

            {/* The Three Gates */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #fde68a' }}>
              <h3 style={{ color: '#92400e', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>The Three Gates of LSTM</h3>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={playLstm} disabled={isLstmPlaying}
                  style={{ background: isLstmPlaying ? '#cbd5e1' : '#f59e0b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: isLstmPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={16} /> {isLstmPlaying ? 'Processing...' : 'Animate LSTM Gates'}
                </button>
                <button onClick={resetLstm}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
                {/* Forget Gate */}
                <div style={{
                  padding: '1.5rem', borderRadius: '14px',
                  background: lstmStep >= 1 ? '#fef2f2' : '#f8fafc',
                  border: `2px solid ${lstmStep >= 1 ? '#ef4444' : '#e2e8f0'}`,
                  transform: lstmStep === 1 ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: lstmStep === 1 ? '0 4px 20px rgba(239,68,68,0.2)' : 'none',
                  transition: 'all 0.5s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#ef4444', color: 'white', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
                    <h4 style={{ color: '#991b1b', margin: 0, fontSize: '1.1rem' }}>🚪 Forget Gate</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                    Decides what to <strong>throw away</strong> from the cell state. Uses a sigmoid (0 = forget, 1 = keep).
                  </p>
                  <div style={{ background: '#fff5f5', padding: '0.75rem', borderRadius: '8px', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color: '#991b1b' }}>
                    f<sub>t</sub> = σ(W<sub>f</sub> · [h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>f</sub>)
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
                    e.g. "He is French. She is..." → Forget "He" gender context.
                  </p>
                </div>

                {/* Input Gate */}
                <div style={{
                  padding: '1.5rem', borderRadius: '14px',
                  background: lstmStep >= 2 ? '#eff6ff' : '#f8fafc',
                  border: `2px solid ${lstmStep >= 2 ? '#3b82f6' : '#e2e8f0'}`,
                  transform: lstmStep === 2 ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: lstmStep === 2 ? '0 4px 20px rgba(59,130,246,0.2)' : 'none',
                  transition: 'all 0.5s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#3b82f6', color: 'white', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>2</span>
                    <h4 style={{ color: '#1e40af', margin: 0, fontSize: '1.1rem' }}>📥 Input Gate</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                    Decides what <strong>new information</strong> to store. Two parts: sigmoid decides <em>which</em> values to update; tanh creates candidate values.
                  </p>
                  <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '8px', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color: '#1e40af' }}>
                    i<sub>t</sub> = σ(W<sub>i</sub> · [h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>i</sub>)<br />
                    C̃<sub>t</sub> = tanh(W<sub>C</sub> · [h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>C</sub>)
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
                    e.g. "She is..." → Store "She" as the new gender context.
                  </p>
                </div>

                {/* Output Gate */}
                <div style={{
                  padding: '1.5rem', borderRadius: '14px',
                  background: lstmStep >= 4 ? '#f0fdf4' : '#f8fafc',
                  border: `2px solid ${lstmStep >= 4 ? '#16a34a' : '#e2e8f0'}`,
                  transform: lstmStep === 4 ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: lstmStep === 4 ? '0 4px 20px rgba(22,163,74,0.2)' : 'none',
                  transition: 'all 0.5s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#16a34a', color: 'white', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>3</span>
                    <h4 style={{ color: '#15803d', margin: 0, fontSize: '1.1rem' }}>📤 Output Gate</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                    Decides what to <strong>output</strong> from the cell state as the new hidden state.
                  </p>
                  <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '8px', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color: '#15803d' }}>
                    o<sub>t</sub> = σ(W<sub>o</sub> · [h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>o</sub>)<br />
                    h<sub>t</sub> = o<sub>t</sub> × tanh(C<sub>t</sub>)
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
                    e.g. Given context "She is French", output is the relevant part for the next word prediction.
                  </p>
                </div>
              </div>

              {/* Cell State Update */}
              <div style={{
                marginTop: '1.5rem', padding: '1.5rem', borderRadius: '14px',
                background: lstmStep >= 3 ? '#faf5ff' : '#f8fafc',
                border: `2px solid ${lstmStep >= 3 ? '#7c3aed' : '#e2e8f0'}`,
                transition: 'all 0.5s ease',
              }}>
                <h4 style={{ color: '#5b21b6', margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>🧠 Cell State Update</h4>
                <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                  The cell state is updated by <strong>forgetting</strong> old info and <strong>adding</strong> new info:
                </p>
                <div style={{ background: '#ede9fe', padding: '0.75rem', borderRadius: '8px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem', color: '#5b21b6', textAlign: 'center' }}>
                  C<sub>t</sub> = f<sub>t</sub> × C<sub>t-1</sub> + i<sub>t</sub> × C̃<sub>t</sub>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.75rem 0 0 0' }}>
                  This is the key to LSTM's power! The cell state can carry information across hundreds of time steps because the <strong>additive</strong> nature of the update avoids repeated multiplication that causes vanishing gradients.
                </p>
              </div>

              {/* Step description */}
              <div style={{ background: '#fffbeb', padding: '1rem 1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                {lstmStep === -1 && <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Click "Animate LSTM Gates" to see how information flows through the three gates.</p>}
                {lstmStep === 0 && <p style={{ color: '#92400e', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>📥 Receiving inputs: previous hidden state h<sub>t-1</sub> and current input x<sub>t</sub>...</p>}
                {lstmStep === 1 && <p style={{ color: '#991b1b', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>🚪 <strong>Forget Gate:</strong> Deciding what old information to discard from the cell state...</p>}
                {lstmStep === 2 && <p style={{ color: '#1e40af', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>📥 <strong>Input Gate:</strong> Deciding what new information to write to the cell state...</p>}
                {lstmStep === 3 && <p style={{ color: '#5b21b6', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>🧠 <strong>Cell State Update:</strong> C<sub>t</sub> = (forget old) + (add new). The conveyor belt is updated!</p>}
                {lstmStep === 4 && <p style={{ color: '#15803d', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>📤 <strong>Output Gate:</strong> Filtering the cell state to produce the hidden state output h<sub>t</sub>.</p>}
                {lstmStep >= 5 && <p style={{ color: '#16a34a', margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>✅ Complete! The LSTM cell has processed one time step. h<sub>t</sub> and C<sub>t</sub> move to the next step.</p>}
              </div>
            </div>

            {/* LSTM Parameter Count */}
            <div style={{ background: '#f0f9ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #0284c7' }}>
              <h3 style={{ color: '#0c4a6e', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>📊 LSTM Parameter Count</h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                An LSTM has <strong>4× the parameters</strong> of a vanilla RNN because it has 4 weight matrices (one for each gate + candidate):
              </p>
              <div style={{ background: '#e0f2fe', padding: '1.25rem', borderRadius: '12px', fontFamily: "'Fira Code', monospace", textAlign: 'center' }}>
                <p style={{ color: '#0c4a6e', margin: 0, fontSize: '0.95rem' }}>
                  Parameters = 4 × [(input_size × hidden_size) + (hidden_size × hidden_size) + hidden_size]
                </p>
                <p style={{ color: '#0369a1', margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>
                  = 4 × [n × h + h × h + h] = 4 × [h(n + h) + h]
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB 5: GRU
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'gru' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div style={{ background: '#f0fdf4', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #16a34a' }}>
              <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#15803d' }}>
                🔓 Gated Recurrent Unit (GRU)
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                The <strong>GRU</strong> (Cho et al., 2014) is a simplified version of LSTM. It combines the forget and input gates into a single <strong>Update Gate</strong>, and merges the cell state and hidden state. This makes it <strong>faster to train</strong> with <strong>fewer parameters</strong> while achieving similar performance on many tasks.
              </p>
              <div style={{ background: '#dcfce7', padding: '1.25rem', borderRadius: '12px' }}>
                <p style={{ color: '#15803d', fontWeight: 700, margin: '0 0 0.5rem 0' }}>GRU vs LSTM: Key Simplifications</p>
                <ul style={{ color: '#475569', margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', lineHeight: 1.8 }}>
                  <li><strong>2 gates</strong> instead of 3 (Update + Reset vs Forget + Input + Output)</li>
                  <li><strong>No separate cell state</strong> — only the hidden state h<sub>t</sub></li>
                  <li><strong>~25% fewer parameters</strong> — faster training, less memory</li>
                </ul>
              </div>
            </div>

            {/* GRU Gates */}
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #bbf7d0' }}>
              <h3 style={{ color: '#15803d', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>The Two Gates of GRU</h3>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button onClick={playGru} disabled={isGruPlaying}
                  style={{ background: isGruPlaying ? '#cbd5e1' : '#16a34a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: isGruPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Play size={16} /> {isGruPlaying ? 'Processing...' : 'Animate GRU Gates'}
                </button>
                <button onClick={resetGru}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {/* Reset Gate */}
                <div style={{
                  padding: '1.5rem', borderRadius: '14px',
                  background: gruStep >= 1 ? '#fef2f2' : '#f8fafc',
                  border: `2px solid ${gruStep >= 1 ? '#f97316' : '#e2e8f0'}`,
                  transform: gruStep === 1 ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: gruStep === 1 ? '0 4px 20px rgba(249,115,22,0.2)' : 'none',
                  transition: 'all 0.5s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#f97316', color: 'white', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>1</span>
                    <h4 style={{ color: '#c2410c', margin: 0, fontSize: '1.1rem' }}>🔄 Reset Gate (r<sub>t</sub>)</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                    Determines how much of the <strong>previous hidden state</strong> to forget when computing the candidate. When r<sub>t</sub> ≈ 0, the network acts as if it's reading the first word of a new sentence.
                  </p>
                  <div style={{ background: '#fff7ed', padding: '0.75rem', borderRadius: '8px', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color: '#c2410c' }}>
                    r<sub>t</sub> = σ(W<sub>r</sub> · [h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>r</sub>)
                  </div>
                </div>

                {/* Update Gate */}
                <div style={{
                  padding: '1.5rem', borderRadius: '14px',
                  background: gruStep >= 2 ? '#eff6ff' : '#f8fafc',
                  border: `2px solid ${gruStep >= 2 ? '#3b82f6' : '#e2e8f0'}`,
                  transform: gruStep === 2 ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: gruStep === 2 ? '0 4px 20px rgba(59,130,246,0.2)' : 'none',
                  transition: 'all 0.5s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#3b82f6', color: 'white', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>2</span>
                    <h4 style={{ color: '#1e40af', margin: 0, fontSize: '1.1rem' }}>🔀 Update Gate (z<sub>t</sub>)</h4>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
                    Acts like LSTM's forget + input gate combined. Decides <strong>how much of the old state to keep</strong> vs <strong>how much new candidate to add</strong>. z<sub>t</sub> = 1 means "keep everything old".
                  </p>
                  <div style={{ background: '#eff6ff', padding: '0.75rem', borderRadius: '8px', fontFamily: "'Fira Code', monospace", fontSize: '0.8rem', color: '#1e40af' }}>
                    z<sub>t</sub> = σ(W<sub>z</sub> · [h<sub>t-1</sub>, x<sub>t</sub>] + b<sub>z</sub>)
                  </div>
                </div>
              </div>

              {/* Hidden State Update */}
              <div style={{
                marginTop: '1.5rem', padding: '1.5rem', borderRadius: '14px',
                background: gruStep >= 3 ? '#f0fdf4' : '#f8fafc',
                border: `2px solid ${gruStep >= 3 ? '#16a34a' : '#e2e8f0'}`,
                transition: 'all 0.5s ease',
              }}>
                <h4 style={{ color: '#15803d', margin: '0 0 0.75rem 0', fontSize: '1.1rem' }}>🧠 Hidden State Update</h4>
                <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '8px', fontFamily: "'Fira Code', monospace", fontSize: '0.85rem', color: '#15803d', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 0.25rem 0' }}>h̃<sub>t</sub> = tanh(W · [r<sub>t</sub> × h<sub>t-1</sub>, x<sub>t</sub>] + b)</p>
                  <p style={{ margin: 0, fontWeight: 700 }}>h<sub>t</sub> = z<sub>t</sub> × h<sub>t-1</sub> + (1 - z<sub>t</sub>) × h̃<sub>t</sub></p>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.75rem 0 0 0' }}>
                  The final hidden state is a linear interpolation between the old state and the candidate. This is elegant — the update gate alone controls the balance between memory and new information.
                </p>
              </div>

              {/* Step description */}
              <div style={{ background: '#f0fdf4', padding: '1rem 1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                {gruStep === -1 && <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Click "Animate GRU Gates" to see how the GRU processes information.</p>}
                {gruStep === 0 && <p style={{ color: '#15803d', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>📥 Receiving inputs: h<sub>t-1</sub> and x<sub>t</sub>...</p>}
                {gruStep === 1 && <p style={{ color: '#c2410c', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>🔄 <strong>Reset Gate:</strong> Determining how much past memory to use for the candidate computation...</p>}
                {gruStep === 2 && <p style={{ color: '#1e40af', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>🔀 <strong>Update Gate:</strong> Deciding the balance between keeping old info vs adopting new info...</p>}
                {gruStep === 3 && <p style={{ color: '#15803d', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>🧠 <strong>Hidden State:</strong> Computing the new hidden state as a blend of old and new...</p>}
                {gruStep >= 4 && <p style={{ color: '#16a34a', margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>✅ Complete! GRU produces a single h<sub>t</sub> — simpler than LSTM but equally powerful for many tasks.</p>}
              </div>
            </div>

            {/* LSTM vs GRU Comparison */}
            <div style={{ background: '#faf5ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #7c3aed' }}>
              <h3 style={{ color: '#5b21b6', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>⚖️ LSTM vs GRU — When to Use Which?</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#ede9fe' }}>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#5b21b6', borderBottom: '2px solid #c4b5fd' }}>Aspect</th>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#f59e0b', borderBottom: '2px solid #c4b5fd' }}>LSTM</th>
                      <th style={{ padding: '0.85rem', textAlign: 'left', color: '#16a34a', borderBottom: '2px solid #c4b5fd' }}>GRU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Gates', '3 (Forget, Input, Output)', '2 (Reset, Update)'],
                      ['States', 'Cell State + Hidden State', 'Hidden State only'],
                      ['Parameters', 'More (~4x vanilla RNN)', 'Fewer (~3x vanilla RNN)'],
                      ['Training Speed', 'Slower', 'Faster'],
                      ['Long Sequences', 'Better for very long dependencies', 'Good for moderate lengths'],
                      ['Best When', 'Large dataset, complex tasks', 'Smaller dataset, speed needed'],
                      ['Use Cases', 'Machine Translation, Speech', 'Chatbots, Short Text Classification'],
                    ].map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#faf5ff' : '#fff' }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: '0.75rem', color: j === 0 ? '#5b21b6' : '#475569', fontWeight: j === 0 ? 700 : 400, borderBottom: '1px solid #e9d5ff' }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bidirectional RNN */}
            <div style={{ background: '#eff6ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #2563eb' }}>
              <h3 style={{ color: '#1e40af', margin: '0 0 1rem 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ↔️ Bidirectional RNN (BiRNN)
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                A standard RNN only reads from <strong>left to right</strong>. But sometimes context from the <strong>future</strong> is also important. A <strong>Bidirectional RNN</strong> runs two RNNs: one forward and one backward, then concatenates their hidden states.
              </p>
              <div style={{ background: '#dbeafe', padding: '1.25rem', borderRadius: '12px' }}>
                <p style={{ color: '#1e40af', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                  <strong>Example:</strong> "I went to the <strong>bank</strong> to deposit money" vs "I sat on the river <strong>bank</strong>."
                  <br />Without seeing the future words ("deposit" vs "river"), we can't disambiguate "bank". A BiRNN sees both directions!
                </p>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '1rem 0 0 0' }}>
                <strong>Note:</strong> BiRNNs double the hidden state size (2 × hidden_size) and cannot be used for real-time generation tasks (since they need the full sequence upfront).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB 6: CODE WALKTHROUGH
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'code' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <h3 className="section-title-main" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Building RNNs with TensorFlow/Keras & PyTorch</h3>

            {/* Keras LSTM */}
            <div style={{ background: '#fffbeb', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #f59e0b' }}>
              <h4 style={{ color: '#92400e', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>🔶 TensorFlow/Keras — Sentiment Analysis with LSTM</h4>
              <pre style={{
                background: '#1e293b', color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px',
                overflow: 'auto', fontSize: '0.82rem', lineHeight: 1.7,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              }}>
{`import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout, Bidirectional
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.datasets import imdb

# 1. Load & Preprocess Data (IMDb movie reviews)
vocab_size = 10000
max_length = 200

(X_train, y_train), (X_test, y_test) = imdb.load_data(num_words=vocab_size)
X_train = pad_sequences(X_train, maxlen=max_length, padding='post', truncating='post')
X_test  = pad_sequences(X_test,  maxlen=max_length, padding='post', truncating='post')

# 2. Build the LSTM Model
model = Sequential([
    # Embedding: Converts word indices → dense vectors (learned during training)
    Embedding(input_dim=vocab_size, output_dim=128, input_length=max_length),
    
    # Bidirectional LSTM: Reads forward AND backward
    Bidirectional(LSTM(64, return_sequences=False, dropout=0.3)),
    
    # Dense classifier
    Dropout(0.5),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')  # Binary: Positive or Negative
])

# 3. Compile
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# 4. Train
model.fit(X_train, y_train, epochs=5, batch_size=64, validation_split=0.2)

# 5. Evaluate
loss, acc = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {acc:.4f}")`}
              </pre>
              <div style={{ marginTop: '1rem' }}>
                <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  <strong>Key Points:</strong>
                </p>
                <ul style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.8, margin: '0.25rem 0 0 0', paddingLeft: '1.5rem' }}>
                  <li><CodeBlock>Embedding</CodeBlock>: Converts integer word IDs into learnable dense vectors. Essential first layer for text.</li>
                  <li><CodeBlock>LSTM(64)</CodeBlock>: 64-unit LSTM. <CodeBlock>return_sequences=False</CodeBlock> returns only the last hidden state (for many-to-one).</li>
                  <li><CodeBlock>Bidirectional</CodeBlock>: Wraps the LSTM to read in both directions, producing 128-dim output (64×2).</li>
                  <li><CodeBlock>Dropout</CodeBlock>: Regularization to prevent overfitting on text data.</li>
                </ul>
              </div>
            </div>

            {/* PyTorch LSTM */}
            <div style={{ background: '#eff6ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #3b82f6' }}>
              <h4 style={{ color: '#1e40af', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>🔷 PyTorch — Custom LSTM for Time Series</h4>
              <pre style={{
                background: '#1e293b', color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px',
                overflow: 'auto', fontSize: '0.82rem', lineHeight: 1.7,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              }}>
{`import torch
import torch.nn as nn

class LSTMPredictor(nn.Module):
    def __init__(self, input_size=1, hidden_size=64, num_layers=2, output_size=1):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        
        # LSTM layer: batch_first=True means input is (batch, seq_len, features)
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2       # Dropout between LSTM layers (not on last layer)
        )
        
        # Fully connected output layer
        self.fc = nn.Linear(hidden_size, output_size)
    
    def forward(self, x):
        # Initialize hidden state and cell state with zeros
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size).to(x.device)
        
        # Forward propagate through LSTM
        out, (hn, cn) = self.lstm(x, (h0, c0))
        
        # Use the last time step's output for prediction
        out = self.fc(out[:, -1, :])
        return out

# Usage
model = LSTMPredictor(input_size=1, hidden_size=64, num_layers=2)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Training loop
for epoch in range(100):
    output = model(X_train)                    # Forward
    loss = criterion(output, y_train)          # Compute loss
    optimizer.zero_grad()                       # Clear gradients
    loss.backward()                             # BPTT
    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)  # Gradient clipping!
    optimizer.step()                            # Update weights`}
              </pre>
              <div style={{ marginTop: '1rem' }}>
                <ul style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.5rem' }}>
                  <li><CodeBlock>num_layers=2</CodeBlock>: Stacked LSTM — the output of LSTM layer 1 feeds into LSTM layer 2.</li>
                  <li><CodeBlock>batch_first=True</CodeBlock>: Input shape is (batch, sequence_length, features) instead of (seq, batch, feat).</li>
                  <li><CodeBlock>clip_grad_norm_</CodeBlock>: Prevents exploding gradients by capping the gradient magnitude.</li>
                  <li>The LSTM returns <CodeBlock>(output, (h_n, c_n))</CodeBlock> — we use the last timestep <CodeBlock>out[:, -1, :]</CodeBlock> for prediction.</li>
                </ul>
              </div>
            </div>

            {/* GRU Example */}
            <div style={{ background: '#f0fdf4', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #16a34a' }}>
              <h4 style={{ color: '#15803d', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>🟢 Quick GRU Example (Keras)</h4>
              <pre style={{
                background: '#1e293b', color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px',
                overflow: 'auto', fontSize: '0.82rem', lineHeight: 1.7,
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              }}>
{`from tensorflow.keras.layers import GRU

# Simply replace LSTM with GRU — the API is identical!
model = Sequential([
    Embedding(vocab_size, 128, input_length=max_length),
    Bidirectional(GRU(64, return_sequences=False, dropout=0.3)),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])

# GRU trains ~20-25% faster than LSTM with similar accuracy`}
              </pre>
            </div>

            {/* return_sequences explanation */}
            <div style={{ background: '#faf5ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #7c3aed' }}>
              <h4 style={{ color: '#5b21b6', margin: '0 0 1rem 0', fontSize: '1.2rem' }}>🔑 Key Parameter: <CodeBlock>return_sequences</CodeBlock></h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#ede9fe', padding: '1.25rem', borderRadius: '12px' }}>
                  <p style={{ fontWeight: 700, color: '#5b21b6', margin: '0 0 0.5rem 0' }}>return_sequences=False</p>
                  <p style={{ color: '#475569', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Returns only the <strong>last</strong> hidden state. Output shape: <CodeBlock>(batch, hidden_size)</CodeBlock></p>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem', fontStyle: 'italic' }}>Use for: Sentiment analysis, classification (many-to-one)</p>
                </div>
                <div style={{ background: '#ede9fe', padding: '1.25rem', borderRadius: '12px' }}>
                  <p style={{ fontWeight: 700, color: '#5b21b6', margin: '0 0 0.5rem 0' }}>return_sequences=True</p>
                  <p style={{ color: '#475569', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Returns hidden state at <strong>every</strong> time step. Output shape: <CodeBlock>(batch, seq_len, hidden_size)</CodeBlock></p>
                  <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem', fontStyle: 'italic' }}>Use for: Stacking LSTM layers, seq-to-seq, NER (many-to-many)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          TAB 7: APPLICATIONS
      ═══════════════════════════════════════════════════ */}
      {activeTab === 'applications' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <h3 className="section-title-main" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Real-World Applications of RNNs</h3>

            {/* Interactive Next-Word Prediction */}
            <div style={{ background: '#faf5ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #7c3aed' }}>
              <h3 style={{ color: '#5b21b6', margin: '0 0 1rem 0', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎮 Interactive: Next-Word Prediction Demo
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                Click a sentence to see how an RNN-based language model predicts the next word with probabilities:
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {Object.keys(demoSentences).map(sentence => (
                  <button key={sentence} onClick={() => runSeqPrediction(sentence)}
                    disabled={isSeqPredicting}
                    style={{
                      background: seqInput === sentence ? '#7c3aed' : '#ede9fe',
                      color: seqInput === sentence ? '#fff' : '#5b21b6',
                      border: 'none', padding: '0.5rem 1rem', borderRadius: '8px',
                      cursor: isSeqPredicting ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '0.82rem',
                      transition: 'all 0.2s',
                    }}>
                    "{sentence}..."
                  </button>
                ))}
              </div>

              {seqInput && (
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <p style={{ color: '#5b21b6', fontWeight: 700, margin: '0 0 1rem 0', fontSize: '0.95rem' }}>
                    Input: "{seqInput} ___"
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {seqPredictions.map((pred, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5b21b6', minWidth: '80px' }}>
                          "{pred.word}"
                        </span>
                        <div style={{ flex: 1, height: '24px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${pred.prob * 100}%`,
                            background: `linear-gradient(90deg, #7c3aed, ${i === 0 ? '#a78bfa' : '#c4b5fd'})`,
                            borderRadius: '6px',
                            transition: 'width 0.5s ease',
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px',
                          }}>
                            <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>{(pred.prob * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Application Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {[
                {
                  emoji: '💬', title: 'Natural Language Processing',
                  desc: 'Machine translation (Google Translate originally used seq-to-seq LSTMs), text generation, chatbots, and question answering.',
                  color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe',
                  detail: 'LSTM/GRU → Transformer (2017)'
                },
                {
                  emoji: '🗣️', title: 'Speech Recognition',
                  desc: 'Converting spoken audio into text. Audio is a sequence of spectral features over time — perfect for RNNs.',
                  color: '#8b5cf6', bg: '#faf5ff', border: '#ddd6fe',
                  detail: 'Used in: Siri, Alexa, Google Assistant'
                },
                {
                  emoji: '📈', title: 'Time Series Forecasting',
                  desc: 'Predicting stock prices, weather, energy consumption, and sales. LSTMs capture temporal patterns and seasonality.',
                  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
                  detail: 'LSTM outperforms ARIMA on many tasks'
                },
                {
                  emoji: '🎵', title: 'Music Generation',
                  desc: 'Composing original music by learning patterns from existing compositions. Each note is a time step in the sequence.',
                  color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8',
                  detail: 'Google Magenta project'
                },
                {
                  emoji: '🏥', title: 'Healthcare — EHR Analysis',
                  desc: 'Analyzing sequential patient records (Electronic Health Records) to predict disease progression and treatment outcomes.',
                  color: '#ef4444', bg: '#fef2f2', border: '#fecaca',
                  detail: 'Predicting hospital readmission'
                },
                {
                  emoji: '📝', title: 'Handwriting Generation',
                  desc: 'Generating realistic handwriting stroke by stroke. Each pen movement is a point in a time sequence.',
                  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
                  detail: 'Alex Graves (2013) seminal work'
                },
              ].map((app, i) => (
                <div key={i} style={{
                  padding: '1.5rem', borderRadius: '14px',
                  background: app.bg, border: `1px solid ${app.border}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{app.emoji}</div>
                  <h4 style={{ color: app.color, margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>{app.title}</h4>
                  <p style={{ color: '#475569', margin: '0 0 0.75rem 0', fontSize: '0.85rem', lineHeight: 1.6 }}>{app.desc}</p>
                  <span style={{ background: `${app.color}15`, color: app.color, padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {app.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* RNN vs Transformers */}
            <div style={{ background: '#fff7ed', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #ea580c' }}>
              <h3 style={{ color: '#c2410c', margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
                🔄 RNNs vs Transformers — The Evolution
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1rem 0' }}>
                In 2017, the <strong>"Attention is All You Need"</strong> paper introduced the <strong>Transformer</strong> architecture, which has largely replaced RNNs for NLP tasks. However, RNNs are still relevant:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <p style={{ fontWeight: 700, color: '#ea580c', margin: '0 0 0.5rem 0' }}>✅ RNNs Still Win When:</p>
                  <ul style={{ color: '#475569', margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    <li>Limited compute / edge devices</li>
                    <li>Streaming / real-time data</li>
                    <li>Small datasets</li>
                    <li>Simple sequence tasks</li>
                  </ul>
                </div>
                <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <p style={{ fontWeight: 700, color: '#ea580c', margin: '0 0 0.5rem 0' }}>🚀 Transformers Win When:</p>
                  <ul style={{ color: '#475569', margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.7 }}>
                    <li>Large-scale NLP (GPT, BERT)</li>
                    <li>Parallelization is needed (RNNs are sequential)</li>
                    <li>Very long-range dependencies</li>
                    <li>Abundant compute & data</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ background: '#f0f9ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #0284c7' }}>
              <h3 style={{ color: '#0c4a6e', margin: '0 0 1.5rem 0', fontSize: '1.3rem' }}>📅 Brief History of RNNs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { year: '1986', event: 'Backpropagation Through Time (BPTT) introduced by Rumelhart, Hinton, Williams.' },
                  { year: '1990', event: 'Elman Network — first practical RNN for sequence processing.' },
                  { year: '1997', event: 'LSTM invented by Hochreiter & Schmidhuber — solving vanishing gradients.' },
                  { year: '2014', event: 'GRU introduced by Cho et al. — a simpler alternative to LSTM.' },
                  { year: '2014', event: 'Seq-to-Seq model by Sutskever et al. — revolutionized machine translation.' },
                  { year: '2015', event: 'Attention mechanism added to RNNs (Bahdanau et al.).' },
                  { year: '2017', event: 'Transformer architecture — "Attention is All You Need" replaces RNNs for most NLP.' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <span style={{
                      background: '#0284c7', color: '#fff', padding: '4px 10px', borderRadius: '6px',
                      fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', minWidth: '50px', textAlign: 'center',
                    }}>{item.year}</span>
                    <p style={{ color: '#475569', margin: 0, fontSize: '0.88rem', lineHeight: 1.5 }}>{item.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
