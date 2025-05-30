import { Controller, Post, Body } from '@nestjs/common';
import {
  MealAnalysisRequest,
  AIRecommendRequest,
  UserProfile,
} from '@generated/nutrition';
import { RecommendationsClient } from 'src/grpc/clients/recommendations.client';

@Controller('nutrition')
export class NutritionController {
  constructor(private readonly recommendationsClient: RecommendationsClient) {}

  @Post('meal-rating')
  async getMealRating(@Body() request: MealAnalysisRequest) {
    return this.recommendationsClient.analyzeMeal(request);
  }

  @Post('daily-recommendations')
  async getDailyRecommendations(@Body() request: UserProfile) {
    return this.recommendationsClient.getDailyRecommendations(request);
  }
}
