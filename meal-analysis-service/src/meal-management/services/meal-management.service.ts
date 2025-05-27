import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meal } from '../schemas/meal.schema';

@Injectable()
export class MealManagementService {
  constructor(
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,
  ) {}

  async saveMeal(userId: string, mealData: Omit<Meal, 'userId' | 'id'>): Promise<string> {
    const meal = new this.mealModel({
      ...mealData,
      userId,
    });
    const savedMeal = await meal.save();
    return savedMeal.id;
  }

  async deleteMeal(userId: string, mealId: string): Promise<boolean> {
    const result = await this.mealModel.deleteOne({
      _id: mealId,
      userId,
    });
    return result.deletedCount > 0;
  }

  async getMealsByDate(userId: string, date: string): Promise<Meal[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.mealModel.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
  }
} 