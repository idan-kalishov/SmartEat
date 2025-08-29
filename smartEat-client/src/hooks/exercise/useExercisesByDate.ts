import { getExercisesByDate } from "@/services/exerciseService";
import { Exercise } from "@/types/exercise";
import { useCallback, useEffect, useState } from "react";

export function useExercisesByDate(date: Date) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setExercises([]); // Reset exercises immediately when date changes

    try {
      const fetchedExercises = await getExercisesByDate(date);
      setExercises(fetchedExercises);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch exercises"
      );
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, [date]); // Add date as dependency since we use it in the function

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  return { exercises, isLoading, error, fetchExercises };
}
