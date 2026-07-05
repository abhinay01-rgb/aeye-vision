import React, { useState, useEffect } from 'react';
import { Layers, Activity, Sparkles, Code, CheckCircle } from 'lucide-react';
import InteractiveLinearRegression from './InteractiveLinearRegression';
import InteractivePolynomialRegression from './InteractivePolynomialRegression';
import InteractiveMultipleLinearRegression from './InteractiveMultipleLinearRegression';
import InteractiveGradientDescent from './InteractiveGradientDescent';
import InteractivePerceptronTrick from './InteractivePerceptronTrick';
import InteractiveLogisticRegression from './InteractiveLogisticRegression';
import InteractiveSoftmaxRegression from './InteractiveSoftmaxRegression';
import InteractiveConfusionMatrix from './InteractiveConfusionMatrix';
import InteractiveKNN from './InteractiveKNN';
import InteractiveSVM from './InteractiveSVM';
import InteractiveRegularization from './InteractiveRegularization';
import InteractiveKMeans from './InteractiveKMeans';
import InteractiveDecisionTree from './InteractiveDecisionTree';
import { ML_ALGORITHMS } from '../data/mlAlgorithms';

export default function MLAlgorithms({ initialSelected }) {
  const [selectedId, setSelectedId] = useState(initialSelected || 'linear_regression');
  const algo = ML_ALGORITHMS.find(a => a.id === selectedId) || ML_ALGORITHMS[0];

  useEffect(() => {
    if (initialSelected) {
      setSelectedId(initialSelected);
    }
  }, [initialSelected]);

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
      case 'softmax':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Decision boundaries */}
            <line x1="100" y1="10" x2="200" y2="190" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
            <line x1="30" y1="120" x2="270" y2="80" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
            {/* Class 0 – blue (bottom-left) */}
            <circle cx="50" cy="150" r="5" fill="#3b82f6" />
            <circle cx="70" cy="165" r="5" fill="#3b82f6" />
            <circle cx="85" cy="145" r="5" fill="#3b82f6" />
            <circle cx="60" cy="175" r="5" fill="#3b82f6" />
            {/* Class 1 – green (top) */}
            <circle cx="120" cy="35" r="5" fill="#22c55e" />
            <circle cx="145" cy="50" r="5" fill="#22c55e" />
            <circle cx="130" cy="65" r="5" fill="#22c55e" />
            <circle cx="155" cy="30" r="5" fill="#22c55e" />
            {/* Class 2 – orange (right) */}
            <circle cx="220" cy="130" r="5" fill="#f59e0b" />
            <circle cx="245" cy="145" r="5" fill="#f59e0b" />
            <circle cx="235" cy="120" r="5" fill="#f59e0b" />
            <circle cx="260" cy="155" r="5" fill="#f59e0b" />
            {/* Labels */}
            <text x="55" y="135" fill="#3b82f6" fontSize="9" fontWeight="bold">Class 0</text>
            <text x="120" y="22" fill="#22c55e" fontSize="9" fontWeight="bold">Class 1</text>
            <text x="220" y="110" fill="#f59e0b" fontSize="9" fontWeight="bold">Class 2</text>
          </svg>
        );
      case 'confusion_matrix':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* 2x2 confusion matrix grid */}
            <rect x="80" y="30" width="80" height="70" rx="6" fill="#22c55e" opacity={0.2} stroke="#22c55e" strokeWidth="1.5" />
            <text x="120" y="62" fill="#22c55e" fontSize="11" fontWeight="bold" textAnchor="middle">TP</text>
            <text x="120" y="80" fill="#22c55e" fontSize="16" fontWeight="800" textAnchor="middle">50</text>
            <rect x="165" y="30" width="80" height="70" rx="6" fill="#f87171" opacity={0.2} stroke="#f87171" strokeWidth="1.5" />
            <text x="205" y="62" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">FN</text>
            <text x="205" y="80" fill="#f87171" fontSize="16" fontWeight="800" textAnchor="middle">5</text>
            <rect x="80" y="105" width="80" height="70" rx="6" fill="#f59e0b" opacity={0.2} stroke="#f59e0b" strokeWidth="1.5" />
            <text x="120" y="137" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">FP</text>
            <text x="120" y="155" fill="#f59e0b" fontSize="16" fontWeight="800" textAnchor="middle">10</text>
            <rect x="165" y="105" width="80" height="70" rx="6" fill="#3b82f6" opacity={0.2} stroke="#3b82f6" strokeWidth="1.5" />
            <text x="205" y="137" fill="#3b82f6" fontSize="11" fontWeight="bold" textAnchor="middle">TN</text>
            <text x="205" y="155" fill="#3b82f6" fontSize="16" fontWeight="800" textAnchor="middle">40</text>
            {/* Labels */}
            <text x="55" y="68" fill="#94a3b8" fontSize="8" textAnchor="end">Actual +</text>
            <text x="55" y="143" fill="#94a3b8" fontSize="8" textAnchor="end">Actual −</text>
            <text x="120" y="22" fill="#94a3b8" fontSize="8" textAnchor="middle">Pred +</text>
            <text x="205" y="22" fill="#94a3b8" fontSize="8" textAnchor="middle">Pred −</text>
            <text x="162" y="192" fill="#475569" fontSize="8" textAnchor="middle">Interactive Confusion Matrix</text>
          </svg>
        );
      case 'knn':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <circle cx="90" cy="80" r="4" fill="#3b82f6" />
            <circle cx="110" cy="100" r="4" fill="#3b82f6" />
            <circle cx="120" cy="70" r="4" fill="#3b82f6" />
            
            <circle cx="190" cy="110" r="4" fill="#f59e0b" />
            <circle cx="170" cy="130" r="4" fill="#f59e0b" />
            <circle cx="210" cy="120" r="4" fill="#f59e0b" />
            
            {/* Target point */}
            <circle cx="140" cy="100" r="5" fill="#fff" stroke="#6366f1" strokeWidth="2" />
            
            {/* Lines to nearest neighbors */}
            <line x1="140" y1="100" x2="110" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2" />
            <line x1="140" y1="100" x2="120" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2" />
            <line x1="140" y1="100" x2="170" y2="130" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="2" />

            <circle cx="110" cy="100" r="6" fill="none" stroke="#fff" strokeWidth="1" />
            <circle cx="120" cy="70" r="6" fill="none" stroke="#fff" strokeWidth="1" />
            <circle cx="170" cy="130" r="6" fill="none" stroke="#fff" strokeWidth="1" />

            <text x="140" y="25" fill="#64748b" fontSize="9" fontWeight="bold" textAnchor="middle">K=3 Nearest Neighbors</text>
          </svg>
        );

      case 'bagging':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <text x="150" y="20" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">Bagging (Bootstrap Aggregating)</text>
            
            <rect x="110" y="30" width="80" height="15" rx="4" fill="rgba(255,255,255,0.05)" stroke="#64748b" />
            <text x="150" y="41" fill="#e2e8f0" fontSize="8" textAnchor="middle">Original Dataset</text>

            <line x1="150" y1="45" x2="150" y2="55" stroke="#64748b" strokeWidth="1.5" />
            <line x1="70" y1="55" x2="230" y2="55" stroke="#64748b" strokeWidth="1.5" />
            
            <line x1="70" y1="55" x2="70" y2="65" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="55" x2="150" y2="65" stroke="#64748b" strokeWidth="1.5" />
            <line x1="230" y1="55" x2="230" y2="65" stroke="#64748b" strokeWidth="1.5" />

            <rect x="40" y="65" width="60" height="15" rx="4" fill="rgba(99,102,241,0.15)" stroke="#6366f1" />
            <text x="70" y="75" fill="#a5b4fc" fontSize="7" textAnchor="middle">Bootstrap 1</text>
            
            <rect x="120" y="65" width="60" height="15" rx="4" fill="rgba(99,102,241,0.15)" stroke="#6366f1" />
            <text x="150" y="75" fill="#a5b4fc" fontSize="7" textAnchor="middle">Bootstrap 2</text>

            <rect x="200" y="65" width="60" height="15" rx="4" fill="rgba(99,102,241,0.15)" stroke="#6366f1" />
            <text x="230" y="75" fill="#a5b4fc" fontSize="7" textAnchor="middle">Bootstrap 3</text>

            <line x1="70" y1="80" x2="70" y2="90" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="80" x2="150" y2="90" stroke="#64748b" strokeWidth="1.5" />
            <line x1="230" y1="80" x2="230" y2="90" stroke="#64748b" strokeWidth="1.5" />
            
            <rect x="40" y="90" width="60" height="20" rx="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
            <text x="70" y="103" fill="#38bdf8" fontSize="8" textAnchor="middle">Model 1</text>
            
            <rect x="120" y="90" width="60" height="20" rx="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
            <text x="150" y="103" fill="#38bdf8" fontSize="8" textAnchor="middle">Model 2</text>

            <rect x="200" y="90" width="60" height="20" rx="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
            <text x="230" y="103" fill="#38bdf8" fontSize="8" textAnchor="middle">Model 3</text>

            <line x1="70" y1="110" x2="70" y2="120" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="110" x2="150" y2="120" stroke="#64748b" strokeWidth="1.5" />
            <line x1="230" y1="110" x2="230" y2="120" stroke="#64748b" strokeWidth="1.5" />

            <text x="70" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>
            <text x="150" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>
            <text x="230" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>

            <line x1="70" y1="135" x2="150" y2="150" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2" />
            <line x1="150" y1="135" x2="150" y2="150" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2" />
            <line x1="230" y1="135" x2="150" y2="150" stroke="#64748b" strokeWidth="1.5" strokeDasharray="2" />

            <rect x="100" y="150" width="100" height="20" rx="4" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" />
            <text x="150" y="163" fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="bold">Aggregation</text>

            <line x1="150" y1="170" x2="150" y2="180" stroke="#64748b" strokeWidth="1.5" />

            <text x="150" y="188" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">Final Prediction</text>
          </svg>
        );

      case 'stacking_ensemble':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <text x="150" y="20" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">Stacking Architecture</text>
            <rect x="110" y="30" width="80" height="15" rx="4" fill="rgba(255,255,255,0.05)" stroke="#64748b" />
            <text x="150" y="41" fill="#e2e8f0" fontSize="8" textAnchor="middle">Dataset</text>
            
            <line x1="150" y1="45" x2="150" y2="55" stroke="#64748b" strokeWidth="1.5" />
            <line x1="70" y1="55" x2="230" y2="55" stroke="#64748b" strokeWidth="1.5" />
            
            <line x1="70" y1="55" x2="70" y2="65" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="55" x2="150" y2="65" stroke="#64748b" strokeWidth="1.5" />
            <line x1="230" y1="55" x2="230" y2="65" stroke="#64748b" strokeWidth="1.5" />

            <rect x="40" y="65" width="60" height="20" rx="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
            <text x="70" y="78" fill="#38bdf8" fontSize="8" textAnchor="middle">Random Forest</text>
            
            <rect x="120" y="65" width="60" height="20" rx="4" fill="rgba(168,85,247,0.15)" stroke="#a855f7" />
            <text x="150" y="78" fill="#a855f7" fontSize="8" textAnchor="middle">SVM</text>

            <rect x="200" y="65" width="60" height="20" rx="4" fill="rgba(74,222,128,0.15)" stroke="#4ade80" />
            <text x="230" y="78" fill="#4ade80" fontSize="8" textAnchor="middle">Logistic Reg</text>

            <line x1="70" y1="85" x2="70" y2="100" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="85" x2="150" y2="100" stroke="#64748b" strokeWidth="1.5" />
            <line x1="230" y1="85" x2="230" y2="100" stroke="#64748b" strokeWidth="1.5" />
            
            <text x="70" y="110" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>
            <text x="150" y="110" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>
            <text x="230" y="110" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>

            <line x1="70" y1="115" x2="150" y2="140" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2" />
            <line x1="150" y1="115" x2="150" y2="140" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2" />
            <line x1="230" y1="115" x2="150" y2="140" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2" />

            <rect x="100" y="140" width="100" height="25" rx="4" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" />
            <text x="150" y="152" fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="bold">Meta Learner</text>
            <text x="150" y="161" fill="#f43f5e" fontSize="7" textAnchor="middle">(Level-1 Model)</text>

            <line x1="150" y1="165" x2="150" y2="175" stroke="#64748b" strokeWidth="1.5" />

            <text x="150" y="185" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">Final Prediction</text>
          </svg>
        );

      case 'voting_ensemble':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <text x="150" y="20" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">Voting Ensemble (Hard / Soft / Average)</text>
            <rect x="50" y="40" width="60" height="25" rx="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
            <text x="80" y="56" fill="#38bdf8" fontSize="10" textAnchor="middle">Model A</text>
            
            <rect x="120" y="40" width="60" height="25" rx="4" fill="rgba(168,85,247,0.15)" stroke="#a855f7" />
            <text x="150" y="56" fill="#a855f7" fontSize="10" textAnchor="middle">Model B</text>

            <rect x="190" y="40" width="60" height="25" rx="4" fill="rgba(74,222,128,0.15)" stroke="#4ade80" />
            <text x="220" y="56" fill="#4ade80" fontSize="10" textAnchor="middle">Model C</text>

            {/* Arrows pointing down */}
            <line x1="80" y1="65" x2="140" y2="105" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="65" x2="150" y2="105" stroke="#64748b" strokeWidth="1.5" />
            <line x1="220" y1="65" x2="160" y2="105" stroke="#64748b" strokeWidth="1.5" />
            
            <rect x="90" y="105" width="120" height="30" rx="4" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" />
            <text x="150" y="124" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="bold">Voting / Averaging</text>

            <line x1="150" y1="135" x2="150" y2="165" stroke="#64748b" strokeWidth="1.5" />

            <rect x="110" y="165" width="80" height="25" rx="4" fill="rgba(99,102,241,0.15)" stroke="#6366f1" />
            <text x="150" y="181" fill="#fff" fontSize="10" textAnchor="middle" fontWeight="bold">Final Pred</text>
          </svg>
        );

      case 'ensemble_learning':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <text x="150" y="20" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">Basic Architecture</text>
            <rect x="110" y="35" width="80" height="20" rx="4" fill="rgba(255,255,255,0.05)" stroke="#64748b" />
            <text x="150" y="49" fill="#e2e8f0" fontSize="9" textAnchor="middle">Dataset</text>
            <line x1="150" y1="55" x2="150" y2="70" stroke="#64748b" strokeWidth="1.5" />
            <line x1="60" y1="70" x2="240" y2="70" stroke="#64748b" strokeWidth="1.5" />
            <line x1="60" y1="70" x2="60" y2="85" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="70" x2="150" y2="85" stroke="#64748b" strokeWidth="1.5" />
            <line x1="240" y1="70" x2="240" y2="85" stroke="#64748b" strokeWidth="1.5" />
            <rect x="35" y="85" width="50" height="20" rx="4" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
            <text x="60" y="99" fill="#38bdf8" fontSize="9" textAnchor="middle">Model 1</text>
            <rect x="125" y="85" width="50" height="20" rx="4" fill="rgba(168,85,247,0.15)" stroke="#a855f7" />
            <text x="150" y="99" fill="#a855f7" fontSize="9" textAnchor="middle">Model 2</text>
            <rect x="215" y="85" width="50" height="20" rx="4" fill="rgba(74,222,128,0.15)" stroke="#4ade80" />
            <text x="240" y="99" fill="#4ade80" fontSize="9" textAnchor="middle">Model 3</text>
            <line x1="60" y1="105" x2="60" y2="120" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="105" x2="150" y2="120" stroke="#64748b" strokeWidth="1.5" />
            <line x1="240" y1="105" x2="240" y2="120" stroke="#64748b" strokeWidth="1.5" />
            <text x="60" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>
            <text x="150" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>
            <text x="240" y="130" fill="#94a3b8" fontSize="8" textAnchor="middle">Prediction</text>
            <line x1="60" y1="135" x2="240" y2="135" stroke="#64748b" strokeWidth="1.5" />
            <line x1="150" y1="135" x2="150" y2="150" stroke="#64748b" strokeWidth="1.5" />
            <rect x="90" y="150" width="120" height="20" rx="4" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" />
            <text x="150" y="164" fill="#f43f5e" fontSize="9" textAnchor="middle">Combine Predictions</text>
            <line x1="150" y1="170" x2="150" y2="180" stroke="#64748b" strokeWidth="1.5" />
            <text x="150" y="192" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">Final Prediction</text>
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

      case 'gradient_descent':
        return (
          <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Loss contour lines */}
            <ellipse cx="150" cy="140" rx="110" ry="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <ellipse cx="150" cy="140" rx="80" ry="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <ellipse cx="150" cy="140" rx="50" ry="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
            <ellipse cx="150" cy="140" rx="20" ry="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            
            {/* Global Minimum Star */}
            <path d="M150,135 L152,139 L156,140 L153,143 L154,147 L150,145 L146,147 L147,143 L144,140 L148,139 Z" fill="#4ade80" />
            <text x="150" y="155" fill="#4ade80" fontSize="7" fontWeight="bold" textAnchor="middle">Minimum</text>

            {/* BGD Path (Smooth, straight) */}
            <path d="M 50,80 Q 90,135 145,140" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="100" strokeDashoffset="0" />
            {/* BGD Points */}
            <circle cx="50" cy="80" r="3.5" fill="#6366f1" />
            <circle cx="78" cy="107" r="3" fill="#6366f1" />
            <circle cx="108" cy="126" r="3" fill="#6366f1" />
            <circle cx="132" cy="136" r="2.5" fill="#6366f1" />
            <text x="35" y="73" fill="#818cf8" fontSize="8" fontWeight="bold">BGD</text>

            {/* SGD Path (Highly erratic, zigzagging) */}
            <path d="M 50,80 L 40,110 L 95,95 L 75,135 L 125,120 L 115,145 L 140,132 L 148,142" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeOpacity="0.8" />
            <circle cx="50" cy="80" r="3.5" fill="#f43f5e" />
            <circle cx="40" cy="110" r="2" fill="#f43f5e" />
            <circle cx="95" cy="95" r="2" fill="#f43f5e" />
            <circle cx="75" cy="135" r="2" fill="#f43f5e" />
            <circle cx="125" cy="120" r="2" fill="#f43f5e" />
            <circle cx="115" cy="145" r="2" fill="#f43f5e" />
            <circle cx="140" cy="132" r="2" fill="#f43f5e" />
            <circle cx="148" cy="142" r="2.5" fill="#f43f5e" />
            <text x="25" y="122" fill="#f43f5e" fontSize="8" fontWeight="bold">SGD</text>

            {/* MBGD Path (Moderate noise, steady convergence) */}
            <path d="M 50,80 L 68,96 L 62,112 L 88,118 L 105,135 L 128,131 L 146,140" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="50" cy="80" r="3.5" fill="#38bdf8" />
            <circle cx="68" cy="96" r="2.5" fill="#38bdf8" />
            <circle cx="62" cy="112" r="2.5" fill="#38bdf8" />
            <circle cx="88" cy="118" r="2.5" fill="#38bdf8" />
            <circle cx="105" cy="135" r="2.5" fill="#38bdf8" />
            <circle cx="128" cy="131" r="2.5" fill="#38bdf8" />
            <circle cx="146" cy="140" r="3.5" fill="#38bdf8" />
            <text x="66" y="75" fill="#38bdf8" fontSize="8" fontWeight="bold">Mini-Batch</text>

            <text x="150" y="20" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">Gradient Descent Optimization Trajectories</text>
            <text x="150" y="190" fill="#64748b" fontSize="7.5" textAnchor="middle">Compare smooth deterministic Batch (BGD) vs noisy Stochastic (SGD/MBGD)</text>
          </svg>
        );
      case 'fitting':
        return (
          <svg viewBox="0 0 320 150" style={{ width: '100%', height: '100%', background: '#080c1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            {/* Divider lines between graphs */}
            <line x1="106" y1="10" x2="106" y2="120" stroke="rgba(255,255,255,0.08)" strokeDasharray="3" />
            <line x1="213" y1="10" x2="213" y2="120" stroke="rgba(255,255,255,0.08)" strokeDasharray="3" />

            {/* 1. Underfitting Panel */}
            <g>
              {/* Axes */}
              <line x1="15" y1="110" x2="95" y2="110" stroke="#475569" strokeWidth="1" />
              <line x1="15" y1="30" x2="15" y2="110" stroke="#475569" strokeWidth="1" />
              {/* Underfit Trend Line (Too simple) */}
              <line x1="20" y1="90" x2="90" y2="70" stroke="#f43f5e" strokeWidth="2.5" />
              {/* Data points */}
              <circle cx="25" cy="100" r="3" fill="#38bdf8" />
              <circle cx="35" cy="80" r="3" fill="#38bdf8" />
              <circle cx="50" cy="55" r="3" fill="#38bdf8" />
              <circle cx="65" cy="45" r="3" fill="#38bdf8" />
              <circle cx="75" cy="60" r="3" fill="#38bdf8" />
              <circle cx="85" cy="85" r="3" fill="#38bdf8" />
              {/* Labels */}
              <text x="55" y="20" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">Underfitting</text>
              <text x="55" y="135" fill="#64748b" fontSize="8" textAnchor="middle">High Bias (Linear line)</text>
            </g>

            {/* 2. Good Fit Panel */}
            <g>
              {/* Axes */}
              <line x1="120" y1="110" x2="200" y2="110" stroke="#475569" strokeWidth="1" />
              <line x1="120" y1="30" x2="120" y2="110" stroke="#475569" strokeWidth="1" />
              {/* Good Fit Curve (Quadratic) */}
              <path d="M 125,105 Q 160,25 195,105" fill="none" stroke="#4ade80" strokeWidth="2.5" />
              {/* Data points */}
              <circle cx="130" cy="100" r="3" fill="#38bdf8" />
              <circle cx="140" cy="80" r="3" fill="#38bdf8" />
              <circle cx="155" cy="55" r="3" fill="#38bdf8" />
              <circle cx="170" cy="45" r="3" fill="#38bdf8" />
              <circle cx="180" cy="60" r="3" fill="#38bdf8" />
              <circle cx="190" cy="85" r="3" fill="#38bdf8" />
              {/* Labels */}
              <text x="160" y="20" fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="middle">Good Fit</text>
              <text x="160" y="135" fill="#64748b" fontSize="8" textAnchor="middle">Balanced & Robust</text>
            </g>

            {/* 3. Overfitting Panel */}
            <g>
              {/* Axes */}
              <line x1="225" y1="110" x2="305" y2="110" stroke="#475569" strokeWidth="1" />
              <line x1="225" y1="30" x2="225" y2="110" stroke="#475569" strokeWidth="1" />
              {/* Overfit Curve (Highly oscillating to touch all points) */}
              <path d="M 228,105 Q 231,105 233,96 T 238,82 T 243,76 T 248,65 T 253,52 T 258,42 T 263,44 T 268,54 T 273,59 T 278,61 T 283,72 T 288,88 T 293,98 T 300,105" fill="none" stroke="#fbbf24" strokeWidth="2" />
              {/* Data points */}
              <circle cx="235" cy="100" r="3" fill="#38bdf8" />
              <circle cx="245" cy="80" r="3" fill="#38bdf8" />
              <circle cx="260" cy="55" r="3" fill="#38bdf8" />
              <circle cx="275" cy="45" r="3" fill="#38bdf8" />
              <circle cx="285" cy="60" r="3" fill="#38bdf8" />
              <circle cx="295" cy="85" r="3" fill="#38bdf8" />
              {/* Labels */}
              <text x="265" y="20" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle">Overfitting</text>
              <text x="265" y="135" fill="#64748b" fontSize="8" textAnchor="middle">High Variance (Over-complex)</text>
            </g>
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
      <div className="ml-algo-header">
        <div className="ml-algo-header-badge">
          <Sparkles size={12} />
          <span>Algorithm Sandbox</span>
        </div>
        <h2 className="ml-algo-title section-title-main">
          Machine Learning Algorithms
        </h2>
        <p className="tutorial-paragraph ml-algo-subtitle">
          Explore interactive visualizations, mathematical formulations, and clean Scikit-Learn code scripts for classical ML models.
        </p>
      </div>

      {/* Mobile / compact algorithm picker */}
      <div className="ml-algo-mobile-picker">
        <label htmlFor="ml-algo-select" className="ml-algo-mobile-picker-label">Jump to algorithm</label>
        <select
          id="ml-algo-select"
          className="ml-algo-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {ML_ALGORITHMS.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      {/* Split Screen Layout */}
      <div className="ml-algo-layout">
        {/* Left Column: List selector */}
        <div className="ml-algo-sidebar">
          {ML_ALGORITHMS.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                className={`ml-algo-card${isSelected ? ' selected' : ''}`}
                onClick={() => setSelectedId(item.id)}
              >
                {isSelected && <div className="ml-algo-card-accent" />}
                <span className="ml-algo-card-category">{item.category}</span>
                <h4 className="ml-algo-card-title">{item.name}</h4>
                <p className="ml-algo-card-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Visual Dashboard */}
        <div className="ml-algo-detail">
          {/* Top Panel - Name and Category */}
          <div className="ml-algo-detail-header">
            <div>
              <h3 className="ml-algo-detail-title">{algo.name}</h3>
              <span className="ml-algo-detail-category">{algo.category}</span>
            </div>
            <div className="ml-algo-ready-badge">
              <CheckCircle size={10} />
              <span>Sandbox Ready</span>
            </div>
          </div>

          {/* Description and Equation */}
          <div>
            <p className="ml-algo-detail-desc">{algo.desc}</p>
            <div className="ml-algo-formula-box">
              <span className="ml-algo-formula-label">Mathematical Formula:</span>
              {algo.formulaHTML ? (
                <div className="ml-algo-formula" dangerouslySetInnerHTML={{ __html: algo.formulaHTML }} />
              ) : (
                <div className="ml-algo-formula">{algo.formula}</div>
              )}
            </div>
          </div>

          {/* Global Regression Metrics - shown once for regression algorithms */}
          {(algo.category && algo.category.includes('Regression')) && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
              <div style={{ color: '#cbd5e1', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Regression Metrics — quick reference</div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 220px', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '10px' }}>
                  <strong style={{ color: '#e2e8f0' }}>MSE</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>MSE = (1/n) Σ (y - ŷ)² — penalizes large errors more; sensitive to outliers.</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <svg viewBox="0 0 180 80" style={{ width: '100%', height: '60px' }}>
                      <line x1="10" y1="60" x2="170" y2="20" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="40" cy="52" r="3" fill="#38bdf8" />
                      <rect x="36" y="30" width="8" height="22" fill="rgba(239,68,68,0.2)" />
                      <circle cx="110" cy="38" r="3" fill="#38bdf8" />
                      <rect x="106" y="18" width="8" height="20" fill="rgba(239,68,68,0.2)" />
                    </svg>
                  </div>
                </div>

                <div style={{ flex: '1 1 220px', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '10px' }}>
                  <strong style={{ color: '#e2e8f0' }}>RMSE</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>RMSE = √MSE — same interpretation as MSE but in original units; easier to compare to target values.</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <svg viewBox="0 0 180 80" style={{ width: '100%', height: '60px' }}>
                      <line x1="10" y1="60" x2="170" y2="20" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="60" cy="45" r="3" fill="#38bdf8" />
                      <line x1="60" y1="45" x2="60" y2="30" stroke="#ef4444" strokeWidth="2" />
                      <circle cx="140" cy="32" r="3" fill="#38bdf8" />
                      <line x1="140" y1="32" x2="140" y2="20" stroke="#ef4444" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                <div style={{ flex: '1 1 220px', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '10px' }}>
                  <strong style={{ color: '#e2e8f0' }}>MAE</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>MAE = (1/n) Σ |y - ŷ| — average magnitude of errors; robust to outliers compared to MSE.</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <svg viewBox="0 0 180 80" style={{ width: '100%', height: '60px' }}>
                      <line x1="10" y1="60" x2="170" y2="20" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="45" cy="55" r="3" fill="#38bdf8" />
                      <line x1="45" y1="55" x2="45" y2="43" stroke="#fbbf24" strokeWidth="2" />
                      <circle cx="115" cy="40" r="3" fill="#38bdf8" />
                      <line x1="115" y1="40" x2="115" y2="30" stroke="#fbbf24" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                <div style={{ flex: '1 1 220px', background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '10px' }}>
                  <strong style={{ color: '#e2e8f0' }}>R² (coefficient of determination)</strong>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>R² = 1 - (SSR / SST). Measures fraction of variance explained by the model (1 is perfect; 0 means no better than mean).</div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <svg viewBox="0 0 180 80" style={{ width: '100%', height: '60px' }}>
                      <line x1="10" y1="60" x2="170" y2="20" stroke="#6366f1" strokeWidth="2" />
                      <circle cx="60" cy="48" r="3" fill="#38bdf8" />
                      <circle cx="95" cy="50" r="3" fill="#38bdf8" />
                      <circle cx="130" cy="40" r="3" fill="#38bdf8" />
                      <line x1="10" y1="30" x2="170" y2="30" stroke="#64748b" strokeWidth="1" strokeDasharray="4,4" />
                      <text x="90" y="18" fill="#94a3b8" fontSize="8" textAnchor="middle">Higher R² ⇒ points closer to regression line</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Visualization Section */}
          <div className="ml-algo-viz-section">
            <span className="ml-algo-section-label">Interactive Visual Concept:</span>
            {algo.svgType === 'linear' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveLinearRegression />
              </div>
            ) : algo.svgType === 'polynomial' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractivePolynomialRegression />
              </div>
            ) : algo.svgType === 'multiple' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveMultipleLinearRegression />
              </div>
            ) : algo.svgType === 'gradient_descent' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveGradientDescent />
              </div>
            ) : algo.svgType === 'perceptron_trick' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractivePerceptronTrick />
              </div>
            ) : algo.svgType === 'logistic' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveLogisticRegression />
              </div>
            ) : algo.svgType === 'softmax' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveSoftmaxRegression />
              </div>
            ) : algo.svgType === 'confusion_matrix' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveConfusionMatrix />
              </div>
            ) : algo.svgType === 'knn' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveKNN />
              </div>
            ) : algo.svgType === 'svm' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveSVM />
              </div>
            ) : algo.svgType === 'regularization' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveRegularization />
              </div>
            ) : algo.svgType === 'kmeans' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveKMeans />
              </div>
            ) : algo.svgType === 'tree' ? (
              <div className="ml-algo-interactive-wrap">
                <InteractiveDecisionTree />
              </div>
            ) : (
              <div className="ml-algo-static-viz">
                {renderVisualization(algo.svgType)}
              </div>
            )}
          </div>

          

          {/* Code block */}
          <div className="ml-algo-code-section">
            <div className="ml-algo-code-header">
              <span className="ml-algo-section-label">Scikit-Learn Implementation:</span>
              <div className="ml-algo-code-tag">
                <Code size={12} />
                <span>Python Template</span>
              </div>
            </div>
            <pre className="ml-algo-code">
              <code>{algo.sklearn}</code>
            </pre>
          </div>

          {/* Extended Deep Dive Content */}
          {algo.extendedContent && (
            <div className="ml-algo-extended">
              
              {/* Intro & Equations */}
              {algo.extendedContent.intro && (
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 700 }}>
                    {algo.extendedContent.intro.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1rem' }}>
                    {algo.extendedContent.intro.desc}
                  </p>
                  <div className="ml-algo-intro-grid">
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{algo.extendedContent.intro.simpleTitle || "Simple Linear Regression"}</span>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{algo.extendedContent.intro.simpleDesc}</p>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                        {algo.extendedContent.intro.simpleFormula}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{algo.extendedContent.intro.multipleTitle || "Multiple Linear Regression"}</span>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{algo.extendedContent.intro.multipleDesc}</p>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: '#fff', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                        {algo.extendedContent.intro.multipleFormula}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* How it Works */}
              {algo.extendedContent.howItWorks && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 700 }}>{algo.extendedContent.howItWorks.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {algo.extendedContent.howItWorks.steps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>{idx + 1}</div>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#e2e8f0', display: 'block', marginBottom: '2px' }}>{step.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{step.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assumptions */}
              {algo.extendedContent.assumptions && (
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 700 }}>Key Assumptions</h4>
                  <div className="ml-algo-assumptions">
                    {algo.extendedContent.assumptions.map((assump, idx) => (
                      <div key={idx} className="ml-algo-assumption-card">
                        <strong style={{ fontSize: '0.82rem', color: '#e2e8f0', display: 'block', marginBottom: '0.25rem' }}>{assump.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>{assump.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              {algo.extendedContent.metrics && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem', fontWeight: 700 }}>Key Evaluation Metrics</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {algo.extendedContent.metrics.map((metric, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <Layers size={16} style={{ color: '#818cf8' }} />
                          <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{metric.name}</strong>
                        </div>
                        
                        {metric.formula && (
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: '#a5b4fc', background: 'rgba(0,0,0,0.25)', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '0.75rem', borderLeft: '3px solid #6366f1' }}>
                            {metric.formula}
                          </div>
                        )}
                        
                        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '1rem' }}>{metric.desc}</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                          {metric.advantages && (
                            <div style={{ background: 'rgba(74, 222, 128, 0.02)', border: '1px solid rgba(74, 222, 128, 0.08)', padding: '0.75rem', borderRadius: '8px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Advantages</span>
                              <ul style={{ margin: 0, paddingLeft: '1rem', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {metric.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                              </ul>
                            </div>
                          )}
                          {metric.disadvantages && (
                            <div style={{ background: 'rgba(244, 63, 94, 0.02)', border: '1px solid rgba(244, 63, 94, 0.08)', padding: '0.75rem', borderRadius: '8px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Disadvantages</span>
                              <ul style={{ margin: 0, paddingLeft: '1rem', color: '#94a3b8', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {metric.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                        {metric.whenToUse && (
                          <div style={{ marginTop: '0.75rem', background: 'rgba(56, 189, 248, 0.03)', border: '1px solid rgba(56, 189, 248, 0.1)', padding: '0.6rem 0.8rem', borderRadius: '8px', fontSize: '0.78rem', color: '#e2e8f0' }}>
                            <strong style={{ color: '#38bdf8' }}>When to use: </strong>{metric.whenToUse}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Metrics Error Growth Visual Comparison Table */}
                  {algo.extendedContent.comparison && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem' }}>
                      <h5 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>{algo.extendedContent.comparison.title}</h5>
                      
                      <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', color: '#cbd5e1' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              <th style={{ textAlign: 'left', padding: '0.5rem', color: '#818cf8' }}>Error Magnitude (y - ŷ)</th>
                              <th style={{ textAlign: 'center', padding: '0.5rem' }}>MAE Value</th>
                              <th style={{ textAlign: 'center', padding: '0.5rem', color: '#f43f5e' }}>MSE Value (Explodes)</th>
                              <th style={{ textAlign: 'center', padding: '0.5rem' }}>RMSE Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {algo.extendedContent.comparison.details.map((item, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <td style={{ padding: '0.5rem', fontWeight: 600 }}>{item.error}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.mae}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center', color: '#f43f5e', fontWeight: 600 }}>{item.mse}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.rmse}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {algo.extendedContent.comparison.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* FAQ / Interview QnA */}
                  {algo.extendedContent.faq && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem', fontWeight: 700 }}>Frequently Asked Interview Questions</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {algo.extendedContent.faq.map((item, idx) => (
                          <div key={idx} style={{ background: 'rgba(99,102,241,0.02)', border: '1px solid rgba(99,102,241,0.08)', padding: '1rem', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
                              <span style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px' }}>Q</span>
                              <strong style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{item.q}</strong>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5', margin: 0, paddingLeft: '1.4rem' }}>
                              <strong style={{ color: '#4ade80' }}>Ans: </strong>{item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pros & Cons */}
              {algo.extendedContent.proscons && (
                <div className="ml-algo-intro-grid">
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
