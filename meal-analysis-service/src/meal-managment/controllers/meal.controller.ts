import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  Meal as GrpcMeal,
  MealIdRequest,
  MealsByDateRequest,
  SaveMealRequest,
  UserIdRequest,
  UserMealHistoryResponse
} from 'src/generated/food-recognition';
import { MealDocument } from '../schemas/meal.schema';
import { MealService } from '../services/meal.service';

@Controller()
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @GrpcMethod('MealService', 'SaveMeal')
  async saveMeal(data: SaveMealRequest): Promise<GrpcMeal> {
    const imageBuffer = data.imageBase64
      ? Buffer.from(data.imageBase64, 'base64')
      : undefined;

    const meal = await this.mealService.saveMeal({
      userId: data.userId,
      name: data.name,
      ingredients: data.ingredients.map(ing => ({
        name: ing.name,
        nutrition: ing.nutrition,
      })),
      imageData: imageBuffer,
    });

    return {
      id: meal._id.toString(),
      userId: meal.userId,
      name: meal.name,
      ingredients: meal.ingredients.map(ing => ({
        name: ing.name,
        nutrition: ing.nutrition,
      })),
      imageBase64: meal.imageData?.toString('base64') ?? '',
      createdAt: meal.createdAt.toISOString(),
    };
  }

  @GrpcMethod('MealService', 'GetUserMealHistory')
  async getUserMealHistory(data: UserIdRequest): Promise<UserMealHistoryResponse> {
    const meals = await this.mealService.getUserMealHistory(data.userId);
    return {
      meals: meals.map((meal: MealDocument) => ({
        id: meal._id.toString(),
        userId: meal.userId,
        name: meal.name,
        ingredients: meal.ingredients.map(ing => ({
          name: ing.name,
          nutrition: ing.nutrition,
        })),
        imageBase64: meal.imageData?.toString('base64') ?? '',
        createdAt: meal.createdAt.toISOString(),
      })),
    };
  }

  @GrpcMethod('MealService', 'GetMealById')
  async getMealById(data: MealIdRequest): Promise<GrpcMeal | null> {
    const meal: MealDocument = await this.mealService.getMealById(data.mealId);
    if (!meal) return null;

    return {
      id: meal._id.toString(),
      userId: meal.userId,
      name: meal.name,
      ingredients: meal.ingredients.map(ing => ({
        name: ing.name,
        nutrition: ing.nutrition,
      })),
      imageBase64: meal.imageData?.toString('base64') ?? '',
      createdAt: meal.createdAt.toISOString(),
    };
  }

  @GrpcMethod('MealService', 'DeleteMeal')
  async deleteMeal(data: MealIdRequest): Promise<GrpcMeal | null> {
    const meal: MealDocument = await this.mealService.deleteMeal(data.mealId);
    if (!meal) return null;

    return {
      id: meal._id.toString(),
      userId: meal.userId,
      name: meal.name,
      ingredients: meal.ingredients.map(ing => ({
        name: ing.name,
        nutrition: ing.nutrition,
      })),
      imageBase64: meal.imageData?.toString('base64') ?? '',
      createdAt: meal.createdAt.toISOString(),
    };
  }

  @GrpcMethod('MealService', 'GetMealsByDate')
  async getMealsByDate(data: MealsByDateRequest): Promise<UserMealHistoryResponse> {
    const date = new Date(data.date);
    const meals = await this.mealService.getMealsByDate(data.userId, date);
    return {
      meals: meals.map((meal: MealDocument) => ({
        id: meal._id.toString(),
        userId: meal.userId,
        name: meal.name,
        ingredients: meal.ingredients.map(ing => ({
          name: ing.name,
          nutrition: ing.nutrition,
        })),
        imageBase64: meal.imageData?.toString('base64') ?? '',
        createdAt: meal.createdAt.toISOString(),
      })),
    };
  }
}
