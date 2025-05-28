import { useEffect, useState } from "react";
import { Meal } from "@/types/meals/mealTypes";

// Stub fetch function (replace with real API when ready)
const fetchMealsByDate = async (date: Date): Promise<Meal[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Normalize the date (set hours, minutes, seconds, and ms to 0)
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return [
    {
      _id: "1",
      userId: "user1",
      ingredients: [
        { 
          name: "Chicken Breast", 
          weight: 200,
          per100gNutrition: {
            calories: { value: 110, unit: 'kcal' },
            protein: { value: 23, unit: 'g' },
            fat: { value: 1.2, unit: 'g' },
            carbs: { value: 0, unit: 'g' }
          }
        },
        { 
          name: "Broccoli", 
          weight: 100,
          per100gNutrition: {
            calories: { value: 34, unit: 'kcal' },
            protein: { value: 2.8, unit: 'g' },
            fat: { value: 0.4, unit: 'g' },
            carbs: { value: 6.6, unit: 'g' }
          }
        },
      ],
      imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      createdAt: normalizedDate.toISOString(),
      updatedAt: normalizedDate.toISOString(),
      name: "Chicken and Broccoli Meal",
    },
    {
      _id: "2",
      userId: "user1",
      ingredients: [
        { 
          name: "Cottage Cheese", 
          weight: 150,
          per100gNutrition: {
            calories: { value: 98, unit: 'kcal' },
            protein: { value: 11, unit: 'g' },
            fat: { value: 4.3, unit: 'g' },
            carbs: { value: 3.4, unit: 'g' }
          }
        },
        { 
          name: "Tomato", 
          weight: 50,
          per100gNutrition: {
            calories: { value: 18, unit: 'kcal' },
            protein: { value: 0.9, unit: 'g' },
            fat: { value: 0.2, unit: 'g' },
            carbs: { value: 3.9, unit: 'g' }
          }
        },
      ],
      imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c",
      createdAt: normalizedDate.toISOString(),
      updatedAt: normalizedDate.toISOString(),
      name: "Cottage Cheese and Tomato Snack",
    },
    {
      _id: "3",
      userId: "user1",
      ingredients: [
        { 
          name: "Omelette", 
          weight: 120,
          per100gNutrition: {
            calories: { value: 154, unit: 'kcal' },
            protein: { value: 11, unit: 'g' },
            fat: { value: 11, unit: 'g' },
            carbs: { value: 1.3, unit: 'g' }
          }
        },
        { 
          name: "Spinach", 
          weight: 30,
          per100gNutrition: {
            calories: { value: 23, unit: 'kcal' },
            protein: { value: 2.9, unit: 'g' },
            fat: { value: 0.4, unit: 'g' },
            carbs: { value: 3.6, unit: 'g' }
          }
        },
      ],
      imageUrl: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0",
      createdAt: normalizedDate.toISOString(),
      updatedAt: normalizedDate.toISOString(),
      name: "Spinach Omelette",
    },
  ];
};

export function useMealsByDate(date: Date) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchMealsByDate(date)
      .then(setMeals)
      .finally(() => setIsLoading(false));
  }, [date]);

  return { meals, isLoading };
} 