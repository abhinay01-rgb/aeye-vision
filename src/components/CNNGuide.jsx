import React, { useState, useEffect, useRef } from 'react';
import { Camera, Layers, Image as ImageIcon, Maximize, Play, RotateCcw, ArrowRight, Network, ArrowDown, LayoutTemplate, Activity, Code, Box, Lock, Unlock, Grid, CheckCircle2, Zap } from 'lucide-react';

export default function CNNGuide() {
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive Convolution State
  const [usePadding, setUsePadding] = useState(false);
  const [convStep, setConvStep] = useState(-1);
  const [isConvPlaying, setIsConvPlaying] = useState(false);
  const convIntervalRef = useRef(null);

  // Flattening State
  const [flatStep, setFlatStep] = useState(-1);
  const [isFlatPlaying, setIsFlatPlaying] = useState(false);
  const flatIntervalRef = useRef(null);

  // Full Pipeline Classification State
  const [selectedImage, setSelectedImage] = useState('Dog');
  const [classifyStep, setClassifyStep] = useState(0);
  const [isClassifying, setIsClassifying] = useState(false);
  const classifyIntervalRef = useRef(null);

  // Transfer Learning State
  const [isTlPlaying, setIsTlPlaying] = useState(false);
  const [tlEpoch, setTlEpoch] = useState(0);
  const tlIntervalRef = useRef(null);

  const runTransferLearning = () => {
    if (isTlPlaying) return;
    setIsTlPlaying(true);
    setTlEpoch(0);
    let currentEpoch = 0;
    
    tlIntervalRef.current = setInterval(() => {
      currentEpoch++;
      setTlEpoch(currentEpoch);
      if (currentEpoch >= 5) {
        clearInterval(tlIntervalRef.current);
        setIsTlPlaying(false);
      }
    }, 800);
  };

  // ViT Animation State
  const [isVitPlaying, setIsVitPlaying] = useState(false);
  const [vitStep, setVitStep] = useState(-1);
  const vitIntervalRef = useRef(null);

  const runVitAnimation = () => {
    if (isVitPlaying) return;
    setIsVitPlaying(true);
    setVitStep(-1);
    let currentStep = -1;
    
    vitIntervalRef.current = setInterval(() => {
      currentStep++;
      setVitStep(currentStep);
      if (currentStep >= 5) {
        clearInterval(vitIntervalRef.current);
        setIsVitPlaying(false);
      }
    }, 1200); // slightly longer interval for reading steps
  };

  const runClassification = () => {
    if (isClassifying) return;
    setIsClassifying(true);
    setClassifyStep(0);

    classifyIntervalRef.current = setInterval(() => {
      setClassifyStep(prev => {
        if (prev >= 8) {
          clearInterval(classifyIntervalRef.current);
          setIsClassifying(false);
          return 8;
        }
        return prev + 1;
      });
    }, 600); // 600ms per step
  };

  // 5x5 Base Input Image
  const baseInputImage = [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1]
  ];

  // 7x7 Padded Image (Zero Padding)
  const paddedImage = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ];

  const activeImage = usePadding ? paddedImage : baseInputImage;
  const outSize = usePadding ? 5 : 3;
  const maxConvSteps = usePadding ? 25 : 9;

  // 3x3 Kernel (Diagonal Edge Detector)
  const kernel = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  // Start Convolution Animation
  const playConvolution = () => {
    if (isConvPlaying) return;
    setIsConvPlaying(true);
    setConvStep(0);
    
    convIntervalRef.current = setInterval(() => {
      setConvStep((prev) => {
        if (prev >= maxConvSteps - 1) {
          clearInterval(convIntervalRef.current);
          setIsConvPlaying(false);
          return maxConvSteps - 1;
        }
        return prev + 1;
      });
    }, usePadding ? 300 : 800); // speed up if padding is on to not bore the user
  };

  const resetConvolution = () => {
    clearInterval(convIntervalRef.current);
    setIsConvPlaying(false);
    setConvStep(-1);
  };

  // Start Flattening Animation
  const playFlattening = () => {
    if (isFlatPlaying) return;
    setIsFlatPlaying(true);
    setFlatStep(0);
    
    flatIntervalRef.current = setInterval(() => {
      setFlatStep((prev) => {
        if (prev >= 8) {
          clearInterval(flatIntervalRef.current);
          setIsFlatPlaying(false);
          return 8;
        }
        return prev + 1;
      });
    }, 500);
  };

  const resetFlattening = () => {
    clearInterval(flatIntervalRef.current);
    setIsFlatPlaying(false);
    setFlatStep(-1);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(convIntervalRef.current);
      clearInterval(classifyIntervalRef.current);
      clearInterval(flatIntervalRef.current);
      clearInterval(tlIntervalRef.current);
      clearInterval(vitIntervalRef.current);
    };
  }, []);

  // Helper to render grid cells
  const renderGrid = (data, size, highlightRow = -1, highlightCol = -1, kernelSize = 3, label = "") => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h4 style={{ color: '#1e293b', marginBottom: '1rem' }}>{label}</h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${size}, 40px)`, 
          gap: '4px', 
          background: '#cbd5e1', 
          padding: '4px', 
          borderRadius: '8px' 
        }}>
          {data.map((row, i) => row.map((val, j) => {
            const isHighlighted = highlightRow !== -1 && 
                                  i >= highlightRow && i < highlightRow + kernelSize &&
                                  j >= highlightCol && j < highlightCol + kernelSize;
            return (
              <div key={`${i}-${j}`} style={{
                width: '40px', height: '40px', 
                background: isHighlighted ? '#fef08a' : (val > 0 ? '#10b981' : '#fff'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: isHighlighted ? '#b45309' : (val > 0 ? '#fff' : '#94a3b8'),
                borderRadius: '4px', border: isHighlighted ? '2px solid #f59e0b' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {val}
              </div>
            );
          }))}
        </div>
      </div>
    );
  };

  return (
    <div className="tab-layout-container fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="section-title-main" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Camera size={32} color="#8b5cf6" />
          Convolutional Neural Networks (CNN)
        </h2>
        <p className="tutorial-paragraph">
          While standard Feed-Forward Networks look at data as a flat list of numbers, <strong>Convolutional Neural Networks (CNNs)</strong> look at data spatially. They are the eyes of Artificial Intelligence, inspired by the human visual cortex, designed specifically to process images by scanning them for patterns, edges, and objects!
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('overview')}
          style={{ background: activeTab === 'overview' ? '#8b5cf6' : 'transparent', color: activeTab === 'overview' ? '#fff' : '#64748b', border: activeTab === 'overview' ? 'none' : '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} /> Architecture & Theory
        </button>
        <button onClick={() => setActiveTab('convolution')}
          style={{ background: activeTab === 'convolution' ? '#ec4899' : 'transparent', color: activeTab === 'convolution' ? '#fff' : '#64748b', border: activeTab === 'convolution' ? 'none' : '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ImageIcon size={18} /> Convolution & Padding
        </button>
        <button onClick={() => setActiveTab('pooling')}
          style={{ background: activeTab === 'pooling' ? '#14b8a6' : 'transparent', color: activeTab === 'pooling' ? '#fff' : '#64748b', border: activeTab === 'pooling' ? 'none' : '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Maximize size={18} /> Max Pooling Layer
        </button>
        <button onClick={() => setActiveTab('flattening')}
          style={{ background: activeTab === 'flattening' ? '#ca8a04' : 'transparent', color: activeTab === 'flattening' ? '#fff' : '#64748b', border: activeTab === 'flattening' ? 'none' : '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowDown size={18} /> Flattening Layer
        </button>
        <button onClick={() => setActiveTab('pipeline')}
          style={{ background: activeTab === 'pipeline' ? '#f59e0b' : 'transparent', color: activeTab === 'pipeline' ? '#fff' : '#64748b', border: activeTab === 'pipeline' ? 'none' : '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={18} /> Code Walkthrough
        </button>
        <button onClick={() => setActiveTab('backprop')}
          style={{ background: activeTab === 'backprop' ? '#ef4444' : 'transparent', color: activeTab === 'backprop' ? '#fff' : '#64748b', border: activeTab === 'backprop' ? 'none' : '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} /> Backpropagation
        </button>
        <button onClick={() => setActiveTab('architectures')}
          style={{ background: activeTab === 'architectures' ? '#8b5cf6' : 'transparent', color: activeTab === 'architectures' ? '#fff' : '#64748b', border: activeTab === 'architectures' ? 'none' : '1px solid #cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box size={18} /> Architectures
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* The WHY */}
            <div style={{ background: '#fff1f2', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #e11d48', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#9f1239', margin: '0 0 1rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#e11d48', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>WHY</span> 
                Do standard ANNs fail with Image Data?
              </h3>
              <p className="tutorial-paragraph" style={{ color: '#475569', marginBottom: '1.5rem' }}>
                Imagine trying to recognize a face by looking at a single vertical list of pixel colors. That is exactly what a standard Feed-Forward Artificial Neural Network (ANN) does. It requires <strong>flattening</strong> a 2D image into a 1D array before processing it. This causes two massive problems:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                  <h4 style={{ color: '#be123c', marginBottom: '0.5rem' }}>1. Loss of Spatial Structure</h4>
                  <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>In an image, pixels that are close together form shapes (like an eye or a wheel). When you flatten a 2D image into a 1D line, neighboring pixels get separated. The ANN loses all context of spatial relationships and geometry!</p>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                  <h4 style={{ color: '#be123c', marginBottom: '0.5rem' }}>2. Parameter Explosion</h4>
                  <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>A tiny 100x100 RGB image has 30,000 pixels. If the first hidden layer of an ANN has 1,000 neurons, you need <strong>30 Million weights</strong> just for the first layer! This is computationally impossible for large images and causes severe overfitting.</p>
                </div>
              </div>
            </div>

            {/* The WHAT */}
            <div style={{ background: '#eff6ff', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #3b82f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#1e3a8a', margin: '0 0 1rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>WHAT</span> 
                is a Convolutional Neural Network (CNN)?
              </h3>
              <p className="tutorial-paragraph" style={{ color: '#475569', margin: 0 }}>
                A <strong>Convolutional Neural Network (CNN)</strong> is a specialized deep learning architecture inspired by the human visual cortex. Instead of flattening an image immediately, a CNN preserves the 2D (or 3D) structure of the data. It is the gold standard for Computer Vision tasks like image classification, object detection, and facial recognition.
              </p>
            </div>

            {/* The HOW */}
            <div style={{ background: '#f0fdf4', padding: '2rem', borderRadius: '16px', borderLeft: '6px solid #22c55e', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <h3 style={{ color: '#14532d', margin: '0 0 1rem 0', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '1rem' }}>HOW</span> 
                do CNNs solve the problem?
              </h3>
              <p className="tutorial-paragraph" style={{ color: '#475569', marginBottom: '1.5rem' }}>
                Instead of feeding every pixel to every neuron, CNNs use a mathematical operation called <strong>Convolution</strong>. They act like a flashlight scanning across the image using tiny grids called <strong>Kernels (or Filters)</strong>.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Local Receptive Fields</h4>
                  <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>A filter only looks at a small 3x3 or 5x5 patch of the image at a time. This perfectly preserves the spatial relationship between neighboring pixels to detect shapes!</p>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Weight Sharing</h4>
                  <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>Instead of learning new weights for every single pixel, the exact same 3x3 filter is scanned across the <em>entire</em> image. This reduces 30 million parameters down to just 9 parameters!</p>
                </div>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ color: '#166534', marginBottom: '0.5rem' }}>Translation Invariance</h4>
                  <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>Because the filter slides everywhere, if it learns to detect a dog's ear in the top left, it can automatically detect a dog's ear in the bottom right. A standard ANN cannot do this!</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Full Pipeline Visual Tab */}
      {activeTab === 'pipeline' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            The Complete CNN Architecture
            <button 
              onClick={runClassification}
              disabled={isClassifying}
              style={{ background: isClassifying ? '#cbd5e1' : '#f59e0b', color: '#fff', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '8px', cursor: isClassifying ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Play size={18} /> {isClassifying ? 'Classifying...' : 'Run Classification'}
            </button>
          </h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            Select an image below and click <strong>Run Classification</strong> to watch it travel through the network! Notice how the <strong>Feature Maps</strong> extract details, the data is flattened, and finally, the Dense layer calculates the probabilities to make a prediction.
          </p>

          <style>
            {`
              @keyframes pulseGlow {
                0% { filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5)); }
                50% { filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.9)); }
                100% { filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5)); }
              }
              @keyframes flowData {
                to { stroke-dashoffset: -20; }
              }
              .flowing-line {
                stroke-dasharray: 6;
                animation: flowData 0.5s linear infinite;
              }
              .glass-panel {
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                border-radius: 16px;
                padding: 3rem 1rem;
                display: flex;
                justify-content: center;
                overflow-x: auto;
                position: relative;
              }
            `}
          </style>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {['Dog', 'Cat', 'Car', 'Bird'].map(img => (
              <button 
                key={img}
                onClick={() => { setSelectedImage(img); setClassifyStep(0); }}
                disabled={isClassifying}
                style={{
                  background: selectedImage === img ? '#0ea5e9' : '#f1f5f9',
                  color: selectedImage === img ? '#fff' : '#475569',
                  border: selectedImage === img ? 'none' : '1px solid #cbd5e1',
                  padding: '0.5rem 1.5rem', borderRadius: '20px', cursor: isClassifying ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                }}
              >
                {img}
              </button>
            ))}
          </div>

          <div className="glass-panel">
            
            {/* Overlay Status Text */}
            {classifyStep > 0 && classifyStep < 8 && (
              <div style={{ position: 'absolute', top: '1.5rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.6rem 1.5rem', borderRadius: '20px', fontWeight: 'bold', animation: 'pulse 1s infinite', backdropFilter: 'blur(4px)', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}>
                {classifyStep === 1 && "SCANNING: Loading Input Image..."}
                {classifyStep === 2 && "FEATURE EXTRACTION: Detecting basic edges in Conv1..."}
                {classifyStep === 3 && "COMPRESSION: Pooling1 shrinking spatial size..."}
                {classifyStep === 4 && "FEATURE EXTRACTION: Detecting complex patterns in Conv2..."}
                {classifyStep === 5 && "COMPRESSION: Pooling2 finalizing spatial maps..."}
                {classifyStep === 6 && "TRANSFORMATION: Flattening 2D maps into 1D Array..."}
                {classifyStep === 7 && "CLASSIFICATION: Dense Layer analyzing patterns..."}
              </div>
            )}

            <svg viewBox="0 0 900 400" width="100%" height="400" style={{ minWidth: '800px' }}>
              {/* --- Gradients & Filters --- */}
              <defs>
                <marker id="arrowDark" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                </marker>
                
                <linearGradient id="convGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>

                <linearGradient id="poolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>

                <linearGradient id="flatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>

                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* --- Labels --- */}
              <text x="250" y="40" fill="#94a3b8" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="1">FEATURE EXTRACTION</text>
              <line x1="50" y1="50" x2="450" y2="50" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowDark)" markerStart="url(#arrowDark)" />
              
              <text x="700" y="40" fill="#94a3b8" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="1">CLASSIFICATION</text>
              <line x1="550" y1="50" x2="850" y2="50" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowDark)" markerStart="url(#arrowDark)" />

              {/* --- Input Image --- */}
              <rect x="20" y="150" width="70" height="70" fill={classifyStep >= 1 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)'} stroke={classifyStep >= 1 ? '#38bdf8' : '#334155'} strokeWidth="3" rx="8" style={{ transition: 'all 0.3s' }} filter={classifyStep >= 1 ? 'url(#neonGlow)' : ''} />
              <text x="55" y="190" fill={classifyStep >= 1 ? '#38bdf8' : '#64748b'} fontSize="16" fontWeight="bold" textAnchor="middle" style={{ transition: 'all 0.3s' }}>{selectedImage}</text>
              <text x="55" y="240" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle">Input Image</text>

              {/* --- Conv Block 1 --- */}
              <text x="130" y="100" fill={classifyStep >= 2 ? '#34d399' : '#64748b'} fontSize="14" fontWeight={classifyStep >= 2 ? 'bold' : 'normal'} textAnchor="middle" style={{ transition: 'all 0.3s' }}>Conv + ReLU</text>
              <g transform="translate(100, 120)">
                {[0, 1, 2, 3].map(i => (
                  <rect key={`c1-${i}`} x={i*5} y={i*5} width="60" height="60" rx="4" fill={classifyStep >= 2 ? 'url(#convGrad)' : 'rgba(255,255,255,0.05)'} stroke={classifyStep >= 2 ? '#6ee7b7' : '#334155'} strokeWidth="1" style={{ transition: 'all 0.3s', filter: classifyStep >= 2 ? 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' : 'none' }} />
                ))}
              </g>
              
              {/* --- Pooling 1 --- */}
              <text x="210" y="100" fill={classifyStep >= 3 ? '#34d399' : '#64748b'} fontSize="14" fontWeight={classifyStep >= 3 ? 'bold' : 'normal'} textAnchor="middle" style={{ transition: 'all 0.3s' }}>Pooling</text>
              <g transform="translate(190, 135)">
                {[0, 1, 2, 3].map(i => (
                  <rect key={`p1-${i}`} x={i*5} y={i*5} width="40" height="40" rx="3" fill={classifyStep >= 3 ? 'url(#poolGrad)' : 'rgba(255,255,255,0.05)'} stroke={classifyStep >= 3 ? '#6ee7b7' : '#334155'} strokeWidth="1" style={{ transition: 'all 0.3s', filter: classifyStep >= 3 ? 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' : 'none' }} />
                ))}
              </g>

              {/* --- Conv Block 2 --- */}
              <text x="310" y="100" fill={classifyStep >= 4 ? '#34d399' : '#64748b'} fontSize="14" fontWeight={classifyStep >= 4 ? 'bold' : 'normal'} textAnchor="middle" style={{ transition: 'all 0.3s' }}>Conv + ReLU</text>
              <g transform="translate(280, 145)">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <rect key={`c2-${i}`} x={i*5} y={i*5} width="30" height="30" rx="2" fill={classifyStep >= 4 ? 'url(#convGrad)' : 'rgba(255,255,255,0.05)'} stroke={classifyStep >= 4 ? '#6ee7b7' : '#334155'} strokeWidth="1" style={{ transition: 'all 0.3s', filter: classifyStep >= 4 ? 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' : 'none' }} />
                ))}
              </g>

              {/* --- Pooling 2 --- */}
              <text x="400" y="100" fill={classifyStep >= 5 ? '#34d399' : '#64748b'} fontSize="14" fontWeight={classifyStep >= 5 ? 'bold' : 'normal'} textAnchor="middle" style={{ transition: 'all 0.3s' }}>Pooling</text>
              <g transform="translate(390, 155)">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <rect key={`p2-${i}`} x={i*5} y={i*5} width="20" height="20" rx="1" fill={classifyStep >= 5 ? 'url(#poolGrad)' : 'rgba(255,255,255,0.05)'} stroke={classifyStep >= 5 ? '#6ee7b7' : '#334155'} strokeWidth="1" style={{ transition: 'all 0.3s', filter: classifyStep >= 5 ? 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' : 'none' }} />
                ))}
              </g>

              {/* --- Connecting Lines (Receptive Fields) --- */}
              <polygon points="50,170 80,180 100,140 100,160" fill="rgba(56,189,248,0.1)" stroke={classifyStep >= 2 ? "#38bdf8" : "#334155"} strokeWidth="2" style={{ transition: 'all 0.3s', filter: classifyStep >= 2 ? 'url(#neonGlow)' : 'none' }} />
              <polygon points="150,150 180,160 190,145 190,155" fill="rgba(56,189,248,0.1)" stroke={classifyStep >= 3 ? "#38bdf8" : "#334155"} strokeWidth="2" style={{ transition: 'all 0.3s', filter: classifyStep >= 3 ? 'url(#neonGlow)' : 'none' }} />
              <polygon points="230,150 250,160 280,155 280,165" fill="rgba(56,189,248,0.1)" stroke={classifyStep >= 4 ? "#38bdf8" : "#334155"} strokeWidth="2" style={{ transition: 'all 0.3s', filter: classifyStep >= 4 ? 'url(#neonGlow)' : 'none' }} />

              {/* --- Flattening Layer --- */}
              <rect x="490" y="100" width="15" height="150" rx="4" fill={classifyStep >= 6 ? 'url(#flatGrad)' : 'rgba(255,255,255,0.05)'} stroke={classifyStep >= 6 ? '#fef08a' : '#334155'} strokeWidth="2" style={{ transition: 'all 0.3s', filter: classifyStep >= 6 ? 'drop-shadow(0 0 8px rgba(250,204,21,0.6))' : 'none' }} />
              <text x="495" y="270" fill={classifyStep >= 6 ? '#fde047' : '#64748b'} fontSize="14" fontWeight="bold" textAnchor="middle" transform="rotate(-90 495,270)" style={{ transition: 'all 0.3s' }}>Flattened</text>

              <line x1="420" y1="165" x2="490" y2="100" stroke={classifyStep >= 6 ? "#38bdf8" : "#334155"} strokeWidth="2" className={classifyStep >= 6 ? "flowing-line" : ""} style={{ transition: 'all 0.3s', filter: classifyStep >= 6 ? 'url(#neonGlow)' : 'none' }} />
              <line x1="420" y1="165" x2="490" y2="250" stroke={classifyStep >= 6 ? "#38bdf8" : "#334155"} strokeWidth="2" className={classifyStep >= 6 ? "flowing-line" : ""} style={{ transition: 'all 0.3s', filter: classifyStep >= 6 ? 'url(#neonGlow)' : 'none' }} />

              {/* --- Fully Connected Layer (Dense) --- */}
              <g transform="translate(600, 80)">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <circle key={`d1-${i}`} cx="0" cy={i * 35} r="12" fill={classifyStep >= 7 ? '#60a5fa' : 'rgba(255,255,255,0.05)'} stroke={classifyStep >= 7 ? '#93c5fd' : '#334155'} strokeWidth="2" style={{ transition: 'all 0.3s', filter: classifyStep >= 7 ? 'url(#neonGlow)' : 'none', animation: classifyStep === 7 ? 'pulseGlow 1s infinite' : 'none' }} />
                ))}
              </g>

              {/* --- Output Layer & Logic --- */}
              <g transform="translate(750, 115)">
                {['Dog', 'Cat', 'Car', 'Bird'].map((className, idx) => {
                  
                  // Determine Probability
                  let prob = "0.00";
                  let isWinner = false;
                  if (classifyStep === 8) {
                    if (className === selectedImage) {
                      prob = "0.94";
                      isWinner = true;
                    } else {
                      prob = (Math.random() * 0.05).toFixed(2);
                    }
                  } else if (classifyStep === 7) {
                     prob = "?.??";
                  }

                  return (
                    <g key={`out-${idx}`}>
                      <circle 
                        cx="0" cy={idx * 40} r="12" 
                        fill={isWinner ? '#34d399' : (classifyStep >= 8 ? '#f87171' : 'rgba(255,255,255,0.05)')} 
                        stroke={isWinner ? '#6ee7b7' : (classifyStep >= 8 ? '#fca5a5' : '#334155')} 
                        strokeWidth="2" 
                        style={{ transition: 'all 0.5s', filter: isWinner ? 'url(#neonGlow)' : 'none' }} 
                      />
                      {/* Probability Text */}
                      <text x="25" y={idx * 40 + 5} fill={isWinner ? '#34d399' : (classifyStep >= 8 ? '#f87171' : '#94a3b8')} fontSize="14" fontWeight="bold" style={{ transition: 'all 0.5s', filter: isWinner ? 'drop-shadow(0 0 2px #34d399)' : 'none' }}>
                        {classifyStep === 0 ? "" : prob}
                      </text>
                      {/* Class Label */}
                      <text x="65" y={idx * 40 + 5} fill={isWinner ? '#f8fafc' : '#64748b'} fontSize="14" fontWeight={isWinner ? "bold" : "normal"} style={{ transition: 'all 0.5s' }}>
                        {className}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* --- Dense Connections --- */}
              {/* Flatten to Dense */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                <line key={`conn1-${i}`} x1="505" y1="175" x2="588" y2={80 + i * 35} stroke={classifyStep >= 7 ? '#60a5fa' : '#1e293b'} strokeWidth={classifyStep >= 7 ? 2 : 1} className={classifyStep >= 7 ? "flowing-line" : ""} style={{ transition: 'all 0.3s' }} />
              ))}
              
              {/* Dense to Output */}
              {[0, 1, 2, 3, 4, 5].map(i => (
                [0, 1, 2, 3].map(j => (
                  <line key={`conn2-${i}-${j}`} x1="612" y1={80 + i * 35} x2="738" y2={115 + j * 40} stroke={classifyStep >= 8 ? '#60a5fa' : '#1e293b'} strokeWidth={classifyStep >= 8 ? 2 : 1} className={classifyStep >= 8 ? "flowing-line" : ""} style={{ transition: 'all 0.3s' }} />
                ))
              ))}

              <text x="750" y="300" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="1">OUTPUT CLASSES</text>
            </svg>
          </div>
        </div>
      )}

      {/* Interactive Convolution & Padding Tab */}
      {activeTab === 'convolution' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            The Sliding Kernel & Zero Padding
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => { setUsePadding(!usePadding); resetConvolution(); }} 
                style={{ background: usePadding ? '#10b981' : '#f1f5f9', color: usePadding ? '#fff' : '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <LayoutTemplate size={16} /> {usePadding ? 'Padding: ON' : 'Padding: OFF'}
              </button>
              <button onClick={playConvolution} disabled={isConvPlaying} style={{ background: isConvPlaying ? '#cbd5e1' : '#ec4899', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: isConvPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Play size={16} /> Scan Image
              </button>
              <button onClick={resetConvolution} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </h3>
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p className="tutorial-paragraph" style={{ margin: 0 }}>
              Padding is a technique used to preserve the spatial dimensions of the input image after convolution operations and to avoid loss of border information.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <h4 style={{ color: '#b91c1c', margin: '0 0 0.5rem 0' }}>1. Valid Padding (No Padding)</h4>
                <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, marginBottom: '0.5rem' }}>
                  Applies convolution without adding any extra pixels. Useful for dimensionality reduction.
                </p>
                <ul style={{ color: '#475569', fontSize: '0.9rem', paddingLeft: '1rem', margin: '0 0 1rem 0' }}>
                  <li>Output shrinks: (n - f + 1) × (n - f + 1)</li>
                  <li>Corner pixels are used least (loss of info)</li>
                </ul>
                <div style={{ background: '#fee2e2', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace', color: '#991b1b' }}>
                  Example: 5x5 Input, 3x3 Filter → 3x3 Output
                </div>
              </div>

              <div style={{ background: '#ecfdf5', padding: '1.5rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <h4 style={{ color: '#047857', margin: '0 0 0.5rem 0' }}>2. Same Padding</h4>
                <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, marginBottom: '0.5rem' }}>
                  Adds layers of zeros around the input to ensure output size equals input size. Preserves edges!
                </p>
                <ul style={{ color: '#475569', fontSize: '0.9rem', paddingLeft: '1rem', margin: '0 0 1rem 0' }}>
                  <li>Output maintained: (n + 2p - f) / s + 1</li>
                  <li>Required padding: p = (f - 1) / 2</li>
                </ul>
                <div style={{ background: '#d1fae5', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace', color: '#065f46' }}>
                  Example: 5x5 Input + 1 Padding, 3x3 Filter → 5x5 Output
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                <h5 style={{ color: '#1d4ed8', margin: '0 0 0.5rem 0' }}>Advantages of Padding</h5>
                <ul style={{ color: '#475569', fontSize: '0.9rem', margin: 0, paddingLeft: '1rem' }}>
                  <li>Retains important edge and border information</li>
                  <li>Allows deeper networks without rapid size reduction</li>
                </ul>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                <h5 style={{ color: '#b45309', margin: '0 0 0.5rem 0' }}>Limitations of Padding</h5>
                <ul style={{ color: '#475569', fontSize: '0.9rem', margin: 0, paddingLeft: '1rem' }}>
                  <li>Increases computational cost</li>
                  <li>Introduces artificial information (zeros) at borders</li>
                </ul>
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '1rem 1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
              <h5 style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Code Example (Keras)</h5>
              <pre style={{ color: '#34d399', fontSize: '0.85rem', margin: 0, padding: 0, fontFamily: 'monospace', background: 'transparent' }}>
{`from tensorflow.keras.layers import Conv2D

