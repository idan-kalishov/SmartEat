import { Per100gNutrition } from "../types/nutrition.types";

export interface IngredientDetails {
    name: string;
    weight: number;
    usdaFoodLabel?: string;
    per100gNutrition?: Per100gNutrition;
}