import api from "./api";

export interface DailyNutrition {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  fiber: number;
}

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

class DailyNutritionService {
  async getDailyNutrition(date: string): Promise<DailyNutrition> {
    try {
      const response = await api.get(`/meals/daily-nutrition/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily nutrition:', error);
      // Return zeros if there's an error or no data
      return {
        calories: 0,
        protein: 0,
        fats: 0,
        carbs: 0,
        fiber: 0,
      };
    }
  }

  async getDailyRecommendations(): Promise<DailyRecommendations> {
    try {
      const response = await api.post("/nutrition/daily-recommendations");
      return response.data;
    } catch (error) {
      console.error('Error fetching daily recommendations:', error);
      // Return default values if there's an error
      return {
        calories: 2000,
        protein: 50,
        fats: 65,
        carbs: 250,
        fiber: 25,
      };
    }
  }
}

export const dailyNutritionService = new DailyNutritionService();
