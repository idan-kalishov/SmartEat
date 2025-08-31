import {
  MealAnalysisRequest,
  NutritionData,
  UserProfile
} from '@generated/nutrition';
import { BadRequestException, Body, Controller, Post, Request } from '@nestjs/common';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';
import { RecommendationsClient } from 'src/grpc/clients/recommendations.client';

interface MealRatingBody {
  ingredients: string[];
  nutrition: NutritionData;
}

@Controller('nutrition')
export class NutritionController {
  constructor(
    private readonly recommendationsClient: RecommendationsClient,
    private readonly authService: AuthGatewayService,
  ) { }



  @Post('meal-rating')
  async getMealRating(@Request() req, @Body() body: MealRatingBody) {
    const profile = await this.authService.getUserProfile(req);
    
    // Create the full request for the gRPC service
    const mealAnalysisRequest: MealAnalysisRequest = {
      user: profile,
      ingredients: body.ingredients,
      nutrition: body.nutrition,
    };
        
    return await this.recommendationsClient.analyzeMeal(mealAnalysisRequest);
  }

  @Post('daily-recommendations')
  async getDailyRecommendations(@Request() req) {
    const profile = await this.authService.getUserProfile(req);
    return this.recommendationsClient.getDailyRecommendations(profile);
  }

  @Post('daily-exercise')
  async getDailyExerciseGoal(@Request() req) {
    const profile = await this.authService.getUserProfile(req);
    return this.recommendationsClient.getDailyExerciseGoal(profile);
  }
}