# 32 filters, 3x3 kernel, same padding to preserve size
conv_layer = Conv2D(filters=32, kernel_size=(3, 3), padding='same', activation='relu')
output = conv_layer(input_image)`}
              </pre>
            </div>
            
            <p style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', textAlign: 'center', margin: '1rem 0 0 0', fontWeight: 'bold', color: '#334155' }}>
              Try it below! Toggle Padding ON to see <strong>Same Padding</strong> in action!
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            
            {/* Input Image */}
            {renderGrid(activeImage, usePadding ? 7 : 5, convStep !== -1 ? Math.floor(convStep / outSize) : -1, convStep !== -1 ? convStep % outSize : -1, 3, usePadding ? "Input Image with Zero Padding (7x7)" : "Input Image (5x5)")}
            
            <div style={{ color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>*</div>
              <ArrowRight />
            </div>

            {/* Kernel */}
            {renderGrid(kernel, 3, -1, -1, 3, "Kernel (3x3)")}

            <div style={{ color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>=</div>
              <ArrowRight />
            </div>

            {/* Output Feature Map */}
            {(() => {
              // Calculate the output matrix dynamically up to the current step
              const outputMap = Array(outSize).fill(0).map(() => Array(outSize).fill('?'));
              
              if (convStep !== -1) {
                for (let i = 0; i <= convStep; i++) {
                  let r = Math.floor(i / outSize);
                  let c = i % outSize;
                  let sum = 0;
                  for (let kr = 0; kr < 3; kr++) {
                    for (let kc = 0; kc < 3; kc++) {
                      sum += activeImage[r + kr][c + kc] * kernel[kr][kc];
                    }
                  }
                  outputMap[r][c] = sum;
                }
              }
              return renderGrid(outputMap, outSize, convStep !== -1 ? Math.floor(convStep / outSize) : -1, convStep !== -1 ? convStep % outSize : -1, 1, `Feature Map (${outSize}x${outSize})`);
            })()}

          </div>
          
          <div style={{ marginTop: '2rem', background: '#fff1f2', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #e11d48' }}>
            <h4 style={{ color: '#9f1239', margin: '0 0 0.5rem 0' }}>The Math Behind The Magic</h4>
            <p style={{ color: '#be123c', margin: 0, fontFamily: 'monospace', fontSize: '1.1rem' }}>
              {convStep === -1 ? 'Click "Scan Image" to see the math!' : (() => {
                let r = Math.floor(convStep / outSize);
                let c = convStep % outSize;
                let mathString = [];
                let sum = 0;
                for (let kr = 0; kr < 3; kr++) {
                  for (let kc = 0; kc < 3; kc++) {
                    let inVal = activeImage[r + kr][c + kc];
                    let kVal = kernel[kr][kc];
                    mathString.push(`(${inVal}×${kVal})`);
                    sum += inVal * kVal;
                  }
                }
                return `${mathString.join(' + ')} = ${sum}`;
              })()}
            </p>
          </div>
        </div>
      )}

      {/* Pooling Tab */}
      {activeTab === 'pooling' && (
        <div className="fade-in">
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className="section-title-main" style={{ margin: 0, fontSize: '1.5rem' }}>Pooling Layers: Downsampling & Compressing</h3>
            <p className="tutorial-paragraph" style={{ margin: 0 }}>
              A pooling layer reduces the spatial dimensions (width and height) of feature maps while retaining the most important information. This helps control overfitting and massively reduces computational costs.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#fef2f2', padding: '1.2rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <h4 style={{ color: '#b91c1c', margin: '0 0 0.5rem 0' }}>1. Max Pooling</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
                  Extracts the <strong>maximum</strong> value from the region. Focuses on the most prominent features (edges, textures). Widely used in CNNs!
                </p>
              </div>
              <div style={{ background: '#ecfdf5', padding: '1.2rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                <h4 style={{ color: '#047857', margin: '0 0 0.5rem 0' }}>2. Average Pooling</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
                  Computes the <strong>mean</strong> value. Represents overall features rather than the strongest ones. Produces smoother feature maps.
                </p>
              </div>
              <div style={{ background: '#eff6ff', padding: '1.2rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <h4 style={{ color: '#1d4ed8', margin: '0 0 0.5rem 0' }}>3. Global Pooling</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
                  Reduces the entire feature map to a single value. Often used at the very end of networks to replace Dense layers.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px', background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
                <h5 style={{ color: '#6d28d9', margin: '0 0 0.5rem 0' }}>Why do we need it? (Advantages)</h5>
                <ul style={{ color: '#475569', fontSize: '0.9rem', margin: 0, paddingLeft: '1rem' }}>
                  <li><strong>Translational Invariance:</strong> Small shifts in the image won't affect detection.</li>
                  <li><strong>Reduces Dimensions:</strong> Lowers computation and helps prevent overfitting.</li>
                </ul>
              </div>
              <div style={{ flex: 1, minWidth: '300px', background: '#1e293b', padding: '1rem 1.5rem', borderRadius: '12px' }}>
                <h5 style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Code Example (Keras)</h5>
                <pre style={{ color: '#34d399', fontSize: '0.85rem', margin: 0, padding: 0, fontFamily: 'monospace', background: 'transparent' }}>
{`from tensorflow.keras.layers import MaxPooling2D

