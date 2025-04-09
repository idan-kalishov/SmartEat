// Interface for a single nutrient (e.g., calories, protein, etc.)
export interface Nutrient {
  value: number | null; // Allow null for missing values
  unit: string; // Unit of measurement (e.g., "KCAL", "G", "MG")
}

// Interface for nutritional data (per100g or scaled)
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

// Interface for an ingredient
export interface Ingredient {
  name: string;
  weight: string; // Weight as a string (can be parsed to a number later)
  nutrition: {
    per100g: NutritionData;
  };
}

// Interface for the transformed ingredient (includes scaled nutrition)
export interface TransformedIngredient extends Omit<Ingredient, "nutrition"> {
  nutrition: {
    per100g: NutritionData;
    scaled: NutritionData;
  };
}

export const nutritionKeyMap = {
  calories: "Calories",
  totalFat: "Fat",
  totalCarbohydrates: "Carbs",
  sugars: "Sugars",
  protein: "Protein",
  fiber: "Fiber",
  iron: "Iron",
} as const;

export const vitaminAndMineralKeys = [
  "iron",
  "vitaminA",
  "vitaminC",
  "vitaminD",
  "vitaminB12",
  "calcium",
  "magnesium",
] as const;
