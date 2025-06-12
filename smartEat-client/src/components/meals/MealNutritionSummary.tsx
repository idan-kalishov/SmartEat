import React from "react";
import { Meal } from "@/types/meals/mealTypes";
import NutritionSummaryRow from "./NutritionSummaryRow";
import { Flame, Dumbbell, Wheat, Cookie } from "lucide-react";

interface MealNutritionSummaryProps {
  meal: Meal;
}

function getMealNutritionTotals(meal: Meal) {
  let calories = 0, protein = 0, fat = 0, carbs = 0;
  meal.ingredients.forEach(ingredient => {
    if (ingredient.nutrition?.per100g) {
      const w = ingredient.weight;
      const nutrition = ingredient.nutrition.per100g;
      calories += ((nutrition.calories?.value || 0) * w) / 100;
      protein += ((nutrition.protein?.value || 0) * w) / 100;
      fat += ((nutrition.fat?.value || 0) * w) / 100;
      carbs += ((nutrition.carbs?.value || 0) * w) / 100;
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
      icons={{
        calories: <Flame className="w-4 h-4" />,
        protein: <Dumbbell className="w-4 h-4" />,
        fat: <Cookie className="w-4 h-4" />,
        carbs: <Wheat className="w-4 h-4" />
      }}
      className="mb-2 justify-center mr-10"
    />
  );
};

export default MealNutritionSummary; 