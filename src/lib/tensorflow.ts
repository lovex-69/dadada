import * as tf from '@tensorflow/tfjs';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import { ClassificationResult, Category } from '@/types';

let model: mobilenetModule.MobileNet | null = null;
let modelLoadPromise: Promise<mobilenetModule.MobileNet> | null = null;

/**
 * Custom error type for TensorFlow operations
 */
export class TensorFlowError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'TensorFlowError';
  }
}

/**
 * Load MobileNet model on first use (singleton pattern)
 * @returns Promise resolving to loaded MobileNet model
 */
export const loadModel = async (): Promise<void> => {
  if (model) {
    return;
  }

  if (modelLoadPromise) {
    await modelLoadPromise;
    return;
  }

  try {
    modelLoadPromise = mobilenetModule.load();
    model = await modelLoadPromise;
    modelLoadPromise = null;
  } catch (error) {
    modelLoadPromise = null;
    if (process.env.NODE_ENV === 'development') {
      console.error('Error loading TensorFlow model:', error);
    }
    throw new TensorFlowError('Failed to load TensorFlow model', error);
  }
};

/**
 * Map ImageNet class names to CivicPulse categories
 * @param className - ImageNet class name
 * @returns Mapped CivicPulse category
 */
export const getCategoryFromClassification = (className: string): Category => {
  const lowerClassName = className.toLowerCase();

  const roadKeywords = [
    'street', 'road', 'highway', 'asphalt', 'pavement', 
    'pothole', 'crack', 'manhole', 'grate', 'curb'
  ];
  
  const garbageKeywords = [
    'trash', 'garbage', 'waste', 'litter', 'bag', 'bottle',
    'can', 'plastic', 'paper', 'container', 'dumpster'
  ];
  
  const waterKeywords = [
    'water', 'leak', 'pipe', 'hydrant', 'fountain', 'drain',
    'puddle', 'flooding', 'sewer', 'valve'
  ];
  
  const infraKeywords = [
    'pole', 'sign', 'light', 'lamp', 'fence', 'barrier',
    'bridge', 'wall', 'structure', 'post', 'utility',
    'traffic', 'signal', 'bench', 'railing'
  ];

  if (roadKeywords.some(keyword => lowerClassName.includes(keyword))) {
    return 'road_damage';
  }

  if (garbageKeywords.some(keyword => lowerClassName.includes(keyword))) {
    return 'garbage';
  }

  if (waterKeywords.some(keyword => lowerClassName.includes(keyword))) {
    return 'water_leak';
  }

  if (infraKeywords.some(keyword => lowerClassName.includes(keyword))) {
    return 'broken_infra';
  }

  return 'other';
};

/**
 * Classify an image and return category, severity, and confidence
 * @param imageElement - HTML image, video, or canvas element
 * @returns Promise resolving to classification result
 */
export const classifyImage = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<ClassificationResult> => {
  try {
    await loadModel();

    if (!model) {
      throw new TensorFlowError('Model not loaded');
    }

    const predictions = await model.classify(imageElement, 3);

    if (!predictions || predictions.length === 0) {
      return {
        className: 'unknown',
        probability: 0,
        category: 'other',
      };
    }

    const topPrediction = predictions[0];
    const confidence = topPrediction.probability;

    let category: Category;
    let finalConfidence = confidence;

    if (confidence > 0.7) {
      category = getCategoryFromClassification(topPrediction.className);
    } else {
      category = 'other';
      finalConfidence = Math.max(0.3, confidence * 0.5);
    }

    return {
      className: topPrediction.className,
      probability: finalConfidence,
      category,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error classifying image:', error);
    }

    return {
      className: 'error',
      probability: 0,
      category: 'other',
    };
  }
};

/**
 * Classify an image from a base64 string
 * @param base64Image - Base64 encoded image string
 * @returns Promise resolving to classification result
 */
export const classifyImageFromBase64 = async (
  base64Image: string
): Promise<ClassificationResult> => {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        try {
          const result = await classifyImage(img);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new TensorFlowError('Failed to load image from base64'));
      };
      
      img.src = base64Image;
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error classifying image from base64:', error);
    }

    return {
      className: 'error',
      probability: 0,
      category: 'other',
    };
  }
};

/**
 * Check if the model is loaded
 * @returns Boolean indicating if model is loaded
 */
export const isModelLoaded = (): boolean => {
  return model !== null;
};

/**
 * Dispose of the model and free memory
 */
export const disposeModel = (): void => {
  if (model) {
    model = null;
  }
  modelLoadPromise = null;
};
