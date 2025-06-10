import { Meal } from "@/types/meals/mealTypes";
import React from "react";
import MealCard from "./MealCard";

interface MealsLogModalProps {
  meals: Meal[];
  onClose: () => void;
  onMealDeleted?: () => void;
}

const MealsLogModal: React.FC<MealsLogModalProps> = ({ meals, onClose, onMealDeleted }) => {

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-lg p-4 sm:p-6 mx-2 relative">
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
            meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} onMealDeleted={onMealDeleted} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MealsLogModal; 