export interface MealRecognitionResult {
  foodName: string;
  weight: number;
  nutrition?: {
    per100g: any;
  };
}