# 2x2 window with stride 2
max_pool = MaxPooling2D(pool_size=(2, 2), strides=2)
output = max_pool(feature_map)`}
                </pre>
              </div>
            </div>
            
            <p style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', textAlign: 'center', margin: '1rem 0 0 0', fontWeight: 'bold', color: '#334155' }}>
              Check out the visualization below to see <strong>Max Pooling</strong> extract the strongest features!
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            
            {/* 4x4 Input */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '1rem' }}>Original Feature Map (4x4)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 50px)', gap: '4px', background: '#cbd5e1', padding: '4px', borderRadius: '8px' }}>
                <div style={{ width: '50px', height: '50px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <div style={{ width: '50px', height: '50px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>5</div>
                <div style={{ width: '50px', height: '50px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <div style={{ width: '50px', height: '50px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
                
                <div style={{ width: '50px', height: '50px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>7</div>
                <div style={{ width: '50px', height: '50px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                <div style={{ width: '50px', height: '50px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>8</div>
                <div style={{ width: '50px', height: '50px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>6</div>
                
                <div style={{ width: '50px', height: '50px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
                <div style={{ width: '50px', height: '50px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                <div style={{ width: '50px', height: '50px', background: '#fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <div style={{ width: '50px', height: '50px', background: '#fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>0</div>
                
                <div style={{ width: '50px', height: '50px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                <div style={{ width: '50px', height: '50px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>9</div>
                <div style={{ width: '50px', height: '50px', background: '#fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                <div style={{ width: '50px', height: '50px', background: '#fef08a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>5</div>
              </div>
            </div>

            <div style={{ color: '#14b8a6', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>Max(2x2)</div>
              <ArrowRight size={32} />
            </div>

            {/* 2x2 Output */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '1rem' }}>Pooled Map (2x2)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 50px)', gap: '4px', background: '#cbd5e1', padding: '4px', borderRadius: '8px' }}>
                <div style={{ width: '50px', height: '50px', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}>7</div>
                <div style={{ width: '50px', height: '50px', background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.4)' }}>8</div>
                <div style={{ width: '50px', height: '50px', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)' }}>9</div>
                <div style={{ width: '50px', height: '50px', background: '#eab308', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(234, 179, 8, 0.4)' }}>5</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Flattening Tab */}
      {activeTab === 'flattening' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Flattening Layer
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={playFlattening} disabled={isFlatPlaying} style={{ background: isFlatPlaying ? '#cbd5e1' : '#ca8a04', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: isFlatPlaying ? 'not-allowed' : 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowDown size={16} /> Unroll Matrix
              </button>
              <button onClick={resetFlattening} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '1rem' }}>
            Standard Neural Networks expect a 1-Dimensional array of numbers, not a 2D grid. The <strong>Flattening</strong> step simply takes the pooled Feature Map and unrolls it row by row into a single long column vector so it can be fed into the Dense classification layer!
          </p>

          <div style={{ background: '#1e293b', padding: '1rem 1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h5 style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0' }}>Code Example (Keras)</h5>
            <pre style={{ color: '#34d399', fontSize: '0.85rem', margin: 0, padding: 0, fontFamily: 'monospace', background: 'transparent' }}>
{`from tensorflow.keras.layers import Flatten

