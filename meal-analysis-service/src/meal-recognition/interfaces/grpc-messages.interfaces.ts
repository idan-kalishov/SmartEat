// src/interfaces/grpc-messages.interfaces.ts
export interface Nutrient {
  value?: number | null;
  unit: string;
}

export interface NutritionData {
  calories: Nutrient;
  totalFat: Nutrient;
  totalCarbohydrates: Nutrient;
  sugars: Nutrient;
  protein: Nutrient;
  iron: Nutrient;
  fiber: Nutrient;
  vitaminA: Nutrient;
  vitaminC: Nutrient;
  vitaminD: Nutrient;
  vitaminB12: Nutrient;
  calcium: Nutrient;
  magnesium: Nutrient;
}

export interface Ingredient {
  name: string;
  weight: string;
  nutrition: {
    per100g: NutritionData;
  };
}

export interface AnalyzeMealRequest {
  image: Buffer;
}

export interface AnalyzeMealResponse {
  items: Ingredient[];
}

export interface IngredientDetailsRequest {
  names: string[];
}

export interface IngredientDetailsResponse {
  items: Ingredient[];
}

// Original interface (what your service returns)
export interface MealRecognitionResult {
  foodName: string; // This will map to Ingredient.name
  weight: number; // This needs to be converted to string
  usdaFoodLabel?: string;
  nutrition?: {
    per100g: any; // This needs proper typing
  };
}

// Client expected interface
export interface Ingredient {
  name: string;
  weight: string;
  nutrition: {
    per100g: NutritionData;
  };
}
