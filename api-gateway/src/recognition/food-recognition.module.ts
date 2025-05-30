import { Module } from '@nestjs/common';
import { FoodRecognitionController } from './controller/food-recognition.controller';
import { FoodRecognitionClient } from 'src/grpc/clients/food-recognition.client';

@Module({
  providers: [FoodRecognitionClient],
  controllers: [FoodRecognitionController],
  exports: [FoodRecognitionClient],
})
export class FoodRecognitionModule { }
