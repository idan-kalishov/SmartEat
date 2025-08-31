import { CompleteMealAnalysisResponse } from '@generated/nutrition';
import {
  MealAnalysisRequest,
  NutrientRecommendation,
  UserProfile
} from '@generated/nutrition_pb';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GeminiRecommendService } from '../services/gemini-recommend.service';
import { NutritionsRatingService } from '../services/nutritionsRating.service';

@Controller()
export class RecommendationsController {
  constructor(
    private readonly nutritionsRatingService: NutritionsRatingService,
    private readonly geminiRecommendService: GeminiRecommendService,
  ) { }

  @GrpcMethod('NutritionsRatingService', 'GetDailyRecommendations')
  getDailyRecommendations(userProfile: UserProfile): NutrientRecommendation {
    return this.nutritionsRatingService.calculateDailyRecommendations(
      userProfile,
    );
  }

  @GrpcMethod('NutritionsRatingService', 'GetDailyExerciseGoal')
  getDailyExerciseGoal(userProfile: UserProfile): Number {
    return this.nutritionsRatingService.calculateTDEE(userProfile);
  }

  @GrpcMethod('NutritionsRatingService', 'AnalyzeMeal')
  async analyzeMeal(
    request: MealAnalysisRequest,
  ): Promise<CompleteMealAnalysisResponse> {
    // Validate input
    if (!request.user || !request.nutrition) {
      throw new Error('Invalid request: User or Nutrition data is missing');
    }

    // Calculate rating
    const recommendations =
      this.nutritionsRatingService.calculateDailyRecommendations(request.user);
    const rating = this.nutritionsRatingService.analyzeMealNutrition(
      recommendations,
      request.nutrition,
      request.user,
    );

    // Get AI recommendations
    const aiResponse = await this.geminiRecommendService.getRecommendations({
      user: request.user,
      ingredients: request.ingredients,
      nutrition: request.nutrition,
    });

    // Combine responses
    return {
      rating,
      recommendations: aiResponse.recommendations,
      positiveFeedback: aiResponse.positiveFeedback,
      dailyRecommendations: recommendations, // Optional: include daily needs
    };
  }
}
