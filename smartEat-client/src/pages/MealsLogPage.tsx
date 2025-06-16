import { ROUTES } from "@/Routing/routes";
import ExercisesCard from "@/components/exercise/ExercisesCard";
import DailyIntakeProgress from "@/components/insights/DailyIntakeProgress";
import { MealDetailsModal } from "@/components/meals/MealDetailsModal";
import WaterTracker from "@/components/water-tracker/WaterTracker";
import { useMealsByDate } from "@/hooks/meals/useMealsByDate";
import { Meal } from "@/types/meals/meal";
import { calculateTotalNutrition } from "@/utils/nutrientCalculations";
import { BarChart3, Clock, Loader2, Plus, Utensils, UtensilsCrossed, } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HorizontalDatePicker from "../components/HorizontalDatePicker";

type Tab = "overview" | "statistics";

const MealsLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const {
    meals = [],
    isLoading,
    error,
    fetchMeals,
  } = useMealsByDate(selectedDate);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 px-2 sm:py-6 h-full overflow-y-auto">
      <div className="w-full max-w-md flex flex-col items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
          Daily Overview
        </h1>
        <HorizontalDatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          daysBefore={10}
          daysAfter={10}
        />
      </div>

            <div className="w-full max-w-md flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "overview"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                >
                    <Utensils className="w-4 h-4" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab("statistics")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "statistics"
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                        }`}
                >
                    <BarChart3 className="w-4 h-4" />
                    Insights
                </button>
            </div>

      {activeTab === "overview" ? (
        <>
          <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Today's Meals
                </h2>
              </div>
              <button
                onClick={() => navigate(ROUTES.UPLOAD)}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Meal
              </button>
            </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                            </div>
                        ) : error ? (
                            <span className="text-red-500">{error}</span>
                        ) : meals.length > 0 ? (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 -mr-2">
                                {meals.map((meal, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer border border-gray-100"
                                        onClick={() => setSelectedMeal(meal)}
                                    >
                                        {meal.imageUrl ? (
                                            <img
                                                src={meal.imageUrl}
                                                alt={meal.name}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                                <Utensils className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {meal.name || "Unnamed Meal"}
                                            </h3>
                                            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatTime(meal.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                {(() => {
                                                    const nutrition = calculateTotalNutrition(meal.ingredients);
                                                    return (
                                                        <>
                                                            <span
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                                {Math.round(nutrition.calories)} cal
                                                            </span>
                                                            <span
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {Math.round(nutrition.protein)}g protein
                                                            </span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-8 text-gray-400">
                                <UtensilsCrossed className="w-8 h-8 mb-2 opacity-50" />
                                <span>No meals added for this date</span>
                            </div>
                        )}
                    </div>

          <ExercisesCard />
        </>
      ) : (
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800">Insights</h2>
          </div>
          <DailyIntakeProgress />
        </div>
      )}

      <WaterTracker selectedDate={selectedDate}></WaterTracker>

      <MealDetailsModal
        meal={selectedMeal}
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onMealDeleted={fetchMeals}
      />
    </div>
  );
};

export default MealsLogPage;
