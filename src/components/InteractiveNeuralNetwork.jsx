import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Minus, Play, RotateCcw, X, Activity, GraduationCap, BarChart2, Mail } from 'lucide-react';

export default function InteractiveNeuralNetwork() {
  // Default architecture for the Spam Classifier example
  const [layers, setLayers] = useState([3, 2, 1]); 
  const [animating, setAnimating] = useState(false);
  const [activeLayer, setActiveLayer] = useState(-1);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // For the spam example, we use fixed activations (ReLU hidden, Sigmoid output)
  // but we keep the dropdown to allow users to override globally if they want to experiment.
  const [activationType, setActivationType] = useState('Mixed (Spam Example)'); 

  // Training Simulation State
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [learningRate, setLearningRate] = useState(0.01);
  const [lossHistory, setLossHistory] = useState([]);
  const [accuracyHistory, setAccuracyHistory] = useState([]);
  const [weightUpdates, setWeightUpdates] = useState(0);
  
  const MAX_EPOCHS = 100;
  const trainingIntervalRef = useRef(null);

  const MAX_LAYERS = 6;
  const MAX_NEURONS = 8;
  const MIN_LAYERS = 2; 

  // Specific labels for the Spam Example
  const spamInputLabels = ['"free"', '"win"', '"offer"'];
  const isSpamArchitecture = layers.length === 3 && layers[0] === 3 && layers[1] === 2 && layers[2] === 1;

  // Pseudo-random number generator for deterministic weights/biases
  const mulberry32 = (a) => {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  // Network math functions
  const activationFns = {
    'ReLU': (x) => Math.max(0, x),
    'Sigmoid': (x) => 1 / (1 + Math.exp(-x)),
    'Tanh': (x) => Math.tanh(x),
    'Linear': (x) => x
  };

  // Generate deterministic network parameters
  const networkParams = useMemo(() => {
    const seed = layers.join(''); 
    const rand = mulberry32(parseInt(seed) || 12345);
    
    const weights = {};
    const biases = {};
    const inputs = [];

    // For the specific spam example, we can use fixed intuitive inputs (e.g., word frequency counts)
    // or just random values between 0 and 1
    for (let i = 0; i < layers[0]; i++) {
      if (isSpamArchitecture) {
        inputs.push([0.8, 1.2, 0.4][i].toFixed(2)); // High frequency of "free" and "win"
      } else {
        inputs.push((rand() * 2).toFixed(2));
      }
    }

    for (let l = 1; l < layers.length; l++) {
      for (let n = 0; n < layers[l]; n++) {
        const targetId = `L${l}-N${n}`;
        biases[targetId] = (rand() * 2 - 1).toFixed(2);
        
        for (let prevN = 0; prevN < layers[l-1]; prevN++) {
          const sourceId = `L${l-1}-N${prevN}`;
          
          if (isSpamArchitecture) {
            // Hardcode some weights specifically to match a spam-like scenario if desired, 
            // or just use determinism. Let's use specific weights that lead to a logical conclusion.
            const presetWeights = {
              'L0-N0-L1-N0': '0.5', 'L0-N0-L1-N1': '0.4',
              'L0-N1-L1-N0': '-0.2', 'L0-N1-L1-N1': '0.1',
              'L0-N2-L1-N0': '0.3', 'L0-N2-L1-N1': '-0.5',
              'L1-N0-L2-N0': '0.7', 'L1-N1-L2-N0': '0.2'
            };
            weights[`${sourceId}-${targetId}`] = presetWeights[`${sourceId}-${targetId}`] || (rand() * 2 - 1).toFixed(1);
          } else {
            weights[`${sourceId}-${targetId}`] = (rand() * 4 - 2).toFixed(1); 
          }
        }
      }
    }
    return { weights, biases, inputs };
  }, [layers, isSpamArchitecture]);

  // Compute forward pass
  const computedNetwork = useMemo(() => {
    const nodeData = {};
    const { weights, biases, inputs } = networkParams;

    for (let n = 0; n < layers[0]; n++) {
      const id = `L0-N${n}`;
      nodeData[id] = { z: parseFloat(inputs[n]), a: parseFloat(inputs[n]) };
    }

    for (let l = 1; l < layers.length; l++) {
      for (let n = 0; n < layers[l]; n++) {
        const targetId = `L${l}-N${n}`;
        let z = parseFloat(biases[targetId]);
        
        for (let prevN = 0; prevN < layers[l-1]; prevN++) {
          const sourceId = `L${l-1}-N${prevN}`;
          const w = parseFloat(weights[`${sourceId}-${targetId}`]);
          const a_prev = nodeData[sourceId].a;
          z += w * a_prev;
        }
        
        // Apply activation logic
        let a;
        if (activationType === 'Mixed (Spam Example)') {
          // Hidden layers = ReLU, Output layer = Sigmoid
          if (l === layers.length - 1) {
            a = activationFns['Sigmoid'](z);
          } else {
            a = activationFns['ReLU'](z);
          }
        } else {
          a = activationFns[activationType](z);
        }
        
        nodeData[targetId] = { z, a };
      }
    }
    return nodeData;
  }, [layers, networkParams, activationType]);

  const addLayer = () => {
    if (layers.length < MAX_LAYERS) {
      const newLayers = [...layers];
      newLayers.splice(newLayers.length - 1, 0, 3);
      setLayers(newLayers);
      if (activationType === 'Mixed (Spam Example)') setActivationType('ReLU');
      resetAnimation();
      resetTraining();
    }
  };

  const removeLayer = () => {
    if (layers.length > MIN_LAYERS) {
      const newLayers = [...layers];
      newLayers.splice(newLayers.length - 2, 1);
      setLayers(newLayers);
      if (activationType === 'Mixed (Spam Example)') setActivationType('ReLU');
      resetAnimation();
      resetTraining();
    }
  };

  const changeNeurons = (index, delta) => {
    const newLayers = [...layers];
    const newVal = newLayers[index] + delta;
    if (newVal >= 1 && newVal <= MAX_NEURONS) {
      newLayers[index] = newVal;
      setLayers(newLayers);
      if (activationType === 'Mixed (Spam Example)') setActivationType('ReLU');
      resetAnimation();
      resetTraining();
    }
  };

  const resetAnimation = () => {
    setAnimating(false);
    setActiveLayer(-1);
    setSelectedNode(null);
  };

  const simulateForwardPass = () => {
    if (animating) return;
    setAnimating(true);
    setActiveLayer(0);
    setSelectedNode(null);
  };

  useEffect(() => {
    if (animating && activeLayer < layers.length) {
      const timer = setTimeout(() => {
        setActiveLayer(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (animating && activeLayer >= layers.length) {
      const timer = setTimeout(() => {
        setAnimating(false);
        setActiveLayer(-1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [animating, activeLayer, layers.length]);

  // --- Training Simulation Logic ---
  const toggleTraining = () => {
    if (isTraining) {
      setIsTraining(false);
      if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
    } else {
      if (epoch >= MAX_EPOCHS) resetTraining();
      setIsTraining(true);
    }
  };

  const resetTraining = () => {
    setIsTraining(false);
    setEpoch(0);
    setLossHistory([]);
    setAccuracyHistory([]);
    setWeightUpdates(0);
    if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
  };

  useEffect(() => {
    if (isTraining) {
      trainingIntervalRef.current = setInterval(() => {
        setEpoch(prev => {
          if (prev >= MAX_EPOCHS) {
            setIsTraining(false);
            clearInterval(trainingIntervalRef.current);
            return prev;
          }
          const currentEpoch = prev + 1;
          
          const baseLoss = 0.9 * Math.exp(-currentEpoch * (learningRate * 4));
          const noise = (Math.random() * 0.05 - 0.02) * (1 - currentEpoch/MAX_EPOCHS);
          const newLoss = Math.max(0.01, baseLoss + noise);
          setLossHistory(h => [...h, newLoss]);

          const targetAcc = 0.95;
          const baseAcc = targetAcc - (targetAcc - 0.1) * Math.exp(-currentEpoch * (learningRate * 3));
          const accNoise = (Math.random() * 0.02 - 0.01);
          const newAcc = Math.min(0.99, baseAcc + accNoise);
          setAccuracyHistory(h => [...h, newAcc]);
          
          const totalEdges = Object.keys(networkParams.weights).length + Object.keys(networkParams.biases).length;
          setWeightUpdates(u => u + totalEdges);

          return currentEpoch;
        });
      }, 100);
    }
    return () => {
      if (trainingIntervalRef.current) clearInterval(trainingIntervalRef.current);
    }
  }, [isTraining, learningRate, networkParams]);

  const currentLoss = lossHistory.length > 0 ? lossHistory[lossHistory.length - 1].toFixed(3) : '0.000';
  const currentAcc = accuracyHistory.length > 0 ? (accuracyHistory[accuracyHistory.length - 1] * 100).toFixed(1) : '0.0';

  // Layout parameters for Network SVG
  const svgWidth = 900;
  const svgHeight = 450;
  const paddingX = 120;
  const layerSpacing = layers.length > 1 ? (svgWidth - 2 * paddingX) / (layers.length - 1) : 0;

  const nodes = [];
  layers.forEach((numNeurons, lIdx) => {
    const x = paddingX + lIdx * layerSpacing;
    const spacingY = 70;
    const startY = svgHeight / 2 - ((numNeurons - 1) * spacingY) / 2;
    for (let n = 0; n < numNeurons; n++) {
      nodes.push({ id: `L${lIdx}-N${n}`, layer: lIdx, index: n, x, y: startY + n * spacingY });
    }
  });

  const edges = [];
  for (let l = 0; l < layers.length - 1; l++) {
    const currentLayerNodes = nodes.filter(n => n.layer === l);
    const nextLayerNodes = nodes.filter(n => n.layer === l + 1);
    currentLayerNodes.forEach(source => {
      nextLayerNodes.forEach(target => {
        edges.push({ id: `${source.id}-${target.id}`, source, target, layer: l });
      });
    });
  }

  const getLayerColor = (idx) => {
    if (idx === 0) return '#10b981'; // Green for input in spam example
    if (idx === layers.length - 1) return '#f43f5e'; // Red/Pink for output
    return '#3b82f6'; // Blue for hidden
  };

  const getLayerLabel = (idx) => {
    if (isSpamArchitecture) {
      if (idx === 0) return 'Input Layer (Email Words)';
      if (idx === layers.length - 1) return 'Output Layer (Sigmoid)';
      return `Hidden Layer (ReLU)`;
    }
    if (idx === 0) return 'Input Layer';
    if (idx === layers.length - 1) return 'Output Layer';
    return `Hidden Layer ${idx}`;
  };

  const handleNodeClick = (node) => {
    if (node.layer === 0) return; 
    setSelectedNode(node);
  };

  const renderActivationCurve = (zValue, aValue, forcedType) => {
    const w = 200;
    const h = 100;
    const cx = w/2;
    const cy = h/2;
    const scaleX = 20; 
    const scaleY = 30;
    
    // Determine which curve to draw
    let curveType = activationType;
    if (activationType === 'Mixed (Spam Example)') {
      curveType = forcedType || 'ReLU'; 
    }
    
    let path = `M 0 ${cy}`;
    for(let i=0; i<=w; i+=5) {
      const x = (i - cx) / scaleX;
      const y = activationFns[curveType](x);
      const py = cy - (y * scaleY);
      path += ` L ${i} ${py}`;
    }

    const pzX = Math.min(Math.max(cx + (zValue||0) * scaleX, 0), w);
    const pzY = Math.min(Math.max(cy - (aValue||0) * scaleY, 0), h);

    return (
      <div style={{ textAlign: 'center' }}>
        <svg width={w} height={h} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <line x1="0" y1={cy} x2={w} y2={cy} stroke="rgba(255,255,255,0.2)" />
          <line x1={cx} y1="0" x2={cx} y2={h} stroke="rgba(255,255,255,0.2)" />
          <path d={path} fill="none" stroke="#f59e0b" strokeWidth="2" />
          {zValue !== undefined && aValue !== undefined && (
            <>
              <circle cx={pzX} cy={pzY} r="4" fill="#10b981" />
              <line x1={pzX} y1={cy} x2={pzX} y2={pzY} stroke="#10b981" strokeDasharray="2" />
              <line x1={cx} y1={pzY} x2={pzX} y2={pzY} stroke="#10b981" strokeDasharray="2" />
            </>
          )}
        </svg>
        <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px', fontWeight: 'bold' }}>{curveType} Curve</div>
      </div>
    );
  };

  // Render Line Chart
  const renderLineChart = (data, color, isPercentage = false) => {
    const width = 250;
    const height = 150;
    const padding = 20;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    
    let points = "";
    if (data.length > 0) {
      const maxVal = isPercentage ? 1 : Math.max(...data, 1);
      data.forEach((val, i) => {
        const x = padding + (i / MAX_EPOCHS) * chartW;
        const y = height - padding - (val / maxVal) * chartH;
        points += `${x},${y} `;
      });
    }

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#475569" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#475569" />
        
        <text x={padding - 5} y={padding + 5} fill="#64748b" fontSize="9" textAnchor="end">{isPercentage ? '100%' : '1.0'}</text>
        <text x={padding - 5} y={height - padding} fill="#64748b" fontSize="9" textAnchor="end">0</text>
        <text x={padding - 15} y={height/2} fill="#64748b" fontSize="9" textAnchor="middle" transform={`rotate(-90, ${padding-15}, ${height/2})`}>
          {isPercentage ? 'Accuracy' : 'Loss'}
        </text>

        <text x={width/2} y={height - 2} fill="#64748b" fontSize="9" textAnchor="middle">Epoch</text>

        {data.length > 0 && (
          <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        )}
        
        {data.length > 0 && (
          <circle 
            cx={padding + ((data.length - 1) / MAX_EPOCHS) * chartW} 
            cy={height - padding - (data[data.length - 1] / (isPercentage ? 1 : Math.max(...data, 1))) * chartH} 
            r="3" 
            fill={color} 
          />
        )}
      </svg>
    );
  };

  const outputNodeData = isSpamArchitecture ? computedNetwork[`L2-N0`] : null;
  const isSpamClassified = outputNodeData && outputNodeData.a > 0.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
      
      {/* ---------------- NETWORK VISUALIZER ---------------- */}
      <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#3b82f6" />
            Interactive Neural Network (Spam Classifier Example)
          </h3>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e2e8f0', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
              <span style={{ color: '#475569', fontSize: '0.85rem', fontWeight: 'bold' }}>Activation:</span>
              <select 
                value={activationType} 
                onChange={(e) => { setActivationType(e.target.value); resetTraining(); }}
                style={{ background: '#fff', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 5px', outline: 'none' }}
              >
                <option value="Mixed (Spam Example)">Mixed (Spam Example)</option>
                <option value="ReLU">ReLU</option>
                <option value="Sigmoid">Sigmoid</option>
                <option value="Tanh">Tanh</option>
                <option value="Linear">Linear</option>
              </select>
            </div>

            <button 
              onClick={simulateForwardPass}
              disabled={animating}
              className="theme-toggle-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', borderRadius: '8px', background: animating ? '#cbd5e1' : '#3b82f6', color: '#fff', border: 'none', cursor: animating ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              <Play size={16} /> Simulate Forward Pass
            </button>
          </div>
        </div>

        {/* Spam Classification Banner */}
        {isSpamArchitecture && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: isSpamClassified ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', border: `1px solid ${isSpamClassified ? '#f87171' : '#4ade80'}`, borderRadius: '8px' }}>
            <h4 style={{ color: '#1e293b', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={18} color={isSpamClassified ? '#ef4444' : '#22c55e'}/> 
              Final Classification: {isSpamClassified ? 'SPAM EMAIL' : 'NOT SPAM'}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>The output value of approximately <strong>{outputNodeData?.a.toFixed(3)}</strong> indicates the probability of the email being spam.</li>
              <li>Since this value is <strong>{isSpamClassified ? 'greater' : 'less'} than 0.5</strong>, the neural network classifies the email as {isSpamClassified ? 'spam (1)' : 'legitimate (0)'}.</li>
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ background: '#e2e8f0', padding: '0.5rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 'bold' }}>Architecture:</span>
            <button onClick={removeLayer} disabled={layers.length <= MIN_LAYERS} style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#1e293b', borderRadius: '4px', cursor: 'pointer' }}><Minus size={14} /></button>
            <span style={{ color: '#1e293b', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{layers.length - 2}</span>
            <button onClick={addLayer} disabled={layers.length >= MAX_LAYERS} style={{ background: '#fff', border: '1px solid #cbd5e1', color: '#1e293b', borderRadius: '4px', cursor: 'pointer' }}><Plus size={14} /></button>
          </div>
          <span style={{ color: '#64748b', fontSize: '0.85rem', alignSelf: 'center' }}>
            *(Change architecture to break out of the Spam Example template). Click any node to inspect its math!
          </span>
        </div>

        <div style={{ overflowX: 'auto', position: 'relative', background: '#f1f5f9', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ minWidth: '600px', background: 'transparent' }}>
            
            {/* Draw Labels */}
            {layers.map((_, idx) => {
              const x = paddingX + idx * layerSpacing;
              return (
                <g key={`controls-${idx}`}>
                  <text x={x} y={svgHeight - 20} fill="#1e293b" fontSize="16" fontWeight="bold" textAnchor="middle">
                    {getLayerLabel(idx)}
                  </text>
                </g>
              );
            })}

            {/* Draw Edges */}
            {edges.map(edge => {
              const isActive = animating && activeLayer === edge.layer;
              const isPassed = animating && activeLayer > edge.layer;
              const isSelected = selectedNode && edge.target.id === selectedNode.id;
              
              let strokeColor = '#cbd5e1';
              let strokeWidth = 1.5;
              
              if (isSelected) {
                strokeColor = '#3b82f6';
                strokeWidth = 3;
              } else if (isActive) {
                strokeColor = '#f59e0b';
                strokeWidth = 3;
              } else if (isPassed) {
                strokeColor = '#94a3b8';
              } else if (isTraining) {
                const edgeSeed = edge.id.length + epoch;
                strokeWidth = 1.5 + (edgeSeed % 3) * 0.5;
                strokeColor = (edgeSeed % 5 === 0) ? '#3b82f6' : '#cbd5e1';
              }

              return (
                <g key={edge.id}>
                  <line 
                    x1={edge.source.x} y1={edge.source.y}
                    x2={edge.target.x} y2={edge.target.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    style={{ transition: 'all 0.1s ease' }}
                  />
                  {/* Show weight text if it's the spam architecture to match screenshot */}
                  {isSpamArchitecture && (
                    <text 
                      x={edge.source.x + (edge.target.x - edge.source.x) * 0.35} 
                      y={edge.source.y + (edge.target.y - edge.source.y) * 0.35 - 5} 
                      fill="#475569" 
                      fontSize="12" 
                      fontWeight="bold"
                      style={{ filter: isActive ? 'drop-shadow(0 0 2px #fff)' : 'none' }}
                    >
                      {networkParams.weights[edge.id]}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map(node => {
              const isOutput = node.layer === layers.length - 1;
              const isInput = node.layer === 0;
              const baseColor = '#dcfce7'; // Light green fill matching screenshot
              
              const isActive = animating && (activeLayer === node.layer || (activeLayer > node.layer && isOutput));
              const isSelected = selectedNode && selectedNode.id === node.id;

              let fill = baseColor;
              let stroke = '#166534';
              let shadow = 'none';

              if (isSelected) {
                fill = '#86efac';
                stroke = '#14532d';
                shadow = `0 0 20px #86efac`;
              } else if (isActive) {
                fill = '#fde047';
                stroke = '#854d0e';
                shadow = `0 0 15px #facc15`;
              }

              // Determine text for node
              let mainText = `N${node.index}`;
              let subText = computedNetwork[node.id].a.toFixed(2);

              if (isSpamArchitecture) {
                if (isInput) {
                  mainText = spamInputLabels[node.index];
                  subText = '';
                } else if (isOutput) {
                  mainText = "Spam";
                  subText = "Probability";
                } else {
                  mainText = "Neuron";
                  subText = `H${node.index + 1}`;
                }
              }

              return (
                <g key={node.id} style={{ transition: 'all 0.3s ease', cursor: isInput ? 'default' : 'pointer' }} onClick={() => handleNodeClick(node)}>
                  <circle 
                    cx={node.x} cy={node.y} 
                    r={isSelected ? 32 : 30} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={isSelected ? 2 : 1}
                    style={{ filter: (isActive || isSelected) ? `drop-shadow(${shadow})` : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))', transition: 'all 0.3s ease' }}
                  />
                  <text x={node.x} y={node.y - (subText ? 4 : -4)} fill="#1e293b" fontSize="13" fontWeight="bold" textAnchor="middle" pointerEvents="none">
                    {mainText}
                  </text>
                  {subText && (
                    <text x={node.x} y={node.y + 12} fill="#1e293b" fontSize="12" textAnchor="middle" pointerEvents="none">
                      {subText}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Signal Animations */}
            {animating && activeLayer >= 0 && activeLayer < layers.length - 1 && edges.filter(e => e.layer === activeLayer).map((edge, idx) => (
              <circle key={`signal-${idx}`} r={5} fill="#f59e0b">
                <animateMotion 
                  dur="0.8s" 
                  repeatCount="1"
                  path={`M ${edge.source.x} ${edge.source.y} L ${edge.target.x} ${edge.target.y}`}
                  fill="freeze"
                />
              </circle>
            ))}

            {/* Backpropagation signals (Weight Updates) during training */}
            {isTraining && edges.map((edge, idx) => {
              if ((edge.id.length + epoch + idx) % 4 !== 0) return null;
              return (
                <circle key={`backprop-${idx}-${epoch}`} r={4} fill="#ef4444">
                  <animateMotion 
                    dur="0.5s" 
                    repeatCount="1"
                    path={`M ${edge.target.x} ${edge.target.y} L ${edge.source.x} ${edge.source.y}`}
                    fill="freeze"
                  />
                </circle>
              );
            })}
          </svg>

          {/* Node controls overlay (desktop) */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            {layers.map((_, idx) => {
              const leftPct = ((paddingX + idx * layerSpacing) / svgWidth) * 100;
              return (
                <div key={`adjust-${idx}`} style={{ position: 'absolute', left: `${leftPct}%`, top: '10px', transform: 'translateX(-50%)', display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
                  <button onClick={() => changeNeurons(idx, 1)} disabled={layers[idx] >= MAX_NEURONS} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fff', color: '#1e293b', border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><Plus size={14} /></button>
                  <button onClick={() => changeNeurons(idx, -1)} disabled={layers[idx] <= 1} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fff', color: '#1e293b', border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><Minus size={14} /></button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Math Panel Popup */}
        {selectedNode && (
          <div style={{ position: 'absolute', right: '30px', top: '100px', width: '320px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 10, backdropFilter: 'blur(10px)' }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
              <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>
                {isSpamArchitecture ? (selectedNode.layer === 2 ? 'Output Layer Math' : `Hidden Neuron ${selectedNode.index + 1} Math`) : `Node ${selectedNode.id} Math`}
              </h4>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#38bdf8' }}>1. Calculate Weighted Sum (z):</strong>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '6px', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                  z = (Σ a_prev × w) + b
                  <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '4px 0' }}/>
                  {(() => {
                    const l = selectedNode.layer;
                    const prevNodes = layers[l-1];
                    let equation = '';
                    for (let i=0; i<prevNodes; i++) {
                      const sourceId = `L${l-1}-N${i}`;
                      const w = networkParams.weights[`${sourceId}-${selectedNode.id}`];
                      const a_prev = computedNetwork[sourceId].a.toFixed(2);
                      equation += `(${a_prev} × ${w}) + `;
                    }
                    equation += networkParams.biases[selectedNode.id];
                    return <div style={{ fontSize: '0.75rem', color: '#94a3b8', wordBreak: 'break-all' }}>{equation}</div>;
                  })()}
                  <div style={{ color: '#10b981', marginTop: '4px', fontWeight: 'bold' }}>z = {computedNetwork[selectedNode.id].z.toFixed(3)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#f59e0b' }}>
                  2. Apply Activation ({activationType === 'Mixed (Spam Example)' ? (selectedNode.layer === 2 ? 'Sigmoid' : 'ReLU') : activationType}):
                </strong>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '6px', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                  a = f(z)
                  <div style={{ color: '#a855f7', marginTop: '4px', fontWeight: 'bold' }}>a = {computedNetwork[selectedNode.id].a.toFixed(3)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {renderActivationCurve(
                  computedNetwork[selectedNode.id].z, 
                  computedNetwork[selectedNode.id].a,
                  activationType === 'Mixed (Spam Example)' ? (selectedNode.layer === 2 ? 'Sigmoid' : 'ReLU') : null
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- TRAINING SIMULATION ---------------- */}
      <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#333' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', margin: '0 0 1rem 0' }}>
          <GraduationCap size={22} /> Training Simulation
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Watch how the network learns by adjusting its weights through backpropagation
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            onClick={toggleTraining}
            style={{ 
              background: isTraining ? '#cbd5e1' : '#f59e0b', 
              color: isTraining ? '#64748b' : '#fff', 
              border: 'none', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              minWidth: '120px',
              transition: 'all 0.2s ease'
            }}
          >
            {isTraining ? 'Training...' : epoch === MAX_EPOCHS ? 'Restart' : 'Start Training'}
          </button>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', color: '#475569', fontSize: '0.9rem' }}>
                Learning Rate: <span style={{ background: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '12px' }}>{learningRate}</span>
              </span>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 'bold' }}>Epoch: {epoch} / {MAX_EPOCHS}</span>
            </div>
            
            <input 
              type="range" 
              min="0.001" 
              max="0.1" 
              step="0.001" 
              value={learningRate} 
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              disabled={isTraining}
              style={{ width: '100%', accentColor: '#3b82f6', cursor: isTraining ? 'not-allowed' : 'pointer' }}
            />
            
            {/* Progress Bar Container */}
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginTop: '1rem', overflow: 'hidden' }}>
              <div style={{ width: `${(epoch / MAX_EPOCHS) * 100}%`, height: '100%', background: '#f59e0b', transition: 'width 0.1s linear' }} />
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Loss (Error)</div>
            <div style={{ color: '#ef4444', fontSize: '1.8rem', fontWeight: 'bold' }}>{currentLoss}</div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Accuracy</div>
            <div style={{ color: '#22c55e', fontSize: '1.8rem', fontWeight: 'bold' }}>{currentAcc}%</div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Weight Updates</div>
            <div style={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 'bold' }}>{weightUpdates.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ---------------- TRAINING PROGRESS VISUALIZATION ---------------- */}
      <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#3b82f6', margin: '0 0 2rem 0' }}>
          <BarChart2 size={22} /> Training Progress Visualization
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '1rem' }}>Loss Over Time</h4>
            {renderLineChart(lossHistory, '#ef4444', false)}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '1rem' }}>Accuracy Over Time</h4>
            {renderLineChart(accuracyHistory, '#22c55e', true)}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '1rem' }}>Activation Function Shape</h4>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ transform: 'scale(1.2)' }}>
                {renderActivationCurve(null, null, activationType === 'Mixed (Spam Example)' ? 'ReLU' : null)}
              </div>
            </div>
            <div style={{ marginTop: '2rem', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {activationType === 'Mixed (Spam Example)' ? 'ReLU (Hidden) / Sigmoid (Output)' : activationType}
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
