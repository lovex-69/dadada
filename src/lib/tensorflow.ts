import * as tf from '@tensorflow/tfjs';
import * as mobilenetModule from '@tensorflow-models/mobilenet';
import { ClassificationResult, Category } from '@/types';

let model: mobilenetModule.MobileNet | null = null;

export const loadModel = async (): Promise<mobilenetModule.MobileNet> => {
  if (!model) {
    model = await mobilenetModule.load();
  }
  return model;
};

export const classifyImage = async (
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
): Promise<ClassificationResult> => {
  return {
    className: '',
    probability: 0,
    category: 'other',
  };
};

export const getCategoryFromClassification = (
  className: string
): Category => {
  return 'other';
};
