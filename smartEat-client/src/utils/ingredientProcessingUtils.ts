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

  const ingredientsWithoutNutrition = ingredients
    .filter((ing) => ing.name && ing.name.trim() !== "")
    .filter((ingredient) => !ingredient.nutrition);

  if (ingredientsWithoutNutrition.length > 0) {
    const ingredientNames = ingredientsWithoutNutrition.map((ing) =>
      ing.name.trim()
    );

    setLoadingMessage(
      `Fetching nutrition for ${ingredientNames.length} ingredient(s)...`
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
    const cleanIngredients = ingredients.map(({ isNew, ...rest }) => rest);
    const transformedIngredients =
      transformIngredientsForResults(cleanIngredients);
    return {
      transformedIngredients,
      failedIngredients: [],
    };
  }
};
