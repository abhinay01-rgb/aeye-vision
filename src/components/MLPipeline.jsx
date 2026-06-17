import React, { useState } from 'react';
import {
  GitMerge, CheckCircle, AlertTriangle, Zap, Shield, Repeat,
  Clock, Code2, ChevronRight, Package, FlaskConical, Cpu,
  ArrowRight, Play, BarChart3, Settings, Archive
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   CODE STRINGS
   ───────────────────────────────────────────────────────────────────────── */

const CODE_WITHOUT_TRAIN = `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.tree import DecisionTreeClassifier

df = pd.read_csv('train.csv')
df.drop(columns=['PassengerId','Name','Ticket','Cabin'], inplace=True)

# Step 1 — Train / Test Split
X_train, X_test, y_train, y_test = train_test_split(
    df.drop(columns=['Survived']), df['Survived'],
    test_size=0.2, random_state=42
)

# Step 2 — Imputation (Age=numeric, Embarked=categorical)
si_age      = SimpleImputer()
si_embarked = SimpleImputer(strategy='most_frequent')

X_train_age      = si_age.fit_transform(X_train[['Age']])
X_train_embarked = si_embarked.fit_transform(X_train[['Embarked']])
X_test_age       = si_age.transform(X_test[['Age']])         # ⚠️ .transform not .fit_transform!
X_test_embarked  = si_embarked.transform(X_test[['Embarked']])

# Step 3 — One-Hot Encode Sex + Embarked
ohe_sex      = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
ohe_embarked = OneHotEncoder(sparse_output=False, handle_unknown='ignore')

X_train_sex      = ohe_sex.fit_transform(X_train[['Sex']])
X_train_embarked = ohe_embarked.fit_transform(X_train_embarked)
X_test_sex       = ohe_sex.transform(X_test[['Sex']])
X_test_embarked  = ohe_embarked.transform(X_test_embarked)

# Step 4 — Manually drop transformed columns, concatenate
X_train_rem = X_train.drop(columns=['Sex','Age','Embarked'])
X_test_rem  = X_test.drop(columns=['Sex','Age','Embarked'])

X_train_final = np.concatenate(
    (X_train_rem, X_train_age, X_train_sex, X_train_embarked), axis=1
)
X_test_final = np.concatenate(
    (X_test_rem, X_test_age, X_test_sex, X_test_embarked), axis=1
)

# Step 5 — Train model
clf = DecisionTreeClassifier()
clf.fit(X_train_final, y_train)
y_pred = clf.predict(X_test_final)

from sklearn.metrics import accuracy_score
print("Accuracy:", accuracy_score(y_test, y_pred))

# Step 6 — Export 3 SEPARATE objects!
import pickle
pickle.dump(ohe_sex,      open('models/ohe_sex.pkl', 'wb'))
pickle.dump(ohe_embarked, open('models/ohe_embarked.pkl', 'wb'))
pickle.dump(clf,          open('models/clf.pkl', 'wb'))`;

const CODE_WITHOUT_PREDICT = `import pickle
import numpy as np

# Load 3 separate objects
ohe_sex      = pickle.load(open('models/ohe_sex.pkl', 'rb'))
ohe_embarked = pickle.load(open('models/ohe_embarked.pkl', 'rb'))
clf          = pickle.load(open('models/clf.pkl', 'rb'))

# User input: Pclass | Sex | Age | SibSp | Parch | Fare | Embarked
test_input = np.array(
    [2, 'male', 31.0, 0, 0, 10.5, 'S'], dtype=object
).reshape(1, 7)

# ❌ Must manually reproduce EVERY transformation step!
test_sex      = ohe_sex.transform(test_input[:, 1].reshape(1, 1))
test_embarked = ohe_embarked.transform(test_input[:, -1].reshape(1, 1))
test_age      = test_input[:, 2].reshape(1, 1)

test_final = np.concatenate(
    (test_input[:, [0, 3, 4, 5]], test_age, test_sex, test_embarked), axis=1
)

# Predict
print(clf.predict(test_final))  # [0] → Did not survive`;

const CODE_WITH_TRAIN = `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.feature_selection import SelectKBest, chi2
from sklearn.tree import DecisionTreeClassifier

df = pd.read_csv('train.csv')
df.drop(columns=['PassengerId','Name','Ticket','Cabin'], inplace=True)

X_train, X_test, y_train, y_test = train_test_split(
    df.drop(columns=['Survived']), df['Survived'],
    test_size=0.2, random_state=42
)

# ─── Build each transformer step ─────────────────────────────────────────────

# trf1: Imputation
trf1 = ColumnTransformer([
    ('impute_age',      SimpleImputer(),                           [2]),
    ('impute_embarked', SimpleImputer(strategy='most_frequent'),   [6])
], remainder='passthrough')

# trf2: One-Hot Encoding (after imputation indices shift)
trf2 = ColumnTransformer([
    ('ohe_sex_embarked', OneHotEncoder(sparse_output=False, handle_unknown='ignore'), [1, 6])
], remainder='passthrough')

# trf3: Scaling
trf3 = ColumnTransformer([
    ('scale', MinMaxScaler(), slice(0, 10))
])

# trf4: Feature Selection — keep best 8
trf4 = SelectKBest(score_func=chi2, k=8)

# trf5: Model
trf5 = DecisionTreeClassifier()

# ─── Assemble the Pipeline ───────────────────────────────────────────────────

pipe = Pipeline([
    ('trf1', trf1),
    ('trf2', trf2),
    ('trf3', trf3),
    ('trf4', trf4),
    ('trf5', trf5)
])

# Alternate: make_pipeline (auto-names steps, no naming required)
# pipe = make_pipeline(trf1, trf2, trf3, trf4, trf5)

# ─── Train ───────────────────────────────────────────────────────────────────
pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_test)

from sklearn.metrics import accuracy_score
print("Accuracy:", accuracy_score(y_test, y_pred))

# ─── Cross Validation ────────────────────────────────────────────────────────
from sklearn.model_selection import cross_val_score
cv = cross_val_score(pipe, X_train, y_train, cv=5, scoring='accuracy')
print(f"CV Mean: {cv.mean():.4f} ± {cv.std():.4f}")

# ─── GridSearch (tune model inside the Pipeline!) ────────────────────────────
from sklearn.model_selection import GridSearchCV
params = {'trf5__max_depth': [1, 2, 3, 4, 5, None]}
grid = GridSearchCV(pipe, params, cv=5, scoring='accuracy')
grid.fit(X_train, y_train)
print("Best Score:", grid.best_score_)
print("Best Params:", grid.best_params_)

# ─── Export — just ONE object! ───────────────────────────────────────────────
import pickle
pickle.dump(pipe, open('pipe.pkl', 'wb'))`;

const CODE_WITH_PREDICT = `import pickle
import numpy as np

# ✅ Load just ONE object
pipe = pickle.load(open('pipe.pkl', 'rb'))

# User input: Pclass | Sex | Age | SibSp | Parch | Fare | Embarked
test_input = np.array(
    [2, 'male', 31.0, 0, 0, 10.5, 'S'], dtype=object
).reshape(1, 7)

# ✅ One line — pipeline handles everything automatically!
print(pipe.predict(test_input))  # [0] → Did not survive`;

const CODE_PIPELINE_VS_MAKE = `# ── Option A: Pipeline (explicit step names) ──────────────────────────────
from sklearn.pipeline import Pipeline

pipe = Pipeline([
    ('trf1', trf1),   # Name → used in GridSearchCV param grid
    ('trf2', trf2),   # e.g. params = {'trf5__max_depth': [1,2,3]}
    ('trf3', trf3),
    ('trf4', trf4),
    ('trf5', trf5)
])

# Access steps by name:
pipe.named_steps['trf1']   # → ColumnTransformer (imputation)
pipe.named_steps['trf5']   # → DecisionTreeClassifier


# ── Option B: make_pipeline (auto-names steps) ────────────────────────────
from sklearn.pipeline import make_pipeline

pipe = make_pipeline(trf1, trf2, trf3, trf4, trf5)

# Auto-named as 'columntransformer', 'selectkbest', 'decisiontreeclassifier'
# GridSearch params: {'decisiontreeclassifier__max_depth': [1,2,3]}`;

/* ─────────────────────────────────────────────────────────────────────────────
   CodeBlock component
   ───────────────────────────────────────────────────────────────────────── */
function CodeBlock({ code, maxHeight = 480 }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');
  const highlighted = lines.map((line, i) => {
    const trimmed = line.trim();
    let color = '#e2e8f0';
    if (trimmed.startsWith('#')) color = '#64748b';
    else if (trimmed.startsWith('import') || trimmed.startsWith('from')) color = '#a5b4fc';
    else if (/\.(fit_transform|fit|transform|predict|score)\(/.test(line)) color = '#86efac';
    else if (/print\(/.test(line)) color = '#fbbf24';
    else if (/pickle\.(dump|load)/.test(line)) color = '#f9a8d4';
    else if (/GridSearchCV|cross_val_score/.test(line)) color = '#67e8f9';
    else if (/pipe\s*=|grid\s*=|clf\s*=|trf\d\s*=/.test(line)) color = '#c4b5fd';

    return (
      <div key={i} style={{ display: 'flex', padding: '0 1rem' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ minWidth: 36, color: '#334155', textAlign: 'right', paddingRight: '1.25rem', flexShrink: 0, userSelect: 'none', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.79rem', lineHeight: '1.65' }}>{i + 1}</span>
        <span style={{ color, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.79rem', lineHeight: '1.65', whiteSpace: 'pre' }}>{line || ' '}</span>
      </div>
    );
  });

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#080d18' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <span style={{ color: '#475569', fontSize: '0.72rem', fontFamily: 'JetBrains Mono, monospace' }}>python</span>
        <button onClick={handleCopy} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', padding: '0.2rem 0.65rem', borderRadius: 5, fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.28)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
        >{copied ? '✓ Copied' : 'Copy'}</button>
      </div>
      <div style={{ padding: '1rem 0', overflowX: 'auto', maxHeight, overflowY: 'auto' }}>
        {highlighted}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Pipeline Steps Flow
   ───────────────────────────────────────────────────────────────────────── */
const PIPE_STEPS = [
  { label: 'trf1', name: 'ColumnTransformer', detail: 'Impute Age (mean)\nImpute Embarked (mode)', color: '#fbbf24', icon: '🔧' },
  { label: 'trf2', name: 'ColumnTransformer', detail: 'OHE: Sex, Embarked\n→ binary columns', color: '#06b6d4', icon: '🔠' },
  { label: 'trf3', name: 'ColumnTransformer', detail: 'MinMaxScaler\nall numeric cols [0,1]', color: '#ec4899', icon: '📐' },
  { label: 'trf4', name: 'SelectKBest', detail: 'chi² test\nKeep top 8 features', color: '#8b5cf6', icon: '🎯' },
  { label: 'trf5', name: 'DecisionTree', detail: 'Fit & Predict\nSurvived: 0 or 1', color: '#10b981', icon: '🌳' },
];

function PipelineFlow() {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ overflowX: 'auto', padding: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', gap: 0 }}>
        {/* Raw data */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ background: 'rgba(71,85,105,0.25)', border: '2px dashed #475569', borderRadius: 10, padding: '0.6rem 0.9rem', minWidth: 90, textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>🚢</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Raw Data</div>
            <div style={{ fontSize: '0.65rem', color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>train.csv</div>
          </div>
        </div>

        {PIPE_STEPS.map((step, i) => (
          <React.Fragment key={i}>
            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
              <ChevronRight size={20} style={{ color: hovered === i ? step.color : '#334155', transition: 'color 0.2s' }} />
            </div>
            {/* Step card */}
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                cursor: 'default',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                background: hovered === i ? `${step.color}18` : 'rgba(15,23,42,0.9)',
                border: `2px solid ${hovered === i ? step.color : step.color + '55'}`,
                borderRadius: 12,
                padding: '0.65rem 0.85rem',
                minWidth: 105,
                textAlign: 'center',
                boxShadow: hovered === i ? `0 0 24px ${step.color}33` : 'none',
                transition: 'all 0.25s ease',
                transform: hovered === i ? 'translateY(-5px)' : 'translateY(0)',
              }}>
                <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{step.icon}</div>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{step.label}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#e2e8f0', marginTop: 2 }}>{step.name}</div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace', marginTop: 4, lineHeight: 1.4, whiteSpace: 'pre-line' }}>{step.detail}</div>
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Arrow to prediction */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
          <ChevronRight size={20} style={{ color: '#334155' }} />
        </div>
        {/* Output */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid #10b981', borderRadius: 10, padding: '0.6rem 0.9rem', minWidth: 90, textAlign: 'center', boxShadow: '0 0 18px rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>🎯</div>
            <div style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>Prediction</div>
            <div style={{ fontSize: '0.7rem', color: '#4ade80', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>Survived: 0/1</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Export Comparison
   ───────────────────────────────────────────────────────────────────────── */
function ExportComparison() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
      {/* Without Pipeline */}
      <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 14, padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <AlertTriangle size={16} style={{ color: '#ef4444' }} />
          <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>Without Pipeline</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { file: 'ohe_sex.pkl', size: '~2 KB', icon: '📦' },
            { file: 'ohe_embarked.pkl', size: '~2 KB', icon: '📦' },
            { file: 'clf.pkl', size: '~12 KB', icon: '📦' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(239,68,68,0.06)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                <span style={{ color: '#fca5a5', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>{f.file}</span>
              </div>
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{f.size}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: 8, fontSize: '0.78rem', color: '#f87171' }}>
            ❌ 3 files — must load ALL in correct order at prediction time
          </div>
        </div>
      </div>

      {/* With Pipeline */}
      <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 14, padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
          <CheckCircle size={16} style={{ color: '#10b981' }} />
          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>With Pipeline</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16,185,129,0.08)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1rem' }}>🗜️</span>
              <span style={{ color: '#6ee7b7', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>pipe.pkl</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>~16 KB</span>
          </div>
          <div style={{ marginTop: 8, padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.08)', borderRadius: 8, fontSize: '0.78rem', color: '#4ade80' }}>
            ✅ 1 file — contains ALL steps. Load &amp; predict in 2 lines.
          </div>
          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.05)', borderRadius: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#86efac' }}>
            pipe.predict(test_input)
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Stat cards
   ───────────────────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Training Lines',    without: '~35 lines', with: '~20 lines', icon: Code2,      color: '#6366f1' },
  { label: 'Prediction Lines',  without: '~12 lines', with: '2 lines',   icon: Play,       color: '#10b981' },
  { label: 'Pickle Files',      without: '3 files',   with: '1 file',    icon: Archive,    color: '#f59e0b' },
  { label: 'CV / GridSearch',   without: '❌ Manual', with: '✅ Native', icon: BarChart3,  color: '#ec4899' },
  { label: 'Data Leakage Risk', without: '🔴 High',   with: '🟢 None',   icon: Shield,     color: '#38bdf8' },
  { label: 'Hyperparameter Tuning', without: '❌ Complex', with: '✅ pipe__step__param', icon: Settings, color: '#8b5cf6' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────────────────── */
export default function MLPipeline() {
  const [mainTab, setMainTab] = useState('without'); // 'without' | 'with'
  const [subTab, setSubTab]   = useState('train');   // 'train' | 'predict'
  const [pipeVsMake, setPipeVsMake] = useState(false);

  return (
    <div className="tab-layout-container fade-in">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="hero-section" style={{ paddingBottom: '1.5rem' }}>
        <div className="hero-badge" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.28)', color: '#818cf8' }}>
          <GitMerge size={12} />
          <span>sklearn.pipeline · Titanic Dataset</span>
        </div>
        <h2 className="hero-title">ML Pipeline — End-to-End</h2>
        <p className="hero-subtitle">
          Build a complete Titanic survival predictor using the manual approach vs a clean <strong style={{ color: '#818cf8' }}>sklearn Pipeline</strong>.
          See exactly why pipelines prevent data leakage, simplify cross-validation, and make deployment trivial.
        </p>
      </div>

      {/* ── Dataset Overview ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '2.5rem' }}>
        {[
          { icon: '🚢', label: 'Dataset',  value: 'Titanic train.csv' },
          { icon: '🎯', label: 'Target',   value: 'Survived (0 / 1)' },
          { icon: '📋', label: 'Features', value: 'Pclass, Sex, Age, SibSp, Parch, Fare, Embarked' },
          { icon: '🗑️', label: 'Dropped',  value: 'PassengerId, Name, Ticket, Cabin' },
          { icon: '🌳', label: 'Model',    value: 'DecisionTreeClassifier' },
        ].map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '0.9rem 1rem' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 6 }}>{item.icon}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>{item.label}</div>
            <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* ── Pipeline Visual Flow ──────────────────────────────────────────── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
          <Zap size={16} style={{ color: '#6366f1' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Pipeline Architecture — 5 Steps</h3>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem' }}>
          Hover over each step to see what it does. Data flows left → right through each transformer automatically.
        </p>
        <PipelineFlow />
      </div>

      {/* ── Stats Comparison Strip ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '2.5rem' }}>
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={14} style={{ color: s.color }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div style={{ background: 'rgba(239,68,68,0.07)', borderRadius: 7, padding: '0.4rem 0.5rem' }}>
                  <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 700, marginBottom: 2 }}>WITHOUT</div>
                  <div style={{ fontSize: '0.78rem', color: '#fca5a5', fontFamily: 'JetBrains Mono, monospace' }}>{s.without}</div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.07)', borderRadius: 7, padding: '0.4rem 0.5rem' }}>
                  <div style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 700, marginBottom: 2 }}>WITH</div>
                  <div style={{ fontSize: '0.78rem', color: '#6ee7b7', fontFamily: 'JetBrains Mono, monospace' }}>{s.with}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Code Tabs ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', marginBottom: '2.5rem' }}>

        {/* Main tab bar: Without / With */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }}>
          {[
            { id: 'without', label: '❌  Without Pipeline  (Aam Zindagi)',    color: '#ef4444' },
            { id: 'with',    label: '✅  With Pipeline  (Mentos Zindagi)',    color: '#10b981' },
          ].map(t => (
            <button key={t.id} onClick={() => { setMainTab(t.id); setSubTab('train'); }}
              style={{ flex: 1, padding: '0.9rem 1.5rem', background: 'transparent', border: 'none', borderBottom: mainTab === t.id ? `3px solid ${t.color}` : '3px solid transparent', color: mainTab === t.id ? t.color : '#64748b', fontWeight: mainTab === t.id ? 700 : 500, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
            >{t.label}</button>
          ))}
        </div>

        {/* Sub-tab bar: Train / Predict */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.12)', padding: '0 1.5rem' }}>
          {[
            { id: 'train',   label: '🏋️  Training Code',    icon: FlaskConical },
            { id: 'predict', label: '🔮  Prediction Code',  icon: Cpu },
          ].map(t => (
            <button key={t.id} onClick={() => setSubTab(t.id)}
              style={{ padding: '0.55rem 1.1rem', background: 'transparent', border: 'none', borderBottom: subTab === t.id ? '2px solid #818cf8' : '2px solid transparent', color: subTab === t.id ? '#a5b4fc' : '#475569', fontWeight: subTab === t.id ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
            >{t.label}</button>
          ))}
        </div>

        {/* Code content */}
        <div style={{ padding: '1.5rem' }}>
          {mainTab === 'without' && subTab === 'train' && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={15} style={{ color: '#ef4444' }} />
                  <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.88rem' }}>Manual Approach — 35+ lines, 3 separate fit/transform blocks</span>
                </div>
                <a
                  href="https://colab.research.google.com/drive/1znfwCbxaaElW71CoqMy4me-dts8ioxrs"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'; }}
                >
                  <span>📓 Open in Google Colab</span>
                  <ArrowRight size={12} />
                </a>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                Every transformer must be manually fit on train and applied to test separately.
                The slightest mistake (using <code style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '1px 4px', borderRadius: 3 }}>.fit_transform()</code> on test data instead of <code style={{ color: '#86efac', background: 'rgba(134,239,172,0.1)', padding: '1px 4px', borderRadius: 3 }}>.transform()</code>) causes silent <strong style={{ color: '#ef4444' }}>data leakage</strong>.
              </p>
              <CodeBlock code={CODE_WITHOUT_TRAIN} maxHeight={500} />
            </div>
          )}
          {mainTab === 'without' && subTab === 'predict' && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
                  <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem' }}>Prediction — Must manually replay every transformation step</span>
                </div>
                <a
                  href="https://colab.research.google.com/drive/1rJY25P-VAx9qmG-_p26ZvaibzxWnmVLK?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#f59e0b',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.16)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.08)'; }}
                >
                  <span>📓 Open in Google Colab</span>
                  <ArrowRight size={12} />
                </a>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                At inference time you must load <strong>3 separate pickle files</strong> and manually apply each transformation in the exact correct order.
                Forgetting one step breaks the prediction silently.
              </p>
              <CodeBlock code={CODE_WITHOUT_PREDICT} maxHeight={400} />
            </div>
          )}
          {mainTab === 'with' && subTab === 'train' && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={15} style={{ color: '#10b981' }} />
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.88rem' }}>Full sklearn Pipeline — includes CV, GridSearch &amp; Export</span>
                </div>
                <a
                  href="https://colab.research.google.com/drive/1Sa4Iw3q8WheaFHGg3F97ioTVObSb7dKk?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.16)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'; }}
                >
                  <span>📓 Open in Google Colab</span>
                  <ArrowRight size={12} />
                </a>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                All 5 steps are chained into <code style={{ color: '#a5b4fc', background: 'rgba(165,180,252,0.1)', padding: '1px 4px', borderRadius: 3 }}>pipe</code>. A single <code style={{ color: '#86efac' }}>pipe.fit(X_train, y_train)</code> runs all preprocessing + training.
                Cross-validation and GridSearchCV work <strong style={{ color: '#10b981' }}>natively and leak-free</strong>.
              </p>
              <CodeBlock code={CODE_WITH_TRAIN} maxHeight={500} />
            </div>
          )}
          {mainTab === 'with' && subTab === 'predict' && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={15} style={{ color: '#10b981' }} />
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.88rem' }}>Prediction — 2 lines total 🚀</span>
                </div>
                <a
                  href="https://colab.research.google.com/drive/17BX6wK6sjlMvzOcrlyLvoKKC0APIi-Vf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.16)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)'; }}
                >
                  <span>📓 Open in Google Colab</span>
                  <ArrowRight size={12} />
                </a>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.6 }}>
                Load <strong>1 pickle file</strong>. Call <code style={{ color: '#86efac', background: 'rgba(134,239,172,0.1)', padding: '1px 4px', borderRadius: 3 }}>pipe.predict()</code>. Done. The pipeline automatically applies every transformation in the correct order.
              </p>
              <CodeBlock code={CODE_WITH_PREDICT} maxHeight={300} />
            </div>
          )}
        </div>
      </div>

      {/* ── Pipeline vs make_pipeline ──────────────────────────────────── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', marginBottom: '2.5rem' }}>
        <button
          onClick={() => setPipeVsMake(v => !v)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package size={16} style={{ color: '#8b5cf6' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0' }}>Pipeline vs make_pipeline — What's the Difference?</span>
          </div>
          <ChevronRight size={18} style={{ color: '#475569', transform: pipeVsMake ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.25s' }} />
        </button>
        {pipeVsMake && (
          <div style={{ padding: '0 1.5rem 1.5rem' }} className="fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                { title: 'Pipeline', color: '#6366f1', icon: '🏗️', points: ['Requires explicit step names', 'Access via pipe.named_steps["name"]', 'GridSearch: "stepname__param"', 'More readable & explicit'] },
                { title: 'make_pipeline', color: '#8b5cf6', icon: '⚡', points: ['Auto-generates step names', 'Names = lowercase class names', 'GridSearch: "classname__param"', 'Shorter syntax, less control'] },
              ].map((col, i) => (
                <div key={i} style={{ background: `${col.color}08`, border: `1px solid ${col.color}25`, borderRadius: 12, padding: '1rem' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>{col.icon}</div>
                  <div style={{ fontWeight: 700, color: col.color, fontSize: '0.9rem', marginBottom: '0.75rem' }}>{col.title}</div>
                  {col.points.map((p, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.8rem', color: '#94a3b8', marginBottom: 5 }}>
                      <ArrowRight size={11} style={{ color: col.color, marginTop: 3, flexShrink: 0 }} />
                      {p}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <CodeBlock code={CODE_PIPELINE_VS_MAKE} maxHeight={360} />
          </div>
        )}
      </div>

      {/* ── Export Comparison ──────────────────────────────────────────── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
          <Archive size={16} style={{ color: '#f59e0b' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Model Export &amp; Deployment Comparison</h3>
        </div>
        <ExportComparison />
      </div>

      {/* ── Key Takeaways ──────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(16,185,129,0.06))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
          <Zap size={16} style={{ color: '#818cf8' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Key Takeaways</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {[
            { icon: Shield,     color: '#38bdf8', title: 'No Data Leakage',       desc: 'fit() is called only on training data, even inside cross-validation folds.' },
            { icon: Repeat,     color: '#10b981', title: 'CV & GridSearch Ready',  desc: 'cross_val_score and GridSearchCV work natively — no manual fold management.' },
            { icon: Archive,    color: '#f59e0b', title: 'One-file Deployment',    desc: 'pickle.dump(pipe) saves everything. One load, one predict call.' },
            { icon: Settings,   color: '#8b5cf6', title: 'Hyperparameter Tuning', desc: 'Tune any step param: {"trf5__max_depth": [1,2,3,None]}' },
            { icon: Code2,      color: '#ec4899', title: 'Cleaner Code',          desc: 'From 35 error-prone lines to ~20 clean, readable, maintainable lines.' },
            { icon: Clock,      color: '#6366f1', title: 'Reproducible',          desc: 'Same pipeline object guarantees identical transforms every time, everywhere.' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ padding: '0.4rem', background: `${item.color}15`, borderRadius: 8, flexShrink: 0 }}>
                  <Icon size={15} style={{ color: item.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
