import { Meal } from "@/types/meals/meal";
import { formatDateLocal } from "@/utils/dateUtils";
import api from "./api";

export const getMealsByDate = async (date: Date): Promise<Meal[]> => {
  const dateStr = formatDateLocal(date); // Use local date
  const response = await api.get<{ meals: Meal[] }>(`/meals/by-date/${dateStr}`);
  return response.data.meals;
};

export const deleteMeal = async (mealId: string): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(`/meals/${mealId}`);
  return response.data;
}; 