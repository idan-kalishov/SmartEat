import React from "react";
import { Meal } from "@/types/meals/mealTypes";

interface MealNutritionSummaryProps {
  meal: Meal;
}

function getMealNutritionTotals(meal: Meal) {
  let calories = 0, protein = 0, fat = 0, carbs = 0;
  meal.ingredients.forEach(ingredient => {
    if (ingredient.per100gNutrition) {
      const w = ingredient.weight;
      calories += (ingredient.per100gNutrition.calories.value * w) / 100;
      protein += (ingredient.per100gNutrition.protein.value * w) / 100;
      fat += (ingredient.per100gNutrition.fat.value * w) / 100;
      carbs += (ingredient.per100gNutrition.carbs.value * w) / 100;
    }
  });
  return {
    calories: Math.round(calories),
    protein: protein.toFixed(1),
    fat: fat.toFixed(1),
    carbs: carbs.toFixed(1),
  };
}

const MealNutritionSummary: React.FC<MealNutritionSummaryProps> = ({ meal }) => {
  const totals = getMealNutritionTotals(meal);
  return (
    <div className="flex space-x-4 mb-2 text-sm justify-center mr-10">
      <span className="flex items-center text-orange-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2v-6c0-1.1-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2v-6c0-1.1-.9-2-2-2z"/>
        </svg>
        {totals.calories}kcal
      </span>
      <span className="flex items-center text-blue-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.66 0-8 1.34-8 4v2h16v-2c0-2.66-5.34-4-8-4z"/>
        </svg>
        {totals.protein}g
      </span>
      <span className="flex items-center text-yellow-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <path d="M12 11c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
        {totals.fat}g
      </span>
      <span className="flex items-center text-green-600 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm0-14a6 6 0 106 6 6 6 0 00-6-6z"/>
        </svg>
        {totals.carbs}g
      </span>
    </div>
  );
};

export default MealNutritionSummary; 