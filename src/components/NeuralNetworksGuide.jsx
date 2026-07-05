import React, { useState } from 'react';
import { Network, Activity, Layers, Repeat, ArrowRight, Zap, Target, Cpu, CheckCircle2 } from 'lucide-react';
import InteractiveNeuralNetwork from './InteractiveNeuralNetwork';

export default function NeuralNetworksGuide() {
  const [activeTab, setActiveTab] = useState('what_is');

  const tabs = [
    { id: 'what_is', label: '1. What is a NN?' },
    { id: 'working', label: '2. How it Works' },
    { id: 'learning', label: '3. The Learning Process' },
    { id: 'types', label: '4. Architectures' },
  ];

  return (
    <div className="tab-layout-container">
      <div className="sub-nav-links">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`sub-nav-link ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="sub-tab-content" style={{ marginTop: '1.5rem' }}>
        
        {/* WHAT IS A NEURAL NETWORK */}
        {activeTab === 'what_is' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">What is a Neural Network?</h2>
            
            <p className="tutorial-paragraph" style={{ marginBottom: '1.5rem' }}>
              Neural networks are machine learning models that mimic the complex functions of the human brain. These models consist of interconnected nodes or "neurons" that process data, learn patterns directly from data without relying on pre-defined rules, and enable the system to perform tasks such as pattern recognition, classification, and decision-making.
            </p>

            <div className="card-note alert-indigo" style={{ marginBottom: '2rem' }}>
              <strong>Key Inspiration:</strong> Biological neurons receive signals through dendrites, process them in the cell body, and transmit output through the axon. Artificial Neural Networks (ANNs) mimic this mathematical operation using Inputs, Weights, Summation, and Activation Functions.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div className="feature-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: '#818cf8', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <Layers size={24} /> Architecture (The Structure)
                </h3>
                <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li><strong>Input Layer:</strong> The gateway that receives raw data (images, text, numbers).</li>
                  <li><strong>Hidden Layers:</strong> One or more intermediate layers where the actual processing and pattern extraction happens. "Deep" learning has many hidden layers.</li>
                  <li><strong>Output Layer:</strong> The final layer that produces the prediction or classification.</li>
                </ul>
              </div>

              <div className="feature-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <Cpu size={24} /> Nodes (The Neurons)
                </h3>
                <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
                  <li>Each node represents a mathematical function.</li>
                  <li>A node connects to several nodes in the next layer.</li>
                  <li>Each connection has a specific <strong>Weight</strong> (importance of the signal).</li>
                  <li>Nodes apply an <strong>Activation Function</strong> to decide if the signal should be passed along.</li>
                </ul>
              </div>
            </div>

            {/* Interactive Neural Network Visualizer */}
            <InteractiveNeuralNetwork />
          </div>
        )}

        {/* HOW IT WORKS */}
        {activeTab === 'working' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Working of Neural Networks</h2>
            
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              To understand how a neural network processes data, we need to zoom into a single "Neuron" (Node). When inputs arrive at a neuron, it performs a specific mathematical calculation before passing the result to the next layer.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ color: '#818cf8', marginBottom: '1.5rem', textAlign: 'center' }}>Inside a Single Neuron</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: '#3b82f6', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                  <div>
                    <strong style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>Weights (W)</strong>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                      Every input (X) is multiplied by a Weight (W). Weights represent the <em>strength or importance</em> of that input. If an input is highly relevant to the outcome, the network will learn to give it a higher weight.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: '#8b5cf6', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                  <div>
                    <strong style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>Bias (B)</strong>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                      After multiplying inputs by weights, all the values are summed up. A Bias term is then added to this sum. The bias allows the activation function to be shifted left or right, giving the neuron flexibility to fire even when all inputs are 0.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ background: '#ec4899', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                  <div>
                    <strong style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>Activation Function (f)</strong>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                      The sum `(W*X + B)` is passed through an Activation Function (like ReLU, Sigmoid, or Tanh). This function decides whether the neuron should "fire" (pass a strong signal) or not. Crucially, it introduces <strong>Non-Linearity</strong>, allowing the network to learn complex patterns rather than just straight lines.
                    </p>
                  </div>
                </div>
              </div>

              <div className="formula-box" style={{ borderColor: '#6366f1', boxShadow: '0 0 20px rgba(99,102,241,0.1)', marginTop: '2rem' }}>
                <div className="formula-visual" style={{ justifyContent: 'center' }}>
                  <span className="fv-left" style={{ color: '#fff' }}>Output = </span>
                  <span style={{ color: '#ec4899', margin: '0 5px' }}>f</span>
                  <span style={{ color: '#fff' }}>(</span>
                  <span style={{ color: '#3b82f6' }}>Σ (Xᵢ × Wᵢ)</span>
                  <span style={{ color: '#fff', margin: '0 8px' }}>+</span>
                  <span style={{ color: '#8b5cf6' }}>Bias</span>
                  <span style={{ color: '#fff' }}>)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THE LEARNING PROCESS */}
        {activeTab === 'learning' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">How does it Learn? (Training)</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              A neural network "learns" by iteratively adjusting its weights and biases to minimize its errors. This process involves two major phases: Forward Propagation and Backpropagation.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              
              <div style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <ArrowRight size={20} /> 1. Forward Propagation
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  Data is fed into the input layer and passes through the hidden layers (multiplied by weights, bias added, and activation applied) until it reaches the output layer. The output layer produces a prediction (e.g., "This image is an Apple with 80% confidence").
                </p>
              </div>

              <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <Target size={20} /> 2. Loss Function (Error Calculation)
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  The network's prediction is compared to the actual, correct answer. The difference between the prediction and the truth is calculated using a Loss Function (Cost Function). The goal of learning is to make this error as small as possible.
                </p>
              </div>

              <div style={{ background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <Repeat size={20} style={{ transform: 'rotate(180deg)' }} /> 3. Backpropagation (The Learning)
                </h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                  The error is propagated <strong>backwards</strong> through the network, from the output layer to the input layer. Using calculus (Gradient Descent), the algorithm calculates how much each weight contributed to the error. It then tweaks all the weights and biases slightly in the direction that will reduce the error next time.
                </p>
              </div>

            </div>

            <div className="card-note alert-emerald" style={{ marginTop: '2rem' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981', marginRight: '8px' }} />
              <strong>Iterative Refinement:</strong> This cycle (Forward → Loss → Backprop) is repeated thousands or millions of times over the entire dataset (called "Epochs") until the network reaches high accuracy.
            </div>
          </div>
        )}

        {/* ARCHITECTURES */}
        {activeTab === 'types' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Types of Neural Networks</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              As deep learning evolved, researchers created specialized architectures tailored for specific types of data (like images vs text).
            </p>

            <div className="analysis-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
              
              <div className="analysis-card" style={{ borderLeft: '3px solid #8b5cf6' }}>
                <div className="analysis-name" style={{ color: '#8b5cf6' }}>Feedforward Neural Networks (FNN/ANN)</div>
                <div className="analysis-note" style={{ marginTop: '1rem', color: '#cbd5e1' }}>
                  Information moves in only one direction—forward—from the input nodes, through the hidden nodes, to the output nodes. There are no loops or cycles. Standard Multi-Layer Perceptrons (MLPs) belong here.
                </div>
              </div>

              <div className="analysis-card" style={{ borderLeft: '3px solid #06b6d4' }}>
                <div className="analysis-name" style={{ color: '#06b6d4' }}>Convolutional Neural Networks (CNN)</div>
                <div className="analysis-note" style={{ marginTop: '1rem', color: '#cbd5e1' }}>
                  Specifically designed for Grid-like data like <strong>Images</strong> and <strong>Video</strong>. They use filters (convolutions) to capture spatial hierarchies, finding edges, then shapes, then objects. Essential for Facial Recognition and Self-Driving Cars.
                </div>
              </div>

              <div className="analysis-card" style={{ borderLeft: '3px solid #f43f5e' }}>
                <div className="analysis-name" style={{ color: '#f43f5e' }}>Recurrent Neural Networks (RNN)</div>
                <div className="analysis-note" style={{ marginTop: '1rem', color: '#cbd5e1' }}>
                  Designed for Sequential data like <strong>Time Series</strong> or <strong>Text</strong>. They have internal memory (loops) that allow previous inputs to influence current outputs. Perfect for Natural Language Processing (NLP) and Speech Recognition.
                </div>
              </div>

              <div className="analysis-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                <div className="analysis-name" style={{ color: '#f59e0b' }}>Long Short-Term Memory (LSTM)</div>
                <div className="analysis-note" style={{ marginTop: '1rem', color: '#cbd5e1' }}>
                  A highly advanced variation of RNNs designed to remember information over long periods. They solve the "vanishing gradient problem" of standard RNNs, making them superior for complex text translation and context retention.
                </div>
              </div>

              <div className="analysis-card" style={{ borderLeft: '3px solid #10b981' }}>
                <div className="analysis-name" style={{ color: '#10b981' }}>Generative Adversarial Networks (GAN)</div>
                <div className="analysis-note" style={{ marginTop: '1rem', color: '#cbd5e1' }}>
                  Consists of two neural networks—a Generator and a Discriminator—competing against each other. The Generator creates fake data (like deepfake images), and the Discriminator tries to catch it. They get better together over time.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
