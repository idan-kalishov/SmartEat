import { Controller, Post, Body } from '@nestjs/common';
import {
  MealAnalysisRequest,
  AIRecommendRequest,
  UserProfile,
  DailyOpinionRequest,
  DailyOpinionResponse,
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

  @Post('daily-exercise')
  async getDailyExerciseGoal(@Body() request: UserProfile) {
    return this.recommendationsClient.getDailyExerciseGoal(request);
  }

  @Post('daily-opinion')
  async getDailyOpinion(
    @Body() request: DailyOpinionRequest,
  ): Promise<DailyOpinionResponse> {
    return await this.recommendationsClient.getDailyOpinion(request);
  }
}
