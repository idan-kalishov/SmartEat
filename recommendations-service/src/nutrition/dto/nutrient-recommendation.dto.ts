// src/nutrition/dto/nutrient-recommendation.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class MicronutrientsDto {
  @ApiProperty({ example: 900 })
  vitaminA: number; // mcg RAE

  @ApiProperty({ example: 90 })
  vitaminC: number; // mg

  @ApiProperty({ example: 20 })
  vitaminD: number; // mcg (800 IU)

  @ApiProperty({ example: 2.4 })
  vitaminB12: number; // mcg

  @ApiProperty({ example: 1000 })
  calcium: number; // mg

  @ApiProperty({ example: 8 })
  iron: number; // mg

  @ApiProperty({ example: 420 })
  magnesium: number; // mg
}

export class NutrientRecommendationDto {
  @ApiProperty({ example: 2000 })
  calories: number;

  @ApiProperty({ example: 150 })
  protein: number; // g

  @ApiProperty({ example: 65 })
  fats: number; // g

  @ApiProperty({ example: 200 })
  carbs: number; // g

  @ApiProperty({ example: 25 })
  fiber: number; // g

  @ApiProperty()
  micronutrients: MicronutrientsDto;
}
