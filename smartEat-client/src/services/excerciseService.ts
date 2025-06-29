import api from "./api";
import { Exercise } from "@/types/exercise";

export const saveExcercise = async (
  excercise: Exercise
): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>(`/meals/save`, {
    excercise,
  });
  return response.data;
};
