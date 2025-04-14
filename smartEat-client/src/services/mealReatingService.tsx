// src/services/mealAnalysisService.ts
import axios from "axios";
import { UserProfile } from "../types/userTypes";
import {
  TransformedIngredient,
  NutritionData,
} from "../types/imageAnalyizeTypes";

const BASE_URL = "https://192.168.1.145:3002";

export interface MealAnalysisResponse {
  rating: {
    letter_grade: string;
    score: number;
  };
  recommendations: string[];
  positive_feedback: string;
  daily_recommendations?: {
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
  ingredients: TransformedIngredient[],
  userProfile: UserProfile
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

  // Prepare the API request payload
  const payload = {
    user: userProfile,
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

  const response = await axios.post(
    `${BASE_URL}/nutrition/meal-rating`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  return response.data;
}
