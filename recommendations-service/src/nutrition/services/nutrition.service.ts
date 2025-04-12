import { Injectable } from '@nestjs/common';
import {
  UserProfile,
  NutrientRecommendation,
  NutritionData,
  MealRating,
  Gender,
  ActivityLevel,
  WeightGoal,
  GoalIntensity,
  DietaryRestrictions,
  Micronutrients,
} from '@generated/nutrition_pb';

@Injectable()
export class NutritionService {
  // Activity factors mapping
  private readonly ACTIVITY_FACTORS: { [key: number]: number } = {
    [ActivityLevel.ACTIVITY_LEVEL_SEDENTARY]: 1.2,
    [ActivityLevel.ACTIVITY_LEVEL_LIGHT]: 1.375,
    [ActivityLevel.ACTIVITY_LEVEL_MODERATE]: 1.55,
    [ActivityLevel.ACTIVITY_LEVEL_ACTIVE]: 1.725,
    [ActivityLevel.ACTIVITY_LEVEL_VERY_ACTIVE]: 1.9,
  };

  private readonly GOAL_ADJUSTMENTS = {
    [WeightGoal.WEIGHT_GOAL_LOSE]: {
      mild: -250,
      moderate: -500,
      aggressive: -1000,
    },
    [WeightGoal.WEIGHT_GOAL_MAINTAIN]: { mild: 0, moderate: 0, aggressive: 0 },
    [WeightGoal.WEIGHT_GOAL_GAIN]: {
      mild: 200,
      moderate: 400,
      aggressive: 800,
    },
  };

  calculateDailyRecommendations(user: UserProfile): NutrientRecommendation {
    // Create a plain object conforming to the NutrientRecommendation interface
    const response: NutrientRecommendation = {
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0,
      fiber: user.gender === Gender.GENDER_MALE ? 38 : 25,
      micronutrients: {
        vitaminA: user.gender === Gender.GENDER_MALE ? 900 : 700,
        vitaminC: user.gender === Gender.GENDER_MALE ? 90 : 75,
        vitaminD: 20,
        vitaminB12: 2.4,
        calcium: user.age > 50 ? 1200 : 1000,
        iron: user.gender === Gender.GENDER_FEMALE && user.age < 50 ? 18 : 8,
        magnesium: user.gender === Gender.GENDER_MALE ? 420 : 320,
      },
    };

    const bmr = this.calculateBMR(user);
    const tdee = this.calculateTDEE(bmr, user.activityLevel);
    const calories = this.adjustForGoal(tdee, user);

    response.calories = calories;
    response.protein = this.calculateProtein(user);
    response.fats = this.calculateFats(calories);
    response.carbs = this.calculateCarbs(calories, user);

    return response;
  }

  analyzeMealNutrition(
    recommendations: NutrientRecommendation,
    meal: NutritionData,
    user: UserProfile,
  ): MealRating {
    // Create a plain object conforming to the MealRating interface
    const rating: MealRating = {
      score: 0,
      letterGrade: 'F',
    };

    // Calculate component scores
    const proteinScore = this.scoreProtein(
      meal.protein?.value || 0,
      recommendations.protein,
      meal.protein?.unit || 'g',
    );

    const fatsScore = this.scoreFats(
      meal.fats?.value || 0,
      recommendations.fats,
      meal.fats?.unit || 'g',
    );

    const carbsScore = this.scoreCarbs(
      meal.carbs?.value || 0,
      recommendations.carbs,
      meal.carbs?.unit || 'g',
    );

    const microScore = this.scoreMicronutrients(
      meal,
      recommendations.micronutrients ?? {
        vitaminA: 0,
        vitaminC: 0,
        vitaminD: 0,
        vitaminB12: 0,
        calcium: 0,
        iron: 0,
        magnesium: 0,
      },
    );

    const goalScore = this.scoreGoalAlignment(recommendations, meal, user);

    // Weighted total score
    const totalScore = Math.round(
      proteinScore * 0.25 +
        fatsScore * 0.2 +
        carbsScore * 0.2 +
        microScore * 0.2 +
        goalScore * 0.15,
    );

    rating.score = totalScore;
    rating.letterGrade = this.getLetterGrade(totalScore);

    return rating;
  }

  private calculateBMR(user: UserProfile): number {
    return (
      10 * user.weightKg +
      6.25 * user.heightCm -
      5 * user.age +
      (user.gender === Gender.GENDER_MALE ? 5 : -161)
    );
  }

