import { UserProfile } from "@/types/userTypes";
import api from "./api";

export interface DailyRecommendations {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  fiber: number;
  micronutrients?: {
    vitaminA: number;
    vitaminC: number;
    vitaminD: number;
    vitaminB12: number;
    calcium: number;
    iron: number;
    magnesium: number;
  };
}

export interface DailyExerciseGoal {
  calories: number; // Calories to burn from exercise per day
}

export async function getDailyRecommendations(
  userProfile: UserProfile
): Promise<DailyRecommendations> {
  const response = await api.post(
    "/nutrition/daily-recommendations",
    userProfile
  );
  return response.data;
}

export async function getDailyExerciseGoal(
  userProfile: UserProfile
): Promise<DailyExerciseGoal> {
  const response = await api.post("/nutrition/daily-exercise", userProfile);
  return response.data;
}
