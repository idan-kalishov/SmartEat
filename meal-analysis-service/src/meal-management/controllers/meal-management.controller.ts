import { Controller, BadRequestException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MealManagementService } from '../services/meal-management.service';
import {
  SaveMealRequest,
  SaveMealResponse,
  DeleteMealRequest,
  DeleteMealResponse,
  GetMealsByDateRequest,
  GetMealsByDateResponse,
  Meal as GrpcMeal,
} from '../../generated/meal-management';
import { Meal as MongoMeal } from '../schemas/meal.schema';
import { Metadata } from '@grpc/grpc-js';

@Controller()
export class MealManagementController {
  constructor(
    private readonly mealManagementService: MealManagementService,
  ) {}

  private transformToGrpcMeal(mongoMeal: MongoMeal): GrpcMeal {
    return {
      id: mongoMeal._id.toString(),
      userId: mongoMeal.userId,
      createdAt: mongoMeal.createdAt.toISOString(),
      ingredients: mongoMeal.ingredients,
      name: mongoMeal.name,
      imageUrl: mongoMeal.imageUrl,
    };
  }

  private validateMeal(meal: GrpcMeal): void {
    if (!meal.ingredients || !Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
      throw new BadRequestException('Meal must have at least one ingredient');
    }

    for (const ing of meal.ingredients) {
      if (!ing.name) {
        throw new BadRequestException('Each ingredient must have a name');
      }
      if (typeof ing.weight !== 'number' || ing.weight <= 0) {
        throw new BadRequestException(`Invalid weight for ingredient ${ing.name}`);
      }
    }
  }

  @GrpcMethod('MealManagementService', 'SaveMeal')
  async saveMeal(data: SaveMealRequest, metadata: Metadata): Promise<SaveMealResponse> {
    try {
      if (!data.meal) {
        throw new BadRequestException('Meal data is required');
      }

      if (!data.userId) {
        throw new BadRequestException('User ID is required');
      }

      // Validate meal data
      this.validateMeal(data.meal);

      // Verify userId matches
      if (data.userId !== data.meal.userId) {
        throw new BadRequestException('User ID mismatch');
      }

      // Check if image data is provided in metadata
      let imageFile: Express.Multer.File | undefined;
      const imageData = metadata.get('image-data');
      const imageMimeType = metadata.get('image-mime-type');
      const imageName = metadata.get('image-name');

      if (imageData && imageMimeType && imageName) {
        const buffer = Buffer.from(imageData[0] as string, 'base64');
        imageFile = {
          buffer,
          mimetype: imageMimeType[0] as string,
          originalname: imageName[0] as string,
          size: buffer.length,
        } as Express.Multer.File;
      }

      const mealId = await this.mealManagementService.saveMeal(data.meal, imageFile);

      return {
        mealId,
        success: true,
      };
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    }
  }

  @GrpcMethod('MealManagementService', 'DeleteMeal')
  async deleteMeal(data: DeleteMealRequest): Promise<DeleteMealResponse> {
    try {
      const success = await this.mealManagementService.deleteMeal(
        data.userId,
        data.mealId,
      );
      return { success };
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  }

  @GrpcMethod('MealManagementService', 'GetMealsByDate')
  async getMealsByDate(data: GetMealsByDateRequest): Promise<GetMealsByDateResponse> {
    try {
      const meals = await this.mealManagementService.getMealsByDate(
        data.userId,
        data.date,
      );
      return {
        meals: meals.map(meal => this.transformToGrpcMeal(meal)),
      };
    } catch (error) {
      console.error('Error getting meals by date:', error);
      throw error;
    }
  }
} 