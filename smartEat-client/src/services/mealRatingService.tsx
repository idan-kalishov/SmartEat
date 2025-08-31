// src/services/mealAnalysisService.ts
import { NutritionData } from "../types/common";
import { TransformedIngredient } from "../types/scaled-ingredient";
import api from "./api";

export interface MealAnalysisResponse {
  rating: {
    letterGrade?: string;
    score: number;
  };
  recommendations: string[];
  positiveFeedback?: string;
  dailyRecommendations?: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    fiber: number;
    micronutrients?: {
      vitaminA: number;
      vitaminC: number;
      vitaminD: number;
      vitaminB12: number;
      calcium: number;
      iron: number;
      magnesium: number;
    };
  };
}

export async function analyzeMeal(
  ingredients: TransformedIngredient[]
): Promise<MealAnalysisResponse> {
  // Sum all nutrition values from ingredients
  const totalNutrition = ingredients.reduce((acc, ingredient) => {
    const addNutrient = (key: keyof NutritionData) => {
      const nutrient = ingredient.nutrition.scaled[key];
      if (nutrient?.value !== undefined) {
        acc[key] = acc[key] || { value: 0, unit: nutrient.unit };
        acc[key]!.value += nutrient.value;
      }
    };

    (
      Object.keys(ingredient.nutrition.scaled) as Array<keyof NutritionData>
    ).forEach(addNutrient);

    return acc;
  }, {} as NutritionData);

  // Prepare the API request payload (no longer includes user profile)
  const payload = {
    ingredients: ingredients.map((ing) => ing.name),
    nutrition: {
      calories: totalNutrition.calories || { value: 0, unit: "kcal" },
      protein: totalNutrition.protein || { value: 0, unit: "g" },
      fats: totalNutrition.totalFat || { value: 0, unit: "g" },
      carbs: totalNutrition.totalCarbohydrates || { value: 0, unit: "g" },
      fiber: totalNutrition.fiber || { value: 0, unit: "g" },
      vitaminA: totalNutrition.vitaminA || { value: 0, unit: "mcg" },
      vitaminC: totalNutrition.vitaminC || { value: 0, unit: "mg" },
      vitaminD: totalNutrition.vitaminD || { value: 0, unit: "mcg" },
      vitaminB12: totalNutrition.vitaminB12 || { value: 0, unit: "mcg" },
      iron: totalNutrition.iron || { value: 0, unit: "mg" },
      calcium: totalNutrition.calcium || { value: 0, unit: "mg" },
      magnesium: totalNutrition.magnesium || { value: 0, unit: "mg" },
    },
  };

  console.log("Sending meal analysis:", payload);

  const response = await api.post("/nutrition/meal-rating", payload);
  return response.data;
}
