import { Ingredient, NutritionData } from './common';

// Interface for the transformed ingredient (includes scaled nutrition)
export interface TransformedIngredient extends Omit<Ingredient, "nutrition"> {
    nutrition: {
        per100g: NutritionData;
        scaled: NutritionData;
    };
} 