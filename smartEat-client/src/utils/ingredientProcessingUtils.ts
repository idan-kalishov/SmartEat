import {fetchNutritionalDataForIngredients, transformIngredientsForResults,} from "../utils/mealAnalysisApi";
import {mergeNutritionData} from "../utils/ingredientUtils";
import {Ingredient} from "../types/imageAnalyizeTypes";

interface ProcessResult {
    transformedIngredients: any[];
}

export const processAndSaveIngredients = async (
    ingredients: any[],
    setLoadingMessage: (message: string) => void
): Promise<ProcessResult> => {
    setLoadingMessage("Processing ingredients...");

    // Separate ingredients that need nutritional data
    const ingredientsWithoutNutrition = ingredients.filter(
        (ingredient) => !ingredient.nutrition
    );

    // Check if there are any ingredients without nutritional data
    if (ingredientsWithoutNutrition.length > 0) {
        // Validate that all ingredients have names
        const hasInvalidIngredients = ingredientsWithoutNutrition.some(
            (ingredient) => !ingredient.name.trim()
        );
        if (hasInvalidIngredients) {
            throw new Error("Please provide valid names for all ingredients.");
        }

        // Fetch nutritional data for ingredients without it
        const ingredientNames = ingredientsWithoutNutrition.map(
            (ingredient) => ingredient.name
        );
        const fetchedNutritionData = await fetchNutritionalDataForIngredients(
            ingredientNames
        );

        // Merge fetched nutritional data with existing ingredients
        const updatedIngredients = mergeNutritionData(
            ingredients,
            fetchedNutritionData
        );

        // Transform ingredients data for the result page
        const transformedIngredients =
            transformIngredientsForResults(updatedIngredients);

        return {transformedIngredients};
    } else {
        // No missing nutritional data, so directly transform
        const transformedIngredients = transformIngredientsForResults(
            ingredients.map(({isNew, ...rest}) => rest as Ingredient)
        );

        return {transformedIngredients};
    }
};
