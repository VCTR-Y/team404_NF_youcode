export type FoodQualityState = 'expired' | 'close to expiry' | 'fresh';

export interface FoodAnalysisResult {
  qualityState: FoodQualityState;
  predictedExpiryDate: string;
}

export interface ImageAnalysisError {
  message: string;
  code: string;
}
