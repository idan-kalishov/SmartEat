import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { IngredientDetailsResponse } from '@generated/food-recognition';
import { FoodRecognitionClient } from 'src/grpc/clients/food-recognition.client';
import {
  AnalyzeMealResponseDto
} from '../dto/responses.dto';

@Controller('food-recognition')
export class FoodRecognitionController {
  constructor(private readonly client: FoodRecognitionClient) { }

  @Post('analyze-meal')
  @UseInterceptors(FileInterceptor('image'))
  async analyzeMeal(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<AnalyzeMealResponseDto> {
    if (!image) {
      throw new BadRequestException('No image provided');
    }

    try {
      const response = await this.client.analyzeMeal(image.buffer);
      return {
        items: response.items.map((item) => ({
          foodName: item.foodName, // Rename food_name to foodName
          weight: item.weight,
          nutrition: item.nutrition,
        })),
      };
    } catch (error) {
      console.error('Analysis error:', error);
      throw new BadRequestException('Failed to analyze meal');
    }
  }

  @Post('ingredient-details')
  async getIngredientDetails(
    @Body() body: { names: string[] },
  ): Promise<IngredientDetailsResponse> {
    try {
      const response = await this.client.fetchIngredientDetails(body.names);

      return {
        items: response.items.map((item) => ({
          name: item.name,
          nutrition: item.nutrition,
        })),
      };
    } catch (error) {
      console.error('Ingredient details error:', error);
      throw new BadRequestException('Failed to fetch ingredient details');
    }
  }
}
