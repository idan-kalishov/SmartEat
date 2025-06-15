export interface Nutrient {
  value?: number;
  unit: string;
}

export interface NutritionInfo {
  per100g: Record<string, Nutrient>;
}

export interface Ingredient {
  name: string;
  weight: number;
  nutrition?: NutritionInfo;
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  userId: string;
  createdAt: string; // ISO date string
  name: string;
  ingredients: Ingredient[];
  imageUrl?: string; // URL to the meal image
} 