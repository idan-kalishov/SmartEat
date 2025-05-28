import axios from "axios";
import { Meal } from "@/types/meals/mealTypes";

const API_URL = "https://localhost:3002";

export const getMealsByDate = async (date: Date): Promise<Meal[]> => {
  const dateStr = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  const response = await axios.get<{ meals: Meal[] }>(`${API_URL}/meals/by-date/${dateStr}`, {
    withCredentials: true
  });
  return response.data.meals;
}; 