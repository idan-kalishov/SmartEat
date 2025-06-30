import api from "./api";
import { Exercise } from "@/types/exercise";

export const saveExercise = async (
  exercise: Exercise
): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(`/exercise/save`, {
    exercise,
    userId: exercise.userId,
  });
  return response.data;
};
