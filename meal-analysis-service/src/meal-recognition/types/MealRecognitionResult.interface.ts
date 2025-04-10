export interface MealRecognitionResult {
  foodName: string;
  weight: number;
  usdaFoodLabel?: string;
  nutrition?: {
    per100g: any;
  };
}

export interface nutritionDTO {
  value: number;
  unit: string;
}
