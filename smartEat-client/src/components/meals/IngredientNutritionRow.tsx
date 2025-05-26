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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2V4c0-1.1-.9-2-2-2zm-4 10c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2v-6c0-1.1-.9-2-2-2zm8 0c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2s2-.9 2-2v-6c0-1.1-.9-2-2-2z"/>
            </svg>
            {((ingredient.per100gNutrition.calories.value * ingredient.weight) / 100).toFixed(0)}kcal
          </span>
          <span className="flex items-center text-blue-600 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.66 0-8 1.34-8 4v2h16v-2c0-2.66-5.34-4-8-4z"/>
            </svg>
            {((ingredient.per100gNutrition.protein.value * ingredient.weight) / 100).toFixed(1)}g
          </span>
          <span className="flex items-center text-yellow-600 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 11c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            {((ingredient.per100gNutrition.fat.value * ingredient.weight) / 100).toFixed(1)}g
          </span>
          <span className="flex items-center text-green-600 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8zm0-14a6 6 0 106 6 6 6 0 00-6-6z"/>
            </svg>
            {((ingredient.per100gNutrition.carbs.value * ingredient.weight) / 100).toFixed(1)}g
          </span>
        </div>
      )}
    </div>
  );
};

export default IngredientNutritionRow; 