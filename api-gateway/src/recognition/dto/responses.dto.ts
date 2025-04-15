// src/food-recognition/dto/responses.dto.ts
export class MealRecognitionResultDto {
  foodName: string;
  weight: number;
  usdaFoodLabel?: string;
  nutrition?: {
    per100g: Record<string, NutrientDto>;
  };
}

export class NutrientDto {
  value?: number | null;
  unit: string;
}

export class AnalyzeMealResponseDto {
  items: MealRecognitionResultDto[];
}

export class IngredientDetailsResponseDto {
  items: MealRecognitionResultDto[];
}
