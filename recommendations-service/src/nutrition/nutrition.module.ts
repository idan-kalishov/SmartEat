import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([grpcOptions])],
  controllers: [NutritionController],
  providers: [NutritionService, MealRatingService, GeminiRecommendService],
})
export class NutritionModule {}
