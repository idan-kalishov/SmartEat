// src/utils/ingredientUtils.ts

import { Ingredient } from "../types/common";

/**
 * Merges fetched nutritional data with existing ingredients.
 * Safely handles missing nutrition data.
 * @param ingredients - The current ingredients array.
 * @param fetchedNutritionData - The nutritional data fetched from the API.
 * @returns - Updated ingredients array with merged nutritional data.
 */
export const mergeNutritionData = (
  ingredients: { name: string; weight: number; nutrition?: any }[],
  fetchedNutritionData: any[]
): Ingredient[] => {
  return ingredients.map((ingredient) => {
    // Skip if already has nutrition
    if (ingredient.nutrition) {
      return ingredient as Ingredient;
    }

    // Find matching nutrition data
    const matchedItem = fetchedNutritionData.find(
      (data: any) => typeof data === "object" && data.name === ingredient.name
    );

    // If found AND has valid nutrition.per100g, merge it
    if (matchedItem && matchedItem.nutrition?.per100g) {
      return {
        ...ingredient,
        nutrition: {
          per100g: matchedItem.nutrition.per100g,
        },
      };
    }

    // No valid data found → keep ingredient as-is (no nutrition)
    // This will be flagged later as "failed"
    console.warn(
      `No valid nutritional data found for ingredient: ${ingredient.name}`
    );
    return {
      ...ingredient,
      nutrition: undefined, // explicitly no nutrition
    };
  }) as Ingredient[];
};
