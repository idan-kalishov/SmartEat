import {
  Gender,
  GoalIntensity,
  MealRating,
  NutrientRecommendation,
  NutritionData,
  UserProfile,
  WeightGoal,
  ActivityLevel,
} from '@generated/nutrition_pb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NutritionsRatingService {
  private calculateBMR(user: UserProfile): number {
    // Using Mifflin-St Jeor Equation
    if (user.gender === Gender.GENDER_MALE) {
      return 10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age + 5;
    } else {
      return 10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age - 161;
    }
  }

  calculateTDEE(user: UserProfile): number {
    const bmr = this.calculateBMR(user);

    const activityFactors = [1.2, 1.375, 1.55, 1.725, 1.9];
    let tdee = bmr * activityFactors[user.activityLevel];

    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE) {
      if (user.goalIntensity === GoalIntensity.GOAL_INTENSITY_MODERATE) {
        tdee -= 300;
      }
    } else if (user.weightGoal === WeightGoal.WEIGHT_GOAL_GAIN) {
      if (user.goalIntensity === GoalIntensity.GOAL_INTENSITY_MODERATE) {
        tdee += 300;
      }
    }

    return tdee;
  }

  calculateDailyExerciseGoal(user: UserProfile): number {
    // Base exercise recommendations based on activity level
    let baseExerciseMinutes = 0;

    switch (user.activityLevel) {
      case ActivityLevel.ACTIVITY_LEVEL_SEDENTARY:
        baseExerciseMinutes = 45; // 45 minutes for sedentary people
        break;
      case ActivityLevel.ACTIVITY_LEVEL_LIGHT:
        baseExerciseMinutes = 30; // 30 minutes for light activity
        break;
      case ActivityLevel.ACTIVITY_LEVEL_MODERATE:
        baseExerciseMinutes = 20; // 20 minutes for moderate activity
        break;
      case ActivityLevel.ACTIVITY_LEVEL_ACTIVE:
        baseExerciseMinutes = 15; // 15 minutes for active people
        break;
      case ActivityLevel.ACTIVITY_LEVEL_VERY_ACTIVE:
        baseExerciseMinutes = 10; // 10 minutes for very active people
        break;
      default:
        baseExerciseMinutes = 30;
    }

    // Adjust based on weight goals
    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE) {
      if (user.goalIntensity === GoalIntensity.GOAL_INTENSITY_MILD) {
        baseExerciseMinutes += 15;
      } else if (user.goalIntensity === GoalIntensity.GOAL_INTENSITY_MODERATE) {
        baseExerciseMinutes += 30;
      } else if (
        user.goalIntensity === GoalIntensity.GOAL_INTENSITY_AGGRESSIVE
      ) {
        baseExerciseMinutes += 45;
      }
    } else if (user.weightGoal === WeightGoal.WEIGHT_GOAL_MAINTAIN) {
      // Keep base exercise for maintenance
    } else if (user.weightGoal === WeightGoal.WEIGHT_GOAL_GAIN) {
      // Reduce exercise for weight gain, but maintain some for health
      baseExerciseMinutes = Math.max(15, baseExerciseMinutes - 10);
    }

    // Convert minutes to calories burned
    // Average person burns about 5-8 calories per minute during moderate exercise
    // We'll use 6 calories per minute as a reasonable average
    const caloriesPerMinute = 6;
    const dailyExerciseCalories = baseExerciseMinutes * caloriesPerMinute;

    return Math.round(dailyExerciseCalories);
  }

  calculateDailyRecommendations(user: UserProfile): NutrientRecommendation {
    const tdee = this.calculateTDEE(user);

    let proteinPerKg = 1.6;
    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE) proteinPerKg = 2.2;
    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_GAIN) proteinPerKg = 1.8;
    const protein = Math.round(user.weightKg * proteinPerKg);

    let fatRatio = 0.25;
    let carbRatio = 0.55;

    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE) {
      fatRatio = 0.3;
      carbRatio = 0.4;
    }

    const fats = Math.round((tdee * fatRatio) / 9);
    const carbs = Math.round((tdee * carbRatio) / 4);
    const calories = Math.round(tdee);
    const fiber = user.gender === Gender.GENDER_MALE ? 38 : 25;

    const micronutrients = {
      vitaminA: user.gender === Gender.GENDER_MALE ? 900 : 700,
      vitaminC: user.gender === Gender.GENDER_MALE ? 90 : 75,
      vitaminD: 15,
      vitaminB12: 2.4,
      calcium: 1000,
      iron: user.gender === Gender.GENDER_MALE ? 8 : 18,
      magnesium: user.gender === Gender.GENDER_MALE ? 420 : 320,
    };

    return {
      calories,
      protein,
      fats,
      carbs,
      fiber,
      micronutrients,
    };
  }

  analyzeMealNutrition(
    recommendations: NutrientRecommendation,
    meal: NutritionData,
    user: UserProfile,
  ): MealRating {
    let score = 60;
    const mealCalories = meal.calories?.value || 0;
    const mealProtein = meal.protein?.value || 0;
    const mealCarbs = meal.carbs?.value || 0;
    const mealFats = meal.fats?.value || 0;

    // Macronutrient Balance (50 points) - NOW CALORIE-BASED
    const proteinCalories = mealProtein * 4;
    const carbCalories = mealCarbs * 4;
    const fatCalories = mealFats * 9;
    const totalCaloriesFromMacros =
      proteinCalories + carbCalories + fatCalories;

    if (totalCaloriesFromMacros > 0) {
      const proteinRatio = proteinCalories / totalCaloriesFromMacros;
      const carbRatio = carbCalories / totalCaloriesFromMacros;
      const fatRatio = fatCalories / totalCaloriesFromMacros;
      const caloriePercentage = mealCalories / recommendations.calories;

      if (caloriePercentage >= 0.2 && caloriePercentage <= 0.3) {
        score += 20;
      } else if (caloriePercentage > 0.3 && caloriePercentage <= 0.4) {
        score += 10;
      } else if (caloriePercentage > 0.4 && caloriePercentage <= 0.5) {
        score -= 10;
      } else if (caloriePercentage > 0.5) {
        score -= 20;
      } else if (caloriePercentage < 0.1) {
        score -= 5;
      }

      // Protein scoring
      if (proteinRatio >= 0.25) score += 20;
      else if (proteinRatio >= 0.15) score += 10;

      // Fat scoring
      if (fatRatio >= 0.2 && fatRatio <= 0.35) score += 15;
      else if (fatRatio > 0.35 && fatRatio <= 0.4) score += 5;
      else if (fatRatio > 0.4) score -= 10;

      // Carb scoring
      if (carbRatio >= 0.4 && carbRatio <= 0.6) score += 15;
      else if (carbRatio > 0.6 && carbRatio <= 0.7) score += 5;
      else if (carbRatio > 0.7) score -= 10;
      else if (carbRatio < 0.3) score -= 5;

      // Penalize low fiber (optional)
      if (meal.fiber?.value && mealCarbs > 0) {
        const fiberRatio = meal.fiber.value / mealCarbs;
        if (fiberRatio < 0.1) score -= 5;
      }
    }

    // Meal Size (20 points)
    const caloriePercentage = mealCalories / recommendations.calories;
    if (caloriePercentage >= 0.2 && caloriePercentage <= 0.3) score += 20;
    else if (caloriePercentage > 0.35) score -= 10;
    else if (caloriePercentage < 0.1) score -= 5;

    // Micronutrients (30 points)
    const micronutrientScore = this.calculateRobustMicronutrientScore(
      meal,
      user,
    );
    score += micronutrientScore;

    score = Math.max(0, Math.min(100, score));

    return {
      score: Math.round(score),
      letterGrade: this.getLetterGrade(score),
    };
  }

  private calculateRobustMicronutrientScore(
    meal: NutritionData,
    user: UserProfile,
  ): number {
    let score = 0;
    const presentMicronutrients: any = [];

    if (meal.iron?.value)
      presentMicronutrients.push({
        value: meal.iron.value,
        dailyNeed:
          user.gender === Gender.GENDER_MALE ? 8 : user.age < 50 ? 18 : 8,
        weight: 3,
      });

    if (meal.magnesium?.value)
      presentMicronutrients.push({
        value: meal.magnesium.value,
        dailyNeed: user.gender === Gender.GENDER_MALE ? 420 : 320,
        weight: 2,
      });

    if (meal.calcium?.value)
      presentMicronutrients.push({
        value: meal.calcium.value,
        dailyNeed: user.age > 50 ? 1200 : 1000,
        weight: 2,
      });

    if (meal.vitaminA?.value)
      presentMicronutrients.push({
        value: meal.vitaminA.value,
        dailyNeed: user.gender === Gender.GENDER_MALE ? 900 : 700,
        weight: 1,
      });

    if (meal.vitaminC?.value)
      presentMicronutrients.push({
        value: meal.vitaminC.value,
        dailyNeed: user.gender === Gender.GENDER_MALE ? 90 : 75,
        weight: 1,
      });

    if (meal.vitaminD?.value)
      presentMicronutrients.push({
        value: meal.vitaminD.value,
        dailyNeed: 15,
        weight: 2,
      });

    if (meal.vitaminB12?.value)
      presentMicronutrients.push({
        value: meal.vitaminB12.value,
        dailyNeed: 2.4,
        weight: 1,
      });

    if (presentMicronutrients.length > 0) {
      let totalScore = 0;
      let maxPossible = 0;

      for (const nutrient of presentMicronutrients) {
        const mealPercentage = nutrient.value / (nutrient.dailyNeed / 3);
        totalScore += Math.min(1, mealPercentage) * nutrient.weight;
        maxPossible += nutrient.weight;
      }

      score = (totalScore / maxPossible) * 30;
    } else {
      score = 15;
    }

    return Math.round(score);
  }

  private getLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}
