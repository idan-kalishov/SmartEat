import React from "react";
import { Meal } from "@/types/meals/mealTypes";
import NutritionSummaryRow from "./NutritionSummaryRow";

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
    <NutritionSummaryRow
      calories={totals.calories}
      protein={totals.protein}
      fat={totals.fat}
      carbs={totals.carbs}
      className="mb-2 justify-center mr-10"
    />
  );
};

export default MealNutritionSummary; 