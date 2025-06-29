import api from "./api";
import { Exercise } from "@/types/exercise";

export const saveExcercise = async (
  excercise: Exercise
): Promise<{ success: boolean }> => {
  debugger;
  const response = await api.post<{ success: boolean }>(`/excercise/save`, {
    excercise,
  });
  return response.data;
};
