import React from "react";
import { Meal } from "@/types/meals/mealTypes";
import IngredientNutritionRow from "./IngredientNutritionRow";

interface MealsLogModalProps {
  meals: Meal[];
  onClose: () => void;
}

const MealsLogModal: React.FC<MealsLogModalProps> = ({ meals, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">Logged Meals</h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {meals.length === 0 ? (
            <p className="text-gray-500 text-center">No meals logged for this date</p>
          ) : (
            meals.map((meal, mealIdx) => (
              <div key={meal._id} className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4">
                <img
                  src={meal.imageUrl}
                  alt="Meal"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold text-green-700 mb-1">
                    {meal.ingredients.map(i => i.name).join(", ")}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(meal.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>
                    {meal.ingredients.map((ingredient, idx) => (
                      <IngredientNutritionRow key={idx} ingredient={ingredient} />
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MealsLogModal; 