import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { grpcOptions } from '../grpc.config';
import {
  NutritionsRatingServiceClient,
  MealAnalysisRequest,
  CompleteMealAnalysisResponse,
  UserProfile,
  NutrientRecommendation,
  GetDailyExerciseGoalResponse,
} from '@generated/nutrition';

@Injectable()
export class RecommendationsClient implements OnModuleInit {
  @Client(grpcOptions)
  private client: ClientGrpc;

  private nutritionsRatingService: NutritionsRatingServiceClient;

  onModuleInit() {
    this.nutritionsRatingService =
      this.client.getService<NutritionsRatingServiceClient>(
        'NutritionsRatingService',
      );
  }

  // New unified method
  analyzeMeal(
    request: MealAnalysisRequest,
  ): Promise<CompleteMealAnalysisResponse> {
    return this.nutritionsRatingService.analyzeMeal(request).toPromise();
  }

  // Keep only if still needed (otherwise remove)
  getDailyRecommendations(
    request: UserProfile,
  ): Promise<NutrientRecommendation> {
    return this.nutritionsRatingService
      .getDailyRecommendations(request)
      .toPromise();
  }

  getDailyExerciseGoal(
    request: UserProfile,
  ): Promise<GetDailyExerciseGoalResponse> {
    return this.nutritionsRatingService
      .getDailyExerciseGoal(request)
      .toPromise();
  }
}
