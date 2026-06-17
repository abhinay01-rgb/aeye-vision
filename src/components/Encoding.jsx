import React, { useState } from 'react';
import { Tag, Binary, Hash, BarChart3, Database, Copy, Check, GitCommit, Crosshair, Target, AlignLeft, Layers, ArrowRight, BookOpen } from 'lucide-react';

/* ── Code Snippet Component ───────────────────────────────────────────────── */
const CodeSnippet = ({ code, color = '#6366f1' }) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-snippet-box" style={{ marginTop: '1rem', border: `1px solid ${color}40` }}>
      <div className="code-header" style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
        <span style={{ color, fontWeight: 600 }}>Python Code + Output</span>
        <button className={`btn btn-copy ${copied ? 'copied' : ''}`} onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="pre-code" style={{ margin: 0, border: 'none', background: 'transparent' }}><code>{code}</code></pre>
    </div>
  );
};

/* ── Before / After Table Component ──────────────────────────────────────── */
const BeforeAfter = ({ before, after, color }) => (
  <div style={{ display: 'flex', gap: '1.5rem', margin: '1.2rem 0', flexWrap: 'wrap' }}>
    <div style={{ flex: 1, minWidth: '180px' }}>
      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Before</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <tbody>
          {before.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', background: 'rgba(255,255,255,0.03)', fontWeight: j === 0 && row.length > 1 ? 600 : 'normal' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', color: color }}>
      <ArrowRight size={24} />
    </div>
    <div style={{ flex: 1, minWidth: '180px' }}>
      <div style={{ fontSize: '0.75rem', color: color, marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>After Encoding</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <tbody>
          {after.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: i === 0 ? '#cbd5e1' : color, background: i === 0 ? 'rgba(255,255,255,0.06)' : `${color}10`, fontWeight: i === 0 ? 700 : 'normal' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ── Main Encoding Config ─────────────────────────────────────────────────── */
const ENCODINGS = [
  {
    key: 'label',
    name: 'Label Encoding',
    icon: Tag,
    color: '#6366f1',
    type: 'Basic',
    desc: 'Assigns a unique integer to each category. Simple and fast, but creates a false numeric order among unrelated categories.',
    bestFor: 'Binary categories (Yes/No, Male/Female) or when using tree-based models (Random Forest, XGBoost) that are immune to false ordering.',
    avoidWhen: 'Nominal data with 3+ categories in distance-based models (KNN, SVM) — the algorithm will wrongly assume Green > Blue > Red.',
    example: {
      concept: `We have a Gender column with Male and Female.\nLabelEncoder scans all unique values alphabetically,\nthen assigns each an integer starting from 0.\n\n  Female → 0\n  Male   → 1`,
      before: [['Gender'], ['Male'], ['Female'], ['Male'], ['Male'], ['Female']],
      after: [['Gender'], ['1'], ['0'], ['1'], ['1'], ['0']],
    },
    code: `import pandas as pd
from sklearn.preprocessing import LabelEncoder

df = pd.DataFrame({'Gender': ['Male', 'Female', 'Male', 'Male', 'Female']})

le = LabelEncoder()
df['Gender'] = le.fit_transform(df['Gender'])

print(df)

# Output:
#    Gender
# 0       1
# 1       0
# 2       1
# 3       1
# 4       0

# Check the class mapping:
print(dict(zip(le.classes_, le.transform(le.classes_))))
# {'Female': 0, 'Male': 1}`
  },
  {
    key: 'ordinal',
    name: 'Ordinal Encoding',
    icon: AlignLeft,
    color: '#f59e0b',
    type: 'Basic',
    desc: 'Assigns ordered integers to categories where a natural rank exists. You explicitly define the order so the math correctly reflects reality.',
    bestFor: 'Education Level, Ratings (Low/Med/High), Experience Level (Beginner/Expert).',
    avoidWhen: 'Nominal data — any data where no real-world ordering exists between categories.',
    example: {
      concept: `Education has a natural rank order:\n  High School < Graduate < Post Graduate < PhD\n\nWe map them to integers that preserve this order:\n  High School  → 0\n  Graduate     → 1\n  Post Graduate→ 2\n  PhD          → 3`,
      before: [['Education'], ['Graduate'], ['PhD'], ['High School'], ['Post Graduate'], ['Graduate']],
      after: [['Education'], ['1'], ['3'], ['0'], ['2'], ['1']],
    },
    code: `import pandas as pd
from sklearn.preprocessing import OrdinalEncoder

df = pd.DataFrame({'Education': ['Graduate', 'PhD', 'High School', 'Post Graduate', 'Graduate']})

# You MUST specify the order explicitly
encoder = OrdinalEncoder(categories=[['High School', 'Graduate', 'Post Graduate', 'PhD']])
df[['Education']] = encoder.fit_transform(df[['Education']])

print(df)

# Output:
#    Education
# 0        1.0
# 1        3.0
# 2        0.0
# 3        2.0
# 4        1.0`
  },
  {
    key: 'onehot',
    name: 'One-Hot Encoding',
    icon: Layers,
    color: '#06b6d4',
    type: 'Basic',
    desc: 'Creates a new binary column for every unique category. The original column is replaced by a matrix of 1s and 0s. Most widely used method.',
    bestFor: 'Nominal data with fewer than 15 unique categories (Color, Department, Payment Method).',
    avoidWhen: 'High cardinality columns (e.g., 500 cities = 500 new columns → Curse of Dimensionality).',
    example: {
      concept: `We have 3 colors: Red, Blue, Green.\nOne-Hot creates 3 separate columns, one per color.\nFor each row, only the matching column is 1, all others are 0.\n\n  Red  → [1, 0, 0]\n  Blue → [0, 1, 0]\n  Green→ [0, 0, 1]`,
      before: [['Color'], ['Red'], ['Blue'], ['Green'], ['Red'], ['Blue']],
      after: [['Color_Blue', 'Color_Green', 'Color_Red'], ['0', '0', '1'], ['1', '0', '0'], ['0', '1', '0'], ['0', '0', '1'], ['1', '0', '0']],
    },
    code: `import pandas as pd
from sklearn.preprocessing import OneHotEncoder

df = pd.DataFrame({'Color': ['Red', 'Blue', 'Green', 'Red', 'Blue']})

# --- Pandas Method (easier) ---
df_encoded = pd.get_dummies(df, columns=['Color'])
print(df_encoded)
# Output:
#    Color_Blue  Color_Green  Color_Red
# 0       False        False       True
# 1        True        False      False
# 2       False         True      False

# --- Scikit-Learn Method ---
enc = OneHotEncoder(sparse_output=False)
result = enc.fit_transform(df[['Color']])
print(enc.get_feature_names_out())  # ['Color_Blue' 'Color_Green' 'Color_Red']`
  },
  {
    key: 'dummy',
    name: 'Dummy Encoding',
    icon: GitCommit,
    color: '#ec4899',
    type: 'Basic',
    desc: 'Identical to One-Hot Encoding, but drops one column. This avoids the "Dummy Variable Trap" — a multicollinearity issue in regression models.',
    bestFor: 'Linear Regression, Logistic Regression. If you know one column\'s value, you can always infer the dropped column.',
    avoidWhen: 'Tree-based models don\'t need this. Only drop_first for regression.',
    example: {
      concept: `Gender has 2 categories: Male and Female.\nOne-Hot creates both columns:\n  Male column and Female column.\n\nBut if Male=0, we KNOW it is Female.\nDropping the Female column eliminates the redundancy.\n\n  Male=1   → was Male\n  Male=0   → was Female (inferred)`,
      before: [['Gender'], ['Male'], ['Female'], ['Male'], ['Female']],
      after: [['Gender_Male'], ['1'], ['0'], ['1'], ['0']],
    },
    code: `import pandas as pd

df = pd.DataFrame({'Gender': ['Male', 'Female', 'Male', 'Female']})

# drop_first=True removes the first category (Female)
df_encoded = pd.get_dummies(df, columns=['Gender'], drop_first=True)
print(df_encoded)

# Output:
#    Gender_Male
# 0            1
# 1            0
# 2            1
# 3            0

# For multiple categories (e.g., Color):
# Red, Blue, Green → drops Blue (first alphabetically)
# Remaining columns: Color_Green, Color_Red`
  },
  {
    key: 'frequency',
    name: 'Frequency / Count Encoding',
    icon: BarChart3,
    color: '#8b5cf6',
    type: 'Advanced',
    desc: 'Replaces each category with the number of times it appears in the dataset. High frequency → high encoded value.',
    bestFor: 'High cardinality features where frequency itself is informative (popular products, top cities).',
    avoidWhen: 'Two categories with the same count become indistinguishable (collision problem).',
    example: {
      concept: `In a City column, count how many times each city appears:\n  Delhi  appears 3 times → replace with 3\n  Mumbai appears 2 times → replace with 2\n  Agra   appears 1 time  → replace with 1\n\nThe encoding now carries the "popularity" signal.`,
      before: [['City'], ['Delhi'], ['Mumbai'], ['Delhi'], ['Agra'], ['Delhi'], ['Mumbai']],
      after: [['City'], ['3'], ['2'], ['3'], ['1'], ['3'], ['2']],
    },
    code: `import pandas as pd

df = pd.DataFrame({'City': ['Delhi', 'Mumbai', 'Delhi', 'Agra', 'Delhi', 'Mumbai']})

# Step 1: Compute frequency map
freq_map = df['City'].value_counts()
print(freq_map)
# Delhi     3
# Mumbai    2
# Agra      1

# Step 2: Map frequencies back to original column
df['City'] = df['City'].map(freq_map)
print(df)

# Output:
#    City
# 0     3
# 1     2
# 2     3
# 3     1
# 4     3
# 5     2`
  },
  {
    key: 'target',
    name: 'Target Encoding',
    icon: Target,
    color: '#f43f5e',
    type: 'Advanced',
    desc: 'Replaces each category with the MEAN of the target variable for all rows sharing that category. Very powerful for correlated features.',
    bestFor: 'High cardinality features with strong correlation to the target (e.g., City → Salary).',
    avoidWhen: 'Small datasets — high risk of data leakage. Always use within cross-validation folds.',
    example: {
      concept: `We have City and Salary. For each city, we calculate\nthe average (mean) salary of all employees in that city:\n\n  Delhi : (50k + 60k) / 2 = 55k → replace with 55\n  Agra  : (30k) / 1 = 30k       → replace with 30\n  Mumbai: (70k) / 1 = 70k       → replace with 70`,
      before: [['City', 'Salary'], ['Delhi', '50k'], ['Delhi', '60k'], ['Agra', '30k'], ['Mumbai', '70k']],
      after: [['City', 'Salary'], ['55', '50k'], ['55', '60k'], ['30', '30k'], ['70', '70k']],
    },
    code: `import pandas as pd
from category_encoders import TargetEncoder

df = pd.DataFrame({
    'City':   ['Delhi', 'Delhi', 'Agra', 'Mumbai'],
    'Salary': [50000, 60000, 30000, 70000]
})

# --- Manual Pandas Method ---
target_mean = df.groupby('City')['Salary'].mean()
df['City_Encoded'] = df['City'].map(target_mean)
print(df)

# Output:
#      City  Salary  City_Encoded
# 0   Delhi   50000         55000
# 1   Delhi   60000         55000
# 2    Agra   30000         30000
# 3  Mumbai   70000         70000

# --- Scikit-Learn Method (with smoothing to reduce overfitting) ---
enc = TargetEncoder(cols=['City'])
df['City'] = enc.fit_transform(df['City'], df['Salary'])`
  },
  {
    key: 'binary',
    name: 'Binary Encoding',
    icon: Binary,
    color: '#10b981',
    type: 'Advanced',
    desc: 'Converts each category to an integer, then converts that integer to its binary representation, splitting each bit into a separate column.',
    bestFor: 'Large cardinality (100–10,000 categories). Uses far fewer columns than One-Hot: log₂(n) columns instead of n.',
    avoidWhen: 'Small datasets or very few categories (the overhead is not worth it).',
    example: {
      concept: `Step 1: Assign integer to each city:\n  Delhi  = 1 → binary: 001\n  Mumbai = 2 → binary: 010\n  Agra   = 3 → binary: 011\n  Noida  = 4 → binary: 100\n\nStep 2: Each bit becomes a column (only 3 cols for 4 cities!)\nOne-Hot would need 4 columns. Binary needs only 3.`,
      before: [['City'], ['Delhi'], ['Mumbai'], ['Agra'], ['Noida']],
      after: [['bit_1', 'bit_2', 'bit_3'], ['0', '0', '1'], ['0', '1', '0'], ['0', '1', '1'], ['1', '0', '0']],
    },
    code: `import pandas as pd
from category_encoders import BinaryEncoder

df = pd.DataFrame({'City': ['Delhi', 'Mumbai', 'Agra', 'Noida']})

# category_encoders handles everything automatically
encoder = BinaryEncoder(cols=['City'])
df_encoded = encoder.fit_transform(df)

print(df_encoded)

# Output:
#    City_0  City_1  City_2
# 0       0       0       1   ← Delhi  = 1 = 001
# 1       0       1       0   ← Mumbai = 2 = 010
# 2       0       1       1   ← Agra   = 3 = 011
# 3       1       0       0   ← Noida  = 4 = 100

# 4 cities → only 3 columns! (One-Hot would need 4 columns)`
  },
  {
    key: 'hash',
    name: 'Hash Encoding',
    icon: Hash,
    color: '#3b82f6',
    type: 'Advanced',
    desc: 'Uses a hashing function to map any category (even unseen ones) to a fixed number of output columns. Memory-efficient for Big Data.',
    bestFor: 'Massive scale (1000+ or even millions of categories): user IDs, IP addresses, URLs, ZIP codes.',
    avoidWhen: 'Small datasets — Hash collisions (two different values mapped to same output) can corrupt data.',
    example: {
      concept: `With 1000 cities, One-Hot creates 1000 columns.\nHash Encoding fixes the output to just 8 columns\nregardless of how many categories exist.\n\nhash("Delhi")  mod 8 → column 3\nhash("Mumbai") mod 8 → column 6\nhash("Agra")   mod 8 → column 1\n(Exact output depends on hashing algorithm)`,
      before: [['City'], ['Delhi'], ['Mumbai'], ['Agra'], ['Noida'], ['Jaipur']],
      after: [['h0','h1','h2','h3','h4','h5','h6','h7'], ['0','0','0','1','0','0','0','0'], ['0','0','0','0','0','0','1','0'], ['0','1','0','0','0','0','0','0'], ['0','0','1','0','0','0','0','0'], ['0','0','0','0','1','0','0','0']],
    },
    code: `import pandas as pd
from category_encoders import HashingEncoder

df = pd.DataFrame({'City': ['Delhi', 'Mumbai', 'Agra', 'Noida', 'Jaipur']})

# n_components = number of output columns (fixed!)
encoder = HashingEncoder(cols=['City'], n_components=8)
df_encoded = encoder.fit_transform(df)

print(df_encoded)

# Output (8 columns regardless of how many cities):
#    col_0  col_1  col_2  col_3  ...
# 0      0      0      0      1  ...   (Delhi)
# 1      0      0      0      0  ...   (Mumbai)
# 2      0      1      0      0  ...   (Agra)

# KEY ADVANTAGE: Works on NEW categories at test time (no error!)`
  },
  {
    key: 'rare',
    name: 'Rare Category Encoding',
    icon: Crosshair,
    color: '#eab308',
    type: 'Advanced',
    desc: 'Groups all low-frequency (rare) categories into a single "Other" bucket before applying other encoding. Reduces noise.',
    bestFor: 'Any dataset with a long tail of rare categories (typos, obscure values, low-frequency classes).',
    avoidWhen: 'When rare categories carry the most predictive signal (e.g., rare disease codes).',
    example: {
      concept: `We have 6 cities but Delhi and Mumbai appear often.\nAgra, Noida, Jaipur, Bhopal each appear only once.\n\nThreshold: if count < 2, mark as "Other".\n\n  Delhi  → 5 times → Keep as "Delhi"\n  Mumbai → 3 times → Keep as "Mumbai"\n  Agra, Noida, Jaipur, Bhopal → "Other"`,
      before: [['City'], ['Delhi'], ['Mumbai'], ['Agra'], ['Delhi'], ['Noida'], ['Delhi'], ['Jaipur'], ['Mumbai'], ['Delhi']],
      after: [['City'], ['Delhi'], ['Mumbai'], ['Other'], ['Delhi'], ['Other'], ['Delhi'], ['Other'], ['Mumbai'], ['Delhi']],
    },
    code: `import pandas as pd

df = pd.DataFrame({
    'City': ['Delhi','Mumbai','Agra','Delhi','Noida','Delhi','Jaipur','Mumbai','Delhi']
})

# Step 1: Count frequencies
freq = df['City'].value_counts()
print(freq)
# Delhi     4
# Mumbai    2
# Agra      1
# Noida     1
# Jaipur    1

# Step 2: Find rare categories (count < 2)
rare_categories = freq[freq < 2].index
print(rare_categories)  # ['Agra', 'Noida', 'Jaipur']

# Step 3: Replace rare categories with 'Other'
df['City'] = df['City'].replace(rare_categories, 'Other')
print(df)

# Output:
#      City
# 0   Delhi
# 1  Mumbai
# 2   Other
# 3   Delhi
# 4   Other
# 5   Delhi
# 6   Other
# 7  Mumbai
# 8   Delhi`
  },
];

/* ── Expanded Method Card ─────────────────────────────────────────────────── */
const MethodCard = ({ enc }) => {
  const [open, setOpen] = useState(false);
  const Icon = enc.icon;
  return (
    <div className="premium-card" style={{ borderTop: `4px solid ${enc.color}`, marginBottom: '1.5rem', cursor: 'default' }}>
      <div className="premium-card-header" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div className="premium-card-title">
          <div className="premium-icon-wrap" style={{ background: `${enc.color}20`, color: enc.color }}>
            <Icon size={20} />
          </div>
          <h3 style={{ flex: 1, margin: 0 }}>{enc.name}</h3>
          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: `${enc.color}20`, color: enc.color, fontWeight: 700, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{enc.type}</span>
          <span style={{ color: '#64748b', marginLeft: '1rem', fontSize: '1.2rem', lineHeight: 1 }}>{open ? '▲' : '▼'}</span>
        </div>
      </div>
      <div className="premium-card-body">
        <p className="premium-desc">{enc.desc}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.6rem', fontSize: '0.9rem' }}>
          <div><span style={{ color: '#10b981', fontWeight: 600 }}>✅ Best For: </span><span style={{ color: '#cbd5e1' }}>{enc.bestFor}</span></div>
          <div><span style={{ color: '#f43f5e', fontWeight: 600 }}>❌ Avoid When: </span><span style={{ color: '#cbd5e1' }}>{enc.avoidWhen}</span></div>
        </div>

        {open && (
          <div className="fade-in" style={{ marginTop: '1.5rem', borderTop: `1px solid ${enc.color}30`, paddingTop: '1.5rem' }}>
            
            {/* Concept Block */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <BookOpen size={15} style={{ color: enc.color }} />
                <span style={{ color: enc.color, fontWeight: 700, fontSize: '0.95rem' }}>How it Works</span>
              </div>
              <pre style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', whiteSpace: 'pre-wrap', lineHeight: 1.7, margin: 0, border: `1px solid ${enc.color}20` }}>
                {enc.example.concept}
              </pre>
            </div>

            {/* Before / After */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: enc.color, fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>Before → After</div>
              <BeforeAfter before={enc.example.before} after={enc.example.after} color={enc.color} />
            </div>

            {/* Code */}
            <CodeSnippet code={enc.code} color={enc.color} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────────────────────── */
export default function Encoding() {
  const [activeTab, setActiveTab] = useState('methods');

  const tabs = [
    { id: 'overview', label: '1. Concepts & Overview' },
    { id: 'decision', label: '2. Decision Flowchart' },
    { id: 'methods', label: '3. All Encoding Techniques' },
    { id: 'interactive', label: '4. Quick Reference' },
  ];

  return (
    <div className="tab-layout-container">
      <div className="sub-nav-links">
        {tabs.map(t => (
          <button key={t.id} className={`sub-nav-link ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div className="sub-tab-content" style={{ marginTop: '1.5rem' }}>

        {/* ─── TAB 1: OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="tab-content fade-in">
            <div className="hero-section" style={{ paddingTop: '0' }}>
              <h2 className="hero-title">Categorical Encoding</h2>
              <p className="hero-subtitle">Computers understand numbers, not text. Encoding converts text-based categorical data into numerical matrices so ML models can learn from them.</p>
            </div>
            <div className="section-block">
              <h3 className="section-title-sub">The Two Types of Categorical Data</h3>
              <div className="analysis-grid">
                <div className="analysis-card" style={{ borderLeft: '3px solid #6366f1' }}>
                  <div className="analysis-name" style={{ color: '#6366f1' }}>Nominal Data (No Order)</div>
                  <div className="analysis-note">
                    <strong>No mathematical order exists.</strong><br/><br/>
                    <em>Examples:</em> Color, City, Gender, Brand.<br/><br/>
                    <span style={{color:'#f43f5e'}}>⚠ Warning:</span> Never use plain integers (Red=1, Blue=2). Model will assume Blue &gt; Red which is meaningless!
                  </div>
                </div>
                <div className="analysis-card" style={{ borderLeft: '3px solid #f59e0b' }}>
                  <div className="analysis-name" style={{ color: '#f59e0b' }}>Ordinal Data (Has Order)</div>
                  <div className="analysis-note">
                    <strong>A real-world rank exists between categories.</strong><br/><br/>
                    <em>Examples:</em> Education (HS &lt; Grad &lt; PhD), Rating (Low &lt; Med &lt; High).<br/><br/>
                    <span style={{color:'#10b981'}}>✅ Safe:</span> Numeric mapping is valid because the math order matches reality.
                  </div>
                </div>
              </div>
            </div>
            <div className="section-block">
              <h3 className="section-title-sub" style={{color:'#ec4899'}}>⚡ The Curse of Dimensionality</h3>
              <p className="tutorial-paragraph">When One-Hot Encoding is applied to a column with many unique categories (high cardinality), each category spawns a new column. A "City" column with 5,000 unique cities creates 5,000 new columns — exploding memory, slowing training, and causing overfitting. For high cardinality, switch to Frequency, Binary, or Hash encoding.</p>
            </div>
          </div>
        )}

        {/* ─── TAB 2: DECISION TREE ────────────────────────────────────── */}
        {activeTab === 'decision' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">The Ultimate Encoding Rule</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>Follow this to pick the right encoder for any feature in any dataset.</p>
            <div style={{ background: 'rgba(15,23,42,0.6)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem', overflowX: 'auto', whiteSpace: 'pre' }}>
{`Categorical Feature
       │
       ▼
 Order Exists?
       │
 ┌─────┴──────────┐
Yes (Ordinal)    No (Nominal)
 │                │
 ▼                ▼
Ordinal     How many unique categories?
Encoding          │
           ┌──────┼──────────┐
           │      │          │
          < 15  15-100     100+
           │      │          │
           ▼      ▼          ▼
        One-Hot  Freq/   Binary /
       Encoding  Count   Hash /
       (Dummy    Encod.  Target
        for                Enc.
        Regress.)`}
            </div>
            <div className="card-note alert-indigo" style={{ marginTop: '2rem' }}>
              <strong>Interview One-Liner:</strong> Ordinal Encoding when order exists → One-Hot for small nominal → Frequency/Binary for high cardinality → Hash for Big Data → Target when strong correlation to target.
            </div>
            <div className="section-block" style={{ marginTop: '2rem' }}>
              <h3 className="section-title-sub">By Algorithm Type</h3>
              <div className="table-wrapper">
                <table className="compare-table">
                  <thead><tr><th>Algorithm</th><th>Recommended Encoding</th><th>Why</th></tr></thead>
                  <tbody>
                    <tr><td>Linear / Logistic Regression</td><td style={{color:'#ec4899'}}>Dummy Encoding</td><td>Avoids multicollinearity</td></tr>
                    <tr><td>KNN, SVM, K-Means</td><td style={{color:'#06b6d4'}}>One-Hot Encoding</td><td>Distance calculations need equal treatment</td></tr>
                    <tr><td>Decision Tree, Random Forest, XGBoost</td><td style={{color:'#6366f1'}}>Label / Ordinal Encoding</td><td>Splits on thresholds, not distances</td></tr>
                    <tr><td>Neural Networks</td><td style={{color:'#06b6d4'}}>One-Hot or Embedding</td><td>Needs bounded numeric inputs</td></tr>
                    <tr><td>Any (High Cardinality)</td><td style={{color:'#f43f5e'}}>Target / Frequency / Hash</td><td>Avoids column explosion</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: ALL METHODS ──────────────────────────────────────── */}
        {activeTab === 'methods' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">All Encoding Techniques</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
              Click any card to expand step-by-step explanations, before/after data tables, and full Python code with expected output.
            </p>
            {ENCODINGS.map(enc => <MethodCard key={enc.key} enc={enc} />)}
          </div>
        )}

        {/* ─── TAB 4: QUICK REFERENCE ──────────────────────────────────── */}
        {activeTab === 'interactive' && (
          <div className="tab-content fade-in">
            <h2 className="section-title-main">Quick Reference Cheat Sheet</h2>
            <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>One-stop summary table for interview revision.</p>
            <div className="table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Encoding</th><th>Data Type</th><th>Cardinality</th><th>Best Algorithms</th><th>Main Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Label', 'Binary Nominal', 'Very Low (2)', 'Trees', 'False ordering for 3+'],
                    ['Ordinal', 'Ordinal', 'Low', 'All', 'Wrong order if mis-specified'],
                    ['One-Hot', 'Nominal', '< 15', 'KNN, SVM, NN', 'Curse of Dimensionality'],
                    ['Dummy', 'Nominal', '< 15', 'Regression', 'None (removes multicollinearity)'],
                    ['Frequency', 'Nominal', '15–100', 'Trees, Boosting', 'Frequency collisions'],
                    ['Target', 'Nominal', '15–1000+', 'Boosting, Trees', 'Data Leakage'],
                    ['Binary', 'Nominal', '100–10k', 'All', 'Bit collision edge cases'],
                    ['Hash', 'Nominal', '1000+', 'All (Big Data)', 'Hash collisions'],
                    ['Rare Category', 'Nominal', 'Any', 'All (preprocessing step)', 'Losing signal in rare values'],
                  ].map(([enc, dtype, card, algo, risk], i) => (
                    <tr key={i}>
                      <td style={{ color: ENCODINGS[i]?.color || '#e2e8f0', fontWeight: 600 }}>{enc}</td>
                      <td>{dtype}</td><td>{card}</td><td>{algo}</td>
                      <td style={{ color: '#f87171', fontSize: '0.85rem' }}>{risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-note alert-amber" style={{ marginTop: '2rem' }}>
              <strong>Golden Rule:</strong> Always fit/train your encoder on training data only. Then use <code>transform()</code> (not <code>fit_transform()</code>) on the test set. Fitting on test data causes data leakage!
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
