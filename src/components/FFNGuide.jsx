import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, GitMerge, Calculator, ArrowRight, Sliders } from 'lucide-react';

export default function FFNGuide() {
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive state for the Perceptrons
  const [a1, setA1] = useState(0); // Angle of Perceptron 1
  const [o1, setO1] = useState(80); // Offset of Perceptron 1
  const [a2, setA2] = useState(0); // Angle of Perceptron 2
  const [o2, setO2] = useState(-80); // Offset of Perceptron 2

  const [isTraining, setIsTraining] = useState(false);
  const animationRef = useRef(null);

  // Target values that perfectly classify the data
  const targetA1 = 30;
  const targetO1 = -20;
  const targetA2 = -45;
  const targetO2 = 10;

  const simulateTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    
    // Reset to bad starting position
    setA1(0); setO1(80);
    setA2(0); setO2(-80);

    let step = 0;
    const totalSteps = 100;

    const animate = () => {
      step++;
      const progress = step / totalSteps;
      
      // Use an ease-out function for smoother stopping
      const ease = 1 - Math.pow(1 - progress, 3);

      setA1(0 + (targetA1 - 0) * ease);
      setO1(80 + (targetO1 - 80) * ease);
      setA2(0 + (targetA2 - 0) * ease);
      setO2(-80 + (targetO2 - -80) * ease);

      if (step < totalSteps) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsTraining(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Fixed data points (Green = Positive Class, Pink = Negative Class)
  const renderDataPoints = () => (
    <>
      {/* Target positive class cluster */}
      <circle cx="40" cy="20" r="4" fill="#22c55e" />
      <circle cx="60" cy="-10" r="4" fill="#22c55e" />
      <circle cx="25" cy="-30" r="4" fill="#22c55e" />
      <circle cx="70" cy="30" r="4" fill="#22c55e" />
      <circle cx="30" cy="50" r="4" fill="#22c55e" />
      
      {/* Negative class scattered outside */}
      <circle cx="-40" cy="60" r="4" fill="#ec4899" />
      <circle cx="-50" cy="-20" r="4" fill="#ec4899" />
      <circle cx="-20" cy="-60" r="4" fill="#ec4899" />
      <circle cx="10" cy="-70" r="4" fill="#ec4899" />
      <circle cx="-60" cy="20" r="4" fill="#ec4899" />
      <circle cx="20" cy="80" r="4" fill="#ec4899" />
      <circle cx="-10" cy="40" r="4" fill="#ec4899" />
    </>
  );

  return (
    <div className="tab-layout-container fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="section-title-main" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrainCircuit size={32} color="#ec4899" />
          Feed Forward Networks (FFN) & Multi-Layer Perceptrons
        </h2>
        <p className="tutorial-paragraph">
          While a single Perceptron is a powerful "atomic" unit, it can only solve simple, linear problems. By combining multiple perceptrons together into hidden layers, we create an Artificial Neural Network (ANN) or Multi-Layer Perceptron (MLP) capable of learning highly complex, non-linear patterns.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{ 
            background: activeTab === 'overview' ? '#14b8a6' : 'transparent', 
            color: activeTab === 'overview' ? '#fff' : '#64748b', 
            border: activeTab === 'overview' ? 'none' : '1px solid #cbd5e1', 
            padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <BrainCircuit size={18} /> Introduction & Theory
        </button>
        <button 
          onClick={() => setActiveTab('nonlinear')}
          style={{ 
            background: activeTab === 'nonlinear' ? '#ec4899' : 'transparent', 
            color: activeTab === 'nonlinear' ? '#fff' : '#64748b', 
            border: activeTab === 'nonlinear' ? 'none' : '1px solid #cbd5e1', 
            padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <GitMerge size={18} /> P1 + P2 = MLP (Interactive)
        </button>
        <button 
          onClick={() => setActiveTab('parameters')}
          style={{ 
            background: activeTab === 'parameters' ? '#8b5cf6' : 'transparent', 
            color: activeTab === 'parameters' ? '#fff' : '#64748b', 
            border: activeTab === 'parameters' ? 'none' : '1px solid #cbd5e1', 
            padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Calculator size={18} /> Trainable Parameters Math
        </button>
      </div>

      {/* Theory & Overview Section */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Multilayer Feed-Forward Neural Network (MFFNN)</h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            A <strong>Multilayer Feed-Forward Neural Network (MFFNN)</strong> is an interconnected Artificial Neural Network with multiple layers containing neurons (with associated weights) that compute results using activation functions. It is called "feed-forward" because the flow of data is strictly one-way: from input to hidden units, and finally to output units. It does not have any loops, no feedback mechanisms, and no signals moving backwards during its operational phase.
          </p>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            The ANN is a self-learning network that mimics the biological nervous system, heavily utilized in Data Mining, Machine Learning, and AI. By learning from sample datasets, it maps complex inputs to desired outputs, adapting its architecture and activation functions based on the specific problem being solved.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#0f766e', marginBottom: '1rem' }}>Architecture Breakdown</h4>
              <ul style={{ color: '#475569', paddingLeft: '1.2rem', lineHeight: '1.7' }}>
                <li><strong>Input Layer:</strong> The starting layer. It receives raw signals (data) and passes them forward along weighted connections.</li>
                <li><strong>Hidden Layer(s):</strong> Positioned between input and output. They perform the heavy computational lifting (summation of dot products of weights and signals, followed by an activation function like Sigmoid or ReLU). Multiple hidden layers significantly increase model accuracy and non-linear capability.</li>
                <li><strong>Output Layer:</strong> Receives processed data to formulate the final prediction. Often uses specialized activation functions (like Softmax for multi-class, or a Heaviside step for binary decisions) to format the result as required.</li>
              </ul>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#0369a1', marginBottom: '1rem' }}>Applications in Data Mining & AI</h4>
              <ul style={{ color: '#475569', paddingLeft: '1.2rem', lineHeight: '1.7' }}>
                <li><strong>Medical Field:</strong> Disease diagnosis and predicting patient outcomes based on historical tabular data.</li>
                <li><strong>Speech Regeneration & Processing:</strong> Acting as the dense decision-making layers at the end of audio processing pipelines.</li>
                <li><strong>Data Processing & Compression:</strong> Autoencoders (a type of FFN) can compress data into dense latent representations.</li>
                <li><strong>Image Processing:</strong> Standard FFNs are often attached to the end of Convolutional Neural Networks (CNNs) to make the final classification based on extracted features.</li>
              </ul>
            </div>

          </div>

          <div style={{ background: '#fff1f2', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #e11d48' }}>
            <h4 style={{ color: '#9f1239', margin: '0 0 0.5rem 0' }}>Limitations & The Backpropagation Nuance</h4>
            <p style={{ color: '#be123c', margin: 0, lineHeight: '1.6' }}>
              Because MFFNNs are strictly feed-forward, they have no concept of "memory" or cycles (unlike Recurrent Neural Networks - RNNs), meaning contextual neighborhood information in sequences is often lost. 
              <br/><br/>
              <em>Important Clarification:</em> While the operational flow of data is purely forward (meaning the network architecture itself cannot correct faults dynamically during a live prediction), we <strong>must</strong> use an external algorithm called <strong>Backpropagation</strong> during the <em>Training Phase</em> to update the weights and teach the network. Once trained, the network reverts to being strictly feed-forward for making predictions.
            </p>
          </div>
        </div>
      )}

      {/* Non-Linearity Section */}
      {activeTab === 'nonlinear' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.5rem' }}>
            Interactive Demo: Classifying Non-Linear Data
            <button 
              onClick={simulateTraining}
              disabled={isTraining}
              style={{
                background: isTraining ? '#cbd5e1' : '#10b981',
                color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: isTraining ? 'not-allowed' : 'pointer',
                fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              {isTraining ? 'Training...' : 'Simulate Learning'}
            </button>
          </h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            A single perceptron draws one straight line. If your data forms a complex shape (like the green cluster below), one line isn't enough! Click <strong>Simulate Learning</strong> to watch step-by-step how the network automatically moves both lines into the perfect position to isolate the green dots. Or, adjust the sliders manually!
          </p>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', alignItems: 'flex-start', marginBottom: '2rem' }}>
              
              {/* Perceptron 1 (P1) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="-100 -100 200 200" width="200" height="200" style={{ background: '#fff', border: '2px solid #cbd5e1', borderRadius: '8px' }}>
                  <g transform={`rotate(${a1}) translate(${o1}, 0)`}>
                    <rect x="-300" y="-300" width="300" height="600" fill="rgba(236, 72, 153, 0.15)" />
                    <rect x="0" y="-300" width="300" height="600" fill="rgba(34, 197, 94, 0.25)" />
                    <line x1="0" y1="-300" x2="0" y2="300" stroke="#ec4899" strokeWidth="3" />
                  </g>
                  {renderDataPoints()}
                </svg>
                <h4 style={{ margin: '1rem 0 0 0', color: '#1e293b' }}>Perceptron 1 (P1)</h4>
                <div style={{ width: '100%', marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>Angle: {Math.round(a1)}°</div>
                  <input type="range" min="-90" max="90" value={a1} onChange={(e) => setA1(Number(e.target.value))} disabled={isTraining} style={{ width: '100%', accentColor: '#ec4899' }} />
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '8px', marginBottom: '4px' }}>Offset: {Math.round(o1)}</div>
                  <input type="range" min="-80" max="80" value={o1} onChange={(e) => setO1(Number(e.target.value))} disabled={isTraining} style={{ width: '100%', accentColor: '#ec4899' }} />
                </div>
              </div>

              <div style={{ fontSize: '2.5rem', color: '#94a3b8', fontWeight: 'bold', alignSelf: 'center', margin: '0 -0.5rem' }}>+</div>

              {/* Perceptron 2 (P2) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="-100 -100 200 200" width="200" height="200" style={{ background: '#fff', border: '2px solid #cbd5e1', borderRadius: '8px' }}>
                  <g transform={`rotate(${a2}) translate(${o2}, 0)`}>
                    <rect x="-300" y="-300" width="300" height="600" fill="rgba(236, 72, 153, 0.15)" />
                    <rect x="0" y="-300" width="300" height="600" fill="rgba(34, 197, 94, 0.25)" />
                    <line x1="0" y1="-300" x2="0" y2="300" stroke="#8b5cf6" strokeWidth="3" />
                  </g>
                  {renderDataPoints()}
                </svg>
                <h4 style={{ margin: '1rem 0 0 0', color: '#1e293b' }}>Perceptron 2 (P2)</h4>
                <div style={{ width: '100%', marginTop: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '4px' }}>Angle: {Math.round(a2)}°</div>
                  <input type="range" min="-90" max="90" value={a2} onChange={(e) => setA2(Number(e.target.value))} disabled={isTraining} style={{ width: '100%', accentColor: '#8b5cf6' }} />
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '8px', marginBottom: '4px' }}>Offset: {Math.round(o2)}</div>
                  <input type="range" min="-80" max="80" value={o2} onChange={(e) => setO2(Number(e.target.value))} disabled={isTraining} style={{ width: '100%', accentColor: '#8b5cf6' }} />
                </div>
              </div>

              <div style={{ fontSize: '2.5rem', color: '#94a3b8', fontWeight: 'bold', alignSelf: 'center', margin: '0 -0.5rem' }}>=</div>

              {/* MLP (Combined) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg viewBox="-100 -100 200 200" width="220" height="220" style={{ background: '#fff', border: '2px solid #22c55e', borderRadius: '8px', boxShadow: '0 10px 25px rgba(34, 197, 94, 0.2)' }}>
                  <defs>
                    <clipPath id="p1-clip">
                      <g transform={`rotate(${a1}) translate(${o1}, 0)`}>
                        <rect x="0" y="-300" width="300" height="600" />
                      </g>
                    </clipPath>
                  </defs>
                  
                  {/* Base background (Fail / Pink) */}
                  <rect x="-100" y="-100" width="200" height="200" fill="rgba(236, 72, 153, 0.15)" />

                  {/* Intersection (Pass / Green) */}
                  <g clipPath="url(#p1-clip)">
                    <g transform={`rotate(${a2}) translate(${o2}, 0)`}>
                      <rect x="0" y="-300" width="300" height="600" fill="rgba(34, 197, 94, 0.4)" />
                    </g>
                  </g>

                  {/* Draw the boundary lines dashed */}
                  <g transform={`rotate(${a1}) translate(${o1}, 0)`}>
                    <line x1="0" y1="-300" x2="0" y2="300" stroke="#ec4899" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                  </g>
                  <g transform={`rotate(${a2}) translate(${o2}, 0)`}>
                    <line x1="0" y1="-300" x2="0" y2="300" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
                  </g>
                  
                  {renderDataPoints()}
                </svg>
                <h4 style={{ margin: '1rem 0 0 0', color: '#1e293b' }}>Multi-Layer Perceptron</h4>
                <span style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 'bold' }}>Non-Linear Boundary (Intersection)</span>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <Sliders size={16} /> Drag sliders to find the perfect fit!
                </div>
              </div>
              
            </div>
          </div>

          <div style={{ marginTop: '2rem', background: '#eff6ff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
            <h4 style={{ color: '#1e3a8a', margin: '0 0 0.5rem 0' }}>The Secret Sauce: Activation Functions</h4>
            <p style={{ color: '#1e40af', margin: 0, lineHeight: '1.6' }}>
              If you simply added the math of two straight lines together, you would mathematically just get another straight line. It is the <strong>Activation Function</strong> (like ReLU or Sigmoid) applied in the hidden layer that acts like a logical "AND" or "OR" gate, allowing the network to intersect these lines and carve out unique, non-linear shapes!
            </p>
          </div>
        </div>
      )}

      {/* Trainable Parameters Section */}
      {activeTab === 'parameters' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Calculating Trainable Parameters</h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            A neural network learns by updating its "parameters". These parameters consist of the <strong>Weights (w)</strong> on every connecting line, and the <strong>Bias (b)</strong> on every receiving neuron. Let's calculate the total trainable parameters for a specific architecture.
          </p>

          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ color: '#333', marginBottom: '1.5rem' }}>Example Architecture: 4 ➔ 3 ➔ 2 ➔ 1</h4>
            
            <svg width="600" height="300" viewBox="0 0 600 300">
              {/* Lines (Weights) */}
              {/* L0 to L1 (4x3 = 12 lines) */}
              {[0, 1, 2, 3].map(i => [0, 1, 2].map(j => (
                <line key={`w0-${i}-${j}`} x1="100" y1={45 + i * 70} x2="250" y2={80 + j * 70} stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2" />
              )))}
              
              {/* L1 to L2 (3x2 = 6 lines) */}
              {[0, 1, 2].map(i => [0, 1].map(j => (
                <line key={`w1-${i}-${j}`} x1="250" y1={80 + i * 70} x2="400" y2={115 + j * 70} stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2" />
              )))}

              {/* L2 to L3 (2x1 = 2 lines) */}
              {[0, 1].map(i => (
                <line key={`w2-${i}`} x1="400" y1={115 + i * 70} x2="550" y2={150} stroke="rgba(148, 163, 184, 0.3)" strokeWidth="2" />
              ))}

              {/* Input Layer L0 (4 nodes) */}
              {[0, 1, 2, 3].map(i => (
                <g key={`L0-${i}`}>
                  <circle cx="100" cy={45 + i * 70} r="20" fill="#fff" stroke="#64748b" strokeWidth="2" />
                  <text x="100" y={45 + i * 70 + 5} fill="#64748b" fontSize="14" textAnchor="middle">X{i+1}</text>
                </g>
              ))}
              <text x="100" y="290" fill="#1e293b" fontSize="16" fontWeight="bold" textAnchor="middle">Input (L0)</text>

              {/* Hidden Layer L1 (3 nodes) */}
              {[0, 1, 2].map(i => (
                <g key={`L1-${i}`}>
                  <circle cx="250" cy={80 + i * 70} r="20" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
                  <text x="250" y={80 + i * 70 + 5} fill="#ec4899" fontSize="14" textAnchor="middle">H{i+1}</text>
                  {/* Bias indicator */}
                  <circle cx="250" cy={80 + i * 70 - 20} r="6" fill="#ec4899" />
                </g>
              ))}
              <text x="250" y="290" fill="#1e293b" fontSize="16" fontWeight="bold" textAnchor="middle">Hidden (L1)</text>

              {/* Hidden Layer L2 (2 nodes) */}
              {[0, 1].map(i => (
                <g key={`L2-${i}`}>
                  <circle cx="400" cy={115 + i * 70} r="20" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" />
                  <text x="400" y={115 + i * 70 + 5} fill="#8b5cf6" fontSize="14" textAnchor="middle">H{i+1}</text>
                  <circle cx="400" cy={115 + i * 70 - 20} r="6" fill="#8b5cf6" />
                </g>
              ))}
              <text x="400" y="290" fill="#1e293b" fontSize="16" fontWeight="bold" textAnchor="middle">Hidden (L2)</text>

              {/* Output Layer L3 (1 node) */}
              <g>
                <circle cx="550" cy="150" r="20" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
                <text x="550" y="155" fill="#22c55e" fontSize="16" textAnchor="middle">Y</text>
                <circle cx="550" cy="130" r="6" fill="#22c55e" />
              </g>
              <text x="550" y="290" fill="#1e293b" fontSize="16" fontWeight="bold" textAnchor="middle">Output (L3)</text>
              
              {/* Legend */}
              <circle cx="20" cy="20" r="6" fill="#ec4899" />
              <text x="35" y="25" fill="#64748b" fontSize="12">= Bias Term (+1)</text>
            </svg>

            {/* The Math Breakdown */}
            <div style={{ width: '100%', maxWidth: '700px', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>L0 ➔ L1 Math:</span>
                <span style={{ fontFamily: 'monospace', color: '#ec4899' }}>(4 inputs × 3 nodes) + 3 biases = <strong>15 parameters</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>L1 ➔ L2 Math:</span>
                <span style={{ fontFamily: 'monospace', color: '#8b5cf6' }}>(3 inputs × 2 nodes) + 2 biases = <strong>8 parameters</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#fff', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 'bold', color: '#1e293b' }}>L2 ➔ L3 Math:</span>
                <span style={{ fontFamily: 'monospace', color: '#22c55e' }}>(2 inputs × 1 node) + 1 bias = <strong>3 parameters</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#1e293b', padding: '1.2rem 1.5rem', borderRadius: '8px', marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.2rem' }}>Total Trainable Parameters:</span>
                <span style={{ fontFamily: 'monospace', color: '#22c55e', fontSize: '1.2rem', fontWeight: 'bold' }}>15 + 8 + 3 = 26</span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
