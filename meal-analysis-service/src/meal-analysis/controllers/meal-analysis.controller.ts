// src/food-recognition/food-recognition.controller.ts
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AnalyzeMealResponse,
  IngredientDetailsResponse,
} from 'src/generated/food-recognition';
import { MealAnalysisService } from '../services/meal-analysis.service';

@Controller()
export class MealAnalysisController {
  constructor(
    private readonly mealAnalysisService: MealAnalysisService,
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
      items: await this.mealAnalysisService.analyzeMeal(file),
    };
  }

  @GrpcMethod('FoodRecognitionService', 'FetchIngredientDetails')
  async fetchIngredientDetails(data: {
    names: string[];
  }): Promise<IngredientDetailsResponse> {
    return {
      items: await this.mealAnalysisService.fetchNutritionDataForIngredients(
        data.names,
      ),
    };
  }
}
