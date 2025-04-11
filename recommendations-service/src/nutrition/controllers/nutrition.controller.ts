// src/nutrition/recommendations/recommendations.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserProfileDto } from '../dto/user-profile.dto';
import { NutrientRecommendationDto } from '../dto/nutrient-recommendation.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from '../services/nutrition.service';

@ApiTags('Nutrition')
@Controller('nutrition/recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Get daily nutrient recommendations' })
  @ApiBody({ type: UserProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Returns calculated nutrient recommendations',
    type: NutrientRecommendationDto,
  })
  getRecommendations(
    @Body() userProfile: UserProfileDto,
  ): NutrientRecommendationDto {
    return this.recommendationsService.calculateDailyRecommendations(
      userProfile,
    );
  }

  @Post('meal-analysis')
  @ApiOperation({ summary: 'Analyze meal against recommendations' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userProfile: { $ref: '#/components/schemas/UserProfileDto' },
        mealNutrition: { type: 'object' },
      },
    },
  })
  analyzeMeal(@Body() { userProfile, mealNutrition }) {
    const recommendations =
      this.recommendationsService.calculateDailyRecommendations(userProfile);
    return this.calculateMealImpact(recommendations, mealNutrition);
  }

  private calculateMealImpact(
    recommendations: NutrientRecommendationDto,
    mealNutrition: any,
  ) {
    return {
      macronutrients: this.calculateMacroImpact(recommendations, mealNutrition),
      micronutrients: this.calculateMicroImpact(
        recommendations.micronutrients,
        mealNutrition,
      ),
    };
  }

  private calculateMacroImpact(
    recommendations: NutrientRecommendationDto,
    meal: any,
  ) {
    const macros = ['protein', 'fats', 'carbs', 'fiber'] as const;
    return macros.reduce(
      (acc, macro) => ({
        ...acc,
        [macro]: {
          consumed: meal[macro] || 0,
          recommended: recommendations[macro],
          percentage: Math.round(
            ((meal[macro] || 0) / recommendations[macro]) * 100,
          ),
          remaining: recommendations[macro] - (meal[macro] || 0),
        },
      }),
      {},
    );
  }

  private calculateMicroImpact(recommendations: any, meal: any) {
    const micronutrients = ['vitaminA', 'vitaminC', 'calcium', 'iron'];
    return micronutrients.reduce(
      (acc, nutrient) => ({
        ...acc,
        [nutrient]: {
          consumed: meal[nutrient] || 0,
          recommended: recommendations[nutrient],
          percentage: Math.round(
            ((meal[nutrient] || 0) / recommendations[nutrient]) * 100,
          ),
          remaining: recommendations[nutrient] - (meal[nutrient] || 0),
        },
      }),
      {},
    );
  }
}
