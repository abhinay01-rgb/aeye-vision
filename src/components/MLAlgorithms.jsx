import React, { useState } from 'react';
import { Layers, Activity, Sparkles, Code, Play, CheckCircle } from 'lucide-react';
import InteractiveLinearRegression from './InteractiveLinearRegression';
import InteractivePolynomialRegression from './InteractivePolynomialRegression';

const ALGORITHMS = [
  {
    id: 'linear_regression',
    name: 'Linear Regression',
    category: 'Supervised Learning (Regression)',
    desc: 'Predicts a continuous target value by modeling a linear relationship between input features and target variables.',
    formula: 'y = w_1 x_1 + w_2 x_2 + ... + b',
    sklearn: `from sklearn.linear_model import LinearRegression\n\n# Initialize and fit\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Predict\npredictions = model.predict(X_test)`,
    svgType: 'linear',
    extendedContent: {
      intro: {
        title: "What is Linear Regression?",
        desc: "Linear regression is a statistical method used to model the relationship between two variables: an independent variable (predictor, X) and a dependent variable (response, Y).",
        simpleFormula: "Y = β₀ + β₁X + ε",
        multipleFormula: "Y = β₀ + β₁X₁ + β₂X₂ + ··· + βₙXₙ + ε",
        simpleDesc: "In Simple Linear Regression, we find a 2D line (e.g., modeling Salary vs. Years of Experience).",
        multipleDesc: "Multiple Linear Regression extends this to two or more independent variables."
      },
      proscons: {
        advantages: [
          "Easy to implement and interpret.",
          "Useful for understanding and predicting linear relationships."
        ],
        disadvantages: [
          "Assumes a linear relationship between independent and dependent variables.",
          "Sensitive to outliers.",
          "Simple Linear Regression cannot handle multiple predictors."
        ]
      }
    }
  },
  {
    id: 'polynomial_regression',
    name: 'Polynomial Regression',
    category: 'Supervised Learning (Regression)',
    desc: 'Models non-linear relationships by adding higher-degree polynomial terms of features, allowing a curve to fit the data.',
    formula: 'y = w_0 + w_1 x + w_2 x^2 + ... + w_n x^n',
    sklearn: `from sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.linear_model import LinearRegression\n\n# Transform features to degree 2\npoly = PolynomialFeatures(degree=2)\nX_poly = poly.fit_transform(X_train)\n\n# Fit linear regression\nmodel = LinearRegression()\nmodel.fit(X_poly, y_train)`,
    svgType: 'polynomial',
    extendedContent: {
      intro: {
        title: "What is Polynomial Regression?",
        desc: "Polynomial regression is a special case of multiple linear regression where we add polynomial terms (like X², X³) to model non-linear, curved relationships.",
        simpleFormula: "Y = β₀ + β₁X + β₂X² + ε",
        multipleFormula: "Y = β₀ + β₁X + β₂X² + β₃X³ + ε",
        simpleDesc: "By squaring the feature X, the model can learn quadratic (parabolic) curves.",
        multipleDesc: "Higher degrees (like power 3 or 4) allow the curve to bend more times to fit complex patterns."
      }
    }
  },
  {
    id: 'regression_metrics',
    name: 'Regression Metrics',
    category: 'Model Evaluation',
    desc: 'Key metrics for evaluating regression models, measuring how well the predicted continuous values align with the true values.',
    formula: 'MSE = \\frac{1}{n} \\sum (y_i - \\hat{y}_i)^2',
    sklearn: `from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score\n\n# Calculate metrics\nmse = mean_squared_error(y_true, y_pred)\nrmse = mean_squared_error(y_true, y_pred, squared=False)\nmae = mean_absolute_error(y_true, y_pred)\nr2 = r2_score(y_true, y_pred)`,
    svgType: 'metrics',
    extendedContent: {
      metrics: [
        { name: "R-squared (R²)", desc: "Measures how well the independent variables explain the variability in the dependent variable (0 to 1)." },
        { name: "Mean Squared Error (MSE)", desc: "The average squared difference between actual and predicted values. Penalizes larger errors heavily (visualized as squares)." },
        { name: "Mean Absolute Error (MAE)", desc: "The average absolute difference between actual and predicted values. Treats all errors proportionally (visualized as lines)." },
        { name: "Root Mean Squared Error (RMSE)", desc: "The square root of MSE, bringing the error back to the original units." },
        { name: "Adjusted R²", desc: "Adjusts R² for the number of predictors in the model to prevent overfitting." }
      ]
    }
  },
  {
    id: 'logistic_regression',
    name: 'Logistic Regression',
    category: 'Supervised Learning (Classification)',
    desc: 'Predicts the probability of a binary outcome (0 or 1) using a logistic sigmoid function.',
    formula: 'p = 1 / (1 + e^{-(w^T x + b)})',
    sklearn: `from sklearn.linear_model import LogisticRegression\n\n# Initialize and fit\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\n\n# Predict probabilities or classes\nprobs = model.predict_proba(X_test)\nclasses = model.predict(X_test)`,
    svgType: 'logistic'
  },
  {
    id: 'decision_trees',
    name: 'Decision Trees',
    category: 'Supervised Learning (Class. / Reg.)',
    desc: 'Splits data points sequentially based on feature thresholds that maximize information gain (minimizing entropy/gini impurity).',
    formula: 'Entropy = -\\sum p_i \\log_2(p_i)',
    sklearn: `from sklearn.tree import DecisionTreeClassifier\n\n# Initialize and fit tree\nmodel = DecisionTreeClassifier(max_depth=5)\nmodel.fit(X_train, y_train)\n\n# Get decision paths\npaths = model.decision_path(X_test)`,
    svgType: 'tree'
  },
  {
    id: 'random_forests',
    name: 'Random Forests',
    category: 'Ensemble Learning',
    desc: 'Combines predictions from multiple decision trees trained on bootstrap samples to reduce variance and combat overfitting.',
    formula: 'Forest(x) = \\frac{1}{N} \\sum Tree_i(x)',
    sklearn: `from sklearn.ensemble import RandomForestClassifier\n\n# Initialize ensemble forest\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\n# Feature importances\nimportances = model.feature_importances_`,
    svgType: 'forest'
  },
  {
    id: 'svm',
    name: 'Support Vector Machines',
    category: 'Supervised Learning (Class. / Reg.)',
    desc: 'Finds an optimal hyperplane that maximizes the margin (distance) between different classes of data points in high-dimensional space.',
    formula: 'Margin = \\frac{2}{||w||} \\text{ s.t. } y_i(w^T x_i + b) \\ge 1',
    sklearn: `from sklearn.svm import SVC\n\n# Initialize Support Vector Classifier\nmodel = SVC(kernel='rbf', C=1.0)\nmodel.fit(X_train, y_train)\n\n# Get support vectors\nsupport_vectors = model.support_vectors_`,
    svgType: 'svm'
  },
  {
    id: 'kmeans',
    name: 'K-Means Clustering',
    category: 'Unsupervised Learning',
    desc: 'Partitions data points into K clusters by iteratively assigning points to the nearest centroid and updating centroids.',
    formula: 'J = \\sum_{i=1}^K \\sum_{x \\in S_i} ||x - \\mu_i||^2',
    sklearn: `from sklearn.cluster import KMeans\n\n# Initialize cluster model\nkmeans = KMeans(n_clusters=3, random_state=42)\nkmeans.fit(X)\n\n# Cluster centroids & labels\ncentroids = kmeans.cluster_centers_\nlabels = kmeans.labels_`,
    svgType: 'kmeans'
  }
];

