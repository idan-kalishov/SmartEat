import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meal } from '../schemas/meal.schema';
import { Meal as GrpcMeal } from '../../generated/meal-management';

@Injectable()
export class MealManagementService {
  constructor(
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,
  ) {}

  async saveMeal(mealData: GrpcMeal): Promise<string> {
    const meal = new this.mealModel({
      userId: mealData.userId,
      ingredients: mealData.ingredients,
      createdAt: new Date(mealData.createdAt),
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