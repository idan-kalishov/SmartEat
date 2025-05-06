import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { NutritionsRatingService } from './services/nutritionsRating.service';
import { GeminiRecommendService } from './services/gemini-recommend.service';
import { RecommendationsController } from './controllers/recommendations.controller';
import { grpcClientOptions } from 'src/grpc.config';
import { LlamaVerificationService } from './services/LlamaVerificationService.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot(), // For environment variables
    ClientsModule.register([grpcClientOptions]), // Your existing gRPC config
    HttpModule,
  ],
  controllers: [RecommendationsController],
  providers: [
    NutritionsRatingService,
    GeminiRecommendService,
    LlamaVerificationService,
  ],
})
export class NutritionModule {}
