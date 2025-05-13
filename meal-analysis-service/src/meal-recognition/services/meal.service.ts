import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meal } from '../schemas/meal.schema';

@Injectable()
export class MealService {
  constructor(@InjectModel(Meal.name) private readonly mealModel: Model<Meal>) {}

  async saveMeal(data: Partial<Meal>) {
    const meal = new this.mealModel(data);
    return meal.save();
  }

  async getUserMealHistory(userId: string) {
    return this.mealModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async getMealById(mealId: string) {
    return this.mealModel.findById(mealId).exec();
  }

  async deleteMeal(mealId: string) {
    return this.mealModel.findByIdAndDelete(mealId).exec();
  }

  async getMealsByDate(userId: string, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return this.mealModel.find({
      userId,
      createdAt: { $gte: start, $lt: end }
    }).exec();
  }
}
