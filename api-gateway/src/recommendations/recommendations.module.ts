import { Module } from '@nestjs/common';
import { RecommendationsClient } from 'src/grpc/clients/recommendationsv.client';
import { NutritionController } from './controller/recommendations.controller';

@Module({
  providers: [RecommendationsClient],
  controllers: [NutritionController],
})
export class RecommendationsModule {}