  private calculateTDEE(bmr: number, activityLevel: number): number {
    return bmr * this.ACTIVITY_FACTORS[activityLevel];
  }

  private adjustForGoal(tdee: number, user: UserProfile): number {
    const intensity = user.goalIntensity;
    const intensityKey =
      intensity === GoalIntensity.GOAL_INTENSITY_MILD
        ? 'mild'
        : intensity === GoalIntensity.GOAL_INTENSITY_AGGRESSIVE
          ? 'aggressive'
          : 'moderate';
    const adjustment = this.GOAL_ADJUSTMENTS[user.weightGoal][intensityKey];
    return Math.round(tdee + adjustment);
  }

  private calculateProtein(user: UserProfile): number {
    const proteinFactors = {
      [WeightGoal.WEIGHT_GOAL_LOSE]: 2.2,
      [WeightGoal.WEIGHT_GOAL_MAINTAIN]: 1.8,
      [WeightGoal.WEIGHT_GOAL_GAIN]: 1.6,
    };
    return Math.round(user.weightKg * proteinFactors[user.weightGoal]);
  }

  private calculateFats(calories: number): number {
    return Math.round((0.25 * calories) / 9);
  }

  private calculateCarbs(calories: number, user: UserProfile): number {
    const proteinCal = this.calculateProtein(user) * 4;
    const fatCal = this.calculateFats(calories) * 9;
    return Math.round((calories - proteinCal - fatCal) / 4);
  }

  private scoreProtein(
    consumed: number,
    recommended: number,
    unit: string,
  ): number {
    const convertedValue = unit === 'mg' ? consumed / 1000 : consumed;
    const percentage = (convertedValue / recommended) * 100;
    return Math.min(Math.round(percentage * 1.1), 120);
  }

  private scoreFats(
    consumed: number,
    recommended: number,
    unit: string,
  ): number {
    const convertedValue = unit === 'mg' ? consumed / 1000 : consumed;
    const percentage = (convertedValue / recommended) * 100;
    return Math.min(Math.round(percentage), 100);
  }

  private scoreCarbs(
    consumed: number,
    recommended: number,
    unit: string,
  ): number {
    const convertedValue = unit === 'mg' ? consumed / 1000 : consumed;
    const percentage = (convertedValue / recommended) * 100;
    return Math.min(Math.round(percentage), 100);
  }

  private scoreMicronutrients(
    meal: NutritionData,
    recommendations: Micronutrients,
  ): number {
    const micros = [
      { key: 'vitaminA', consumed: meal.vitaminA?.value || 0 },
      { key: 'vitaminC', consumed: meal.vitaminC?.value || 0 },
      { key: 'calcium', consumed: meal.calcium?.value || 0 },
      { key: 'iron', consumed: meal.iron?.value || 0 },
      { key: 'magnesium', consumed: meal.magnesium?.value || 0 },
      { key: 'vitaminD', consumed: meal.vitaminD?.value || 0 },
      { key: 'vitaminB12', consumed: meal.vitaminB12?.value || 0 },
    ];

    const validMicros = micros.filter(
      (m) => m.consumed !== null && m.consumed !== undefined,
    );

    if (validMicros.length === 0) return 75;

    const total = validMicros.reduce((sum, m) => {
      const recommended =
        recommendations[m.key as keyof typeof recommendations];
      const percentage = (m.consumed / recommended) * 100;
      return sum + Math.min(percentage, 150);
    }, 0);

    return Math.round(total / validMicros.length);
  }

  private scoreGoalAlignment(
    recommendations: NutrientRecommendation,
    meal: NutritionData,
    user: UserProfile,
  ): number {
    let score = 80;

    const proteinPercentage =
      ((meal.protein?.value || 0) / recommendations.protein) * 100;
    if (proteinPercentage < 20) score -= 15;
    else if (proteinPercentage > 40) score += 10;

    const caloriePercentage =
      ((meal.calories?.value || 0) / recommendations.calories) * 100;
    if (caloriePercentage > 40) score -= 20;

    // Check dietary restrictions
    if (
      user.dietaryRestrictions &&
      this.mealViolatesRestrictions(meal, user.dietaryRestrictions)
    ) {
      score -= 30;
    }

    return Math.max(0, Math.min(100, score));
  }

  private mealViolatesRestrictions(
    meal: NutritionData,
    restrictions: DietaryRestrictions,
  ): boolean {
    // Implement actual logic to check meal against restrictions
    return false;
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
}
