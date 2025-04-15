export interface AnalyzeMealResponse {
  items: MealRecognitionResult[];
}

export interface IngredientDetailsRequest {
  names: string[];
}

export interface IngredientDetailsResponse {
  items: IngredientsRecognitionResult[];
}

export interface MealRecognitionResult {
  foodName: string;
  weight: number;
  nutrition?: NutritionInfo | undefined;
}

export interface IngredientsRecognitionResult {
  name: string;
  nutrition?: NutritionInfo | undefined;
}

export interface NutritionInfo {
  /** Direct map without nested nutrients */
  per100g: { [key: string]: Nutrient };
}

export interface NutritionInfo_Per100gEntry {
  key: string;
  value: Nutrient | undefined;
}

export interface Nutrient {
  value?: number | undefined;
  unit: string;
}
