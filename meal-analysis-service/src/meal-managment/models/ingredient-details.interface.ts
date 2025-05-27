import { NutritionInfo } from '../../generated/food-recognition';

export interface IngredientDetails {
    name: string;
    weight?: number;
    nutrition?: NutritionInfo;
    per100gNutrition?: any;
}