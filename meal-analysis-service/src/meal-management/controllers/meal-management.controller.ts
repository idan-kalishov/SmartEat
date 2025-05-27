import { Controller } from '@nestjs/common';
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
  Ingredient as GrpcIngredient,
} from '../../generated/meal-management';
import { Meal as MongoMeal, Ingredient as MongoIngredient } from '../schemas/meal.schema';

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
      ingredients: mongoMeal.ingredients.map(ing => ({
        name: ing.name,
        weight: ing.weight,
        usdaFoodLabel: ing.usdaFoodLabel,
        nutrition: ing.nutrition,
      })),
    };
  }

  private transformToMongoMeal(grpcMeal: GrpcMeal): {
    ingredients: Array<{
      name: string;
      weight: number;
      usdaFoodLabel?: string;
      nutrition?: {
        per100g: {
          [key: string]: {
            value?: number;
            unit: string;
          };
        };
      };
    }>;
    createdAt: Date;
  } {
    return {
      ingredients: grpcMeal.ingredients.map(ing => ({
        name: ing.name,
        weight: ing.weight,
        usdaFoodLabel: ing.usdaFoodLabel,
        nutrition: ing.nutrition,
      })),
      createdAt: new Date(grpcMeal.createdAt),
    };
  }

  @GrpcMethod('MealManagementService', 'SaveMeal')
  async saveMeal(data: SaveMealRequest): Promise<SaveMealResponse> {
    const mealData = this.transformToMongoMeal(data.meal);
    const mealId = await this.mealManagementService.saveMeal(
      data.userId,
      mealData as any, // Type assertion needed due to Mongoose Document type complexity
    );
    return {
      mealId,
      success: true,
    };
  }

  @GrpcMethod('MealManagementService', 'DeleteMeal')
  async deleteMeal(data: DeleteMealRequest): Promise<DeleteMealResponse> {
    const success = await this.mealManagementService.deleteMeal(
      data.userId,
      data.mealId,
    );
    return { success };
  }

  @GrpcMethod('MealManagementService', 'GetMealsByDate')
  async getMealsByDate(
    data: GetMealsByDateRequest,
  ): Promise<GetMealsByDateResponse> {
    const mongoMeals = await this.mealManagementService.getMealsByDate(
      data.userId,
      data.date,
    );
    const meals = mongoMeals.map(meal => this.transformToGrpcMeal(meal));
    return { meals };
  }
} 