import { dailyNutritionService } from "@/services/dailyNutritionService";
import { useCallback, useEffect, useState } from "react";

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

export function useDailyNutrition(selectedDate: string) {
  const [currentNutrition, setCurrentNutrition] = useState<DailyNutrition | null>(null);
  const [recommendations, setRecommendations] = useState<DailyRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNutritionData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentNutrition(null);
    setRecommendations(null);

    try {
      // Fetch both current nutrition and recommendations in parallel
      const [currentNutritionData, recommendationsData] = await Promise.all([
        dailyNutritionService.getDailyNutrition(selectedDate),
        dailyNutritionService.getDailyRecommendations(),
      ]);

      setCurrentNutrition(currentNutritionData);
      setRecommendations(recommendationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data');
      setCurrentNutrition(null);
      setRecommendations(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchNutritionData();
  }, [fetchNutritionData]);

  return { 
    currentNutrition, 
    recommendations, 
    isLoading, 
    error, 
    fetchNutritionData 
  };
}
