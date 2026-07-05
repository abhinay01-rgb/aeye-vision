import React, { useState } from 'react';
import { ArrowRight, ChevronRight, BrainCircuit, RefreshCw, GraduationCap } from 'lucide-react';

export default function PerceptronGuide() {
  const [activeTab, setActiveTab] = useState('forward');

  // Interactive State for Student Pass Prediction
  const [cgpa, setCgpa] = useState(7.5);
  const [marks, setMarks] = useState(70);
  
  // Hardcoded weights for the educational example
  const w1 = 1.5; // CGPA weight
  const w2 = 0.1; // 12th Marks weight
  const bias = -15.0;
  
  // Math calculations
  const z = (cgpa * w1) + (marks * w2) + bias;
  const sigmoid = (val) => 1 / (1 + Math.exp(-val));
  const prediction = sigmoid(z);
  const isPass = prediction >= 0.5;

  return (
    <div className="tab-layout-container fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="section-title-main" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrainCircuit size={32} color="#8b5cf6" />
          How a Perceptron Works
        </h2>
        <p className="tutorial-paragraph">
          A Perceptron is the fundamental building block of a Neural Network. It takes multiple inputs, multiplies them by weights, adds a bias, and passes the result through an activation function to generate an output.
        </p>
      </div>

      {/* Interactive Perceptron Visualization */}
      <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h4 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <GraduationCap size={24} color="#f59e0b"/> Interactive Example: Will the Student Pass?
        </h4>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center', maxWidth: '600px' }}>
          Adjust the student's CGPA and 12th Grade marks using the sliders. Watch how the Perceptron calculates the weighted sum and uses a Sigmoid activation function to predict if they will pass!
        </p>
        
        {/* Input Sliders */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', width: '100%', maxWidth: '600px' }}>
          <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: '#475569' }}>CGPA:</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{cgpa.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0" max="10" step="0.1" 
              value={cgpa} onChange={(e) => setCgpa(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6' }}
            />
          </div>

          <div style={{ flex: 1, background: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: '#475569' }}>12th Marks (%):</span>
              <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{marks}</span>
            </div>
            <input 
              type="range" min="0" max="100" step="1" 
              value={marks} onChange={(e) => setMarks(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6' }}
            />
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '750px', overflowX: 'auto' }}>
          <svg viewBox="0 0 750 350" width="100%" height="350">
            {/* Inputs */}
            <circle cx="80" cy="120" r="30" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
            <text x="80" y="115" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">CGPA</text>
            <text x="80" y="135" fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">{cgpa.toFixed(1)}</text>
            
            <circle cx="80" cy="240" r="30" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
            <text x="80" y="235" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">Marks</text>
            <text x="80" y="255" fill="#3b82f6" fontSize="16" fontWeight="bold" textAnchor="middle">{marks}</text>

            <text x="80" y="320" fill="#475569" fontSize="14" textAnchor="middle">Inputs (X)</text>

            {/* Summation Node */}
            <circle cx="340" cy="180" r="45" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" />
            <text x="340" y="175" fill="#ca8a04" fontSize="24" fontWeight="bold" textAnchor="middle">∑</text>
            <text x="340" y="200" fill="#1e293b" fontSize="18" fontWeight="bold" textAnchor="middle">{z > 0 ? '+' : ''}{z.toFixed(2)}</text>
            <text x="340" y="245" fill="#475569" fontSize="14" textAnchor="middle">Sum (z)</text>

            {/* Bias */}
            <text x="340" y="50" fill="#475569" fontSize="14" textAnchor="middle">Bias (b)</text>
            <rect x="310" y="60" width="60" height="30" rx="4" fill="#fff" stroke="#94a3b8" strokeWidth="1" />
            <text x="340" y="80" fill="#ef4444" fontSize="16" fontWeight="bold" textAnchor="middle">{bias}</text>
            <line x1="340" y1="90" x2="340" y2="135" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Edges from inputs to summation */}
            {/* CGPA Edge */}
            <line x1="110" y1="120" x2="295" y2="165" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            <rect x="175" y="125" width="50" height="24" rx="4" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="200" y="142" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">w₁: {w1}</text>
            
            {/* Marks Edge */}
            <line x1="110" y1="240" x2="295" y2="195" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            <rect x="175" y="205" width="50" height="24" rx="4" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
            <text x="200" y="222" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">w₂: {w2}</text>

            <text x="200" y="320" fill="#475569" fontSize="14" textAnchor="middle">Weights (w)</text>

            {/* Summation to Activation */}
            <line x1="385" y1="180" x2="445" y2="180" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />

            {/* Activation Function Node */}
            <text x="500" y="110" fill="#475569" fontSize="14" textAnchor="middle">Activation (Sigmoid)</text>
            <circle cx="500" cy="180" r="45" fill="#dcfce7" stroke="#166534" strokeWidth="2" />
            <text x="500" y="175" fill="#166534" fontSize="16" fontWeight="bold" textAnchor="middle">g(z)</text>
            <text x="500" y="200" fill="#1e293b" fontSize="16" fontWeight="bold" textAnchor="middle">{prediction.toFixed(3)}</text>

            {/* Output */}
            <line x1="545" y1="180" x2="605" y2="180" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="660" y="110" fill="#475569" fontSize="14" textAnchor="middle">Prediction (ŷ)</text>
            
            <rect x="615" y="145" width="90" height="70" rx="8" fill={isPass ? '#dcfce7' : '#fee2e2'} stroke={isPass ? '#22c55e' : '#ef4444'} strokeWidth="2" />
            <text x="660" y="175" fill={isPass ? '#166534' : '#991b1b'} fontSize="20" fontWeight="bold" textAnchor="middle">{isPass ? 'PASS' : 'FAIL'}</text>
            <text x="660" y="195" fill={isPass ? '#166534' : '#991b1b'} fontSize="12" textAnchor="middle">{prediction.toFixed(1)} probability</text>

            {/* Equation Box underneath */}
            <rect x="150" y="300" width="450" height="40" rx="8" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
            <text x="375" y="325" fill="#1e293b" fontSize="16" fontFamily="monospace" textAnchor="middle">
              z = ({cgpa.toFixed(1)} × {w1}) + ({marks} × {w2}) + ({bias}) = {z.toFixed(2)}
            </text>

            {/* Arrow Definition */}
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Propagation Explanations */}
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setActiveTab('forward')}
            style={{ 
              background: activeTab === 'forward' ? '#3b82f6' : 'transparent', 
              color: activeTab === 'forward' ? '#fff' : '#94a3b8', 
              border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <ArrowRight size={18} /> Forward Propagation
          </button>
          <button 
            onClick={() => setActiveTab('backward')}
            style={{ 
              background: activeTab === 'backward' ? '#ef4444' : 'transparent', 
              color: activeTab === 'backward' ? '#fff' : '#94a3b8', 
              border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <RefreshCw size={18} /> Backward Propagation (Learning)
          </button>
        </div>

        {activeTab === 'forward' && (
          <div className="fade-in">
            <h3 style={{ color: '#38bdf8', marginBottom: '1rem', fontSize: '1.2rem' }}>What is Forward Propagation?</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Forward propagation is the process of pushing input data (X) through the network to generate a prediction (ŷ). The data flows strictly in one direction: from input to output. No learning happens during this phase; it is purely a calculation step.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.2)' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>The Simple Math</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '1.1rem', flex: 1 }}>
                    1. Compute Weighted Sum (z): <br/>
                    <span style={{ color: '#38bdf8' }}>z = (w₁x₁ + w₂x₂ + ... + wₙxₙ) + b</span>
                  </div>
                  <ChevronRight color="#475569" />
                  <div style={{ flex: 1.5, color: '#94a3b8', fontSize: '0.9rem' }}>
                    Multiply every input by its corresponding weight, add them all together, and add the bias.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '1.1rem', flex: 1 }}>
                    2. Apply Activation (ŷ): <br/>
                    <span style={{ color: '#10b981' }}>ŷ = g(z)</span>
                  </div>
                  <ChevronRight color="#475569" />
                  <div style={{ flex: 1.5, color: '#94a3b8', fontSize: '0.9rem' }}>
                    Pass the sum 'z' through an activation function 'g()' like ReLU or Sigmoid to introduce non-linearity and get the final prediction 'ŷ'.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backward' && (
          <div className="fade-in">
            <h3 style={{ color: '#f87171', marginBottom: '1rem', fontSize: '1.2rem' }}>What is Backward Propagation (Backprop)?</h3>
            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Backward propagation is how the neural network learns. After making a prediction during the forward pass, it calculates the error (Loss) by comparing the prediction to the actual truth. It then sends this error <i>backwards</i> through the network to adjust the weights and bias so the next prediction will be more accurate.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(248,113,113,0.2)' }}>
              <h4 style={{ color: '#fff', marginBottom: '1rem' }}>The Simple Math</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '1.1rem', flex: 1 }}>
                    1. Calculate Error (Loss): <br/>
                    <span style={{ color: '#f87171' }}>Loss = (ŷ - y)²</span>
                  </div>
                  <ChevronRight color="#475569" />
                  <div style={{ flex: 1.5, color: '#94a3b8', fontSize: '0.9rem' }}>
                    Compare the network's prediction (ŷ) to the true actual value (y). (This example uses Mean Squared Error).
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '1.1rem', flex: 1 }}>
                    2. Calculate Gradients: <br/>
                    <span style={{ color: '#fb923c' }}>gradient = ∂Loss / ∂w</span>
                  </div>
                  <ChevronRight color="#475569" />
                  <div style={{ flex: 1.5, color: '#94a3b8', fontSize: '0.9rem' }}>
                    Use calculus (the chain rule) to figure out how much each specific weight 'w' contributed to the total error.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', color: '#fff', fontFamily: 'monospace', fontSize: '1.1rem', flex: 1 }}>
                    3. Update Weights: <br/>
                    <span style={{ color: '#38bdf8' }}>w_new = w_old - (α × gradient)</span>
                  </div>
                  <ChevronRight color="#475569" />
                  <div style={{ flex: 1.5, color: '#94a3b8', fontSize: '0.9rem' }}>
                    Adjust the old weight slightly in the opposite direction of the gradient. 'α' is the Learning Rate (a small step size like 0.01).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
