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
      return await this.client.analyzeMeal(image.buffer);
    } catch (error) {
      console.error('Analysis error:', error);
      throw new BadRequestException('Failed to analyze meal');
    }
  }

  @Post('ingredient-details')
  async getIngredientDetails(
    @Body() body: { names: string[] },
  ): Promise<IngredientDetailsResponseDto> {
    try {
      return await this.client.fetchIngredientDetails(body.names);
    } catch (error) {
      console.error('Ingredient details error:', error);
      throw new BadRequestException('Failed to fetch ingredient details');
    }
  }
}
