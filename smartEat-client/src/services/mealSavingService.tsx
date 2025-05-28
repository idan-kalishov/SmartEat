import { CustomeToastPromise } from "@/components/CustomeToastPromise";
import axios from "axios";

interface Ingredient {
  name: string;
  weight: number;
  nutrition?: {
    per100g: Record<string, { value: number; unit: string }>;
  };
}

interface Meal {
  name: string;
  ingredients: Ingredient[];
}

const API_URL = "https://localhost:3002";

export const logMealToBackend = async (
  name: string,
  ingredients: Ingredient[]
) => {
  const mealData: Meal = {
    name,
    ingredients: ingredients.map(ing => ({
      name: ing.name,
      weight: ing.weight,
      nutrition: ing.nutrition ? {
        per100g: Object.entries(ing.nutrition.per100g).reduce((acc, [key, value]) => ({
          ...acc,
          [key]: { value, unit: getUnitForKey(key) }
        }), {})
      } : undefined
    }))
  };

  return CustomeToastPromise(
    axios.post(`${API_URL}/meals`, mealData, {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    }).then(response => response.data),
    {
      loadingMessage: "Logging meal...",
      successMessage: "Meal was successfully saved!",
      errorMessage: "Failed to log meal, Please try Again",
    }
  );
};

// Helper function to determine units for different nutrients
function getUnitForKey(key: string): string {
  const unitMap: Record<string, string> = {
    calories: "kcal",
    protein: "g",
    totalFat: "g",
    totalCarbohydrates: "g",
    fiber: "g",
    sugar: "g",
    sodium: "mg",
    potassium: "mg",
    calcium: "mg",
    iron: "mg",
    vitaminA: "µg",
    vitaminC: "mg",
    vitaminD: "µg",
    vitaminB12: "µg",
    magnesium: "mg"
  };
  
  return unitMap[key] || "g";
}
