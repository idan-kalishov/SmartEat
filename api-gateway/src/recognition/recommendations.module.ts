// src/recognition/recognition.module.ts
import { Module } from '@nestjs/common';
import { FoodRecognitionController } from './controller/food-recognition.controller';
import { FoodRecognitionClient } from 'src/grpc/clients/food-recognition.client';

@Module({
  providers: [FoodRecognitionClient],
  controllers: [FoodRecognitionController],
  exports: [FoodRecognitionClient], // Important for DI
})
export class RecognitionModule {}
