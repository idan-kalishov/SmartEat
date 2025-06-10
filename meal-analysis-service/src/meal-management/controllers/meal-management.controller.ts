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
  ImageData,
} from '../../generated/meal-management';
import { Meal as MongoMeal } from '../schemas/meal.schema';

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
  async saveMeal(data: SaveMealRequest): Promise<SaveMealResponse> {
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

      // Extract image data from meal object if present
      let imageFile: Express.Multer.File | undefined;
      
      if (data.meal.imageData) {
        const { data: imageBase64, mimeType, name } = data.meal.imageData;
        const buffer = Buffer.from(imageBase64, 'base64');
        
        imageFile = {
          buffer,
          mimetype: mimeType,
          originalname: name,
          size: buffer.length,
        } as Express.Multer.File;

        // Remove imageData from meal object before saving
        delete data.meal.imageData;
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