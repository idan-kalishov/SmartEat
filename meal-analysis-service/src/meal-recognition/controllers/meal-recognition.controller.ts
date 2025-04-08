// src/food-recognition/food-recognition.controller.ts
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FoodRecognitionService } from '../services/food-recognition.service';
import { IngredientDetailsDto } from '../dto/ingredient-details.dto';

@Controller('food-recognition')
export class FoodRecognitionController {
  constructor(
    private readonly foodRecognitionService: FoodRecognitionService,
  ) {}

  @Post('analyze')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeMeal(@UploadedFile() file: Express.Multer.File) {
    return this.foodRecognitionService.analyzeMeal(file);
  }

  /**
   * Fetch nutritional data for multiple ingredients.
   * @param body Request body containing an array of ingredient names.
   * @returns Array of objects with ingredient names and their nutritional data.
   */
  @Post('ingredient-details')
  @UsePipes(new ValidationPipe())
  async fetchIngredientDetails(@Body() body: IngredientDetailsDto) {
    return this.foodRecognitionService.fetchNutritionDataForIngredients(
      body.names,
    );
  }
}
