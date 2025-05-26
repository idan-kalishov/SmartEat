import { ROUTES } from "@/Routing/routes";
import React, { useState } from "react";
import HorizontalDatePicker from "../components/HorizontalDatePicker";
import MealsLogModal from "../components/meals/MealsLogModal";
import { useMealsByDate } from "@/hooks/meals/useMealsByDate";
import IngredientNutritionRow from "../components/meals/IngredientNutritionRow";
import MealNutritionSummary from "../components/meals/MealNutritionSummary";
import MenuActionButton from "../components/meals/MenuActionButton";
import MealCard from "../components/meals/MealCard";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { meals, isLoading } = useMealsByDate(selectedDate);
  const [showModal, setShowModal] = useState(false);

  const lastMeal = meals[meals.length - 1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Title */}
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
            <>
              <div
                className="w-full flex flex-col items-start bg-green-100 rounded p-4 hover:bg-green-200 transition cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                <MealCard meal={lastMeal} onClick={() => setShowModal(true)} isPreview={true} />
                {meals.length > 1 && (
                  <div className="text-xs text-gray-500 mt-2 text-center w-full">
                    And {meals.length - 1} more meal{meals.length - 1 > 1 ? 's' : ''}...
                  </div>
                )}
              </div>
            </>
          ) : (
            <span className="text-gray-400">No meals logged for this date.</span>
          )}
        </div>
        {showModal && <MealsLogModal meals={meals} onClose={() => setShowModal(false)} />}
      </div>

      {/* Plus Button */}
      <Link to="/upload">
        <button className="w-24 h-24 rounded-full bg-blue-500 text-white text-5xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors sm:w-28 sm:h-28 sm:text-6xl">
          +
        </button>
      </Link>

      <Link to="/profile">
        <div className="w-24 h-24  bg-blue-500 text-white text-5xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors sm:w-28 sm:h-28 sm:text-6xl">
          goal
        </div>
      </Link>
      <Link to={ROUTES.USER_PROFILE}>
        <div className="w-24 h-24  bg-blue-500 text-white text-5xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors sm:w-28 sm:h-28 sm:text-6xl">
          profile
        </div>
      </Link>
    </div>
  );
};

export default Home;
