// src/food-recognition/food-recognition.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FoodRecognitionService } from '../services/food-recognition.service';

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
}
