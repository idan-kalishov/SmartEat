import { useEffect, useState } from "react";
import { Meal } from "@/types/meals/mealTypes";
import { getMealsByDate } from "@/services/mealService";

export function useMealsByDate(date: Date) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedMeals = await getMealsByDate(date);
        setMeals(fetchedMeals);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch meals');
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [date]);

  return { meals, isLoading, error };
} 