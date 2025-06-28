export interface Nutrient {
    value: number | null; // Allow null for missing values, more flexible than optional
    unit: string; // Unit of measurement (e.g., "KCAL", "G", "MG")
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
    weight: number;
    nutrition?: {
        per100g: NutritionData;
    };
} 