# Unrolls the 2D feature map into a 1D vector
flat_layer = Flatten()
output = flat_layer(pooled_features)`}
            </pre>
          </div>


          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            
            {/* 3x3 Matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '1rem' }}>Feature Map (3x3)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 50px)', gap: '4px', background: '#cbd5e1', padding: '4px', borderRadius: '8px' }}>
                {/* Row 0 */}
                <div style={{ width: '50px', height: '50px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 0 ? 0.3 : 1, transition: 'opacity 0.3s' }}>7</div>
                <div style={{ width: '50px', height: '50px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 1 ? 0.3 : 1, transition: 'opacity 0.3s' }}>8</div>
                <div style={{ width: '50px', height: '50px', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 2 ? 0.3 : 1, transition: 'opacity 0.3s' }}>9</div>
                
                {/* Row 1 */}
                <div style={{ width: '50px', height: '50px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 3 ? 0.3 : 1, transition: 'opacity 0.3s' }}>4</div>
                <div style={{ width: '50px', height: '50px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 4 ? 0.3 : 1, transition: 'opacity 0.3s' }}>5</div>
                <div style={{ width: '50px', height: '50px', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 5 ? 0.3 : 1, transition: 'opacity 0.3s' }}>6</div>
                
                {/* Row 2 */}
                <div style={{ width: '50px', height: '50px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 6 ? 0.3 : 1, transition: 'opacity 0.3s' }}>1</div>
                <div style={{ width: '50px', height: '50px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 7 ? 0.3 : 1, transition: 'opacity 0.3s' }}>2</div>
                <div style={{ width: '50px', height: '50px', background: '#bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 8 ? 0.3 : 1, transition: 'opacity 0.3s' }}>3</div>
              </div>
            </div>

            <div style={{ color: '#ca8a04', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>Unroll Rows</div>
              <ArrowRight size={32} />
            </div>

            {/* 1x9 Array */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h4 style={{ color: '#1e293b', marginBottom: '1rem' }}>Flattened Vector (9x1)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '50px', gridTemplateRows: 'repeat(9, 30px)', gap: '2px', background: '#cbd5e1', padding: '4px', borderRadius: '8px' }}>
                <div style={{ background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 0 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 0 ? 'translateX(0)' : 'translateX(-20px)' }}>7</div>
                <div style={{ background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 1 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 1 ? 'translateX(0)' : 'translateX(-20px)' }}>8</div>
                <div style={{ background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 2 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 2 ? 'translateX(0)' : 'translateX(-20px)' }}>9</div>
                
                <div style={{ background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 3 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 3 ? 'translateX(0)' : 'translateX(-20px)' }}>4</div>
                <div style={{ background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 4 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 4 ? 'translateX(0)' : 'translateX(-20px)' }}>5</div>
                <div style={{ background: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 5 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 5 ? 'translateX(0)' : 'translateX(-20px)' }}>6</div>
                
                <div style={{ background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 6 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 6 ? 'translateX(0)' : 'translateX(-20px)' }}>1</div>
                <div style={{ background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 7 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 7 ? 'translateX(0)' : 'translateX(-20px)' }}>2</div>
                <div style={{ background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', opacity: flatStep >= 8 ? 1 : 0, transition: 'opacity 0.3s', transform: flatStep >= 8 ? 'translateX(0)' : 'translateX(-20px)' }}>3</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Full Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Building an Image Classifier using CNN (CIFAR-10)</h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            Let's walk through a complete, real-world image classification pipeline using Keras, step-by-step. We will build a model to classify 32x32 color images into 10 categories (CIFAR-10 dataset).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Step 1 */}
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ color: '#60a5fa', margin: '0 0 0.5rem 0' }}>Step 1: Importing Libraries</h4>
              <pre style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0 0 1rem 0', fontFamily: 'monospace' }}>
{`import tensorflow as tf
from tensorflow.keras import layers, models, datasets
import matplotlib.pyplot as plt`}
              </pre>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                <strong>Explanation:</strong> We import TensorFlow and its Keras API for building neural networks. <code>datasets</code> gives us access to pre-loaded image datasets like CIFAR-10. <code>matplotlib.pyplot</code> is used for graphing our training accuracy later!
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ color: '#fbbf24', margin: '0 0 0.5rem 0' }}>Step 2: Load and Prepare Dataset</h4>
              <pre style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0 0 1rem 0', fontFamily: 'monospace' }}>
{`(x_train, y_train), (x_test, y_test) = datasets.cifar10.load_data()

