import { Per100gNutrition } from "../types/nutrition.types";

export interface IngredientDetails {
    name: string;
    weight: number;
    per100gNutrition?: Per100gNutrition;
}