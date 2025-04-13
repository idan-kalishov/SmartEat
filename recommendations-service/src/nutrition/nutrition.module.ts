import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { NutritionsRatingService } from './services/nutritionsRating.service';
import { GeminiRecommendService } from './services/gemini-recommend.service';
import { RecommendationsController } from './controllers/recommendations.controller';
import { grpcClientOptions } from 'src/grpc.config';

@Module({
  imports: [
    ConfigModule.forRoot(), // For environment variables
    ClientsModule.register([grpcClientOptions]), // Your existing gRPC config
  ],
  controllers: [RecommendationsController],
  providers: [NutritionsRatingService, GeminiRecommendService],
})
export class NutritionModule {}
