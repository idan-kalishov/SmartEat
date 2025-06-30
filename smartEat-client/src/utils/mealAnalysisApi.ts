import api from "@/services/api";
import { IngredientsRecognitionResult, MealRecognitionResult, } from "@/types/protoServicesTypes";
import { AxiosError } from "axios";
import { Ingredient, Nutrient, NutritionData } from "../types/common";
import { TransformedIngredient } from "../types/scaled-ingredient";

// Define the shape of the food recognition response
export interface FoodRecognitionResponse {
    foodName: string;
    quantity: number;
    weight: number;
    nutrition: {
        per100g: {
            calories: number;
            totalFat: number;
            sugars: number;
            protein: number;
            iron: number;
        };
    };
}

/**
 * Sends an image to the backend for food recognition.
 * @param {File} imageFile - The image file to send.
 * @returns {Promise<MealRecognitionResult[]>} - The response data from the backend.
 */
export const analyzeFoodImage = async (
    imageFile: File
): Promise<MealRecognitionResult[]> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const response = await api.post(
            "/food-recognition/analyze-meal",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log(response);
        return response.data?.items;
    } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError;
        console.error(
            "Error analyzing image:",
            axiosError.response?.data || axiosError.message
        );
        throw new Error(
            `Failed to analyze the image. Please try again. ${JSON.stringify(
                axiosError
            )}`
        );
    }
};

/**
 * Fetches nutritional data for multiple ingredients from the backend.
 * @param {string[]} ingredientNames - Array of ingredient names.
 * @returns {Promise<any[]>} - Fetched nutritional data for the ingredients.
 */
export const fetchNutritionalDataForIngredients = async (
    ingredientNames: string[]
): Promise<IngredientsRecognitionResult[]> => {
    try {
        const response = await api.post("/food-recognition/ingredient-details", {
            names: ingredientNames,
        });
        console.log("result  " + JSON.stringify(response.data));
        return response.data?.items;
    } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError;
        console.error(
            "Error fetching nutritional data:",
            axiosError.response?.data || axiosError.message
        );
        throw new Error(
            `Failed to fetch nutritional data. ${JSON.stringify(axiosError)}`
        );
    }
};

/**
 * Transforms ingredients data for the result page.
 * Scales nutritional values based on the user-specified weight.
 * @param {Ingredient[]} ingredients - Ingredients with per100g nutritional data.
 * @returns {TransformedIngredient[]} - Transformed ingredients data with scaled values.
 */
export const transformIngredientsForResults = (
    ingredients: Ingredient[]
): TransformedIngredient[] => {
    return ingredients.map((ingredient) => {
        if (!ingredient.nutrition?.per100g) {
            console.warn(
                `No nutritional data found for "${ingredient.name}". Skipping scaling.`
            );
            return {
                ...ingredient,
                nutrition: {
                    per100g: null as unknown as NutritionData,
                    scaled: null as unknown as NutritionData,
                },
            };
        }

        const weight = ingredient.weight || 100;
        const per100g = ingredient.nutrition.per100g;

        const scale = (nutrient: Nutrient): Nutrient => {
            if (!nutrient || nutrient.value == null) {
                return { value: null, unit: nutrient?.unit || "unknown" };
            }
            return {
                value: +(nutrient.value * (weight / 100)).toFixed(2),
                unit: nutrient.unit,
            };
        };

        const scaled: NutritionData = {
            calories: scale(per100g.calories),
            totalFat: scale(per100g.totalFat),
            totalCarbohydrates: scale(per100g.totalCarbohydrates),
            sugars: scale(per100g.sugars),
            protein: scale(per100g.protein),
            iron: scale(per100g.iron),
            fiber: scale(per100g.fiber),
            vitaminA: scale(per100g.vitaminA),
            vitaminC: scale(per100g.vitaminC),
            vitaminD: scale(per100g.vitaminD),
            vitaminB12: scale(per100g.vitaminB12),
            calcium: scale(per100g.calcium),
            magnesium: scale(per100g.magnesium),
        };

        return {
            ...ingredient,
            nutrition: {
                per100g,
                scaled,
            },
        };
    });
};
