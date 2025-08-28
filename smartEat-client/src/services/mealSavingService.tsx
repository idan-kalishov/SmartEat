import { CustomToastPromise } from "@/components/CustomToastPromise.tsx";
import api from "./api";

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

export const logMealToBackend = async (
  name: string,
  ingredients: Ingredient[],
  image?: string // Base64 image string
) => {
  // Create FormData for multipart upload
  const formData = new FormData();

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

  // Add meal data as JSON string
  formData.append('meal', JSON.stringify(mealData));

  // Add image if provided
  if (image) {
    // Convert base64 to blob
    // Check if image is already a data URL
    if (image.startsWith('data:')) {
      // It's already a data URL, convert directly to blob
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append('image', blob, 'meal-image.jpg');
    } else {
      // It's a base64 string without data URL prefix, add the prefix
      const dataUrl = `data:image/jpeg;base64,${image}`;
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      formData.append('image', blob, 'meal-image.jpg');
    }
  }

  // Create the API promise first
  const apiPromise = api.post("/meals", formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Let browser set the boundary
    },
  }).then(response => response.data)
      .catch(error => console.error(error));

  CustomToastPromise(
    apiPromise,
    {
      loadingMessage: "Logging meal...",
      successMessage: "Meal was successfully saved!",
      errorMessage: "Failed to log meal, Please try Again",
    }
  );

  return apiPromise;
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
