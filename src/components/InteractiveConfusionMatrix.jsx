import React, { useState, useMemo } from 'react';

// ── Color palette ────────────────────────────────────────────────────────────
const COLORS = {
  TP: '#22c55e',
  TN: '#3b82f6',
  FP: '#f59e0b',
  FN: '#f87171',
  heading: '#e2e8f0',
  body: '#94a3b8',
  secondary: '#64748b',
  accent: '#818cf8',
  cardBg: 'rgba(255,255,255,0.02)',
  cardBorder: 'rgba(255,255,255,0.06)',
};

// ── Shared style fragments ───────────────────────────────────────────────────
const cardStyle = {
  background: COLORS.cardBg,
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: '12px',
  padding: '0.9rem',
};

const sectionTitle = (text, emoji) => (
  <h4 style={{ color: COLORS.heading, fontSize: '0.93rem', fontWeight: 700, marginBottom: '0.5rem' }}>
    {emoji && <span style={{ marginRight: '0.4rem' }}>{emoji}</span>}{text}
  </h4>
);

// ── Metric helpers ───────────────────────────────────────────────────────────
function computeMetrics(tp, tn, fp, fn) {
  const total = tp + tn + fp + fn;
  const accuracy  = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall    = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const f1        = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
  const specificity = (tn + fp) > 0 ? tn / (tn + fp) : 0;
  return { accuracy, precision, recall, f1, specificity, total };
}

// ── Mini progress bar ────────────────────────────────────────────────────────
function MetricBar({ value, color }) {
  return (
    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min(value * 100, 100)}%`,
        height: '100%',
        background: color,
        borderRadius: '3px',
        transition: 'width 0.3s ease',
      }} />
    </div>
  );
}

// ── Interactive 2×2 Grid ─────────────────────────────────────────────────────
function ConfusionGrid({ tp, tn, fp, fn, onChange }) {
  const cells = [
    { key: 'tp', label: 'TP', value: tp, color: COLORS.TP, row: 0, col: 0 },
    { key: 'fn', label: 'FN', value: fn, color: COLORS.FN, row: 0, col: 1 },
    { key: 'fp', label: 'FP', value: fp, color: COLORS.FP, row: 1, col: 0 },
    { key: 'tn', label: 'TN', value: tn, color: COLORS.TN, row: 1, col: 1 },
  ];

  const btnStyle = (color) => ({
    width: '22px', height: '22px', borderRadius: '50%', border: 'none',
    background: color, color: '#fff', fontWeight: 700, fontSize: '0.8rem',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: 0.85, transition: 'opacity 0.2s',
  });

  const cellSize = 120;
  const gap = 4;
  const labelOffset = 80;
  const svgW = labelOffset + cellSize * 2 + gap + 10;
  const headerH = 50;
  const svgH = headerH + cellSize * 2 + gap + 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      {/* SVG matrix */}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', maxWidth: '380px', height: 'auto' }}>
        {/* Column headers */}
        <text x={labelOffset + cellSize / 2} y={20} textAnchor="middle" fontSize="10" fill={COLORS.heading} fontWeight="600">
          Predicted
        </text>
        <text x={labelOffset + cellSize / 2} y={35} textAnchor="middle" fontSize="8.5" fill={COLORS.body}>
          Positive
        </text>
        <text x={labelOffset + cellSize + gap + cellSize / 2} y={20} textAnchor="middle" fontSize="10" fill={COLORS.heading} fontWeight="600">
          Predicted
        </text>
        <text x={labelOffset + cellSize + gap + cellSize / 2} y={35} textAnchor="middle" fontSize="8.5" fill={COLORS.body}>
          Negative
        </text>

        {/* Row headers */}
        <text x={labelOffset - 10} y={headerH + cellSize / 2 - 6} textAnchor="end" fontSize="10" fill={COLORS.heading} fontWeight="600">
          Actual
        </text>
        <text x={labelOffset - 10} y={headerH + cellSize / 2 + 8} textAnchor="end" fontSize="8.5" fill={COLORS.body}>
          Positive
        </text>
        <text x={labelOffset - 10} y={headerH + cellSize + gap + cellSize / 2 - 6} textAnchor="end" fontSize="10" fill={COLORS.heading} fontWeight="600">
          Actual
        </text>
        <text x={labelOffset - 10} y={headerH + cellSize + gap + cellSize / 2 + 8} textAnchor="end" fontSize="8.5" fill={COLORS.body}>
          Negative
        </text>

        {/* Cells */}
        {cells.map((c) => {
          const x = labelOffset + c.col * (cellSize + gap);
          const y = headerH + c.row * (cellSize + gap);
          return (
            <g key={c.key}>
              <rect x={x} y={y} width={cellSize} height={cellSize} rx={10}
                fill={c.color} opacity={0.12} stroke={c.color} strokeWidth={1.5} />
              <text x={x + cellSize / 2} y={y + 30} textAnchor="middle" fontSize="11" fill={c.color} fontWeight="700">
                {c.label}
              </text>
              <text x={x + cellSize / 2} y={y + cellSize / 2 + 8} textAnchor="middle" fontSize="26" fill={c.color} fontWeight="800">
                {c.value}
              </text>
            </g>
          );
        })}
      </svg>

      {/* +/- controls */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', width: '100%', maxWidth: '380px' }}>
        {[
          { key: 'tp', label: 'TP', color: COLORS.TP, value: tp },
          { key: 'tn', label: 'TN', color: COLORS.TN, value: tn },
          { key: 'fp', label: 'FP', color: COLORS.FP, value: fp },
          { key: 'fn', label: 'FN', color: COLORS.FN, value: fn },
        ].map((c) => (
          <div key={c.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
            background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}33`, borderRadius: '8px', padding: '0.3rem 0.2rem',
          }}>
            <button onClick={() => onChange(c.key, Math.max(0, c.value - 1))} style={btnStyle(c.color)} aria-label={`Decrease ${c.label}`}>−</button>
            <span style={{ color: c.color, fontWeight: 700, fontSize: '0.78rem', minWidth: '28px', textAlign: 'center' }}>{c.label}: {c.value}</span>
            <button onClick={() => onChange(c.key, c.value + 1)} style={btnStyle(c.color)} aria-label={`Increase ${c.label}`}>+</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Metric display card ──────────────────────────────────────────────────────
