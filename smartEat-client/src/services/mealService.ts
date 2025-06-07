import axios from "axios";
import { Meal } from "@/types/meals/mealTypes";

const API_URL = "https://localhost:3002";

function formatDateLocal(date: Date): string {
  // Returns YYYY-MM-DD in local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getMealsByDate = async (date: Date): Promise<Meal[]> => {
  const dateStr = formatDateLocal(date); // Use local date
  const response = await axios.get<{ meals: Meal[] }>(`${API_URL}/meals/by-date/${dateStr}`, {
    withCredentials: true
  });
  return response.data.meals;
}; 