import {
  DeleteMealRequest,
  DeleteMealResponse,
  GetMealsByDateRequest,
  GetMealsByDateResponse,
  Meal,
  MealManagementServiceClient,
  SaveMealRequest,
  SaveMealResponse,
  ImageData,
} from '@generated/meal-management';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { mealManagementGrpcOptions } from '../meal-management.config';

@Injectable()
export class MealManagementClient implements OnModuleInit {
  @Client(mealManagementGrpcOptions)
  private readonly client: ClientGrpc;

  private mealService: MealManagementServiceClient;

  onModuleInit() {
    this.mealService = this.client.getService<MealManagementServiceClient>(
      'MealManagementService',
    );
  }

  private validateMeal(meal: Meal): void {
    if (!meal.ingredients || !Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
      throw new BadRequestException('Meal must have at least one ingredient');
    }

    meal.ingredients.forEach(ingredient => {
      if (!ingredient.name) {
        throw new BadRequestException('Each ingredient must have a name');
      }
      if (typeof ingredient.weight !== 'number' || ingredient.weight <= 0) {
        throw new BadRequestException(`Invalid weight for ingredient ${ingredient.name}`);
      }
    });
  }

  async saveMeal(userId: string, meal: Meal, image?: Express.Multer.File): Promise<SaveMealResponse> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      this.validateMeal(meal);

      if (userId !== meal.userId) {
        throw new BadRequestException('User ID mismatch');
      }

      // Create a meal with image data if provided
      const mealWithImageData: Meal = { ...meal };
      
      if (image) {
        const imageData: ImageData = {
          data: image.buffer.toString('base64'),
          mimeType: image.mimetype,
          name: image.originalname,
        };
        mealWithImageData.imageData = imageData;
      }

      const request: SaveMealRequest = {
        userId,
        meal: mealWithImageData,
      };

      return await firstValueFrom(this.mealService.saveMeal(request));
    } catch (error) {
      console.error('Error in client saveMeal:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to save meal: ' + error.message);
    }
  }

  async deleteMeal(userId: string, mealId: string): Promise<DeleteMealResponse> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!mealId) {
        throw new BadRequestException('Meal ID is required');
      }

      const request: DeleteMealRequest = { 
        userId,
        mealId 
      };
      return await firstValueFrom(this.mealService.deleteMeal(request));
    } catch (error) {
      console.error('Error deleting meal:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete meal: ' + error.message);
    }
  }

  async getMealsByDate(userId: string, date: string): Promise<GetMealsByDateResponse> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!date) {
        throw new BadRequestException('Date is required');
      }

      const request: GetMealsByDateRequest = { 
        userId,
        date 
      };
      return await firstValueFrom(this.mealService.getMealsByDate(request));
    } catch (error) {
      console.error('Error getting meals by date:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to get meals by date: ' + error.message);
    }
  }
}