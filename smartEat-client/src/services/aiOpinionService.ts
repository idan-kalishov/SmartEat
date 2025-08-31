import { Meal } from "@/types/meals/meal";
import { Exercise } from "@/types/exercise";
import { UserProfile } from "@/types/userTypes";
import {
  DailyRecommendations,
  DailyExerciseGoal,
} from "./dailyRecommendationsService";
import { calculateTotalNutrition } from "@/utils/nutrientCalculations";
import api from "./api";

export interface AIOpinionRequest {
  userProfile: UserProfile;
  meals: Meal[];
  exercises: Exercise[];
  dailyRecommendations: DailyRecommendations;
  dailyExerciseGoal: DailyExerciseGoal;
  currentTime: string;
}

export interface AIOpinionResponse {
  opinion: string;
  recommendations: string[];
  positiveFeedback: string;
}

export async function getAIOpinion(
  request: AIOpinionRequest
): Promise<AIOpinionResponse> {
  // Calculate current day's nutrition intake
  const totalNutrition = request.meals.reduce(
    (acc, meal) => {
      const mealNutrition = calculateTotalNutrition(meal.ingredients);
      return {
        calories: acc.calories + (mealNutrition.calories || 0),
        protein: acc.protein + (mealNutrition.protein || 0),
        totalFat: acc.totalFat + (mealNutrition.totalFat || 0),
        totalCarbohydrates:
          acc.totalCarbohydrates + (mealNutrition.totalCarbohydrates || 0),
        fiber: acc.fiber + (mealNutrition.fiber || 0),
      };
    },
    {
      calories: 0,
      protein: 0,
      totalFat: 0,
      totalCarbohydrates: 0,
      fiber: 0,
    }
  );

  // Calculate current day's exercise
  const totalExercise = request.exercises.reduce((acc, exercise) => {
    return acc + (exercise.minutes || 0);
  }, 0);

  // Calculate remaining needs
  const remainingCalories = Math.max(
    0,
    request.dailyRecommendations.calories - totalNutrition.calories
  );
  const remainingProtein = Math.max(
    0,
    request.dailyRecommendations.protein - totalNutrition.protein
  );
  const remainingFat = Math.max(
    0,
    request.dailyRecommendations.fats - totalNutrition.totalFat
  );
  const remainingCarbs = Math.max(
    0,
    request.dailyRecommendations.carbs - totalNutrition.totalCarbohydrates
  );
  const remainingExercise = Math.max(
    0,
    request.dailyExerciseGoal.exerciseGoal - totalExercise
  );

  // Prepare the API request payload
  const payload = {
    user: request.userProfile,
    current_progress: {
      nutrition: {
        calories: totalNutrition.calories,
        protein: totalNutrition.protein,
        fats: totalNutrition.totalFat,
        carbs: totalNutrition.totalCarbohydrates,
        fiber: totalNutrition.fiber,
      },
      exercise: totalExercise,
    },
    remaining_needs: {
      nutrition: {
        calories: remainingCalories,
        protein: remainingProtein,
        fats: remainingFat,
        carbs: remainingCarbs,
      },
      exercise: remainingExercise,
    },
    daily_goals: {
      nutrition: request.dailyRecommendations,
      exercise: request.dailyExerciseGoal.exerciseGoal,
    },
    current_time: request.currentTime,
  };

  console.log("Sending AI opinion request:", payload);

  const response = await api.post("/nutrition/daily-opinion", payload);
  return response.data;
}
