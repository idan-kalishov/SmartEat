import React from "react";
import { Ingredient } from "@/types/meals/mealTypes";
import NutritionSummaryRow from "./NutritionSummaryRow";

interface IngredientNutritionRowProps {
  ingredient: Ingredient;
}

const IngredientNutritionRow: React.FC<IngredientNutritionRowProps> = ({ ingredient }) => {
  const nutrition = ingredient.nutrition?.per100g;
  const weight = ingredient.weight;
  return (
    <div className="mb-2">
      <div className="font-bold text-green-700">
        {ingredient.name} <span className="text-xs text-gray-500">({ingredient.weight}g)</span>
      </div>
      {nutrition && (
        <NutritionSummaryRow
          calories={Math.round((nutrition.calories?.value || 0) * weight / 100)}
          protein={Number(((nutrition.protein?.value || 0) * weight / 100).toFixed(1))}
          fat={Number(((nutrition.fat?.value || 0) * weight / 100).toFixed(1))}
          carbs={Number(((nutrition.carbs?.value || 0) * weight / 100).toFixed(1))}
          className="mt-1 text-xs"
        />
      )}
    </div>
  );
};

export default IngredientNutritionRow; 