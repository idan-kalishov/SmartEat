import React, { useState } from "react";
import { Meal } from "@/types/meals/mealTypes";
import IngredientNutritionRow from "./IngredientNutritionRow";
import MealNutritionSummary from "./MealNutritionSummary";
import MenuActionButton from "./MenuActionButton";

interface MealsLogModalProps {
  meals: Meal[];
  onClose: () => void;
}

const MealsLogModal: React.FC<MealsLogModalProps> = ({ meals, onClose }) => {
  const [menuOpenIdx, setMenuOpenIdx] = useState<number | null>(null);

  const handleEditMeal = (meal: Meal) => {
    // Stub: implement edit logic later
    alert(`Edit meal: ${meal._id}`);
  };
  const handleDeleteMeal = (meal: Meal) => {
    // Stub: implement delete logic later
    alert(`Delete meal: ${meal._id}`);
  };

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
            meals.map((meal, mealIdx) => (
              <div key={meal._id} className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4 relative">
                {/* 3-dots menu */}
                <div className="absolute top-2 right-2 z-10">
                  <button
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none transition duration-150 hover:bg-gray-200 active:scale-90 focus-visible:ring focus-visible:ring-green-300"
                    onClick={() => setMenuOpenIdx(menuOpenIdx === mealIdx ? null : mealIdx)}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>⋯</span>
                  </button>
                  {menuOpenIdx === mealIdx && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg py-1">
                      <MenuActionButton
                        onClick={() => { setMenuOpenIdx(null); handleEditMeal(meal); }}
                      >
                        Edit
                      </MenuActionButton>
                      <MenuActionButton
                        onClick={() => { setMenuOpenIdx(null); handleDeleteMeal(meal); }}
                        colorClass="text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </MenuActionButton>
                    </div>
                  )}
                </div>
                <img
                  src={meal.imageUrl}
                  alt="Meal"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <MealNutritionSummary meal={meal} />
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