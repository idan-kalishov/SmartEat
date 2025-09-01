import { Cookie, Dumbbell, Flame, Wheat, Activity } from "lucide-react";
import React from "react";
import {
  DailyNutrition,
  DailyRecommendations,
} from "../../hooks/nutrition/useDailyNutrition";
import { Exercise } from "../../types/exercise";
import { DailyExerciseGoal } from "../../services/dailyRecommendationsService";

interface NutrientProgress {
  current: number;
  target: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface DailyIntakeProgressProps {
  currentNutrition: DailyNutrition | null;
  recommendations: DailyRecommendations | null;
  error: string | null;
  exercises?: Exercise[];
  exerciseGoal?: DailyExerciseGoal | null;
}

const DailyIntakeProgress: React.FC<DailyIntakeProgressProps> = ({
  currentNutrition,
  recommendations,
  error,
  exercises = [],
  exerciseGoal,
}) => {
  // Calculate total calories burned from exercises
  const totalExerciseCalories = exercises.reduce((total, exercise) => {
    return total + (Number(exercise.calories) || 0);
  }, 0);

  // Create nutrients data from props
  const nutrients: NutrientProgress[] =
    currentNutrition && recommendations
      ? [
          {
            current: currentNutrition.calories,
            target: recommendations.calories,
            label: "Calories",
            icon: Flame,
            color: "from-orange-500 to-red-500",
          },
          {
            current: currentNutrition.protein,
            target: recommendations.protein,
            label: "Protein",
            icon: Dumbbell,
            color: "from-rose-500 to-red-500",
          },
          {
            current: currentNutrition.fats,
            target: recommendations.fats,
            label: "Fat",
            icon: Cookie,
            color: "from-blue-500 to-indigo-500",
          },
          {
            current: currentNutrition.carbs,
            target: recommendations.carbs,
            label: "Carbs",
            icon: Wheat,
            color: "from-amber-500 to-yellow-600",
          },
        ]
      : [];

  // Add exercise progress if exercise goal is available
  if (exerciseGoal) {
    nutrients.push({
      current: totalExerciseCalories,
      target: exerciseGoal.calories,
      label: "Exercise",
      icon: Activity,
      color: "from-green-500 to-emerald-600",
    });
  }

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const formatValue = (value: number, label: string) => {
    if (label === "Calories") return value.toLocaleString() + " kcal";
    if (label === "Exercise") return value.toLocaleString() + " cal";
    return value + "g";
  };

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Daily Progress
          </h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentNutrition || !recommendations) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Daily Progress
          </h3>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-gray-600 text-sm">No nutrition data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Daily Progress</h3>
      </div>

      <div className="grid gap-3">
        {nutrients.map((nutrient, index) => {
          const progress = getProgressPercentage(
            nutrient.current,
            nutrient.target
          );

          return (
            <div
              key={index}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg bg-gradient-to-r ${nutrient.color} bg-opacity-10`}
                  >
                    <nutrient.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {nutrient.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatValue(Math.round(nutrient.current), nutrient.label)}
                  </div>
                  <div className="text-xs text-gray-500">
                    of {formatValue(nutrient.target, nutrient.label)}
                  </div>
                </div>
              </div>

              <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full bg-gradient-to-r ${nutrient.color} transition-all duration-500 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-1 flex justify-between items-center">
                <span
                  className="text-xs font-medium"
                  style={{ color: progress > 100 ? "#ef4444" : "#6b7280" }}
                >
                  {progress > 100 ? "Exceeded" : `${Math.round(progress)}%`}
                </span>
                <span className="text-xs text-gray-500">
                  {formatValue(
                    Math.round(Math.max(0, nutrient.target - nutrient.current)),
                    nutrient.label
                  )}{" "}
                  remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyIntakeProgress;
