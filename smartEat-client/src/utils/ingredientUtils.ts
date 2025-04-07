// ingredientUtils.ts

import { Ingredient } from "../types/imageAnalyizeTypes";

/**
 * Merges fetched nutritional data with existing ingredients.
 * @param ingredients - The current ingredients array.
 * @param fetchedNutritionData - The nutritional data fetched from the API.
 * @returns - Updated ingredients array with merged nutritional data.
 */
export const mergeFetchedNutritionData = (
  ingredients: any[],
  fetchedNutritionData: any[]
) => {
  return ingredients.map((ingredient) => {
    if (ingredient.isNew) {
      const matchedNutrition = fetchedNutritionData.find(
        (data: { name: string }) => data.name === ingredient.name
      );
      return {
        ...ingredient,
        nutrition: {
          per100g: matchedNutrition?.nutrition.per100g,
        },
        isNew: false, // Mark as no longer new
      };
    }
    return ingredient;
  });
};

/**
 * Merges fetched nutritional data with existing ingredients.
 * @param ingredients - The current ingredients array.
 * @param fetchedNutritionData - The nutritional data fetched from the API.
 * @returns - Updated ingredients array with merged nutritional data.
 */
export const mergeNutritionData = (
  ingredients: { name: string; weight: string; nutrition?: any }[],
  fetchedNutritionData: any[]
): Ingredient[] => {
  return ingredients.map((ingredient) => {
    if (!ingredient.nutrition) {
      const matchedNutrition = fetchedNutritionData.find(
        (data: { name: string }) => data.name === ingredient.name
      );
      console.log(`matched nutrition ${matchedNutrition}`);
      return {
        ...ingredient,
        nutrition: { per100g: matchedNutrition?.nutrition.per100g || null },
      };
    }
    return ingredient;
  }) as Ingredient[];
};
