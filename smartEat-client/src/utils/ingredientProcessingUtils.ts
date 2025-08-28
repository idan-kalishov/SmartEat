// src/utils/ingredientProcessingUtils.ts

import { Ingredient } from "../types/common";
import { mergeNutritionData } from "./ingredientUtils";
import {
  fetchNutritionalDataForIngredients,
  transformIngredientsForResults,
} from "./mealAnalysisApi";

export interface ProcessResult {
  transformedIngredients: any[];
  failedIngredients: string[];
}

export const processAndSaveIngredients = async (
  ingredients: any[],
  setLoadingMessage: (message: string) => void
): Promise<ProcessResult> => {
  setLoadingMessage("Processing ingredients...");

  const ingredientsWithoutNutrition = ingredients.filter(
    (ingredient) => !ingredient.nutrition
  );

  if (ingredientsWithoutNutrition.length > 0) {
    const invalidIngredients = ingredientsWithoutNutrition.filter(
      (ingredient) => !ingredient.name?.trim()
    );

    if (invalidIngredients.length > 0) {
      const invalidNames = invalidIngredients
        .map((i) => i.name || "(unnamed)")
        .join(", ");
      throw new Error(`Invalid ingredient names: ${invalidNames}`);
    }

    const ingredientNames = ingredientsWithoutNutrition.map(
      (ingredient) => ingredient.name
    );
    const fetchedNutritionData = await fetchNutritionalDataForIngredients(
      ingredientNames
    );

    const failedIngredients = fetchedNutritionData
      .filter((item: any) => !item.nutrition)
      .map((item: any) => item.name);

    const updatedIngredients = mergeNutritionData(
      ingredients,
      fetchedNutritionData
    );
    const transformedIngredients =
      transformIngredientsForResults(updatedIngredients);

    return {
      transformedIngredients,
      failedIngredients,
    };
  } else {
    const transformedIngredients = transformIngredientsForResults(
      ingredients.map(({ isNew, ...rest }) => rest as Ingredient)
    );
    return {
      transformedIngredients,
      failedIngredients: [],
    };
  }
};
