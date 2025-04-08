import axios, { AxiosError } from "axios";
import {
  Ingredient,
  NutritionData,
  TransformedIngredient,
} from "../types/imageAnalyizeTypes";

// Base URL for the API
const BASE_URL = "https://192.168.1.145:3000";

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
 * @returns {Promise<FoodRecognitionResponse[]>} - The response data from the backend.
 */
export const analyzeFoodImage = async (
  imageFile: File
): Promise<FoodRecognitionResponse[]> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post<FoodRecognitionResponse[]>(
      `${BASE_URL}/food-recognition/analyze`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // Optional: Increase timeout if needed
      }
    );
    return response.data;
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
): Promise<any[]> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/food-recognition/ingredient-details`,
      {
        names: ingredientNames,
      }
    );
    console.log("result  " + JSON.stringify(response.data));
    return response.data;
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
    // Safeguard: Ensure nutrition.per100g exists
    if (!ingredient.nutrition?.per100g) {
      console.warn(
        `No nutritional data found for "${ingredient.name}". Skipping scaling.`
      );
      return {
        ...ingredient,
        nutrition: {
          per100g: null as unknown as NutritionData, // Explicitly cast to satisfy type
          scaled: null as unknown as NutritionData, // Explicitly cast to satisfy type
        },
      };
    }

    // Safeguard: Parse weight as a number (default to 100g if invalid)
    const weight = parseFloat(ingredient.weight) || 100;

    // Scale nutrient values based on the user-specified weight
    const scaledNutrition = Object.fromEntries(
      Object.entries(ingredient.nutrition.per100g).map(([key, nutrient]) => {
        // Safeguard: Handle missing or null nutrient values
        if (!nutrient || nutrient.value == null) {
          return [key, { value: null, unit: nutrient?.unit || "unknown" }];
        }

        // Calculate scaled value
        const scaledValue = +(nutrient.value * (weight / 100)).toFixed(2);

        return [key, { value: scaledValue, unit: nutrient.unit }];
      })
    ) as NutritionData; // Cast to ensure type safety

    return {
      ...ingredient,
      nutrition: {
        per100g: ingredient.nutrition.per100g,
        scaled: scaledNutrition,
      },
    };
  });
};