# Normalization (Scaling)
x_train, x_test = x_train / 255.0, x_test / 255.0

# One-hot encoding the labels
num_classes = 10
y_train = tf.keras.utils.to_categorical(y_train, num_classes)
y_test  = tf.keras.utils.to_categorical(y_test, num_classes)`}
              </pre>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                <strong>Explanation:</strong> First, we download the dataset. Since image pixel values range from 0 to 255, we divide them by <code>255.0</code> to normalize them to a range of <code>[0, 1]</code>. This helps the network learn faster. We then use <code>to_categorical</code> to one-hot encode our labels (turning a label '3' into an array where only the 3rd index is a 1).
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #ec4899' }}>
              <h4 style={{ color: '#f472b6', margin: '0 0 0.5rem 0' }}>Step 3: Building the CNN Architecture</h4>
              <pre style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0 0 1rem 0', fontFamily: 'monospace' }}>
{`model = models.Sequential([
    # Convolutional Base (Feature Extraction)
    layers.Conv2D(32, (3,3), activation='relu', padding='same', input_shape=(32,32,3)),
    layers.MaxPooling2D(2,2),
    
    layers.Conv2D(64, (3,3), activation='relu', padding='same'),
    layers.MaxPooling2D(2,2),
    
    layers.Conv2D(64, (3,3), activation='relu', padding='same'),
    
    # Classification Head
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(num_classes, activation='softmax')
])`}
              </pre>
              <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem' }}>
                <li><code>Conv2D</code>: Detects features like edges/textures. We use 32 and 64 filters of size 3x3. <code>padding='same'</code> prevents the image from shrinking.</li>
                <li><code>MaxPooling2D</code>: Compresses the feature maps by 2x2 blocks, keeping the most prominent features and reducing memory usage.</li>
                <li><code>Flatten</code>: Converts the 2D feature maps into a 1D array so standard neural network layers can read it.</li>
                <li><code>Dense</code>: The fully connected layers make the final decision. The final layer uses <code>softmax</code> activation to output a probability percentage for each of the 10 classes!</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: '#34d399', margin: '0 0 0.5rem 0' }}>Step 4: Compiling and Training</h4>
              <pre style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0 0 1rem 0', fontFamily: 'monospace' }}>
{`model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

history = model.fit(x_train, y_train,
                    epochs=15,
                    batch_size=64,
                    validation_split=0.2,
                    verbose=2)`}
              </pre>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                <strong>Explanation:</strong> <code>compile()</code> configures the training process. We use the <strong>Adam</strong> optimizer (which smartly adjusts learning rates) and <strong>Categorical Crossentropy</strong> as our loss function (since we have multiple classes).<br/><br/>
                <code>fit()</code> starts training! It will loop over the data 15 times (<code>epochs=15</code>), updating weights using 64 images at a time (<code>batch_size=64</code>), and will use 20% of the data to validate its accuracy (<code>validation_split=0.2</code>).
              </p>
            </div>

            {/* Step 5 */}
            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ color: '#a78bfa', margin: '0 0 0.5rem 0' }}>Step 5: Evaluating & Predicting</h4>
              <pre style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: '0 0 1rem 0', fontFamily: 'monospace' }}>
{`# 1. Evaluate on unseen test data
test_loss, test_acc = model.evaluate(x_test, y_test, verbose=0)
print(f"Test accuracy = {test_acc:.3f}")

