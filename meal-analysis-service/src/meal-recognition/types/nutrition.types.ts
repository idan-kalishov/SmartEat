import { NutritionDetails } from "../models/nutrition-details.interface";

export type Per100gNutrition = Record<Nutrient | string, NutritionDetails>;

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