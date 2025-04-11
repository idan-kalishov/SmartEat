// src/nutrition/recommendations/recommendations.service.ts
import { Injectable } from '@nestjs/common';
import { ActivityLevel, Gender, UserProfileDto } from '../dto/user-profile.dto';
import { NutrientRecommendationDto } from '../dto/nutrient-recommendation.dto';

@Injectable()
export class RecommendationsService {
  private readonly ACTIVITY_FACTORS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  private readonly GOAL_ADJUSTMENTS = {
    lose: { mild: -250, moderate: -500, aggressive: -1000 },
    maintain: { mild: 0, moderate: 0, aggressive: 0 },
    gain: { mild: 200, moderate: 400, aggressive: 800 },
  };

  calculateDailyRecommendations(
    user: UserProfileDto,
  ): NutrientRecommendationDto {
    const bmr = this.calculateBMR(user); // basal metabolic rate
    const tdee = this.calculateTDEE(bmr, user.activityLevel); //Total daily energy
    const calories = this.adjustForGoal(tdee, user);

    return {
      calories,
      protein: this.calculateProtein(user),
      fats: this.calculateFats(calories),
      carbs: this.calculateCarbs(calories, user),
      fiber: user.gender === Gender.MALE ? 38 : 25,
      micronutrients: this.calculateMicronutrients(user),
    };
  }

  private calculateBMR(user: UserProfileDto): number {
    return (
      10 * user.weight +
      6.25 * user.height -
      5 * user.age +
      (user.gender === Gender.MALE ? 5 : -161)
    );
  }

  private calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    return bmr * this.ACTIVITY_FACTORS[activityLevel];
  }

  private adjustForGoal(tdee: number, user: UserProfileDto): number {
    const adjustment =
      this.GOAL_ADJUSTMENTS[user.weightGoal][user.goalIntensity || 'moderate'];
    return Math.round(tdee + adjustment);
  }

  private calculateProtein(user: UserProfileDto): number {
    const proteinFactors = {
      lose: 2.2,
      maintain: 1.8,
      gain: 1.6,
    };
    return Math.round(user.weight * proteinFactors[user.weightGoal]);
  }

  private calculateFats(calories: number): number {
    // 25% of calories from fats 9 calories per 1 gram of fat
    return Math.round((0.25 * calories) / 9);
  }

  private calculateCarbs(calories: number, user: UserProfileDto): number {
    const proteinGrams = this.calculateProtein(user);
    const fatGrams = this.calculateFats(calories);
    return Math.round((calories - proteinGrams * 4 - fatGrams * 9) / 4);
  }

  // src/nutrition/recommendations/recommendations.service.ts
  private calculateMicronutrients(user: UserProfileDto) {
    return {
      vitaminA: user.gender === Gender.MALE ? 900 : 700,
      vitaminC: user.gender === Gender.MALE ? 90 : 75,
      vitaminD: 20,
      vitaminB12: 2.4,
      calcium: user.age > 50 ? 1200 : 1000,
      iron: user.gender === Gender.FEMALE && user.age < 50 ? 18 : 8,
      magnesium: user.gender === Gender.MALE ? 420 : 320,
    };
  }
}
