import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGatewayModule } from './authGateway/auth.gateway.module';
import { FoodRecognitionModule } from './recognition/food-recognition.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { MealManagementModule } from './meal-management/meal-management.module';

@Module({
  imports: [RecommendationsModule, AuthGatewayModule, FoodRecognitionModule, MealManagementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
