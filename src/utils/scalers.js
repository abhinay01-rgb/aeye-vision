/**
 * Simplified mathematical utilities for Feature Scaling
 */

// Basic math utilities
export const getMean = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length;

export const getMedian = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const getPercentile = (arr, p) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

export const getStdDev = (arr, mean) => {
  const m = mean !== undefined ? mean : getMean(arr);
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - m, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

// Vector magnitude for Normalizer
export const getMagnitude = (vector) => {
  return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
};

// Scaling algorithms
export const scalers = {
  standard: (data) => {
    const mean = getMean(data);
    const std = getStdDev(data, mean);
    const epsilon = 1e-8;
    return data.map(x => (x - mean) / (std || epsilon));
  },
  
  minmax: (data) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    const epsilon = 1e-8;
    return data.map(x => (x - min) / (range || epsilon));
  },
  
  robust: (data) => {
    const median = getMedian(data);
    const q1 = getPercentile(data, 25);
    const q3 = getPercentile(data, 75);
    const iqr = q3 - q1;
    const epsilon = 1e-8;
    return data.map(x => (x - median) / (iqr || epsilon));
  },
  
  maxabs: (data) => {
    const maxAbs = Math.max(...data.map(x => Math.abs(x)));
    const epsilon = 1e-8;
    return data.map(x => x / (maxAbs || epsilon));
  },

  normalizer: (vector) => {
    const mag = getMagnitude(vector);
    const epsilon = 1e-8;
    return vector.map(x => x / (mag || epsilon));
  }
};
