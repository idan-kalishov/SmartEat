import { CustomeToastPromise } from "@/components/CustomeToastPromise";
import { TransformedIngredient } from "@/types/imageAnalyizeTypes";
import { IngredientDetails, Meal } from "@/types/meals/mealTypes";
import apiClient from "./authService";

export const logMealToBackend = async (
  name: string,
  servingSize: number,
  ingredients: TransformedIngredient[],
  imageUrl?: string
) => {
  // Transform ingredients to match backend IngredientDetails type, scaling weights by serving size
  const transformedIngredients: IngredientDetails[] = ingredients.map(ing => ({
    name: ing.name,
    // Scale the weight by the serving size
    weight: parseFloat(ing.weight) * servingSize,
    per100gNutrition: Object.entries(ing.nutrition.per100g).reduce((acc, [key, value]) => {
      if (value.value !== null) {
        acc[key] = {
          value: value.value,
          unit: value.unit
        };
      }
      return acc;
    }, {} as Record<string, { value: number; unit: string }>)
  }));

  const mealData: Omit<Meal, '_id' | 'userId' | 'createdAt' | 'updatedAt'> = {
    name,
    ingredients: transformedIngredients,
    imageUrl
  };

  return CustomeToastPromise(
    apiClient.post("/meals", mealData).then(res => res.data),
    {
      loadingMessage: "Logging meal...",
      successMessage: `${name} was successfully saved!`,
      errorMessage: "Failed to log meal, Please try Again",
    }
  );
};
