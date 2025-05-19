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
    <div className="flex space-x-4 mb-2 text-sm justify-center">
      <span className="flex items-center text-orange-600 font-semibold">
        🔥 {totals.calories}kcal
      </span>
      <span className="flex items-center text-blue-600 font-semibold">
        🥩 {totals.protein}g
      </span>
      <span className="flex items-center text-yellow-600 font-semibold">
        🥑 {totals.fat}g
      </span>
      <span className="flex items-center text-green-600 font-semibold">
        🌾 {totals.carbs}g
      </span>
    </div>
  );
};

export default MealNutritionSummary; 