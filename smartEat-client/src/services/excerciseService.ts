import api from "./api";
import { Exercise } from "@/types/exercise";

export const saveExcercise = async (
  exercise: Exercise
): Promise<{ success: boolean }> => {
  const a = {
    exercise,
    userId: exercise.userId,
  };

  debugger;
  const response = await api.post<{ success: boolean }>(`/excercise/save`, {
    exercise,
    userId: exercise.userId,
  });
  return response.data;
};
