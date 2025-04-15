// src/recognition/controller/food-recognition.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  AnalyzeMealResponseDto,
  IngredientDetailsResponseDto,
} from '../dto/responses.dto';
import { FoodRecognitionClient } from 'src/grpc/clients/food-recognition.client';
import { IngredientDetailsResponse } from '@generated/food-recognition';

@Controller('food-recognition')
export class FoodRecognitionController {
  constructor(private readonly client: FoodRecognitionClient) {}

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
          foodName: item['food_name'], // Rename food_name to foodName
          weight: item.weight,
          nutrition: item.nutrition
            ? {
                per100g: item.nutrition['per_100g'], // Rename per_100g to per100g
              }
            : undefined,
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
          nutrition: item.nutrition
            ? {
                per100g: item.nutrition['per_100g'],
              }
            : undefined,
        })),
      };
    } catch (error) {
      console.error('Ingredient details error:', error);
      throw new BadRequestException('Failed to fetch ingredient details');
    }
  }
}
