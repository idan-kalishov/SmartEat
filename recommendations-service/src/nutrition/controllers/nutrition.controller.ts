import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  MealAnalysisRequest,
  MealRating,
  AIRecommendRequest,
  AIRecommendResponse,
  NutrientRecommendation,
  UserProfile,
} from '@generated/nutrition_pb';
import { NutritionService } from '../services/nutrition.service';
import { GeminiRecommendService } from '../services/gemini-recommend.service';

@Controller()
export class NutritionController {
  constructor(
    private readonly nutritionService: NutritionService,
    private readonly geminiRecommendService: GeminiRecommendService,
  ) {}

  @GrpcMethod('NutritionService', 'GetDailyRecommendations')
  getDailyRecommendations(userProfile: UserProfile): NutrientRecommendation {
    return this.nutritionService.calculateDailyRecommendations(userProfile);
  }

  @GrpcMethod('NutritionService', 'GetMealRating')
  getMealRating(request: MealAnalysisRequest): MealRating {
    // Access user and nutrition directly as properties
    const user = request.user;
    const nutrition = request.nutrition;

    if (!user || !nutrition) {
      throw new Error('Invalid request: User or Nutrition data is missing');
    }

    const recommendations =
      this.nutritionService.calculateDailyRecommendations(user);
    return this.nutritionService.analyzeMealNutrition(
      recommendations,
      nutrition,
      user,
    );
  }

  @GrpcMethod('NutritionService', 'GetAIRecommendations')
  async getAIRecommendations(
    request: AIRecommendRequest,
  ): Promise<AIRecommendResponse> {
    return this.geminiRecommendService.getRecommendations(request);
  }
}
