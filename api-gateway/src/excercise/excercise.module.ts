import { Module } from '@nestjs/common';
import { RecommendationsClient } from 'src/grpc/clients/recommendations.client';
import { ExcerciseController } from './controller/excercise.controller';

@Module({
  providers: [RecommendationsClient],
  controllers: [ExcerciseController],
})
export class RecommendationsModule {}
