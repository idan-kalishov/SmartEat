// src/food-recognition/food-recognition.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FoodRecognitionService } from '../services/food-recognition.service';
import { AnalyzeMealResponse } from 'src/generated/food-recognition';

@Controller()
export class FoodRecognitionController {
  constructor(
    private readonly foodRecognitionService: FoodRecognitionService,
  ) {}

  @GrpcMethod('FoodRecognitionService', 'AnalyzeMeal')
  async analyzeMeal(data: { image: Buffer }): Promise<AnalyzeMealResponse> {
    // Convert Buffer to Multer.File-like object
    const file = {
      buffer: data.image,
      originalname: 'uploaded_image.jpg',
      mimetype: 'image/jpeg',
      size: data.image.length,
    } as Express.Multer.File;

    return {
      items: await this.foodRecognitionService.analyzeMeal(file),
    };
  }

  @GrpcMethod('FoodRecognitionService', 'FetchIngredientDetails')
  async fetchIngredientDetails(data: {
    names: string[];
  }): Promise<{ items: any[] }> {
    return {
      items: await this.foodRecognitionService.fetchNutritionDataForIngredients(
        data.names,
      ),
    };
  }
}