function MetricCard({ name, value, formula, description, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${color}22`,
      borderRadius: '10px',
      padding: '0.7rem 0.8rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: COLORS.heading, fontWeight: 700, fontSize: '0.8rem' }}>{name}</span>
        <span style={{ color, fontWeight: 800, fontSize: '1rem', fontFamily: 'monospace' }}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>
      <MetricBar value={value} color={color} />
      <div style={{ color: COLORS.secondary, fontSize: '0.7rem', fontFamily: 'monospace', marginTop: '0.15rem' }}>{formula}</div>
      <div style={{ color: COLORS.body, fontSize: '0.72rem', lineHeight: 1.5 }}>{description}</div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function InteractiveConfusionMatrix() {
  const [tp, setTp] = useState(50);
  const [tn, setTn] = useState(40);
  const [fp, setFp] = useState(10);
  const [fn, setFn] = useState(5);

  const metrics = useMemo(() => computeMetrics(tp, tn, fp, fn), [tp, tn, fp, fn]);

  const handleChange = (key, val) => {
    switch (key) {
      case 'tp': setTp(val); break;
      case 'tn': setTn(val); break;
      case 'fp': setFp(val); break;
      case 'fn': setFn(val); break;
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '1.25rem',
      background: 'linear-gradient(160deg, rgba(15,23,42,0.98), rgba(9,14,30,0.98))',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem',
    }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 1 — What is a Confusion Matrix
          ═══════════════════════════════════════════════════════════════════════ */}
      <div style={cardStyle}>
        {sectionTitle('What is a Confusion Matrix?', '📊')}
        <p style={{ color: COLORS.body, fontSize: '0.8rem', lineHeight: 1.65, margin: 0 }}>
          A <strong style={{ color: COLORS.heading }}>Confusion Matrix</strong> is a table used to <strong style={{ color: '#818cf8' }}>evaluate the performance of a classification model</strong>.
          It compares the <strong style={{ color: COLORS.TP }}>predicted labels</strong> generated by the model against the <strong style={{ color: COLORS.TN }}>actual (true) labels</strong> from the dataset.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
          {[
            { text: 'Works for Binary Classification', icon: '✅' },
            { text: 'Works for Multi-class Classification', icon: '✅' },
            { text: 'Foundation of all classification metrics', icon: '📐' },
          ].map((item, i) => (
            <span key={i} style={{
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
              borderRadius: '20px', padding: '0.25rem 0.6rem', fontSize: '0.72rem', color: COLORS.heading,
            }}>
              {item.icon} {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 2 — Interactive Confusion Matrix Grid
          ═══════════════════════════════════════════════════════════════════════ */}
      <div style={{ ...cardStyle, background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.12)' }}>
        {sectionTitle('Interactive Confusion Matrix', '🔬')}
        <p style={{ color: COLORS.body, fontSize: '0.78rem', lineHeight: 1.6, margin: '0 0 0.7rem 0' }}>
          Click the <strong style={{ color: COLORS.heading }}>+/−</strong> buttons below to adjust TP, TN, FP, and FN values. All metrics update <strong style={{ color: '#facc15' }}>in real time</strong>.
        </p>

        <ConfusionGrid tp={tp} tn={tn} fp={fp} fn={fn} onChange={handleChange} />

        {/* Live metrics summary bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem',
          marginTop: '0.9rem',
        }}>
          {[
            { label: 'Accuracy', val: metrics.accuracy, color: '#a78bfa' },
            { label: 'Precision', val: metrics.precision, color: COLORS.TP },
            { label: 'Recall', val: metrics.recall, color: '#38bdf8' },
            { label: 'F1-Score', val: metrics.f1, color: '#facc15' },
            { label: 'Specificity', val: metrics.specificity, color: COLORS.TN },
          ].map((m, i) => (
            <div key={i} style={{
              textAlign: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', padding: '0.4rem 0.2rem',
              border: `1px solid ${m.color}22`,
            }}>
              <div style={{ color: m.color, fontWeight: 800, fontSize: '0.95rem', fontFamily: 'monospace' }}>
                {(m.val * 100).toFixed(1)}%
              </div>
              <div style={{ color: COLORS.secondary, fontSize: '0.65rem', marginTop: '0.15rem' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 3 — TP / TN / FP / FN Explanation Cards
          ═══════════════════════════════════════════════════════════════════════ */}
      <div style={cardStyle}>
        {sectionTitle('Understanding TP, TN, FP, FN', '🎯')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {[
            {
              key: 'TP', full: 'True Positive', color: COLORS.TP, icon: '✅',
              line1: 'Predicted: YES', line2: 'Actually: YES',
              desc: 'The model correctly predicted the positive class. Both the prediction and reality agree — it\'s a hit!',
            },
            {
              key: 'TN', full: 'True Negative', color: COLORS.TN, icon: '✅',
              line1: 'Predicted: NO', line2: 'Actually: NO',
              desc: 'The model correctly predicted the negative class. It successfully identified a true absence.',
            },
            {
              key: 'FP', full: 'False Positive (Type I Error)', color: COLORS.FP, icon: '❌',
              line1: 'Predicted: YES', line2: 'Actually: NO',
              desc: 'A false alarm — the model predicted positive, but the actual class was negative. Also known as a Type I Error.',
            },
            {
              key: 'FN', full: 'False Negative (Type II Error)', color: COLORS.FN, icon: '❌',
              line1: 'Predicted: NO', line2: 'Actually: YES',
              desc: 'A missed detection — the model predicted negative, but the actual class was positive. Also known as a Type II Error.',
            },
          ].map((c) => (
            <div key={c.key} style={{
              background: `${c.color}08`, border: `1px solid ${c.color}22`, borderRadius: '12px',
              padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{
                  background: `${c.color}22`, color: c.color, fontWeight: 800, fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem', borderRadius: '6px',
                }}>{c.key}</span>
                <span style={{ color: c.color, fontWeight: 700, fontSize: '0.8rem' }}>{c.full}</span>
                <span>{c.icon}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.15rem' }}>
                <span style={{
                  fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px',
                  background: 'rgba(255,255,255,0.05)', color: COLORS.heading,
                }}>{c.line1}</span>
                <span style={{
                  fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px',
                  background: 'rgba(255,255,255,0.05)', color: COLORS.heading,
                }}>{c.line2}</span>
              </div>
              <p style={{ color: COLORS.body, fontSize: '0.72rem', lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 4 — Metrics with Formulas (live values)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div style={cardStyle}>
        {sectionTitle('Classification Metrics & Formulas', '📐')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <MetricCard
            name="Accuracy"
            value={metrics.accuracy}
            formula={`(TP + TN) / Total = (${tp} + ${tn}) / ${metrics.total}`}
            description="Of all predictions, how many were correct? Best when classes are balanced."
            color="#a78bfa"
          />
          <MetricCard
            name="Precision"
            value={metrics.precision}
            formula={`TP / (TP + FP) = ${tp} / (${tp} + ${fp})`}
            description="Of all predicted positive, how many were actually positive? High precision = low false alarm rate."
            color={COLORS.TP}
          />
          <MetricCard
            name="Recall (Sensitivity)"
            value={metrics.recall}
            formula={`TP / (TP + FN) = ${tp} / (${tp} + ${fn})`}
            description="Of all actual positives, how many did we catch? High recall = we miss very few positives."
            color="#38bdf8"
          />
          <MetricCard
            name="F1-Score"
            value={metrics.f1}
            formula={`2 × (Prec × Rec) / (Prec + Rec) = 2 × (${metrics.precision.toFixed(3)} × ${metrics.recall.toFixed(3)}) / (${metrics.precision.toFixed(3)} + ${metrics.recall.toFixed(3)})`}
            description="Harmonic mean of Precision and Recall. Balances both concerns into a single number."
            color="#facc15"
          />
          <MetricCard
            name="Specificity"
            value={metrics.specificity}
            formula={`TN / (TN + FP) = ${tn} / (${tn} + ${fp})`}
            description="Of all actual negatives, how many did we correctly identify as negative?"
            color={COLORS.TN}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 5 — Type I vs Type II Error
          ═══════════════════════════════════════════════════════════════════════ */}
      <div style={cardStyle}>
        {sectionTitle('Type I vs Type II Error', '⚠️')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          {/* Type I */}
          <div style={{
            background: `${COLORS.FP}0a`, border: `1px solid ${COLORS.FP}22`, borderRadius: '10px', padding: '0.7rem',
          }}>
            <div style={{ color: COLORS.FP, fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
              🔔 Type I Error (False Positive)
            </div>
            <p style={{ color: COLORS.body, fontSize: '0.74rem', lineHeight: 1.55, margin: '0 0 0.4rem 0' }}>
              <strong style={{ color: COLORS.heading }}>False alarm</strong> — predicting positive when it is actually negative.
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.2)', borderRadius: '6px', padding: '0.45rem', fontSize: '0.7rem', color: COLORS.body, lineHeight: 1.5,
            }}>
              <strong style={{ color: COLORS.FP }}>Medical test example:</strong> A healthy person is told they have a disease. Causes unnecessary anxiety and further testing.
            </div>
          </div>
          {/* Type II */}
          <div style={{
            background: `${COLORS.FN}0a`, border: `1px solid ${COLORS.FN}22`, borderRadius: '10px', padding: '0.7rem',
          }}>
            <div style={{ color: COLORS.FN, fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.3rem' }}>
              🔇 Type II Error (False Negative)
            </div>
            <p style={{ color: COLORS.body, fontSize: '0.74rem', lineHeight: 1.55, margin: '0 0 0.4rem 0' }}>
              <strong style={{ color: COLORS.heading }}>Missed detection</strong> — predicting negative when it is actually positive.
            </p>
            <div style={{
              background: 'rgba(0,0,0,0.2)', borderRadius: '6px', padding: '0.45rem', fontSize: '0.7rem', color: COLORS.body, lineHeight: 1.5,
            }}>
              <strong style={{ color: COLORS.FN }}>Medical test example:</strong> A sick person is told they are healthy. Delays treatment and can be life-threatening.
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 6 — When to Use What Metric
          ═══════════════════════════════════════════════════════════════════════ */}
      <div style={cardStyle}>
        {sectionTitle('When to Use What Metric?', '🧭')}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            {
              metric: 'Accuracy',
              when: 'When classes are balanced',
              example: 'Equal number of spam vs non-spam emails',
              color: '#a78bfa',
              icon: '⚖️',
            },
            {
              metric: 'Precision',
              when: 'When false positives are costly',
              example: 'Spam detection — marking a real email as spam is bad',
              color: COLORS.TP,
              icon: '🎯',
            },
            {
              metric: 'Recall',
              when: 'When false negatives are costly',
              example: 'Disease detection — missing a sick patient is dangerous',
              color: '#38bdf8',
              icon: '🔍',
            },
            {
              metric: 'F1-Score',
              when: 'When you need balance between precision and recall',
              example: 'Fraud detection — both false alarms and missed fraud are costly',
              color: '#facc15',
              icon: '⚡',
            },
          ].map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              background: `${m.color}06`, border: `1px solid ${m.color}15`,
              borderRadius: '8px', padding: '0.55rem 0.7rem',
            }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                  <strong style={{ color: m.color, fontSize: '0.78rem' }}>{m.metric}</strong>
                  <span style={{ color: COLORS.secondary, fontSize: '0.68rem' }}>—</span>
                  <span style={{ color: COLORS.heading, fontSize: '0.75rem' }}>{m.when}</span>
                </div>
                <span style={{ color: COLORS.body, fontSize: '0.7rem' }}>Example: {m.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Section 7 — Python (sklearn) Code Example
          ═══════════════════════════════════════════════════════════════════════ */}
      <div style={cardStyle}>
        {sectionTitle('Python Implementation (sklearn)', '🐍')}
        <pre style={{
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          margin: 0,
          overflowX: 'auto',
          fontSize: '0.73rem',
          lineHeight: 1.7,
          color: COLORS.body,
          fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
        }}>
          <code>{`from sklearn.metrics import confusion_matrix, classification_report

# Example true and predicted labels
y_true = [1, 0, 1, 1, 0, 1, 0, 0, 1, 0]
y_pred = [1, 0, 1, 0, 0, 1, 1, 0, 1, 0]

# Generate confusion matrix
cm = confusion_matrix(y_true, y_pred)
print("Confusion Matrix:")
print(cm)
# Output:
#   [[TN, FP],
#    [FN, TP]]

# Get detailed classification report
report = classification_report(y_true, y_pred)
print("\\nClassification Report:")
print(report)`}</code>
        </pre>
        <p style={{ color: COLORS.secondary, fontSize: '0.68rem', marginTop: '0.5rem', marginBottom: 0, lineHeight: 1.5 }}>
          <strong style={{ color: COLORS.body }}>Note:</strong> sklearn outputs the matrix as [[TN, FP], [FN, TP]] by default.
          Use <code style={{ color: '#818cf8' }}>ConfusionMatrixDisplay</code> from <code style={{ color: '#818cf8' }}>sklearn.metrics</code> for built-in visualization.
        </p>
      </div>
    </div>
  );
}
