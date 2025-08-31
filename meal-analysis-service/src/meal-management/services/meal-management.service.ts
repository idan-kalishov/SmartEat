import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meal as GrpcMeal, GetDailyNutritionResponse } from '../../generated/meal-management';
import { Meal } from '../schemas/meal.schema';
import { ImageUploadService } from './image-upload.service';

@Injectable()
export class MealManagementService {
  constructor(
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,
    private readonly imageUploadService: ImageUploadService,
  ) { }

  async saveMeal(mealData: GrpcMeal, imageFile?: Express.Multer.File): Promise<string> {
    let imageUrl: string | undefined;

    // Upload image if provided
    if (imageFile) {
      try {
        imageUrl = await this.imageUploadService.uploadImage(imageFile, mealData.userId);
      } catch (error) {
        console.error('Failed to upload image:', error);
        throw error;
      }
    }

    const meal = new this.mealModel({
      userId: mealData.userId,
      name: mealData.name,
      ingredients: mealData.ingredients,
      createdAt: new Date(mealData.createdAt),
      imageUrl: imageUrl,
    });

    const savedMeal = await meal.save();
    return savedMeal.id;
  }

  async deleteMeal(userId: string, mealId: string): Promise<boolean> {
    // Get the meal first to delete the image
    const meal = await this.mealModel.findOne({ _id: mealId, userId });
    if (!meal) {
      return false;
    }

    // Delete the image if it exists
    if (meal.imageUrl) {
      await this.imageUploadService.deleteImage(meal.imageUrl);
    }

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

  async getDailyNutrition(userId: string, date: string): Promise<GetDailyNutritionResponse> {
    const meals = await this.getMealsByDate(userId, date);
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFats = 0;
    let totalCarbs = 0;
    let totalFiber = 0;

    for (const meal of meals) {
      for (const ingredient of meal.ingredients) {
        if (ingredient.nutrition?.per100g) {
          const weightRatio = ingredient.weight / 100; // Convert to ratio for 100g
          
          // Sum up nutrition values for this ingredient
          const nutrition = ingredient.nutrition.per100g;
          
          // Debug: log the available nutrition fields
          console.log('Available nutrition fields:', Object.keys(nutrition));
          console.log('Nutrition data for ingredient:', ingredient.name, nutrition);
          
          totalCalories += (nutrition.calories?.value || 0) * weightRatio;
          totalProtein += (nutrition.protein?.value || 0) * weightRatio;
          totalFats += (nutrition.totalFat?.value || 0) * weightRatio;
          totalCarbs += (nutrition.totalCarbohydrates?.value || 0) * weightRatio;
          totalFiber += (nutrition.fiber?.value || 0) * weightRatio;
        }
      }
    }

    console.log('Final nutrition totals:', {
      calories: totalCalories,
      protein: totalProtein,
      fats: totalFats,
      carbs: totalCarbs,
      fiber: totalFiber
    });

    return {
      calories: Math.round(totalCalories * 100) / 100, // Round to 2 decimal places
      protein: Math.round(totalProtein * 100) / 100,
      fats: Math.round(totalFats * 100) / 100,
      carbs: Math.round(totalCarbs * 100) / 100,
      fiber: Math.round(totalFiber * 100) / 100,
    };
  }
} 