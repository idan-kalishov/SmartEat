export interface Meal {
  foodName: string;
  weight: number;
  usdaFoodLabel?: string;
  per100gNutrition?: Per100gNutrition;
}

export type Per100gNutrition = Record<Nutrient | string, NutritionDTO>;

export interface NutritionDTO {
  value: number;
  unit: string;
}

export type Nutrient =
  | 'calories'
  | 'protein'
  | 'carbohydrates'
  | 'fat'
  | 'iron'
  | 'fiber'
  | 'vitaminC'
  | 'vitaminA'
  | 'calcium'
  | 'magnesium';