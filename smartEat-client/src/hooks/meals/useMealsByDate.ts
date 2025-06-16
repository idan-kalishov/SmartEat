import { getMealsByDate } from "@/services/mealService";
import { Meal } from "@/types/meals/meal";
import { useCallback, useEffect, useState } from "react";

export function useMealsByDate(date: Date) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMeals([]); // Reset meals immediately when date changes

    try {
      const fetchedMeals = await getMealsByDate(date);
      setMeals(fetchedMeals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [date]); // Add date as dependency since we use it in the function

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return { meals, isLoading, error, fetchMeals };
} 