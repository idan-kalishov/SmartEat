import { Meal } from "@/types/meals/meal";
import api from "./api";

export function formatDateLocal(date: Date): string {
  // Returns YYYY-MM-DD in local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const getMealsByDate = async (date: Date): Promise<Meal[]> => {
  const dateStr = formatDateLocal(date); // Use local date
  const response = await api.get<{ meals: Meal[] }>(
    `/meals/by-date/${dateStr}`
  );
  return response.data.meals;
};

export const deleteMeal = async (
  mealId: string
): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(`/meals/${mealId}`);
  return response.data;
};
