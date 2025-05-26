import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  SaveMealRequest,
  UserIdRequest,
  MealIdRequest,
  MealsByDateRequest,
  Meal as GrpcMeal,
  UserMealHistoryResponse,
} from 'src/generated/food-recognition';
import { MealService } from '../services/meal.service';
import { Meal } from '../schemas/meal.schema';

@Controller()
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @GrpcMethod('MealService', 'SaveMeal')
  async saveMeal(data: SaveMealRequest): Promise<GrpcMeal> {
    const imageBuffer = data.imageBase64
      ? Buffer.from(data.imageBase64, 'base64')
      : undefined;

    return this.mealService.saveMeal({
      userId: data.userId,
      ingredients: data.ingredients,
      imageData: imageBuffer,
    });
  }

  @GrpcMethod('MealService', 'GetUserMealHistory')
  async getUserMealHistory(data: UserIdRequest): Promise<UserMealHistoryResponse> {
    const meals = await this.mealService.getUserMealHistory(data.userId);
    return {
      meals: meals.map((meal) => ({
        id: meal._id.toString(),
        userId: meal.userId,
        ingredients: meal.ingredients,
        imageBase64: meal.imageData?.toString('base64') ?? '',
        createdAt: meal.createdAt.toISOString(),
      })),
    };
  }

  @GrpcMethod('MealService', 'GetMealById')
  async getMealById(data: MealIdRequest): Promise<GrpcMeal | null> {
    const meal = await this.mealService.getMealById(data.mealId);
    if (!meal) return null;

    return {
      id: meal._id.toString(),
      userId: meal.userId,
      ingredients: meal.ingredients,
      imageBase64: meal.imageData?.toString('base64') ?? '',
      createdAt: meal.createdAt.toISOString(),
    };
  }

  @GrpcMethod('MealService', 'DeleteMeal')
  async deleteMeal(data: MealIdRequest): Promise<GrpcMeal | null> {
    const meal = await this.mealService.deleteMeal(data.mealId);
    if (!meal) return null;

    return {
      id: meal._id.toString(),
      userId: meal.userId,
      ingredients: meal.ingredients,
      imageBase64: meal.imageData?.toString('base64') ?? '',
      createdAt: meal.createdAt.toISOString(),
    };
  }

  @GrpcMethod('MealService', 'GetMealsByDate')
  async getMealsByDate(data: MealsByDateRequest): Promise<UserMealHistoryResponse> {
    const date = new Date(data.date);
    const meals = await this.mealService.getMealsByDate(data.userId, date);
    return {
      meals: meals.map((meal) => ({
        id: meal._id.toString(),
        userId: meal.userId,
        ingredients: meal.ingredients,
        imageBase64: meal.imageData?.toString('base64') ?? '',
        createdAt: meal.createdAt.toISOString(),
      })),
    };
  }
}
