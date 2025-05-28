import React from "react";
import { IngredientDetails } from "@/types/meals/mealTypes";
import NutritionSummaryRow from "./NutritionSummaryRow";

interface IngredientNutritionRowProps {
  ingredient: IngredientDetails;
}

const IngredientNutritionRow: React.FC<IngredientNutritionRowProps> = ({ ingredient }) => {
  const nutrition = ingredient.per100gNutrition;
  const weight = ingredient.weight;
  return (
    <div className="mb-2">
      <div className="font-bold text-green-700">
        {ingredient.name} <span className="text-xs text-gray-500">({ingredient.weight}g)</span>
      </div>
      {nutrition && (
        <NutritionSummaryRow
          calories={((nutrition.calories.value * weight) / 100).toFixed(0)}
          protein={((nutrition.protein.value * weight) / 100).toFixed(1)}
          fat={((nutrition.fat.value * weight) / 100).toFixed(1)}
          carbs={((nutrition.carbs.value * weight) / 100).toFixed(1)}
          className="mt-1 text-xs"
        />
      )}
    </div>
  );
};

export default IngredientNutritionRow; 