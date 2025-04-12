import { Injectable } from '@nestjs/common';
import {
  MealAnalysisRequest,
  MealRating,
  NutritionData,
  UserProfile,
  WeightGoal,
  Gender,
} from '@generated/nutrition_pb';

@Injectable()
export class MealRatingService {
  calculateRating(request: MealAnalysisRequest): MealRating {
    // Create a plain object conforming to the MealRating interface
    const response: MealRating = {
      letterGrade: 'F',
      score: 0,
    };

    // Check if nutrition and user are present
    if (!request.nutrition || !request.user) {
      return response;
    }

    const nutrition = request.nutrition; // Direct property access
    const user = request.user; // Direct property access

    const proteinScore = this.scoreProtein(nutrition.protein?.value ?? 0, user);
    const fatsScore = this.scoreFats(nutrition.fats?.value ?? 0, user);
    const carbsScore = this.scoreCarbs(nutrition.carbs?.value ?? 0, user);
    const microScore = this.scoreMicronutrients(nutrition);
    const goalScore = this.scoreGoalAlignment(nutrition, user);

    const totalScore = Math.round(
      proteinScore * 0.25 +
        fatsScore * 0.2 +
        carbsScore * 0.2 +
        microScore * 0.2 +
        goalScore * 0.15,
    );

    response.score = totalScore;
    response.letterGrade = this.getLetterGrade(totalScore);

    return response;
  }

  private scoreProtein(proteinGrams: number, user: UserProfile): number {
    const proteinNeeds = this.calculateProteinNeeds(user);
    const percentage = (proteinGrams / proteinNeeds) * 100;
    let score = Math.min(percentage, 120);

    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE) {
      score *= 1.1;
    }

    return Math.round(score);
  }

  private scoreFats(fatsGrams: number, user: UserProfile): number {
    const fatsNeeds = this.calculateFatsNeeds(user);
    const percentage = (fatsGrams / fatsNeeds) * 100;
    return Math.min(Math.round(percentage), 100); // Max 100%
  }

  private scoreCarbs(carbsGrams: number, user: UserProfile): number {
    const carbsNeeds = this.calculateCarbsNeeds(user);
    const percentage = (carbsGrams / carbsNeeds) * 100;
    let score = Math.min(percentage, 100);

    // Adjust based on goals
    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE) {
      score *= 0.9; // Slightly penalize high carbs for weight loss
    } else if (user.weightGoal === WeightGoal.WEIGHT_GOAL_GAIN) {
      score *= 1.05; // Slightly reward carbs for weight gain
    }

    return Math.round(score);
  }

  private scoreMicronutrients(nutrition: NutritionData): number {
    const micros = [
      nutrition.vitaminA,
      nutrition.vitaminD,
      nutrition.vitaminB12,
      nutrition.fiber,
    ].filter((m) => m?.value !== undefined && m?.value !== null);

    if (micros.length === 0) return 75; // Neutral score if no data

    const total = micros.reduce((sum, m) => {
      const percentage = this.getMicroPercentage(m?.value!, m?.unit ?? 'g');
      return sum + Math.min(percentage, 150); // Cap at 150%
    }, 0);

    return Math.round(total / micros.length);
  }

  private getMicroPercentage(value: number, unit: string): number {
    const rdaValues = {
      vitaminA: 900, // mcg
      vitaminD: 20, // mcg
      vitaminB12: 2.4, // mcg
      fiber: 28, // g
    };

    // Convert units if needed (simplified)
    let convertedValue = value;
    if (unit === 'IU') {
      if (value === rdaValues.vitaminA) {
        convertedValue = value * 0.3; // Convert IU to mcg RAE
      } else if (value === rdaValues.vitaminD) {
        convertedValue = value * 0.025; // Convert IU to mcg
      }
    }

    return (convertedValue / rdaValues[unit]) * 100;
  }

  private scoreGoalAlignment(
    nutrition: NutritionData,
    user: UserProfile,
  ): number {
    let score = 80; // Base score

    // Protein check
    const proteinPercentage =
      ((nutrition.protein?.value ?? 0) / this.calculateProteinNeeds(user)) *
      100;
    if (proteinPercentage < 20) score -= 15;
    else if (proteinPercentage > 40) score += 10;

    // Calorie check
    const caloriePercentage =
      ((nutrition.calories?.value ?? 0) / this.calculateCalorieNeeds(user)) *
      100;
    if (
      user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE &&
      caloriePercentage > 40
    )
      score -= 20;
    if (
      user.weightGoal === WeightGoal.WEIGHT_GOAL_GAIN &&
      caloriePercentage < 30
    )
      score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  private getLetterGrade(score: number): string {
    const grades: Array<[number, string]> = [
      [97, 'A+'],
      [93, 'A'],
      [90, 'A-'],
      [87, 'B+'],
      [83, 'B'],
      [80, 'B-'],
      [77, 'C+'],
      [73, 'C'],
      [70, 'C-'],
      [67, 'D+'],
      [63, 'D'],
      [60, 'D-'],
      [0, 'F'],
    ];

    return grades.find(([threshold]) => score >= threshold)?.[1] || 'F';
  }

  // Helper calculation methods
  private calculateProteinNeeds(user: UserProfile): number {
    // g per kg of body weight
    const factor =
      user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE
        ? 2.2
        : user.weightGoal === WeightGoal.WEIGHT_GOAL_GAIN
          ? 1.8
          : 1.2;
    return Math.round(user.weightKg * factor);
  }

  private calculateFatsNeeds(user: UserProfile): number {
    // 25% of total calories
    const calories = this.calculateCalorieNeeds(user);
    return Math.round((0.25 * calories) / 9); // 9 cal/g
  }

  private calculateCarbsNeeds(user: UserProfile): number {
    // Remainder after protein and fats
    const calories = this.calculateCalorieNeeds(user);
    const proteinCal = this.calculateProteinNeeds(user) * 4;
    const fatCal = this.calculateFatsNeeds(user) * 9;
    return Math.round((calories - proteinCal - fatCal) / 4);
  }

  private calculateCalorieNeeds(user: UserProfile): number {
    // Mifflin-St Jeor equation
    const bmr = 10 * user.weightKg + 6.25 * user.heightCm - 5 * user.age;
    const adjustedBmr =
      user.gender === Gender.GENDER_MALE ? bmr + 5 : bmr - 161;

    const activityFactors = {
      ACTIVITY_LEVEL_SEDENTARY: 1.2,
      ACTIVITY_LEVEL_LIGHT: 1.375,
      ACTIVITY_LEVEL_MODERATE: 1.55,
      ACTIVITY_LEVEL_ACTIVE: 1.725,
      ACTIVITY_LEVEL_VERY_ACTIVE: 1.9,
    };

    let calories = adjustedBmr * activityFactors[user.activityLevel];

    // Adjust for goals
    if (user.weightGoal === WeightGoal.WEIGHT_GOAL_LOSE) {
      calories -= 300; // Moderate deficit
    } else if (user.weightGoal === WeightGoal.WEIGHT_GOAL_GAIN) {
      calories += 300; // Moderate surplus
    }

    return Math.round(calories);
  }
}
