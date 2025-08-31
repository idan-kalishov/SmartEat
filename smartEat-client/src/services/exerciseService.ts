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

function formatDateLocal(date: Date): string {
  // Returns YYYY-MM-DD in local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const getExercisesByDate = async (date: Date): Promise<Exercise[]> => {
  const dateStr = formatDateLocal(date); // Use local date
  const response = await api.get<{ exercises: Exercise[] }>(
    `/exercise/by-date/${dateStr}`
  );
  return response.data.exercises;
};
