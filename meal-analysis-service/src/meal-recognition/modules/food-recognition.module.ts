import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FoodRecognitionController } from '../controllers/meal-recognition.controller';
import { FoodRecognitionService } from '../services/food-recognition.service';

@Module({
  imports: [HttpModule],
  controllers: [FoodRecognitionController],
  providers: [FoodRecognitionService],
})
export class FoodRecognitionModule {}
