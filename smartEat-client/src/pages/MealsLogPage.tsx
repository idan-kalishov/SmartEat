import { useMealsByDate } from "@/hooks/meals/useMealsByDate";
import React, { useState } from "react";
import HorizontalDatePicker from "../components/HorizontalDatePicker";
import MealCard from "../components/meals/MealCard";
import MealsLogModal from "../components/meals/MealsLogModal";
import ExerciseCard from "@/components/ExcerciseCard";

const MealsLogPage: React.FC = () => {
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
          <>
            <div
              className="w-full flex flex-col items-start bg-green-100 rounded p-4 hover:bg-green-200 transition cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <MealCard
                meal={lastMeal}
                onClick={() => setShowModal(true)}
                isPreview={true}
              />
              {meals.length > 1 && (
                <div className="text-xs text-gray-500 mt-2 text-center w-full">
                  And {meals.length - 1} more meal
                  {meals.length - 1 > 1 ? "s" : ""}...
                </div>
              )}
            </div>
          </>
        ) : (
          <span className="text-gray-400">No meals logged for this date.</span>
        )}
      </div>
      <ExerciseCard />
      {showModal && (
        <MealsLogModal meals={meals} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default MealsLogPage;
