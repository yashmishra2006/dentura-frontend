export interface Language {
  code: 'en' | 'hi';
  name: string;
  flag: string;
}

export interface ImageType {
  id: 'xray' | 'gum';
  name: string;
  description: string;
  icon: string;
}

export interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  recommendations?: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  currentStep: string;
  progress: number;
}