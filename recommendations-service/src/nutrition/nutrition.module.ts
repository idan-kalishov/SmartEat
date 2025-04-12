import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { NutritionService } from './services/nutrition.service';
import { GeminiRecommendService } from './services/gemini-recommend.service';
import { NutritionController } from './controllers/nutrition.controller';
import { grpcClientOptions } from 'src/grpc.config';

@Module({
  imports: [
    ConfigModule.forRoot(), // For environment variables
    ClientsModule.register([grpcClientOptions]), // Your existing gRPC config
  ],
  controllers: [NutritionController],
  providers: [NutritionService, GeminiRecommendService],
})
export class NutritionModule {}
