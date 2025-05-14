import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MealService } from '../services/meal.service';
import { Meal } from '../schemas/meal.schema';
import { IngredientDetails } from '../models/ingredient-details.interface';

@Controller()
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @GrpcMethod('MealService', 'SaveMeal')
  async saveMeal(data: {
    userId: string;
    ingredients: IngredientDetails[];
    imageUrl?: string;
  }): Promise<Meal> {
    return this.mealService.saveMeal({
      userId: data.userId,
      ingredients: data.ingredients,
      imageUrl: data.imageUrl,
    });
  }

  @GrpcMethod('MealService', 'GetUserMealHistory')
  async getUserMealHistory(data: { userId: string }): Promise<{ meals: Meal[] }> {
    const meals = await this.mealService.getUserMealHistory(data.userId);
    return { meals };
  }

  @GrpcMethod('MealService', 'GetMealById')
  async getMealById(data: { mealId: string }): Promise<Meal | null> {
    return this.mealService.getMealById(data.mealId);
  }

  @GrpcMethod('MealService', 'DeleteMeal')
  async deleteMeal(data: { mealId: string }): Promise<Meal | null> {
    return this.mealService.deleteMeal(data.mealId);
  }

  @GrpcMethod('MealService', 'GetMealsByDate')
  async getMealsByDate(data: { userId: string; date: string }): Promise<{ meals: Meal[] }> {
    const date = new Date(data.date);
    const meals = await this.mealService.getMealsByDate(data.userId, date);
    return { meals };
  }
}
