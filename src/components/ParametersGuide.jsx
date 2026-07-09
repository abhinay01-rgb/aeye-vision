import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronRight, Zap, Layers, Activity, Brain, Target, AlertCircle, TrendingDown, Copy, Check } from 'lucide-react';

// Reusable styled components
const SectionCard = ({ children, style }) => (
  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem', ...style }}>
    {children}
  </div>
);

const DiamondH4 = ({ children, color = '#5eead4' }) => (
  <h4 style={{ color, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
    <div style={{ width: '8px', height: '8px', background: color, transform: 'rotate(45deg)', flexShrink: 0 }}></div>
    {children}
  </h4>
);

const NumberBadge = ({ num, color = '#6366f1' }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', background: color, color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{num}</span>
);

const CodeBlock = ({ children }) => (
  <code style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.9rem' }}>{children}</code>
);

const FormulaBox = ({ children }) => (
  <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.25rem 1.5rem', margin: '1rem 0', textAlign: 'center', fontFamily: 'monospace', fontSize: '1.05rem', color: '#c4b5fd', letterSpacing: '0.5px' }}>
    {children}
  </div>
);

const StyledTable = ({ headers, rows, headerBg = '#334155' }) => (
  <div style={{ overflowX: 'auto', marginTop: '1rem', marginBottom: '1rem' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1e293b', color: '#f8fafc', borderRadius: '8px', overflow: 'hidden' }}>
      <thead>
        <tr style={{ background: headerBg, borderBottom: '2px solid #475569' }}>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: '0.85rem 1rem', borderRight: i < headers.length - 1 ? '1px solid #475569' : 'none', fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? '1px solid #475569' : 'none' }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding: '0.75rem 1rem', borderRight: ci < row.length - 1 ? '1px solid #475569' : 'none', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const IncreaseDecreaseGrid = ({ increase, decrease }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
      <h5 style={{ color: '#4ade80', marginBottom: '0.75rem', fontSize: '0.95rem' }}>✅ Increase When</h5>
      <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
        {increase.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
    <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
      <h5 style={{ color: '#f87171', marginBottom: '0.75rem', fontSize: '0.95rem' }}>❌ Decrease When</h5>
      <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
        {decrease.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  </div>
);

const StarRating = ({ count }) => (
  <span style={{ color: '#fbbf24', letterSpacing: '1px' }}>{'⭐'.repeat(count)}</span>
);

const TypicalValuesBox = ({ values }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
    {values.map((v, i) => (
      <span key={i} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc', padding: '0.35rem 0.85rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: 600 }}>{v}</span>
    ))}
  </div>
);


export default function ParametersGuide() {
  const [expandedSections, setExpandedSections] = useState({
    lr: true, batch: false, optimizer: false, epochs: false, weightDecay: false, dropout: false, layers: false, activation: false, kfold: false
  });

  const [copiedCode, setCopiedCode] = useState(null);
  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeSnippet = ({ code, id, lang = 'python' }) => (
    <div style={{ position: 'relative', background: '#0f172a', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', marginTop: '0.75rem', marginBottom: '1rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{lang}</span>
        <button onClick={() => handleCopy(code, id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: copiedCode === id ? '#4ade80' : '#64748b', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>
          {copiedCode === id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '1rem', overflowX: 'auto', fontSize: '0.85rem', lineHeight: '1.6', color: '#e2e8f0', fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace" }}><code>{code}</code></pre>
    </div>
  );

  const toggle = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const AccordionHeader = ({ sectionKey, number, title, stars, color = '#ec4899' }) => (
    <button
      onClick={() => toggle(sectionKey)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer',
        transition: 'all 0.2s ease', marginBottom: expandedSections[sectionKey] ? '0' : '0.5rem',
        borderBottomLeftRadius: expandedSections[sectionKey] ? '0' : '12px',
        borderBottomRightRadius: expandedSections[sectionKey] ? '0' : '12px',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: color, color: '#fff', borderRadius: '8px', fontSize: '1rem', fontWeight: 800, flexShrink: 0 }}>{number}</span>
      <span style={{ flex: 1, textAlign: 'left', color: '#e2e8f0', fontSize: '1.15rem', fontWeight: 700 }}>{title}</span>
      {stars && <StarRating count={stars} />}
      {expandedSections[sectionKey] ? <ChevronDown size={20} color="#94a3b8" /> : <ChevronRight size={20} color="#94a3b8" />}
    </button>
  );

  const AccordionBody = ({ sectionKey, children }) => (
    expandedSections[sectionKey] ? (
      <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.08)', borderTop: 'none', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', padding: '1.5rem', marginBottom: '0.5rem' }} className="fade-in">
        {children}
      </div>
    ) : null
  );

  return (
    <div className="tab-layout-container fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 className="section-title-main" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sliders size={32} color="#ec4899" />
          The 6 Most Important Hyperparameters in Deep Learning
        </h2>
        <p className="tutorial-paragraph" style={{ marginBottom: '1rem' }}>
          These are the <strong>first hyperparameters you should tune</strong> because they have the biggest impact on training speed, convergence, and model performance.
        </p>
        <div style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} color="#ec4899" />
          <span style={{ color: '#f9a8d4', fontSize: '0.9rem' }}>In practice, most performance improvements come from tuning these six hyperparameters carefully before experimenting with more advanced settings.</span>
        </div>
      </div>

      {/* ===== 1. LEARNING RATE ===== */}
      <AccordionHeader sectionKey="lr" number="1" title="Learning Rate (α)" stars={5} color="#6366f1" />
      <AccordionBody sectionKey="lr">
        <DiamondH4>What is it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          The <strong style={{ color: '#e2e8f0' }}>Learning Rate (LR)</strong> controls <strong style={{ color: '#e2e8f0' }}>how much the model updates its weights after each iteration</strong>. Think of it as the <strong style={{ color: '#fbbf24' }}>step size</strong> the optimizer takes while searching for the minimum loss.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ color: '#f87171', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Large LR →</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>Bigger steps → Faster learning but may <strong style={{ color: '#f87171' }}>overshoot</strong> the optimum.</p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ color: '#4ade80', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Small LR →</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>Smaller steps → Slower learning but more <strong style={{ color: '#4ade80' }}>stable</strong>.</p>
          </div>
        </div>

        <DiamondH4>Why do we need it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0.75rem 0' }}>
          The model learns by updating its weights using gradients. The update rule is:
        </p>
        <FormulaBox>
          New Weight = Old Weight − (Learning Rate × Gradient)
        </FormulaBox>
        <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          <li>Without a learning rate, the model wouldn't know <strong style={{ color: '#e2e8f0' }}>how much</strong> to update the weights.</li>
          <li>Too large → Training becomes <strong style={{ color: '#f87171' }}>unstable</strong>.</li>
          <li>Too small → Training becomes <strong style={{ color: '#fbbf24' }}>extremely slow</strong>.</li>
        </ul>

        <DiamondH4>Example</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0.75rem 0' }}>Suppose the optimizer suggests changing a weight by <strong style={{ color: '#e2e8f0' }}>10</strong>:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ color: '#a5b4fc', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Learning Rate = 0.1</p>
            <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: '0 0 0.25rem 0' }}>Weight Update = 10 × 0.1 = <strong>1</strong></p>
            <p style={{ color: '#fbbf24', margin: 0, fontSize: '0.85rem' }}>→ Large step</p>
          </div>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ color: '#a5b4fc', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Learning Rate = 0.001</p>
            <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: '0 0 0.25rem 0' }}>Weight Update = 10 × 0.001 = <strong>0.01</strong></p>
            <p style={{ color: '#4ade80', margin: 0, fontSize: '0.85rem' }}>→ Small step</p>
          </div>
        </div>

        <DiamondH4>Typical Values</DiamondH4>
        <TypicalValuesBox values={['0.1', '0.01', '0.001', '0.0001']} />

        <IncreaseDecreaseGrid
          increase={['Training is extremely slow', 'Loss decreases very slowly']}
          decrease={['Loss jumps up and down', 'Training diverges', 'Accuracy fluctuates heavily']}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <DiamondH4 color="#ec4899">Recommended Learning Rates</DiamondH4>
          <StyledTable
            headers={['Model', 'Learning Rate']}
            rows={[
              ['ANN', '0.001'],
              ['CNN', '0.001'],
              ['RNN / LSTM', '0.001'],
              ['Transformer', '1e-4'],
              ['BERT Fine-tuning', '2e-5 – 5e-5'],
            ]}
          />
        </div>
      </AccordionBody>

      {/* ===== 2. BATCH SIZE ===== */}
      <AccordionHeader sectionKey="batch" number="2" title="Batch Size" stars={5} color="#ec4899" />
      <AccordionBody sectionKey="batch">
        <DiamondH4>What is it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          Batch Size is the <strong style={{ color: '#e2e8f0' }}>number of training samples processed before updating the weights once</strong>. Instead of using the whole dataset at once, the data is divided into batches.
        </p>

        <DiamondH4>Example</DiamondH4>
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <p style={{ color: '#a5b4fc', fontWeight: 700, margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Dataset</p>
              <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: 0, fontSize: '1.1rem' }}>1000 images</p>
            </div>
            <div>
              <p style={{ color: '#a5b4fc', fontWeight: 700, margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Batch Size</p>
              <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: 0, fontSize: '1.1rem' }}>100</p>
            </div>
            <div>
              <p style={{ color: '#a5b4fc', fontWeight: 700, margin: '0 0 0.25rem 0', fontSize: '0.85rem' }}>Iterations per epoch</p>
              <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: 0, fontSize: '1.1rem' }}>1000 / 100 = <strong style={{ color: '#4ade80' }}>10</strong></p>
            </div>
          </div>
          <p style={{ color: '#94a3b8', margin: '0.75rem 0 0 0', fontSize: '0.88rem' }}>So the model updates its weights <strong style={{ color: '#e2e8f0' }}>10 times in one epoch</strong>.</p>
        </div>

        <DiamondH4>Why do we need it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1.25rem 0' }}>
          Training on the entire dataset every update is slow, memory intensive, and computationally expensive. Batching makes training practical and efficient.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>Small Batch Size (16, 32)</h5>
            <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>✔ Better generalization</p>
            <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>✔ Uses less GPU memory</p>
            <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>✖ Noisy gradients</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>✖ Slower training</p>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#f87171', marginBottom: '0.5rem' }}>Large Batch Size (256, 512)</h5>
            <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>✔ Faster GPU training</p>
            <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>✔ Stable gradients</p>
            <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>✖ Requires more GPU memory</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>✖ Can reduce generalization</p>
          </div>
        </div>

        <DiamondH4>Typical Values</DiamondH4>
        <TypicalValuesBox values={['16', '32', '64', '128', '256']} />

        <IncreaseDecreaseGrid
          increase={['GPU has enough memory', 'Training is unstable']}
          decrease={['GPU Out Of Memory', 'Better generalization is needed']}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <DiamondH4 color="#ec4899">Recommended Batch Sizes</DiamondH4>
          <StyledTable
            headers={['Dataset', 'Batch Size']}
            rows={[
              ['Small', '16–32'],
              ['Medium', '32–64'],
              ['Large', '64–256'],
            ]}
          />
        </div>
      </AccordionBody>

      {/* ===== 3. OPTIMIZER ===== */}
      <AccordionHeader sectionKey="optimizer" number="3" title="Optimizer" stars={5} color="#8b5cf6" />
      <AccordionBody sectionKey="optimizer">
        <DiamondH4>What is it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          The optimizer is the algorithm that <strong style={{ color: '#e2e8f0' }}>updates the model's weights to minimize the loss function</strong>. Without an optimizer, the neural network cannot learn.
        </p>

        <DiamondH4>Why do we need it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0.5rem 0' }}>After backpropagation computes gradients, the optimizer decides:</p>
        <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          <li>Which <strong style={{ color: '#e2e8f0' }}>direction</strong> to move</li>
          <li>How <strong style={{ color: '#e2e8f0' }}>far</strong> to move</li>
          <li>How <strong style={{ color: '#e2e8f0' }}>quickly</strong> to converge</li>
        </ul>

        <DiamondH4>Common Optimizers</DiamondH4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Adam */}
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#a5b4fc', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Adam</h5>
            <span style={{ background: '#4ade80', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Most Popular</span>
            <ul style={{ color: '#94a3b8', paddingLeft: '1rem', lineHeight: '1.7', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>✔ Fast convergence</li>
              <li>✔ Works well without much tuning</li>
              <li>✔ Best for beginners</li>
            </ul>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.82rem' }}>Use: ANN, CNN, NLP, most DL tasks</p>
          </div>

          {/* SGD */}
          <div style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#f9a8d4', marginBottom: '0.5rem', fontSize: '1.05rem' }}>SGD (Stochastic Gradient Descent)</h5>
            <ul style={{ color: '#94a3b8', paddingLeft: '1rem', lineHeight: '1.7', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>✔ Better final generalization</li>
              <li>✔ Preferred in image classification</li>
              <li>✖ Slower convergence</li>
            </ul>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.82rem' }}>Usually combined with Momentum</p>
          </div>

          {/* AdamW */}
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#c4b5fd', marginBottom: '0.5rem', fontSize: '1.05rem' }}>AdamW</h5>
            <span style={{ background: '#8b5cf6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Improved Adam</span>
            <ul style={{ color: '#94a3b8', paddingLeft: '1rem', lineHeight: '1.7', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>✔ Better weight decay handling</li>
              <li>✔ Standard for Transformers</li>
            </ul>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.82rem' }}>Use: BERT, GPT, ViT, LLMs</p>
          </div>

          {/* RMSProp */}
          <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#fde68a', marginBottom: '0.5rem', fontSize: '1.05rem' }}>RMSProp</h5>
            <span style={{ background: '#f59e0b', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>Sequential Data</span>
            <ul style={{ color: '#94a3b8', paddingLeft: '1rem', lineHeight: '1.7', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <li>✔ Designed for sequential data</li>
              <li>✔ Adapts learning rate per param</li>
            </ul>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.82rem' }}>Use: RNN, LSTM, GRU</p>
          </div>
        </div>

        <DiamondH4 color="#ec4899">Which Optimizer Should You Use?</DiamondH4>
        <StyledTable
          headers={['Model', 'Optimizer']}
          rows={[
            ['ANN', 'Adam'],
            ['CNN', 'SGD / Adam'],
            ['RNN', 'RMSProp / Adam'],
            ['Transformer', 'AdamW'],
          ]}
        />
      </AccordionBody>

      {/* ===== 4. EPOCHS ===== */}
      <AccordionHeader sectionKey="epochs" number="4" title="Epochs" stars={5} color="#f59e0b" />
      <AccordionBody sectionKey="epochs">
        <DiamondH4>What is it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          An <strong style={{ color: '#e2e8f0' }}>Epoch</strong> means the model has seen the <strong style={{ color: '#e2e8f0' }}>entire training dataset once</strong>.
        </p>

        <DiamondH4>Example</DiamondH4>
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#a5b4fc', fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>Dataset: <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>10,000 images</span></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <p style={{ color: '#fbbf24', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Epoch = 1</p>
              <p style={{ color: '#94a3b8', margin: 0 }}>Model sees all 10,000 images <strong style={{ color: '#e2e8f0' }}>once</strong>.</p>
            </div>
            <div>
              <p style={{ color: '#fbbf24', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Epoch = 100</p>
              <p style={{ color: '#94a3b8', margin: 0 }}>Model has seen the dataset <strong style={{ color: '#e2e8f0' }}>100 times</strong>.</p>
            </div>
          </div>
        </div>

        <DiamondH4>Why do we need it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1.25rem 0' }}>
          One pass through the data is usually <strong style={{ color: '#e2e8f0' }}>not enough</strong> for the model to learn meaningful patterns. Multiple epochs allow the model to gradually improve.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>❌ Too Few Epochs</h5>
            <p style={{ color: '#f87171', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Result: Underfitting</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>The model hasn't learned enough.</p>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <h5 style={{ color: '#f87171', marginBottom: '0.5rem' }}>❌ Too Many Epochs</h5>
            <p style={{ color: '#f87171', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Result: Overfitting</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>The model memorizes the training data and performs poorly on new data.</p>
          </div>
        </div>

        <DiamondH4>Typical Values</DiamondH4>
        <TypicalValuesBox values={['10', '50', '100', '200', '500']} />

        <IncreaseDecreaseGrid
          increase={['Training accuracy is still improving', 'Validation accuracy is improving']}
          decrease={['Validation loss starts increasing', 'Use Early Stopping to stop automatically']}
        />
      </AccordionBody>

      {/* ===== 5. WEIGHT DECAY ===== */}
      <AccordionHeader sectionKey="weightDecay" number="5" title="Weight Decay (L2 Regularization)" stars={4} color="#14b8a6" />
      <AccordionBody sectionKey="weightDecay">
        <DiamondH4>What is it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          Weight Decay adds a <strong style={{ color: '#e2e8f0' }}>penalty for large weights</strong> during training. Instead of only minimizing the prediction loss, the model also tries to keep its weights small.
        </p>

        <DiamondH4>Why do we need it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1.25rem 0' }}>
          Large weights often mean the model is <strong style={{ color: '#f87171' }}>memorizing</strong> the training data instead of learning general patterns. Weight Decay reduces this behavior.
        </p>

        <DiamondH4>Benefits</DiamondH4>
        <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          <li>✔ <strong style={{ color: '#4ade80' }}>Reduces overfitting</strong></li>
          <li>✔ <strong style={{ color: '#4ade80' }}>Improves generalization</strong></li>
          <li>✔ <strong style={{ color: '#4ade80' }}>Produces simpler models</strong></li>
        </ul>

        <DiamondH4>Typical Values</DiamondH4>
        <TypicalValuesBox values={['0.00001', '0.0001', '0.001', '0.01']} />

        <IncreaseDecreaseGrid
          increase={['Training accuracy is much higher than validation accuracy', 'Example: Train = 99%, Val = 85% (classic overfitting)']}
          decrease={['Training accuracy is also low', 'The model is already struggling to learn']}
        />

        <div style={{ marginTop: '1.5rem', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
          <h5 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>💡 Best Practice</h5>
          <p style={{ color: '#94a3b8', margin: 0 }}><CodeBlock>0.0001</CodeBlock> works well for many CNNs. <CodeBlock>0.01</CodeBlock> is commonly used with AdamW in Transformers.</p>
        </div>
      </AccordionBody>

      {/* ===== 6. DROPOUT ===== */}
      <AccordionHeader sectionKey="dropout" number="6" title="Dropout" stars={4} color="#ef4444" />
      <AccordionBody sectionKey="dropout">
        <DiamondH4>What is it?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          Dropout is a <strong style={{ color: '#e2e8f0' }}>regularization technique</strong> used to prevent overfitting by randomly <strong style={{ color: '#e2e8f0' }}>dropping</strong> neurons (deactivating them) during training. These neurons do not participate in forward or backward propagation for that iteration.
        </p>

        <DiamondH4>How Does Dropout Work?</DiamondH4>
        <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
          <li>During training, a percentage of neurons are randomly <strong style={{ color: '#e2e8f0' }}>set to zero</strong> in each forward pass.</li>
          <li>This forces the network to learn <strong style={{ color: '#e2e8f0' }}>redundant representations</strong>, making it more <strong style={{ color: '#e2e8f0' }}>robust</strong>.</li>
          <li>Dropout is only applied during <strong style={{ color: '#e2e8f0' }}>training</strong>, not during inference (prediction).</li>
        </ul>

        <DiamondH4>Where Do We Set Dropout Rate?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0.5rem 0' }}>
          The <strong style={{ color: '#e2e8f0' }}>dropout rate</strong> (probability of dropping a neuron) is typically between <strong style={{ color: '#e2e8f0' }}>0.2 and 0.5</strong>.
        </p>
        <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
          <li><strong style={{ color: '#e2e8f0' }}>Low dropout (e.g., 0.1 - 0.3):</strong> Good for small datasets.</li>
          <li><strong style={{ color: '#e2e8f0' }}>High dropout (e.g., 0.4 - 0.6):</strong> Good for large, complex models.</li>
        </ul>

        <DiamondH4>Example</DiamondH4>
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#a5b4fc', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Dropout = 0.5</p>
          <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>Suppose a layer has <CodeBlock>100 neurons</CodeBlock></p>
          <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>During one training iteration → <CodeBlock>50 neurons</CodeBlock> are randomly disabled.</p>
          <p style={{ color: '#94a3b8', margin: 0 }}>In the next iteration, a <strong style={{ color: '#e2e8f0' }}>different random set</strong> of neurons is disabled.</p>
        </div>

        <DiamondH4>Key Reasons for Using Dropout</DiamondH4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <NumberBadge num="1" color="#6366f1" />
            <div>
              <p style={{ color: '#e2e8f0', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Prevents Overfitting</p>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>In deep networks, models can <strong style={{ color: '#e2e8f0' }}>memorize</strong> the training data instead of generalizing. Dropout prevents this by <strong style={{ color: '#e2e8f0' }}>removing random neurons</strong>, making the model more robust.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <NumberBadge num="2" color="#6366f1" />
            <div>
              <p style={{ color: '#e2e8f0', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Improves Generalization</p>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Helps the model perform <strong style={{ color: '#e2e8f0' }}>better on unseen data (test set)</strong>. Ensures that neurons do not depend too much on specific features.</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <NumberBadge num="3" color="#6366f1" />
            <div>
              <p style={{ color: '#e2e8f0', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Acts as Model Averaging</p>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Dropout <strong style={{ color: '#e2e8f0' }}>trains multiple sub-networks</strong> (since different neurons are dropped each time). The final model behaves like an <strong style={{ color: '#e2e8f0' }}>ensemble of many smaller networks</strong>, improving stability.</p>
            </div>
          </div>
        </div>

        <DiamondH4>Typical Values</DiamondH4>
        <TypicalValuesBox values={['0.1', '0.2', '0.3', '0.5']} />

        <IncreaseDecreaseGrid
          increase={['Training accuracy is much higher than validation accuracy', 'Example: Train = 99%, Val = 82%']}
          decrease={['Both training and validation accuracy are low', 'The model is underfitting and needs more capacity']}
        />

        <div style={{ marginTop: '1.5rem' }}>
          <DiamondH4 color="#ec4899">Recommended Dropout Rates</DiamondH4>
          <StyledTable
            headers={['Model', 'Dropout']}
            rows={[
              ['ANN', '0.3 – 0.5'],
              ['CNN', '0.2 – 0.5'],
              ['RNN / LSTM', '0.2 – 0.5'],
              ['Transformer', '0.1'],
            ]}
          />
        </div>
      </AccordionBody>

      {/* ===== 7. HIDDEN LAYERS & NEURONS ===== */}
      <AccordionHeader sectionKey="layers" number="7" title="Number of Hidden Layers & Neurons" stars={4} color="#0ea5e9" />
      <AccordionBody sectionKey="layers">
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1.25rem 0' }}>
          Choosing the right number of hidden layers and neurons is crucial for <strong style={{ color: '#e2e8f0' }}>model performance</strong>. Too few neurons can lead to <strong style={{ color: '#f87171' }}>underfitting</strong>, while too many can cause <strong style={{ color: '#f87171' }}>overfitting</strong>.
        </p>

        <DiamondH4>How Many Hidden Layers Should You Use?</DiamondH4>
        <StyledTable
          headers={['Number of Hidden Layers', 'When to Use']}
          rows={[
            ['0 (Only Input & Output Layer)', 'For simple linear problems (e.g., Linear Regression)'],
            ['1 Hidden Layer', 'Works well for most basic problems (e.g., simple classification)'],
            ['2-3 Hidden Layers', 'Good for complex tasks (e.g., image recognition, speech processing)'],
            ['4+ Hidden Layers', 'Needed for deep learning tasks (e.g., object detection, NLP, GANs, LLMs)'],
          ]}
        />
        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#4ade80', margin: 0 }}>✅ <strong>Rule of Thumb:</strong> Start with <strong>1 hidden layer</strong> and increase if accuracy does not improve.</p>
        </div>

        <DiamondH4>How Many Neurons per Hidden Layer?</DiamondH4>
        <div style={{ paddingLeft: '0.5rem', marginBottom: '1.5rem' }}>
          <DiamondH4 color="#f9a8d4">General Rules</DiamondH4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <NumberBadge num="1" color="#ec4899" />
              <p style={{ color: '#94a3b8', margin: 0, lineHeight: '1.6' }}><strong style={{ color: '#e2e8f0' }}>Between input and output layer sizes</strong> — A common approach is to set the number of neurons between the input and output layer sizes.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <NumberBadge num="2" color="#ec4899" />
              <p style={{ color: '#94a3b8', margin: 0, lineHeight: '1.6' }}><strong style={{ color: '#e2e8f0' }}>Try powers of 2</strong> (e.g., 16, 32, 64, 128, 256, ...) — This often works well due to hardware optimization.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <NumberBadge num="3" color="#ec4899" />
              <p style={{ color: '#94a3b8', margin: 0, lineHeight: '1.6' }}><strong style={{ color: '#e2e8f0' }}>Increase neurons if underfitting, decrease if overfitting.</strong></p>
            </div>
          </div>

          <DiamondH4 color="#f9a8d4">Common Formulas</DiamondH4>
          <div style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
            <p style={{ color: '#f9a8d4', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Half-sum rule:</p>
            <FormulaBox>
              Hidden Neurons = (Input Neurons + Output Neurons) / 2
            </FormulaBox>
          </div>
          <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0' }}>
            • <strong style={{ color: '#e2e8f0' }}>Empirical testing:</strong> Try [input neurons, 2× input neurons, output neurons].
          </p>
        </div>
      </AccordionBody>

      {/* ===== 8. ACTIVATION FUNCTIONS ===== */}
      <AccordionHeader sectionKey="activation" number="8" title="Activation Functions" stars={4} color="#22c55e" />
      <AccordionBody sectionKey="activation">
        <DiamondH4>Why Do We Need Activation Functions?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          Without activation functions, a neural network is just a linear model — no matter how many layers. Activation functions introduce <strong style={{ color: '#e2e8f0' }}>non-linearity</strong>, allowing the network to learn complex patterns.
        </p>

        <StyledTable
          headers={['Feature', 'With Activation Function', 'Without Activation Function']}
          rows={[
            ['Can learn curves', '✅ Yes', '❌ No (only straight lines)'],
            ['Solve complex problems', '✅ Yes', '❌ No'],
            ['Deep learning usable', '✅ Essential', '❌ Not useful'],
          ]}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ color: '#f87171', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Without activation:</p>
            <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>Dense(1)  # Linear</p>
            <p style={{ color: '#94a3b8', margin: 0 }}>→ Can't learn non-linear patterns.</p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '1.25rem' }}>
            <p style={{ color: '#4ade80', fontWeight: 700, margin: '0 0 0.5rem 0' }}>With activation:</p>
            <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>Dense(8, activation='relu')</p>
            <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>→ Can model complex logic like:</p>
            <p style={{ color: '#fbbf24', margin: 0, fontStyle: 'italic', fontSize: '0.88rem' }}>"If CGPA is high OR IQ is high, then likely to be placed"</p>
          </div>
        </div>

        <DiamondH4>Common Activation Functions</DiamondH4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {['ReLU', 'LeakyReLU', 'Sigmoid', 'Softmax', 'Tanh', 'Linear'].map(name => (
            <span key={name} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', padding: '0.4rem 1rem', borderRadius: '8px', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.9rem' }}>{name}</span>
          ))}
        </div>

        <DiamondH4 color="#ec4899">Recommended Activation per Layer</DiamondH4>
        <StyledTable
          headers={['Layer', 'Recommended Activation', 'Why']}
          rows={[
            ['Input', '– (no activation)', 'Raw features'],
            ['Hidden', 'ReLU, LeakyReLU', 'Avoid vanishing gradient'],
            ['Output (binary)', 'Sigmoid', 'Gives probability [0, 1]'],
            ['Output (multi-class)', 'Softmax', 'Probabilities for all classes'],
            ['Output (regression)', 'Linear', 'Raw value output'],
          ]}
        />

        <DiamondH4 color="#ec4899">Real-World Task Examples</DiamondH4>
        <StyledTable
          headers={['Task', 'Activation Functions']}
          rows={[
            ['Predict Placement (Yes/No)', 'Hidden: ReLU → Output: Sigmoid'],
            ['Predict House Price', 'Hidden: ReLU → Output: Linear'],
            ['Image Classification (e.g., MNIST)', 'Hidden: ReLU → Output: Softmax'],
            ['Sentiment Analysis', 'Hidden: Tanh or ReLU → Output: Sigmoid'],
          ]}
        />

        <DiamondH4 color="#5eead4">Activation Function Summary</DiamondH4>
        <StyledTable
          headers={['Activation', 'Range', 'Best For', 'Used In']}
          rows={[
            ['ReLU', '[0, ∞)', 'Hidden layers (most cases)', 'Deep networks, CNNs'],
            ['Leaky ReLU', '(-∞, ∞)', 'Hidden layers (better than ReLU)', 'If ReLU has dead neurons'],
            ['Sigmoid', '[0, 1]', 'Binary classification output', 'Logistic output'],
            ['Tanh', '[-1, 1]', 'Centered input', 'Hidden layers sometimes'],
            ['Softmax', '[0, 1]', 'Multi-class classification', 'Final layer for multi-class'],
            ['Linear', '(-∞, ∞)', 'Regression output', 'Final layer for regression'],
          ]}
        />
      </AccordionBody>

      {/* ===== 9. K-FOLD CROSS VALIDATION ===== */}
      <AccordionHeader sectionKey="kfold" number="9" title="K-Fold Cross Validation" stars={4} color="#06b6d4" />
      <AccordionBody sectionKey="kfold">
        <DiamondH4>What is K-Fold Cross Validation?</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          <strong style={{ color: '#e2e8f0' }}>K-Fold Cross Validation</strong> is a model evaluation technique used to measure how well a machine learning model generalizes to unseen data.
        </p>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          Instead of training and validating the model <strong style={{ color: '#e2e8f0' }}>only once</strong>, K-Fold trains and evaluates the model <strong style={{ color: '#e2e8f0' }}>K times</strong>, using different parts of the dataset for validation each time. This provides a <strong style={{ color: '#4ade80' }}>more reliable estimate of model performance</strong>.
        </p>

        <DiamondH4>Why Do We Need It?</DiamondH4>
        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <p style={{ color: '#fbbf24', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Suppose you have 1,000 samples and split them once:</p>
          <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: '0 0 0.5rem 0' }}>Training = 800 &nbsp;&nbsp;|&nbsp;&nbsp; Validation = 200</p>
          <p style={{ color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Your validation accuracy depends entirely on <strong style={{ color: '#e2e8f0' }}>which 200 samples</strong> happened to be chosen. Another split might give a different accuracy.</p>
          <p style={{ color: '#4ade80', margin: 0 }}>K-Fold reduces this randomness by ensuring <strong>every sample is used for validation exactly once</strong> and for training <strong>K−1 times</strong>.</p>
        </div>

        <DiamondH4>How K-Fold Works (K=5)</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
          Dataset = <CodeBlock>1000 Samples</CodeBlock> &nbsp;→&nbsp; Split into <CodeBlock>5 equal folds</CodeBlock>
        </p>

        {/* Interactive Fold Visualization */}
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '500px' }}>
            {[1, 2, 3, 4, 5].map(iter => (
              <div key={iter} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, width: '85px', flexShrink: 0 }}>Iteration {iter}</span>
                <div style={{ display: 'flex', flex: 1, gap: '3px' }}>
                  {[1, 2, 3, 4, 5].map(fold => {
                    const isVal = fold === iter;
                    return (
                      <div key={fold} style={{
                        flex: 1, padding: '0.5rem 0.25rem', borderRadius: '6px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700,
                        background: isVal ? 'rgba(236,72,153,0.25)' : 'rgba(99,102,241,0.15)',
                        border: isVal ? '2px solid #ec4899' : '1px solid rgba(99,102,241,0.25)',
                        color: isVal ? '#f9a8d4' : '#a5b4fc'
                      }}>
                        <div>{isVal ? '🔍 Valid' : 'Train'}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Fold {fold}</div>
                      </div>
                    );
                  })}
                </div>
                <span style={{ color: '#64748b', fontSize: '0.78rem', width: '60px', textAlign: 'right', flexShrink: 0 }}>→ Acc {iter}</span>
              </div>
            ))}
          </div>
          <FormulaBox>
            Average Accuracy = (Acc1 + Acc2 + Acc3 + Acc4 + Acc5) / 5
          </FormulaBox>
        </div>

        <DiamondH4>Example Results</DiamondH4>
        <StyledTable
          headers={['Fold', 'Accuracy']}
          rows={[
            ['Fold 1', '94%'],
            ['Fold 2', '96%'],
            ['Fold 3', '95%'],
            ['Fold 4', '97%'],
            ['Fold 5', '93%'],
          ]}
        />
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', margin: '0 0 0.25rem 0' }}>(94 + 96 + 95 + 97 + 93) / 5</p>
          <p style={{ color: '#4ade80', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Final Model Accuracy = 95%</p>
        </div>

        <DiamondH4>Choosing the Value of K</DiamondH4>
        <StyledTable
          headers={['K Value', 'When to Use']}
          rows={[
            [<strong style={{ color: '#4ade80' }}>5</strong>, 'Most common, good balance of speed and reliability'],
            [<strong style={{ color: '#a5b4fc' }}>10</strong>, 'Higher reliability, but more computation'],
            [<span><strong style={{ color: '#fbbf24' }}>Leave-One-Out</strong> (K = N)</span>, 'Very small datasets; computationally expensive'],
          ]}
        />

        <DiamondH4 color="#4ade80">Advantages</DiamondH4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { title: 'Better Use of Data', desc: 'Every sample is used for training K−1 times and for validation 1 time. No data is wasted.' },
            { title: 'More Reliable Estimate', desc: 'One train/validation split can be lucky or unlucky. K-Fold averages across multiple splits, reducing variance.' },
            { title: 'Helps Detect Overfitting', desc: 'If validation performance varies a lot across folds, the model may not generalize well.' },
            { title: 'Works for Small Datasets', desc: 'When you have limited data, K-Fold allows every sample to contribute to both training and validation.' },
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                <NumberBadge num={i + 1} color="#22c55e" />
                <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.92rem' }}>{item.title}</span>
              </div>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <DiamondH4 color="#f87171">Disadvantages</DiamondH4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ color: '#f87171', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Slow</p>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>If K=10, the model is trained <strong style={{ color: '#e2e8f0' }}>10 separate times</strong>. Deep learning models can take hours or days to train once.</p>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ color: '#f87171', fontWeight: 700, margin: '0 0 0.25rem 0' }}>High Computational Cost</p>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Large datasets and deep neural networks require significant GPU time and memory.</p>
          </div>
        </div>

        <DiamondH4>K-Fold in ML vs Deep Learning</DiamondH4>
        <StyledTable
          headers={['Machine Learning', 'Deep Learning']}
          rows={[
            ['Commonly used', 'Used less often'],
            ['Fast to train', 'Training is expensive'],
            ['Recommended for most models', 'Often replaced with a single train/val split + Early Stopping'],
          ]}
        />

        <DiamondH4 color="#ec4899">Stratified K-Fold</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0.75rem 0' }}>
          For classification problems with <strong style={{ color: '#e2e8f0' }}>imbalanced classes</strong>, use <strong style={{ color: '#ec4899' }}>Stratified K-Fold</strong>. It preserves the class proportions in every fold.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '10px', padding: '1rem' }}>
            <p style={{ color: '#f9a8d4', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Example Dataset:</p>
            <p style={{ color: '#e2e8f0', fontFamily: 'monospace', margin: '0 0 0.15rem 0' }}>100 Samples</p>
            <p style={{ color: '#4ade80', fontFamily: 'monospace', margin: '0 0 0.15rem 0' }}>90 Cats 🐱</p>
            <p style={{ color: '#f87171', fontFamily: 'monospace', margin: 0 }}>10 Dogs 🐶</p>
          </div>
          <div>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0.5rem 0' }}>
              A random split might produce a validation fold with <strong style={{ color: '#f87171' }}>very few dogs</strong>.
            </p>
            <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: 0 }}>
              <strong style={{ color: '#ec4899' }}>Stratified K-Fold</strong> ensures each fold has ~18 Cats + 2 Dogs.
            </p>
          </div>
        </div>
        <StyledTable
          headers={['Fold', 'Cats', 'Dogs']}
          rows={[
            ['Fold 1', '18', '2'],
            ['Fold 2', '18', '2'],
            ['Fold 3', '18', '2'],
            ['Fold 4', '18', '2'],
            ['Fold 5', '18', '2'],
          ]}
        />

        <DiamondH4 color="#fbbf24">K-Fold for Hyperparameter Tuning</DiamondH4>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', margin: '0 0 0.75rem 0' }}>
          K-Fold is often combined with <strong style={{ color: '#e2e8f0' }}>Grid Search</strong>, <strong style={{ color: '#e2e8f0' }}>Random Search</strong>, or <strong style={{ color: '#e2e8f0' }}>Bayesian Optimization</strong>.
        </p>
        <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>Learning Rate = 0.001</span>
            <span style={{ color: '#fbbf24' }}>↓</span>
            <span style={{ color: '#a5b4fc' }}>Run 5-Fold Cross Validation</span>
            <span style={{ color: '#fbbf24' }}>↓</span>
            <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>Average Accuracy = <strong>95%</strong></span>
            <div style={{ width: '60%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
            <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>Learning Rate = 0.0005</span>
            <span style={{ color: '#fbbf24' }}>↓</span>
            <span style={{ color: '#a5b4fc' }}>Run 5-Fold Cross Validation</span>
            <span style={{ color: '#fbbf24' }}>↓</span>
            <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>Average Accuracy = <strong style={{ color: '#4ade80' }}>96%</strong></span>
            <span style={{ color: '#fbbf24' }}>↓</span>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>✅ Choose 0.0005</span>
          </div>
        </div>

        <DiamondH4 color="#a5b4fc">Python Code — K-Fold Cross Validation (sklearn)</DiamondH4>
        <CodeSnippet id="kfold-basic" code={`from sklearn.model_selection import KFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris

# Load dataset
X, y = load_iris(return_X_y=True)

# Create model
model = RandomForestClassifier(n_estimators=100, random_state=42)

# Create K-Fold (K=5)
kf = KFold(n_splits=5, shuffle=True, random_state=42)

# Run cross-validation
scores = cross_val_score(model, X, y, cv=kf, scoring='accuracy')

# Results
print("Fold Accuracies:", scores)
print(f"Mean Accuracy: {scores.mean():.4f}")
print(f"Std Deviation: {scores.std():.4f}")`} />

        <DiamondH4 color="#a5b4fc">Python Code — Stratified K-Fold (for Imbalanced Data)</DiamondH4>
        <CodeSnippet id="kfold-stratified" code={`from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.ensemble import GradientBoostingClassifier
import numpy as np

# Example: Imbalanced dataset
# X = your features, y = your labels

model = GradientBoostingClassifier(n_estimators=100, random_state=42)

# Stratified K-Fold preserves class proportions in each fold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

scores = cross_val_score(model, X, y, cv=skf, scoring='accuracy')

print("Fold Accuracies:", scores)
print(f"Mean Accuracy: {scores.mean():.4f}")
print(f"Std Deviation: {scores.std():.4f}")`} />

        <DiamondH4 color="#a5b4fc">Python Code — K-Fold with Grid Search (Hyperparameter Tuning)</DiamondH4>
        <CodeSnippet id="kfold-gridsearch" code={`from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.svm import SVC
from sklearn.datasets import load_iris

# Load data
X, y = load_iris(return_X_y=True)

# Define model
model = SVC()

# Define hyperparameter grid
param_grid = {
    'C': [0.1, 1, 10, 100],
    'kernel': ['linear', 'rbf', 'poly'],
    'gamma': ['scale', 'auto']
}

# Stratified 5-Fold Cross Validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# Grid Search with K-Fold
grid_search = GridSearchCV(
    estimator=model,
    param_grid=param_grid,
    cv=cv,
    scoring='accuracy',
    n_jobs=-1,        # Use all CPU cores
    verbose=1
)

grid_search.fit(X, y)

print(f"Best Parameters: {grid_search.best_params_}")
print(f"Best CV Accuracy: {grid_search.best_score_:.4f}")`} />

        <DiamondH4>Summary</DiamondH4>
        <StyledTable
          headers={['Feature', 'K-Fold Cross Validation']}
          rows={[
            ['Purpose', 'Evaluate model performance reliably'],
            ['Number of Trainings', 'K times'],
            ['Validation Used', 'A different fold in each iteration'],
            ['Final Metric', 'Average of all K validation scores'],
            ['Common K Values', '5 or 10'],
            ['Best For', 'Machine learning and small datasets'],
            ['Less Common For', 'Large deep learning models due to training cost'],
          ]}
        />

        <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
          <h5 style={{ color: '#a5b4fc', marginBottom: '0.75rem' }}>📌 Rule of Thumb</h5>
          <ul style={{ color: '#94a3b8', paddingLeft: '1.2rem', lineHeight: '1.8', margin: 0 }}>
            <li><strong style={{ color: '#e2e8f0' }}>Machine Learning (Random Forest, SVM, XGBoost, etc.)</strong> → Use <strong style={{ color: '#4ade80' }}>5-fold or 10-fold cross-validation</strong> by default.</li>
            <li><strong style={{ color: '#e2e8f0' }}>Deep Learning (CNNs, RNNs, Transformers)</strong> → Usually use a <strong style={{ color: '#fbbf24' }}>train/validation/test split with Early Stopping</strong>. Reserve K-Fold for small datasets or research scenarios.</li>
          </ul>
        </div>
      </AccordionBody>

      {/* ===== PARAMETERS vs HYPERPARAMETERS COMPARISON TABLE ===== */}
      <SectionCard style={{ marginTop: '1rem' }}>
        <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>Parameters vs Hyperparameters</h3>
        <StyledTable
          headers={['Concept', 'Parameters', 'Hyperparameters']}
          rows={[
            [<span>Learned by model?</span>, <span style={{ color: '#4ade80' }}>✅ Yes</span>, <span style={{ color: '#f87171' }}>❌ No</span>],
            [<span>Direct impact on predictions?</span>, <span style={{ color: '#4ade80' }}>✅ Yes</span>, <span style={{ color: '#f87171' }}>❌ No (but affects learning)</span>],
            [<span>Changes during training?</span>, <span style={{ color: '#4ade80' }}>✅ Yes</span>, <span style={{ color: '#f87171' }}>❌ No</span>],
            [<span>Manually set?</span>, <span style={{ color: '#f87171' }}>❌ No</span>, <span style={{ color: '#4ade80' }}>✅ Yes</span>],
            ['Examples', 'Weights, Biases', 'Learning Rate, Batch Size, Optimizer'],
          ]}
        />
      </SectionCard>

      {/* ===== GRAND SUMMARY TABLE ===== */}
      <SectionCard>
        <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>📋 Grand Summary Table</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#1e293b', color: '#f8fafc', borderRadius: '8px', overflow: 'hidden', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#334155', borderBottom: '2px solid #475569' }}>
                <th style={{ padding: '0.85rem 0.75rem', borderRight: '1px solid #475569', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Hyperparameter</th>
                <th style={{ padding: '0.85rem 0.75rem', borderRight: '1px solid #475569', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>What It Controls</th>
                <th style={{ padding: '0.85rem 0.75rem', borderRight: '1px solid #475569', fontSize: '0.85rem', fontWeight: 700, color: '#4ade80' }}>Increase When</th>
                <th style={{ padding: '0.85rem 0.75rem', borderRight: '1px solid #475569', fontSize: '0.85rem', fontWeight: 700, color: '#f87171' }}>Decrease When</th>
                <th style={{ padding: '0.85rem 0.75rem', fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc' }}>Recommended Default</th>
              </tr>
            </thead>
            <tbody>
              {[
                { hp: 'Learning Rate ⭐⭐⭐⭐⭐', controls: 'Step size for updating weights', inc: 'Training is slow', dec: 'Loss oscillates or diverges', def: '0.001 (Adam)' },
                { hp: 'Batch Size ⭐⭐⭐⭐⭐', controls: 'Samples before a weight update', inc: 'GPU has memory, training unstable', dec: 'GPU OOM or generalization is poor', def: '32–64' },
                { hp: 'Optimizer ⭐⭐⭐⭐⭐', controls: 'How weights are updated', inc: 'Need faster convergence', dec: 'Current optimizer underperforms', def: 'Adam' },
                { hp: 'Epochs ⭐⭐⭐⭐⭐', controls: 'Complete passes through dataset', inc: 'Model is underfitting', dec: 'Validation loss increases', def: 'Use Early Stopping' },
                { hp: 'Weight Decay ⭐⭐⭐⭐', controls: 'Penalizes large weights', inc: 'Train acc ≫ Val acc', dec: 'Model is underfitting', def: '0.0001 (CNNs), 0.01 (AdamW)' },
                { hp: 'Dropout ⭐⭐⭐⭐', controls: 'Randomly disables neurons', inc: 'Overfitting', dec: 'Underfitting', def: '0.2–0.5 (CNN/ANN), 0.1 (Transformers)' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 5 ? '1px solid #475569' : 'none' }}>
                  <td style={{ padding: '0.75rem', borderRight: '1px solid #475569', fontWeight: 700, color: '#e2e8f0', fontSize: '0.85rem' }}>{row.hp}</td>
                  <td style={{ padding: '0.75rem', borderRight: '1px solid #475569', color: '#cbd5e1', fontSize: '0.83rem' }}>{row.controls}</td>
                  <td style={{ padding: '0.75rem', borderRight: '1px solid #475569', color: '#86efac', fontSize: '0.83rem' }}>{row.inc}</td>
                  <td style={{ padding: '0.75rem', borderRight: '1px solid #475569', color: '#fca5a5', fontSize: '0.83rem' }}>{row.dec}</td>
                  <td style={{ padding: '0.75rem', color: '#c4b5fd', fontSize: '0.83rem', fontWeight: 600 }}>{row.def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
