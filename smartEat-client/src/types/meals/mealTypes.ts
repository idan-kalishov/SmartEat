export interface Nutrient {
  value?: number;
  unit: string;
}

export interface NutritionInfo {
  per100g: Record<string, Nutrient>;
}

export interface IngredientDetails {
  name: string;
  weight: number;
  usdaFoodLabel?: string;
  nutrition?: NutritionInfo;
}

export interface Meal {
  id: string;
  userId: string;
  ingredients: IngredientDetails[];
  imageUrl?: string;
  name: string;
  createdAt: string;
} 