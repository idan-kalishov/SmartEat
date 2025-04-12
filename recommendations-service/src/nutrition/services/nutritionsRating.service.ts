import { Injectable } from '@nestjs/common';
import {
  UserProfile,
  NutrientRecommendation,
  NutritionData,
  MealRating,
  Gender,
  ActivityLevel,
  WeightGoal,
} from '@generated/nutrition_pb';

@Injectable()
export class NutritionsRatingService {
  // Basic calorie needs calculation
  private calculateBMR(user: UserProfile): number {
    return (
      10 * user.weightKg +
      6.25 * user.heightCm -
      5 * user.age +
      (user.gender === Gender.GENDER_MALE ? 5 : -161)
    );
  }

  // Simplified TDEE calculation
  private calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const factors = [1.2, 1.375, 1.55, 1.725, 1.9];
    return bmr * factors[activityLevel];
  }

  calculateDailyRecommendations(user: UserProfile): NutrientRecommendation {
    const bmr = this.calculateBMR(user);
    const tdee = this.calculateTDEE(bmr, user.activityLevel);

    // Simplified protein calculation (grams per kg)
    const protein = Math.round(user.weightKg * 1.6); // 1.6g/kg works for most goals

    return {
      calories: Math.round(tdee),
      protein: protein,
      fats: Math.round((tdee * 0.25) / 9), // 25% of calories from fat
      carbs: Math.round((tdee * 0.55) / 4), // Remainder from carbs
      fiber: user.gender === Gender.GENDER_MALE ? 38 : 25,
      micronutrients: {} as any, // Satisfy type requirement
    };
  }

  analyzeMealNutrition(
    recommendations: NutrientRecommendation,
    meal: NutritionData,
    user: UserProfile,
  ): MealRating {
    // Base score starts at 75 (C) - assumption that most meals are decent
    let score = 75;
    const mealCalories = meal.calories?.value || 0;
    const mealProtein = meal.protein?.value || 0;
    const mealCarbs = meal.carbs?.value || 0;
    const mealFats = meal.fats?.value || 0;

    // Adjust score based on protein content
    const proteinPercentage = mealProtein / recommendations.protein;
    if (proteinPercentage > 0.3)
      score += 15; // Good protein boost
    else if (proteinPercentage > 0.15) score += 5;

    // Check macronutrient balance
    const totalMacros = mealProtein + mealCarbs + mealFats;
    if (totalMacros > 0) {
      const proteinRatio = mealProtein / totalMacros;
      const carbRatio = mealCarbs / totalMacros;
      const fatRatio = mealFats / totalMacros;

      // Ideal ranges (adjust these as needed)
      if (proteinRatio >= 0.25 && proteinRatio <= 0.35) score += 10;
      if (fatRatio >= 0.2 && fatRatio <= 0.35) score += 5;
    }

    // Check if meal is appropriate size (10-35% of daily calories)
    const caloriePercentage = mealCalories / recommendations.calories;
    if (caloriePercentage > 0.35)
      score -= 15; // Too large
    else if (caloriePercentage < 0.1) score -= 5; // Too small

    // Ensure score stays within bounds
    score = Math.max(40, Math.min(100, score));

    return {
      score: Math.round(score),
      letterGrade: this.getLetterGrade(score),
    };
  }

  private getLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}