export default function MLAlgorithms({ initialSelected }) {
  const [selectedId, setSelectedId] = useState(initialSelected || 'linear_regression');
  const algo = ALGORITHMS.find(a => a.id === selectedId) || ALGORITHMS[0];

  // Helper to render interactive SVGs for each algorithm visualization
  const renderVisualization = (type) => {
    switch (type) {
      case 'metrics':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <style>
              {`
                .mse-sq { opacity: 0; animation: mseAnim 6s infinite alternate; }
                .mae-ln { opacity: 1; animation: maeAnim 6s infinite alternate; }
                @keyframes mseAnim { 0%, 40% { opacity: 0; } 60%, 100% { opacity: 1; } }
                @keyframes maeAnim { 0%, 40% { opacity: 1; stroke-width: 3px; } 60%, 100% { opacity: 0.5; stroke-width: 1px; } }
              `}
            </style>
            {/* Regression Line */}
            <line x1="30" y1="160" x2="270" y2="40" stroke="#6366f1" strokeWidth="2" />
            
            {/* Data point 1: x=70, actual y=90, pred y=140. Error = 50 */}
            {/* MSE Square */}
            <rect x="70" y="90" width="50" height="50" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeDasharray="2" className="mse-sq" />
            {/* MAE Line */}
            <line x1="70" y1="90" x2="70" y2="140" stroke="#ef4444" className="mae-ln" />
            <circle cx="70" cy="90" r="5" fill="#38bdf8" />
            <circle cx="70" cy="140" r="3" fill="#6366f1" />

            {/* Data point 2: x=140, actual y=130, pred y=105. Error = -25 */}
            {/* MSE Square */}
            <rect x="115" y="105" width="25" height="25" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeDasharray="2" className="mse-sq" />
            <line x1="140" y1="130" x2="140" y2="105" stroke="#ef4444" className="mae-ln" />
            <circle cx="140" cy="130" r="5" fill="#38bdf8" />
            <circle cx="140" cy="105" r="3" fill="#6366f1" />

            {/* Data point 3: x=210, actual y=30, pred y=70. Error = 40 */}
            <rect x="210" y="30" width="40" height="40" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeDasharray="2" className="mse-sq" />
            <line x1="210" y1="30" x2="210" y2="70" stroke="#ef4444" className="mae-ln" />
            <circle cx="210" cy="30" r="5" fill="#38bdf8" />
            <circle cx="210" cy="70" r="3" fill="#6366f1" />

            <text x="150" y="25" fill="#818cf8" fontSize="10" fontWeight="bold" textAnchor="middle">Visualizing MAE (Lines) vs MSE (Squares)</text>
            <text x="150" y="190" fill="#475569" fontSize="8" textAnchor="middle">Animations automatically toggle between absolute distance and squared area</text>
          </svg>
        );
      case 'logistic':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Class 0 points */}
            <circle cx="40" cy="160" r="5" fill="#38bdf8" />
            <circle cx="70" cy="155" r="5" fill="#38bdf8" />
            <circle cx="90" cy="170" r="5" fill="#38bdf8" />
            <circle cx="120" cy="160" r="5" fill="#38bdf8" />
            {/* Class 1 points */}
            <circle cx="180" cy="40" r="5" fill="#ec4899" />
            <circle cx="210" cy="35" r="5" fill="#ec4899" />
            <circle cx="240" cy="45" r="5" fill="#ec4899" />
            <circle cx="260" cy="35" r="5" fill="#ec4899" />
            
            {/* Sigmoid boundary curve */}
            <path d="M 30,170 Q 150,170 150,100 T 270,30" fill="none" stroke="#6366f1" strokeWidth="2.5" />
            <line x1="150" y1="10" x2="150" y2="190" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />
            <text x="155" y="105" fill="#64748b" fontSize="8">Threshold p=0.5</text>
            <text x="210" y="80" fill="#ec4899" fontSize="9" fontWeight="bold">Class 1</text>
            <text x="60" y="120" fill="#38bdf8" fontSize="9" fontWeight="bold">Class 0</text>
          </svg>
        );
      case 'tree':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Nodes */}
            <line x1="150" y1="30" x2="80" y2="90" stroke="#475569" strokeWidth="2" />
            <line x1="150" y1="30" x2="220" y2="90" stroke="#475569" strokeWidth="2" />
            <line x1="80" y1="90" x2="40" y2="150" stroke="#475569" strokeWidth="2" />
            <line x1="80" y1="90" x2="120" y2="150" stroke="#475569" strokeWidth="2" />

            {/* Root */}
            <rect x="120" y="15" width="60" height="25" rx="5" fill="#6366f1" />
            <text x="150" y="31" fill="#fff" fontSize="9" textAnchor="middle">X1 &le; 2.5</text>

            {/* Branches */}
            <rect x="50" y="77" width="60" height="25" rx="5" fill="#38bdf8" />
            <text x="80" y="93" fill="#fff" fontSize="9" textAnchor="middle">X2 &le; 0.88</text>
            <rect x="190" y="77" width="60" height="25" rx="5" fill="#e2e8f0" />
            <text x="220" y="93" fill="#0f172a" fontSize="9" textAnchor="middle" fontWeight="bold">Class B</text>

            {/* Leaves */}
            <circle cx="40" cy="150" r="14" fill="#a855f7" />
            <text x="40" y="153" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">Class A</text>
            <circle cx="120" cy="150" r="14" fill="#4ade80" />
            <text x="120" y="153" fill="#0f172a" fontSize="9" textAnchor="middle" fontWeight="bold">Class C</text>
          </svg>
        );
      case 'forest':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Tree Miniatures */}
            {/* Tree 1 */}
            <g transform="translate(10, 20) scale(0.6)">
              <line x1="80" y1="40" x2="40" y2="100" stroke="#475569" strokeWidth="3" />
              <line x1="80" y1="40" x2="120" y2="100" stroke="#475569" strokeWidth="3" />
              <circle cx="80" cy="40" r="15" fill="#38bdf8" />
              <circle cx="40" cy="100" r="12" fill="#4ade80" />
              <circle cx="120" cy="100" r="12" fill="#ec4899" />
              <text x="80" y="140" fill="#64748b" fontSize="14" textAnchor="middle">Tree 1</text>
            </g>
            {/* Tree 2 */}
            <g transform="translate(110, 20) scale(0.6)">
              <line x1="80" y1="40" x2="40" y2="100" stroke="#475569" strokeWidth="3" />
              <line x1="80" y1="40" x2="120" y2="100" stroke="#475569" strokeWidth="3" />
              <circle cx="80" cy="40" r="15" fill="#a855f7" />
              <circle cx="40" cy="100" r="12" fill="#38bdf8" />
              <circle cx="120" cy="100" r="12" fill="#4ade80" />
              <text x="80" y="140" fill="#64748b" fontSize="14" textAnchor="middle">Tree 2</text>
            </g>
            {/* Tree 3 */}
            <g transform="translate(210, 20) scale(0.6)">
              <line x1="80" y1="40" x2="40" y2="100" stroke="#475569" strokeWidth="3" />
              <line x1="80" y1="40" x2="120" y2="100" stroke="#475569" strokeWidth="3" />
              <circle cx="80" cy="40" r="15" fill="#f59e0b" />
              <circle cx="40" cy="100" r="12" fill="#ec4899" />
              <circle cx="120" cy="100" r="12" fill="#38bdf8" />
              <text x="80" y="140" fill="#64748b" fontSize="14" textAnchor="middle">Tree 3</text>
            </g>
            
            {/* Voting block */}
            <line x1="50" y1="130" x2="150" y2="165" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3" />
            <line x1="150" y1="130" x2="150" y2="165" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3" />
            <line x1="250" y1="130" x2="150" y2="165" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3" />
            
            <rect x="110" y="160" width="80" height="25" rx="5" fill="#6366f1" />
            <text x="150" y="176" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">Majority Vote</text>
          </svg>
        );
      case 'svm':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Support Vectors */}
            <circle cx="95" cy="115" r="7" stroke="#38bdf8" strokeWidth="2" fill="none" />
            <circle cx="185" cy="55" r="7" stroke="#ec4899" strokeWidth="2" fill="none" />
            <circle cx="145" cy="145" r="7" stroke="#38bdf8" strokeWidth="2" fill="none" />

            {/* Other points */}
            <circle cx="50" cy="140" r="4" fill="#38bdf8" opacity="0.6" />
            <circle cx="70" cy="170" r="4" fill="#38bdf8" opacity="0.6" />
            <circle cx="230" cy="40" r="4" fill="#ec4899" opacity="0.6" />
            <circle cx="210" cy="70" r="4" fill="#ec4899" opacity="0.6" />

            {/* Separating Hyperplane */}
            <line x1="50" y1="60" x2="230" y2="180" stroke="#6366f1" strokeWidth="3" />
            
            {/* Margin lines */}
            <line x1="75" y1="45" x2="255" y2="165" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="4" />
            <line x1="25" y1="75" x2="205" y2="195" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4" />

            <text x="160" y="125" fill="#6366f1" fontSize="9" fontWeight="bold">Hyperplane</text>
            <text x="210" y="110" fill="#ec4899" fontSize="8">Support Vector</text>
          </svg>
        );
      case 'kmeans':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Cluster 1 */}
            <circle cx="60" cy="60" r="4" fill="#38bdf8" />
            <circle cx="80" cy="40" r="4" fill="#38bdf8" />
            <circle cx="90" cy="70" r="4" fill="#38bdf8" />
            <circle cx="50" cy="80" r="4" fill="#38bdf8" />
            <polygon points="70,60 10,10 20,20" fill="none" />
            
            {/* Centroid 1 */}
            <path d="M70,55 L75,70 L60,60 L80,60 L65,70 Z" fill="#fbbf24" stroke="#000" strokeWidth="0.5" transform="translate(-5, -5)" />

            {/* Cluster 2 */}
            <circle cx="210" cy="70" r="4" fill="#ec4899" />
            <circle cx="240" cy="50" r="4" fill="#ec4899" />
            <circle cx="230" cy="85" r="4" fill="#ec4899" />
            <circle cx="250" cy="80" r="4" fill="#ec4899" />
            
            {/* Centroid 2 */}
            <path d="M232,71 L237,86 L222,76 L242,76 L227,86 Z" fill="#fbbf24" stroke="#000" strokeWidth="0.5" transform="translate(-5, -5)" />

            {/* Cluster 3 */}
            <circle cx="150" cy="140" r="4" fill="#4ade80" />
            <circle cx="130" cy="160" r="4" fill="#4ade80" />
            <circle cx="170" cy="155" r="4" fill="#4ade80" />
            <circle cx="160" cy="170" r="4" fill="#4ade80" />
            
            {/* Centroid 3 */}
            <path d="M152,156 L157,171 L142,161 L162,161 L147,171 Z" fill="#fbbf24" stroke="#000" strokeWidth="0.5" transform="translate(-5, -5)" />

            <text x="110" y="20" fill="#64748b" fontSize="8">K=3 Cluster Partitions</text>
            <text x="80" y="85" fill="#fbbf24" fontSize="8">Centroid</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="tab-content fade-in" style={{ position: 'relative', zIndex: 1 }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        top: '10%',
        right: '10%',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Header Info */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          color: '#a5b4fc',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '50px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1rem'
        }}>
          <Sparkles size={12} />
          <span>Algorithm Sandbox</span>
        </div>
        <h2 className="section-title-main" style={{ fontSize: '2.2rem', fontWeight: 850, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Machine Learning Algorithms
        </h2>
        <p className="tutorial-paragraph" style={{ maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '0.92rem', color: '#94a3b8' }}>
          Explore interactive visualizations, mathematical formulations, and clean Scikit-Learn code scripts for classical ML models.
        </p>
      </div>

      {/* Split Screen Layout */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap',
        alignItems: 'stretch'
      }}>
        {/* Left Column: List selector */}
        <div style={{
          flex: '1 1 280px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {ALGORITHMS.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                style={{
                  background: isSelected ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.01)',
                  border: '1px solid',
                  borderColor: isSelected ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '14px',
                  padding: '1.2rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                  }
                }}
              >
                {/* Active glow tag */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '3px',
                    height: '100%',
                    background: '#6366f1',
                    borderRadius: '3px 0 0 3px'
                  }} />
                )}
                
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {item.category}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: isSelected ? '#a5b4fc' : '#fff', marginTop: '0.15rem', marginBottom: '0.4rem', fontFamily: 'Outfit, sans-serif' }}>
                  {item.name}
                </h4>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Visual Dashboard */}
        <div style={{
          flex: '2 2 500px',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '24px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Top Panel - Name and Category */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                {algo.name}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>{algo.category}</span>
            </div>
            {/* Future update indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.2)',
              color: '#4ade80',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <CheckCircle size={10} />
              <span>Sandbox Ready</span>
            </div>
          </div>

          {/* Description and Equation */}
          <div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
              {algo.desc}
            </p>
            <div style={{
              background: 'rgba(8,12,28,0.5)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mathematical Formula:</span>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '1rem',
                color: '#fff',
                textAlign: 'center',
                padding: '0.25rem 0',
                background: 'rgba(255,255,255,0.01)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.02)'
              }}>
                {algo.formula}
              </div>
            </div>
          </div>

          {/* Visualization Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interactive Visual Concept:
            </span>
            {algo.svgType === 'linear' ? (
              <div style={{ width: '100%', paddingTop: '0.5rem' }}>
                <InteractiveLinearRegression />
              </div>
            ) : algo.svgType === 'polynomial' ? (
              <div style={{ width: '100%', paddingTop: '0.5rem' }}>
                <InteractivePolynomialRegression />
              </div>
            ) : (
              <div style={{ height: '200px', width: '100%' }}>
                {renderVisualization(algo.svgType)}
              </div>
            )}
          </div>

          {/* Code block */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Scikit-Learn Implementation:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#818cf8', fontWeight: 600 }}>
                <Code size={12} />
                <span>Python Template</span>
              </div>
            </div>
            <pre style={{
              background: '#04060f',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '1.2rem',
              color: '#94a3b8',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.78rem',
              lineHeight: '1.5',
              overflowX: 'auto',
              margin: 0
            }}>
              <code>{algo.sklearn}</code>
            </pre>
          </div>

          {/* Extended Deep Dive Content */}
          {algo.extendedContent && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginTop: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '1.5rem'
            }}>
              
              {/* Intro & Equations */}
              {algo.extendedContent.intro && (
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 700 }}>
                    {algo.extendedContent.intro.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {algo.extendedContent.intro.desc}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Simple Linear Regression</span>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{algo.extendedContent.intro.simpleDesc}</p>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                        {algo.extendedContent.intro.simpleFormula}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Multiple Linear Regression</span>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{algo.extendedContent.intro.multipleDesc}</p>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                        {algo.extendedContent.intro.multipleFormula}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              {algo.extendedContent.metrics && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 700 }}>Key Evaluation Metrics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {algo.extendedContent.metrics.map((metric, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <Layers size={14} style={{ color: '#38bdf8', marginTop: '2px', flexShrink: 0 }} />
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'block' }}>{metric.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{metric.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pros & Cons */}
              {algo.extendedContent.proscons && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {/* Advantages */}
                  <div style={{ background: 'rgba(74, 222, 128, 0.03)', border: '1px solid rgba(74, 222, 128, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                    <h5 style={{ fontSize: '0.85rem', color: '#4ade80', marginBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 0.75rem 0' }}>
                      <CheckCircle size={14} /> Advantages
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {algo.extendedContent.proscons.advantages.map((pro, i) => <li key={i}>{pro}</li>)}
                    </ul>
                  </div>
                  {/* Disadvantages */}
                  <div style={{ background: 'rgba(244, 63, 94, 0.03)', border: '1px solid rgba(244, 63, 94, 0.1)', padding: '1rem', borderRadius: '12px' }}>
                    <h5 style={{ fontSize: '0.85rem', color: '#f43f5e', marginBottom: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 0.75rem 0' }}>
                      <Activity size={14} /> Disadvantages
                    </h5>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {algo.extendedContent.proscons.disadvantages.map((con, i) => <li key={i}>{con}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
