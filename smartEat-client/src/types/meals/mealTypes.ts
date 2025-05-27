export interface NutritionDetails { value: number; unit: string; }
export type Per100gNutrition = Record<string, NutritionDetails>;
export interface IngredientDetails { name: string; weight: number; usdaFoodLabel?: string; per100gNutrition?: Per100gNutrition; }
export interface Meal { _id: string; userId: string; ingredients: IngredientDetails[]; imageUrl?: string; createdAt: string; updatedAt: string; name: string; } 