# 2. Make predictions on new images
import numpy as np
predictions = model.predict(x_test)
print("Predicted class:", np.argmax(predictions[0]))
print("Actual class:", np.argmax(y_test[0]))`}
              </pre>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                <strong>Explanation:</strong> We test the trained model on <code>x_test</code> (images it has never seen before) to see how well it generalizes. To predict a single image, we use <code>model.predict()</code>, which outputs 10 probabilities. We use <code>np.argmax()</code> to find the index of the highest probability, which corresponds to our predicted class!
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Backpropagation Tab */}
      {activeTab === 'backprop' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Backpropagation in CNNs: Learning to See</h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            <strong>Backpropagation</strong> is the engine that drives learning. It propagates prediction errors backwards through the network to tweak internal parameters (filter weights and biases). This iterative process allows the CNN to learn complex hierarchical features over time!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ color: '#1d4ed8', margin: '0 0 0.5rem 0' }}>1. The Forward Pass</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                Input images move through convolutional layers, activation functions (like ReLU), and pooling layers to generate a final prediction.
              </p>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ color: '#b91c1c', margin: '0 0 0.5rem 0' }}>2. Loss Calculation</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                The prediction is compared to the actual label using a loss function (like Cross-Entropy). This calculates the total error!
              </p>
              <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', margin: '0.75rem 0', fontFamily: 'monospace', color: '#991b1b', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', border: '1px solid #fecaca' }}>
                L = -Σ y · log(ŷ)
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                <em>Example:</em> If true label <code>y=1</code> but prediction <code>ŷ=0.2</code>, the loss is high (-log(0.2) ≈ 1.6). The network knows it messed up!
              </p>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ color: '#6d28d9', margin: '0 0 0.5rem 0' }}>3. The Backward Pass</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                The Chain Rule is applied to compute the gradient of the loss with respect to each filter weight. For Conv layers, it involves a 180-degree rotation of the input!
              </p>
              <div style={{ background: '#f5f3ff', padding: '0.75rem', borderRadius: '8px', margin: '0.75rem 0', fontFamily: 'monospace', color: '#5b21b6', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', border: '1px solid #ddd6fe' }}>
                ∂L/∂F = ∂L/∂O * rot180(I)
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                <em>Example:</em> We find how much a specific pixel in a filter (F) contributed to the final error (L) by tracing the math backwards.
              </p>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: '#047857', margin: '0 0 0.5rem 0' }}>4. Weight Update</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                Filter weights are tweaked using an optimizer (like SGD or Adam) to step downwards on the error curve, guided by the Learning Rate (η).
              </p>
              <div style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: '8px', margin: '0.75rem 0', fontFamily: 'monospace', color: '#065f46', fontSize: '0.9rem', textAlign: 'center', fontWeight: 'bold', border: '1px solid #a7f3d0' }}>
                F_new = F_old - η(∂L/∂F)
              </div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                <em>Example:</em> If <code>∂L/∂F</code> is positive, the weight is decreased slightly. If negative, it's increased. Slowly, the filter learns!
              </p>
            </div>
          </div>

          <div style={{ background: '#fff1f2', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
            <h4 style={{ color: '#9f1239', margin: '0 0 0.5rem 0' }}>Challenges of Backpropagation</h4>
            <ul style={{ color: '#be123c', fontSize: '0.95rem', margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>Vanishing Gradients:</strong> Gradients can shrink to zero in very deep networks, stopping learning in early layers (often solved by using ReLU).</li>
              <li><strong>Dying ReLU:</strong> Neurons can get stuck outputting zero forever.</li>
              <li><strong>Exploding Gradients:</strong> Unstable training causing massive weight updates.</li>
              <li><strong>Computational Intensity:</strong> Calculating all these derivatives takes massive memory and GPU power!</li>
            </ul>
          </div>
        </div>
      )}

      {/* Architectures Tab */}
      {activeTab === 'architectures' && (
        <div className="fade-in">
          <h3 className="section-title-main" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>The Evolution of CNN Architectures</h3>
          <p className="tutorial-paragraph" style={{ marginBottom: '2rem' }}>
            Over the years, researchers have designed powerful CNN architectures to solve specific problems like vanishing gradients, computational efficiency, and semantic segmentation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #94a3b8' }}>
              <h4 style={{ color: '#334155', margin: '0 0 0.5rem 0' }}>LeNet-5 (1998)</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Pioneer:</strong> Designed by Yann LeCun, it was the first successful CNN, used primarily for recognizing handwritten digits (zip codes) on checks.</p>
            </div>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ color: '#b91c1c', margin: '0 0 0.5rem 0' }}>AlexNet (2012)</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Breakthrough:</strong> Won the ImageNet competition by a landslide. It popularized the use of ReLU activations and trained on GPUs, sparking the deep learning boom.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ color: '#1d4ed8', margin: '0 0 0.5rem 0' }}>VGGNet / VGG-16 (2014)</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Uniform Network:</strong> Proved that depth is critical. It uses very simple, uniform 3x3 convolutions stacked deeply. Extremely popular for Transfer Learning.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ color: '#b45309', margin: '0 0 0.5rem 0' }}>GoogLeNet / Inception (2014)</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Efficient Network:</strong> Introduced "Inception Modules" to apply 1x1, 3x3, and 5x5 filters in parallel, reducing parameters while capturing multi-scale features.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: '#047857', margin: '0 0 0.5rem 0' }}>ResNet (2015)</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Deep Network:</strong> Solved the vanishing gradient problem in ultra-deep networks (152+ layers) using "Skip Connections" (Residual Blocks) that bypass layers.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #06b6d4' }}>
              <h4 style={{ color: '#0e7490', margin: '0 0 0.5rem 0' }}>MobileNet</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Lightweight Network:</strong> Uses "Depthwise Separable Convolutions" to drastically reduce the number of parameters, making it perfect for mobile and edge devices.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #ec4899' }}>
              <h4 style={{ color: '#be185d', margin: '0 0 0.5rem 0' }}>U-Net</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Segmenter:</strong> Famous in medical imaging. It uses a U-shaped architecture to output a pixel-by-pixel mask (Semantic Segmentation) rather than a single class.</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
              <h4 style={{ color: '#6d28d9', margin: '0 0 0.5rem 0' }}>ViT (Vision Transformer)</h4>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}><strong>The Modern Paradigm:</strong> Ditches convolutions entirely! It treats image patches like words in a sentence, using Self-Attention mechanisms. State-of-the-art today.</p>
            </div>
          </div>

          {/* VGG-16 Deep Dive */}
          <div style={{ background: '#f0f9ff', padding: '2rem', borderRadius: '16px', border: '1px solid #bae6fd', marginBottom: '2rem' }}>
            <h3 style={{ color: '#0369a1', margin: '0 0 1rem 0' }}>Deep Dive: VGG-16 & Transfer Learning</h3>
            <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1rem' }}>
              <strong>VGG-16</strong> is a convolutional neural network (CNN) designed for image classification tasks, known for its simple and uniform architecture that delivers strong performance on visual recognition problems.
            </p>
            <ul style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>Consists of <strong>16 layers</strong> (13 convolutional + 3 fully connected layers)</li>
              <li style={{ marginBottom: '0.25rem' }}>Uses repeated <strong>3×3 convolution filters</strong> for feature extraction</li>
              <li style={{ marginBottom: '0.25rem' }}>Applies <strong>max pooling</strong> between layers to reduce spatial dimensions</li>
              <li style={{ marginBottom: '0.25rem' }}>Produces final predictions using fully connected layers with <strong>softmax</strong></li>
              <li style={{ marginBottom: '0.25rem' }}>Achieves <strong>92.7% test accuracy</strong> on the ImageNet dataset which contains 14 million images belonging to 1000 classes.</li>
            </ul>
            <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1.5rem', padding: '1rem', background: '#e0f2fe', borderRadius: '8px' }}>
              <strong>The Magic of Transfer Learning:</strong> Because VGG-16 was trained on 14 million images, it already knows how to detect lines, shapes, and complex features like eyes or wheels. We can borrow this knowledge and apply it to our own custom datasets!
            </p>

            <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0' }}>How to perform Transfer Learning with VGG-16 in Keras</h4>
              <pre style={{ color: '#e2e8f0', fontSize: '0.9rem', margin: 0, fontFamily: 'monospace' }}>
{`from tensorflow.keras.applications import VGG16
from tensorflow.keras import layers, models

# 1. Load the pre-trained VGG16 base
# include_top=False means we drop the final 1000-class classification head!
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# 2. Freeze the base layers so we don't destroy their learned features
for layer in base_model.layers:
    layer.trainable = False

