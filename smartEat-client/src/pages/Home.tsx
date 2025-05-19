import React, { useState } from "react";
import HorizontalDatePicker from "../components/HorizontalDatePicker";
import MealsLogModal from "../components/meals/MealsLogModal";
import { useMealsByDate } from "@/hooks/meals/useMealsByDate";
import IngredientNutritionRow from "../components/meals/IngredientNutritionRow";
import MealNutritionSummary from "../components/meals/MealNutritionSummary";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { meals, isLoading } = useMealsByDate(selectedDate);
  const [showModal, setShowModal] = useState(false);

  const lastMeal = meals[meals.length - 1];

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-200 py-4 px-2 sm:py-8">
      <div className="w-full max-w-md flex flex-col items-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center text-green-800">
          Select Date
        </h2>
        <HorizontalDatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          daysBefore={10}
          daysAfter={10}
        />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col items-center">
        <span className="text-gray-500 text-sm sm:text-base mb-2">
          Logged Meals ({meals.length})
        </span>
        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : lastMeal ? (
          <button
            className="w-full flex flex-col items-start bg-green-100 rounded p-2 hover:bg-green-200 transition"
            onClick={() => setShowModal(true)}
          >
            <div className="flex items-center w-full">
              <img
                src={lastMeal.imageUrl}
                alt={lastMeal.ingredients.map((i) => i.name).join(", ")}
                className="w-12 h-12 rounded object-cover mr-4"
              />
              <div>
                <MealNutritionSummary meal={lastMeal} />
                {lastMeal.ingredients.map((ingredient, idx) => (
                  <IngredientNutritionRow key={idx} ingredient={ingredient} />
                ))}
                <div className="text-xs text-gray-500">
                  {new Date(lastMeal.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            {meals.length > 1 && (
              <div className="text-xs text-gray-500 mt-2 text-center w-full">
                And {meals.length - 1} more meal{meals.length - 1 > 1 ? 's' : ''}...
              </div>
            )}
          </button>
        ) : (
          <span className="text-gray-400">No meals logged for this date.</span>
        )}
      </div>
      {showModal && <MealsLogModal meals={meals} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;
