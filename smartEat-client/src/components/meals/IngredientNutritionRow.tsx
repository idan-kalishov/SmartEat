import React from "react";
import { IngredientDetails } from "@/types/meals/mealTypes";

interface IngredientNutritionRowProps {
  ingredient: IngredientDetails;
}

const IngredientNutritionRow: React.FC<IngredientNutritionRowProps> = ({ ingredient }) => {
  return (
    <div className="mb-2">
      <div className="font-bold text-green-700">
        {ingredient.name} <span className="text-xs text-gray-500">({ingredient.weight}g)</span>
      </div>
      {ingredient.per100gNutrition && (
        <div className="flex space-x-2 mt-1 text-xs">
          <span className="flex items-center text-orange-600 font-semibold">
            🔥 {((ingredient.per100gNutrition.calories.value * ingredient.weight) / 100).toFixed(0)}kcal
          </span>
          <span className="flex items-center text-blue-600 font-semibold">
            🥩 {((ingredient.per100gNutrition.protein.value * ingredient.weight) / 100).toFixed(1)}g
          </span>
          <span className="flex items-center text-yellow-600 font-semibold">
            🥑 {((ingredient.per100gNutrition.fat.value * ingredient.weight) / 100).toFixed(1)}g
          </span>
          <span className="flex items-center text-green-600 font-semibold">
            🌾 {((ingredient.per100gNutrition.carbs.value * ingredient.weight) / 100).toFixed(1)}g
          </span>
        </div>
      )}
    </div>
  );
};

export default IngredientNutritionRow; 