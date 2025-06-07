import { useEffect, useState, useCallback } from "react";
import { Meal } from "@/types/meals/mealTypes";
import { getMealsByDate } from "@/services/mealService";

export function useMealsByDate(date: Date) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async (targetDate: Date) => {
    setIsLoading(true);
    setError(null);
    setMeals([]); // Reset meals immediately when date changes
    
    try {
      const fetchedMeals = await getMealsByDate(targetDate);
      setMeals(fetchedMeals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch meals');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies since we pass the date as a parameter

  useEffect(() => {
    fetchMeals(date);
  }, [date, fetchMeals]);

  return { meals, isLoading, error };
} 