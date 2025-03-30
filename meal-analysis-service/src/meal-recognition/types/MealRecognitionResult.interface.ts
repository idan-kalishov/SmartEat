export interface MealRecognitionResult {
  foodName: string;
  quantity: number;
  weight: number;
  nutrition?: {
    per100g: any;
  };
}
