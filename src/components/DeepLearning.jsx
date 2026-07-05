import React, { useState } from 'react';
import { Brain, Cpu, Database, Network, Layers, Zap, ArrowRight, Image as ImageIcon, MessageSquare, Car, Stethoscope } from 'lucide-react';

export default function DeepLearning() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '1. Intro to Deep Learning' },
    { id: 'types', label: '2. Types of Networks' },
    { id: 'compare', label: '3. ML vs DL' },
    { id: 'applications', label: '4. Applications' },
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
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Introduction to Deep Learning</h2>
            
            <div className="card-note alert-indigo" style={{ marginBottom: '2rem' }}>
              <strong>Definition:</strong> Deep Learning is a subfield of Machine Learning concerned with algorithms inspired by the structure and function of the brain called <strong>Artificial Neural Networks (ANNs)</strong>.
            </div>

            <p className="tutorial-paragraph">
              Deep Learning is transforming the way machines understand, learn, and interact with complex data. By mimicking the neural networks of the human brain, it enables computers to autonomously uncover patterns and make informed decisions from vast amounts of unstructured data like images, text, and audio.
            </p>

            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' }}>How Does It Work?</h3>
            <p className="tutorial-paragraph" style={{ marginBottom: '1.5rem' }}>
              A Neural Network consists of layers of interconnected nodes (neurons). The "deep" in deep learning refers to the number of layers through which the data is transformed.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginTop: '1rem' }}>
              <div style={{ flex: '1 1 250px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Layers size={36} style={{ color: '#8b5cf6' }} />
                <h4 style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>1. Input Layer</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Receives the raw input data (e.g., pixels of an image, numerical features, or text tokens). No computation happens here; it just passes the data forward.
                </p>
              </div>

              <div style={{ flex: '1 1 250px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Network size={36} style={{ color: '#818cf8' }} />
                <h4 style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>2. Hidden Layers</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  The core computational layers. Deep neural networks have multiple hidden layers that progressively extract higher-level features (e.g., from edges to shapes to faces).
                </p>
              </div>

              <div style={{ flex: '1 1 250px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Zap size={36} style={{ color: '#f59e0b' }} />
                <h4 style={{ color: '#e2e8f0', fontSize: '1.1rem' }}>3. Output Layer</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Produces the final result or prediction. For example, a single node for a continuous value (regression) or multiple nodes representing probabilities for classes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TYPES OF NETWORKS TAB */}
        {activeTab === 'types' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Types of Neural Networks</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              Deep Learning is not just one algorithm. Different types of neural network architectures are designed to handle specific types of data efficiently.
            </p>

            <div className="analysis-grid">
              <div className="analysis-card" style={{ borderLeft: '3px solid #6366f1' }}>
                <div className="analysis-name" style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Database size={18} /> Artificial Neural Networks (ANN)
                </div>
                <div className="analysis-note" style={{ marginTop: '0.5rem' }}>
                  <strong>Best for:</strong> Tabular Data, Standard Regression/Classification.<br/><br/>
                  The most basic deep learning model. Consists of fully connected layers where every neuron connects to all neurons in the next layer. Good for standard feature sets but struggles with complex spatial or sequential data.
                </div>
              </div>

              <div className="analysis-card" style={{ borderLeft: '3px solid #06b6d4' }}>
                <div className="analysis-name" style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} /> Convolutional Neural Networks (CNN)
                </div>
                <div className="analysis-note" style={{ marginTop: '0.5rem' }}>
                  <strong>Best for:</strong> Images, Computer Vision, Video processing.<br/><br/>
                  Uses convolution layers to apply filters across the input. Extremely effective at capturing spatial hierarchies in images (e.g., detecting edges, then textures, then specific objects like eyes or tires).
                </div>
              </div>

              <div className="analysis-card" style={{ borderLeft: '3px solid #ec4899' }}>
                <div className="analysis-name" style={{ color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} /> Recurrent Neural Networks (RNN & LSTM)
                </div>
                <div className="analysis-note" style={{ marginTop: '0.5rem' }}>
                  <strong>Best for:</strong> Sequential Data, Text (NLP), Time Series.<br/><br/>
                  Unlike standard networks, RNNs have a "memory" of previous inputs. This makes them perfect for data where sequence matters, like predicting the next word in a sentence or forecasting stock prices.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPARE TAB */}
        {activeTab === 'compare' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Machine Learning vs. Deep Learning</h2>
            
            <div className="table-wrapper" style={{ marginTop: '1.5rem' }}>
              <table className="compare-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th style={{ color: '#06b6d4' }}>Machine Learning</th>
                    <th style={{ color: '#818cf8' }}>Deep Learning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Data Dependency</strong></td>
                    <td>Works well with small to medium datasets</td>
                    <td>Requires huge volumes of data (Big Data) to shine</td>
                  </tr>
                  <tr>
                    <td><strong>Hardware Dependencies</strong></td>
                    <td>Can easily train on low-end CPUs</td>
                    <td>Requires specialized hardware (GPUs/TPUs)</td>
                  </tr>
                  <tr>
                    <td><strong>Feature Engineering</strong></td>
                    <td>Crucial. Requires manual extraction by domain experts</td>
                    <td><strong>Automated.</strong> Learns features directly from raw data</td>
                  </tr>
                  <tr>
                    <td><strong>Execution Time</strong></td>
                    <td>Trains quickly (Minutes to Hours)</td>
                    <td>Trains slowly (Hours to Weeks)</td>
                  </tr>
                  <tr>
                    <td><strong>Interpretability</strong></td>
                    <td>Highly interpretable (e.g., Decision Trees)</td>
                    <td>Low interpretability ("Black Box")</td>
                  </tr>
                  <tr>
                    <td><strong>Best For</strong></td>
                    <td>Structured/Tabular databases</td>
                    <td>Unstructured data (Images, Audio, Text)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pipeline-visual" style={{ marginTop: '2.5rem', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>The Workflow Shift: End-to-End Learning</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(6, 182, 212, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                  <div style={{ color: '#06b6d4', width: '120px', fontWeight: 'bold' }}>ML Pipeline</div>
                  <Database size={24} color="#94a3b8" /> <ArrowRight size={16} color="#475569" />
                  <div style={{ padding: '0.5rem 1rem', background: '#06b6d4', color: '#fff', borderRadius: '8px', fontSize: '0.85rem' }}>Manual Feature Extraction</div> <ArrowRight size={16} color="#475569" />
                  <div style={{ padding: '0.5rem 1rem', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: '1px solid #06b6d4', borderRadius: '8px', fontSize: '0.85rem' }}>Model Training</div> <ArrowRight size={16} color="#475569" />
                  <div style={{ color: '#fff' }}>Output</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ color: '#818cf8', width: '120px', fontWeight: 'bold' }}>DL Pipeline</div>
                  <Database size={24} color="#94a3b8" /> <ArrowRight size={16} color="#475569" />
                  <div style={{ padding: '0.5rem 1rem', background: 'linear-gradient(to right, #6366f1, #a855f7)', color: '#fff', borderRadius: '8px', fontSize: '0.85rem', flex: 1, textAlign: 'center' }}>
                    Feature Extraction + Model Training (End-to-End)
                  </div> 
                  <ArrowRight size={16} color="#475569" />
                  <div style={{ color: '#fff' }}>Output</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Key Applications of Deep Learning</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              Deep Learning is the driving force behind many of the AI breakthroughs we see in the modern world.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              <div className="feature-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Car size={32} style={{ color: '#10b981', marginBottom: '1rem' }} />
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Autonomous Vehicles</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Self-driving cars use Deep Learning (primarily CNNs) to process video feeds in real-time, detecting pedestrians, reading stop signs, and understanding lane boundaries.
                </p>
              </div>

              <div className="feature-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <MessageSquare size={32} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Virtual Assistants & NLP</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Siri, Alexa, and tools like ChatGPT rely heavily on Deep Learning (Transformers and RNNs) to understand speech, translate languages, and generate human-like text.
                </p>
              </div>

              <div className="feature-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Stethoscope size={32} style={{ color: '#f43f5e', marginBottom: '1rem' }} />
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Healthcare & Medicine</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Deep Learning models analyze medical imagery (like X-rays and MRIs) to detect diseases like cancer earlier and more accurately than human radiologists in some cases.
                </p>
              </div>

              <div className="feature-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Brain size={32} style={{ color: '#a855f7', marginBottom: '1rem' }} />
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Generative AI</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  Models like GANs (Generative Adversarial Networks) can create incredibly realistic synthetic images, deepfakes, and even generate new music or art from scratch.
                </p>
              </div>
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