# 3. Create a new model on top of it
model = models.Sequential([
    base_model,
    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5), # Prevent overfitting
    layers.Dense(1, activation='sigmoid') # e.g. Cat vs Dog (Binary Classification)
])

# 4. Compile and Train
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
# model.fit(...) # Fast training with excellent accuracy!`}
              </pre>
            </div>
          </div>

          {/* Interactive Transfer Learning Visualization */}
          <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid #cbd5e1', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={24} color="#3b82f6" /> 
                Visualizing Transfer Learning (VGG-16)
              </h3>
              <button 
                onClick={runTransferLearning}
                disabled={isTlPlaying}
                style={{ 
                  background: isTlPlaying ? '#94a3b8' : '#3b82f6', 
                  color: 'white', border: 'none', padding: '0.5rem 1.5rem', 
                  borderRadius: '24px', cursor: isTlPlaying ? 'not-allowed' : 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' 
                }}
              >
                <Play size={16} /> {isTlPlaying ? `Training... Epoch ${tlEpoch}/5` : 'Train on Custom Dataset'}
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '2rem' }}>
              When training on a small, custom dataset (like Dogs vs Cats), the <strong>Base Layers</strong> are locked. Only the <strong>New Classification Head</strong> updates its weights to learn the new task. Watch how the data flows!
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              
              {/* Input Image */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
                <div style={{ width: '64px', height: '64px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #94a3b8', fontSize: '1.5rem' }}>
                  📸
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px', textAlign: 'center' }}>Custom<br/>Dataset</div>
              </div>

              <div style={{ color: tlEpoch > 0 ? '#3b82f6' : '#cbd5e1', transition: 'color 0.3s' }}>
                <ArrowRight size={24} />
              </div>

              {/* VGG16 Frozen Blocks */}
              <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '1.5rem 1rem 1rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', position: 'relative', marginTop: '12px' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#64748b', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  <Lock size={12} /> FROZEN BASE (VGG-16)
                </div>
                
                {/* 5 Blocks of VGG */}
                {[
                  { id: 1, layers: ['Conv 1-1', 'Conv 1-2'] },
                  { id: 2, layers: ['Conv 2-1', 'Conv 2-2'] },
                  { id: 3, layers: ['Conv 3-1', 'Conv 3-2', 'Conv 3-3'] },
                  { id: 4, layers: ['Conv 4-1', 'Conv 4-2', 'Conv 4-3'] },
                  { id: 5, layers: ['Conv 5-1', 'Conv 5-2', 'Conv 5-3'] }
                ].map((block) => (
                  <div key={block.id} style={{ display: 'flex', gap: '2px', padding: '6px', background: 'rgba(255,255,255,0.7)', borderRadius: '6px', border: '1px solid #cbd5e1', opacity: tlEpoch > 0 && tlEpoch <= block.id ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                    {block.layers.map((layer) => (
                      <div key={layer} style={{ background: '#94a3b8', width: '22px', height: '110px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{layer}</div>
                    ))}
                    <div style={{ background: '#cbd5e1', width: '22px', height: '110px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.65rem', fontWeight: 'bold', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Pooling</div>
                  </div>
                ))}
              </div>

              <div style={{ color: tlEpoch > 5 ? '#3b82f6' : (tlEpoch > 0 ? '#10b981' : '#cbd5e1'), transition: 'color 0.3s' }}>
                <ArrowRight size={24} />
              </div>

              {/* Trainable Head */}
              <div style={{ display: 'flex', gap: '4px', background: tlEpoch > 0 ? '#ecfdf5' : '#f8fafc', padding: '1.5rem 1rem 1rem 1rem', borderRadius: '12px', border: `1px solid ${tlEpoch > 0 ? '#10b981' : '#cbd5e1'}`, position: 'relative', transition: 'background 0.3s, border 0.3s', marginTop: '12px' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: tlEpoch > 0 ? '#10b981' : '#94a3b8', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'background 0.3s' }}>
                  <Unlock size={12} /> TRAINABLE HEAD
                </div>
                
                <div style={{ background: tlEpoch > 0 ? (tlEpoch % 2 === 0 ? '#34d399' : '#059669') : '#cbd5e1', width: '22px', height: '110px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', writingMode: 'vertical-rl', transform: 'rotate(180deg)', transition: 'background 0.2s', fontWeight: 'bold' }}>Flatten</div>
                <div style={{ background: tlEpoch > 0 ? (tlEpoch % 2 === 0 ? '#10b981' : '#047857') : '#94a3b8', width: '24px', height: '110px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', transition: 'background 0.2s', fontWeight: 'bold', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Dense</div>
                <div style={{ background: tlEpoch > 0 ? (tlEpoch % 2 === 0 ? '#10b981' : '#047857') : '#94a3b8', width: '24px', height: '110px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', transition: 'background 0.2s', fontWeight: 'bold', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Dense</div>
                <div style={{ background: tlEpoch > 0 ? (tlEpoch % 2 === 0 ? '#059669' : '#065f46') : '#64748b', width: '24px', height: '110px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', transition: 'background 0.2s', fontWeight: 'bold', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Dense (Out)</div>
              </div>

            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: tlEpoch > 0 ? '#f0fdf4' : '#f1f5f9', borderRadius: '8px', border: `1px solid ${tlEpoch > 0 ? '#bbf7d0' : '#e2e8f0'}` }}>
              <strong>Status:</strong> {
                !isTlPlaying 
                  ? (tlEpoch > 0 ? "Training complete! The new head has learned to classify your custom dataset while reusing VGG-16's feature extractors." : "Waiting to train. Base model features are fixed.") 
                  : `Propagating data through frozen layers... Updating Trainable Head weights (Epoch ${tlEpoch})! ⚡`
              }
            </div>

          </div>

          {/* Vision Transformer (ViT) Deep Dive */}
          <div style={{ background: '#f5f3ff', padding: '2rem', borderRadius: '16px', border: '1px solid #ddd6fe', marginBottom: '2rem' }}>
            <h3 style={{ color: '#4c1d95', margin: '0 0 1rem 0' }}>Deep Dive: Vision Transformer (ViT) Architecture</h3>
            <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1rem' }}>
              <strong>Vision Transformer (ViT)</strong> is a deep learning architecture that applies the Transformer model to images. Instead of relying on convolutions, ViTs use <strong>self-attention</strong> to capture relationships across all image patches, enabling a global understanding of the image.
            </p>
            <ul style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '2rem', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.25rem' }}>Uses self-attention to model global dependencies between image patches.</li>
              <li style={{ marginBottom: '0.25rem' }}>Unlike CNNs, it does not rely on convolution operations for feature extraction.</li>
              <li style={{ marginBottom: '0.25rem' }}>Demonstrates strong performance in image classification, object detection and segmentation.</li>
            </ul>

            {/* Interactive ViT Animation */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h4 style={{ color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={20} color="#8b5cf6" /> 
                  Interactive ViT Workflow
                </h4>
                <button 
                  onClick={runVitAnimation}
                  disabled={isVitPlaying}
                  style={{ 
                    background: isVitPlaying ? '#94a3b8' : '#8b5cf6', 
                    color: 'white', border: 'none', padding: '0.5rem 1.5rem', 
                    borderRadius: '24px', cursor: isVitPlaying ? 'not-allowed' : 'pointer', 
                    display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' 
                  }}
                >
                  <Play size={16} /> {isVitPlaying ? `Processing... Step ${vitStep}/5` : 'Run ViT Animation'}
                </button>
              </div>

              {/* Visualization Track */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', position: 'relative' }}>
                {/* 1. Input Image */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', opacity: vitStep >= 0 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                  <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '4px', border: '2px solid #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🖼️</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 'bold', color: '#475569' }}>Image</div>
                </div>

                <ArrowRight size={20} color={vitStep >= 1 ? '#8b5cf6' : '#cbd5e1'} style={{ transition: 'color 0.3s' }} />

                {/* 2. Patches */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', opacity: vitStep >= 1 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', width: '60px', height: '60px', background: '#f8fafc', padding: '2px', border: `2px solid ${vitStep === 1 ? '#8b5cf6' : '#94a3b8'}`, transition: 'border 0.3s' }}>
                    {[...Array(9)].map((_, i) => <div key={i} style={{ background: vitStep === 1 ? '#8b5cf6' : '#cbd5e1', height: '100%', width: '100%', transition: 'background 0.3s' }} />)}
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 'bold', color: vitStep === 1 ? '#8b5cf6' : '#475569', transition: 'color 0.3s' }}>Patching</div>
                </div>

                <ArrowRight size={20} color={vitStep >= 2 ? '#8b5cf6' : '#cbd5e1'} style={{ transition: 'color 0.3s' }} />

                {/* 3. Linear Projection & Positional Embedding */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px', opacity: vitStep >= 2 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                  <div style={{ display: 'flex', gap: '2px', border: `2px solid ${vitStep === 2 ? '#8b5cf6' : '#94a3b8'}`, padding: '4px', borderRadius: '4px', background: '#f8fafc', transition: 'border 0.3s' }}>
                    <div style={{ width: '12px', height: '50px', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.45rem', color: 'white', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>*CLS</div>
                    {[...Array(3)].map((_, i) => <div key={i} style={{ width: '12px', height: '50px', background: vitStep === 2 ? '#3b82f6' : '#94a3b8', opacity: 0.8, transition: 'background 0.3s' }} />)}
                    <span style={{ margin: '0 2px', color: '#64748b', fontSize: '0.5rem', display: 'flex', alignItems: 'center' }}>...</span>
                    <div style={{ width: '12px', height: '50px', background: vitStep === 2 ? '#3b82f6' : '#94a3b8', opacity: 0.8, transition: 'background 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 'bold', color: vitStep === 2 ? '#8b5cf6' : '#475569', textAlign: 'center', transition: 'color 0.3s' }}>+ Positional<br/>Embeddings</div>
                </div>

                <ArrowRight size={20} color={vitStep >= 3 ? '#8b5cf6' : '#cbd5e1'} style={{ transition: 'color 0.3s' }} />

                {/* 4. Transformer Encoder */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px', opacity: vitStep >= 3 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                  <div style={{ width: '80px', height: '70px', background: '#8b5cf6', borderRadius: '8px', border: `2px solid ${vitStep === 3 ? '#c4b5fd' : '#6d28d9'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'border 0.3s' }}>
                    <Network size={20} style={{ marginBottom: '4px' }} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold', textAlign: 'center' }}>Transformer<br/>Encoder</span>
                  </div>
                </div>

                <ArrowRight size={20} color={vitStep >= 4 ? '#8b5cf6' : '#cbd5e1'} style={{ transition: 'color 0.3s' }} />

                {/* 5. MLP Head */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', opacity: vitStep >= 4 ? 1 : 0.5, transition: 'opacity 0.3s' }}>
                  <div style={{ width: '60px', height: '50px', background: '#10b981', borderRadius: '4px', border: `2px solid ${vitStep === 4 ? '#6ee7b7' : '#047857'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', transition: 'border 0.3s' }}>MLP</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 'bold', color: vitStep === 4 ? '#10b981' : '#475569', transition: 'color 0.3s' }}>Classify</div>
                </div>

              </div>

              {/* Step Descriptions */}
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '60px' }}>
                {vitStep === -1 && <span style={{ color: '#64748b' }}>Click play to see how ViT processes an image without convolutions.</span>}
                {vitStep === 0 && <span><strong>Step 0: Input.</strong> We start with a standard 2D image.</span>}
                {vitStep === 1 && <span style={{ color: '#8b5cf6' }}><strong>Step 1: Patch Splitting.</strong> The image is divided into fixed-size, non-overlapping patches (e.g., 16x16 pixels).</span>}
                {vitStep === 2 && <span style={{ color: '#3b82f6' }}><strong>Step 2: Linear Projection.</strong> Patches are flattened into vectors. We add Positional Encodings so the model knows where patches came from, and prepend a special <strong>[CLS] token</strong> to aggregate global information.</span>}
                {vitStep === 3 && <span style={{ color: '#6d28d9' }}><strong>Step 3: Transformer Encoder.</strong> Multi-Head Self-Attention (MSA) allows every patch to look at every other patch simultaneously!</span>}
                {vitStep === 4 && <span style={{ color: '#047857' }}><strong>Step 4: MLP Head.</strong> The output of just the [CLS] token is passed through a dense network to predict the final class!</span>}
                {vitStep >= 5 && <span><strong>Done!</strong> ViT successfully classified the image using global attention instead of local convolutions.</span>}
              </div>
            </div>

            {/* ViT Details Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
                <h4 style={{ color: '#4c1d95', margin: '0 0 0.5rem 0' }}>1. Image Patching and Embedding</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Converts a 2D image into a sequence of patch embeddings, analogous to tokens in NLP.</p>
                <ul style={{ color: '#475569', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem' }}>
                  <li><strong>Patch Splitting:</strong> The image is divided into fixed-size, non-overlapping patches (each treated as a token) to reduce computation while preserving local spatial info.</li>
                  <li><strong>Patch Flattening:</strong> Each patch of size P×P×C is flattened into a single vector of length P²×C.</li>
                  <li><strong>Patch Embedding (Linear Projection):</strong> Each flattened patch is mapped to a learnable D-dimensional embedding, acting like word embeddings.</li>
                </ul>
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                <h4 style={{ color: '#1e3a8a', margin: '0 0 0.5rem 0' }}>2. Positional Encoding & 3. CLS Token</h4>
                <ul style={{ color: '#475569', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem' }}>
                  <li><strong>Positional Encoding:</strong> Since Transformers are permutation invariant, learnable positional encodings are injected so the model knows the spatial order of patches.</li>
                  <li><strong>CLS Token:</strong> A learnable vector prepended to the patch sequence that gathers global information from all patches. Its final output alone is used for prediction without CNN-style pooling.</li>
                </ul>
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #6d28d9' }}>
                <h4 style={{ color: '#4c1d95', margin: '0 0 0.5rem 0' }}>4. Transformer Encoder (Pre-LayerNorm)</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Applies LayerNorm before both the attention and feed-forward blocks to stabilize gradient flow.</p>
                <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  LayerNorm(x) = ( (x - μ) / σ ) ⊙ γ + β
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>Each Encoder Block has: Multi-Head Self-Attention (MSA), Feed-Forward Network (FFN), Residual connections, and LayerNorm.</p>
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #ec4899' }}>
                <h4 style={{ color: '#9d174d', margin: '0 0 0.5rem 0' }}>5. Multi-Head Self-Attention (MSA)</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>Enables each patch to relate to all others using Query, Key, and Value projections.</p>
                <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Q = XW_Q,  K = XW_K,  V = XW_V<br/><br/>
                  Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V<br/><br/>
                  MSA(X) = Concat(head_1, ..., head_h) W_O
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>Multiple heads allow the model to focus on different types of relationships simultaneously (e.g., edges, color, global shapes).</p>
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                <h4 style={{ color: '#b45309', margin: '0 0 0.5rem 0' }}>6. Feed-Forward Network & 7. Residual Connections</h4>
                <p style={{ color: '#475569', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>The FFN operates independently on each token. Residuals bypass transformation blocks to preserve earlier layer info.</p>
                <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  FFN(x) = W_2 GELU(W_1 x + b_1) + b_2
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ color: '#047857', margin: '0 0 0.5rem 0' }}>8. Classification Head & 9. Training ViTs</h4>
                <ul style={{ color: '#475569', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem' }}>
                  <li><strong>MLP Head:</strong> Converts the CLS token output into class probabilities using softmax.</li>
                  <li><strong>Data Requirements:</strong> ViTs need large-scale datasets and augmentations to generalize well because they lack the strong inductive biases (like translation invariance) of CNNs.</li>
                  <li><strong>Pretraining & Finetuning:</strong> Usually pretrained on massive datasets and finetuned for specific tasks.</li>
                </ul>
              </div>

            </div>

            {/* Comparison Table */}
            <h4 style={{ color: '#4c1d95', margin: '2rem 0 1rem 0' }}>ViT vs Convolutional Neural Networks (CNNs)</h4>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#334155' }}>Feature</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#334155' }}>CNNs (e.g. VGG, ResNet)</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#334155' }}>ViTs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 'bold' }}>Attention Scope</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Capture local features via convolutions</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Capture global relationships via self-attention</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 'bold' }}>Inductive Bias</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Strong biases (locality, translation invariance)</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Minimal biases, more flexible but data-hungry</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 'bold' }}>Data Requirement</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Work well with small datasets</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Need large datasets for best performance</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', color: '#475569', fontWeight: 'bold' }}>Feature Learning</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Learn hierarchical features</td>
                    <td style={{ padding: '1rem', color: '#475569' }}>Learn context-rich, long-range features</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pros and Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <h4 style={{ color: '#166534', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={18} /> Advantages</h4>
                <ul style={{ color: '#15803d', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Global Context:</strong> Captures long-range dependencies.</li>
                  <li><strong>Scalability:</strong> Performs incredibly well with massive datasets.</li>
                  <li><strong>Parallel Processing:</strong> Highly efficient parallel computation.</li>
                  <li><strong>Strong Representations:</strong> Learns diverse patterns directly from data.</li>
                </ul>
              </div>

              <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <h4 style={{ color: '#991b1b', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} /> Limitations</h4>
                <ul style={{ color: '#b91c1c', fontSize: '0.9rem', margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li><strong>Data-Hungry:</strong> Requires massive datasets to learn.</li>
                  <li><strong>High Compute Cost:</strong> Self-attention scales quadratically with patches.</li>
                  <li><strong>No Local Bias:</strong> Does not natively exploit local pixel patterns.</li>
                  <li><strong>Hard on Small Images:</strong> Few tokens reduce attention effectiveness.</li>
                </ul>
              </div>
            </div>

          </div>
          
          </div>
      )}

    </div>
  );
}
