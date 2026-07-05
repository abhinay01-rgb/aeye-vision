import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Shuffle, Settings, Activity, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const trueWeights = [2, -1.5, 1, -0.5, 0.8, -0.3, 0.6, -0.8, 0.4, -0.2];

export default function InteractiveRegularization() {
  const [regType, setRegType] = useState('none');
  const [lambda, setLambda] = useState(0);
  const [noiseLevel, setNoiseLevel] = useState(0.3);
  const [numFeatures, setNumFeatures] = useState(6);
  
  const [trainData, setTrainData] = useState({ X: [], y: [] });
  const [testData, setTestData] = useState({ X: [], y: [] });
  const [learnedWeights, setLearnedWeights] = useState([]);
  
  // Metrics
  const [metrics, setMetrics] = useState({
    trainError: 0,
    testError: 0,
    activeFeatures: 0,
    regPenalty: 0,
    weightDiff: 0
  });

  const generateData = useCallback((n, features, noise) => {
    const X = [];
    const y = [];
    
    for (let i = 0; i < n; i++) {
      const row = [];
      let target = 0;
      
      for (let j = 0; j < features; j++) {
        const feature = (Math.random() - 0.5) * 4;
        row.push(feature);
        target += trueWeights[j] * feature;
      }
      
      target += (Math.random() - 0.5) * noise * 4;
      X.push(row);
      y.push(target);
    }
    return { X, y };
  }, []);

  const handleGenerateNewData = useCallback(() => {
    setTrainData(generateData(80, numFeatures, noiseLevel));
    setTestData(generateData(40, numFeatures, noiseLevel));
  }, [numFeatures, noiseLevel, generateData]);

  useEffect(() => {
    handleGenerateNewData();
  }, [numFeatures]); 

  useEffect(() => {
    setTrainData(generateData(80, numFeatures, noiseLevel));
    setTestData(generateData(40, numFeatures, noiseLevel));
  }, [noiseLevel, generateData, numFeatures]);

  useEffect(() => {
    if (trainData.X.length === 0) return;

    const n = trainData.X.length;
    const p = numFeatures;
    
    // Initialize weights
    let weights = new Array(p).fill(0);
    
    // Simple gradient descent
    const learningRate = 0.01;
    const iterations = 500;
    
    for (let iter = 0; iter < iterations; iter++) {
      const gradient = new Array(p).fill(0);
      
      for (let i = 0; i < n; i++) {
        let prediction = 0;
        for (let j = 0; j < p; j++) {
          prediction += weights[j] * trainData.X[i][j];
        }
        const error = prediction - trainData.y[i];
        for (let j = 0; j < p; j++) {
          gradient[j] += (2 / n) * error * trainData.X[i][j];
        }
      }
      
      for (let j = 0; j < p; j++) {
        if (regType === 'l1') {
          gradient[j] += lambda * Math.sign(weights[j]);
        } else if (regType === 'l2') {
          gradient[j] += 2 * lambda * weights[j];
        }
      }
      
      for (let j = 0; j < p; j++) {
        weights[j] -= learningRate * gradient[j];
        
        if (regType === 'l1') {
          const threshold = learningRate * lambda;
          if (Math.abs(weights[j]) < threshold) {
            weights[j] = 0;
          } else {
            weights[j] = Math.sign(weights[j]) * (Math.abs(weights[j]) - threshold);
          }
        }
      }
    }
    
    setLearnedWeights(weights);

    // Calculate metrics
    const calcError = (data, w) => {
      let mse = 0;
      for (let i = 0; i < data.X.length; i++) {
        let prediction = 0;
        for (let j = 0; j < p; j++) {
          prediction += w[j] * data.X[i][j];
        }
        mse += Math.pow(prediction - data.y[i], 2);
      }
      return mse / data.X.length;
    };

    const trainError = calcError(trainData, weights);
    const testError = calcError(testData, weights);
    
    let penalty = 0;
    if (regType !== 'none') {
      for (let w of weights) {
        if (regType === 'l1') penalty += Math.abs(w);
        else if (regType === 'l2') penalty += w * w;
      }
      penalty *= lambda;
    }

    let diff = 0;
    for (let i = 0; i < p; i++) {
      diff += Math.pow(weights[i] - trueWeights[i], 2);
    }
    diff /= p;

    setMetrics({
      trainError,
      testError,
      activeFeatures: weights.filter(w => Math.abs(w) > 0.01).length,
      regPenalty: penalty,
      weightDiff: diff
    });

  }, [trainData, testData, lambda, regType, numFeatures]);

  const barChartData = useMemo(() => {
    return {
      labels: Array.from({ length: numFeatures }, (_, i) => `F${i + 1}`),
      datasets: [
        {
          label: 'True Weights',
          data: trueWeights.slice(0, numFeatures),
          backgroundColor: 'rgba(56, 189, 248, 0.4)',
          borderColor: '#38bdf8',
          borderWidth: 1.5,
          borderRadius: 4
        },
        {
          label: 'Learned Weights',
          data: learnedWeights,
          backgroundColor: 'rgba(244, 63, 94, 0.6)',
          borderColor: '#f43f5e',
          borderWidth: 1.5,
          borderRadius: 4
        }
      ]
    };
  }, [numFeatures, learnedWeights]);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: '#cbd5e1',
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    },
    plugins: {
      legend: { labels: { color: '#cbd5e1' } }
    }
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '1.25rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
      
      {/* Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        <div style={cardStyle}>
          <h4 style={{ color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={16} /> Regularization Settings</h4>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['none', 'l1', 'l2'].map(type => (
              <button
                key={type}
                onClick={() => setRegType(type)}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', border: '1px solid',
                  background: regType === type ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                  borderColor: regType === type ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)',
                  color: regType === type ? '#fff' : '#94a3b8',
                  textTransform: 'capitalize'
                }}
              >
                {type === 'none' ? 'None' : type.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 'bold' }}>Regularization Strength (λ)</span>
              <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{lambda.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0" max="2" step="0.05" value={lambda} 
              onChange={e => setLambda(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 'bold' }}>Data Noise Level</span>
              <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{noiseLevel.toFixed(1)}</span>
            </div>
            <input 
              type="range" min="0" max="1.5" step="0.1" value={noiseLevel} 
              onChange={e => setNoiseLevel(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 'bold' }}>Number of Features</span>
              <span style={{ color: '#818cf8', fontWeight: 'bold' }}>{numFeatures}</span>
            </div>
            <input 
              type="range" min="3" max="10" step="1" value={numFeatures} 
              onChange={e => setNumFeatures(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#6366f1' }}
            />
          </div>

          <button 
            onClick={handleGenerateNewData}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
            }}
          >
            <Shuffle size={16} /> Generate New Data
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ ...cardStyle, flex: 1 }}>
            <h4 style={{ color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={16} /> Performance Metrics</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Training Error</div>
                <div style={{ color: '#f43f5e', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{metrics.trainError.toFixed(2)}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test Error</div>
                <div style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{metrics.testError.toFixed(2)}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Features</div>
                <div style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{metrics.activeFeatures} / {numFeatures}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weight MSE</div>
                <div style={{ color: '#a855f7', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{metrics.weightDiff.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h4 style={{ color: '#e2e8f0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={16} /> Feature Weights Chart</h4>
        <div style={{ height: '300px', width: '100%' }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

    </div>
  );
}
