import React, { useState } from "react";
import { Dumbbell, Plus, Flame, Loader2 } from "lucide-react";
import { ExerciseSelect, Exercise, IntensityType } from "@/types/exercise";
import AddExerciseModal from "./AddExerciseModal";
import { saveExercise } from "@/services/exerciseService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/appState";

interface ExercisesCardProps {
  exercises: Exercise[];
  fetchExercises: () => void;
  selectedDate: Date;
  isLoading: boolean;
  error: string | null;
}

const ExercisesCard: React.FC<ExercisesCardProps> = ({
  exercises,
  fetchExercises,
  selectedDate,
  isLoading,
  error,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const appState = useSelector((state: RootState) => state.appState);
  const user = appState.user;

  const handleAddExercise = async (
    exerciseData: ExerciseSelect,
    intensity: IntensityType,
    duration: number
  ) => {
    if (intensity.value && exerciseData.value) {
      const newExercise: Exercise = {
        id: Math.random().toString(),
        calories: (
          (exerciseData.caloriesPerHour * intensity.multiplier * duration) /
          60
        ).toFixed(0),
        createdAt: selectedDate.toISOString(),
        minutes: duration,
        name: exerciseData.label,
        userId: user?._id,
      };

      await saveExercise(newExercise);
      setIsModalOpen(false);
      fetchExercises();
    }
  };

  const getTotalCalories = () => {
    return exercises.reduce(
      (total, exercise) => total + Number(exercise.calories),
      0
    );
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Today's Exercises
          </h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm font-medium"
          title="Add Exercise"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Exercise
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : error ? (
        <span className="text-red-500">{error}</span>
      ) : exercises.length > 0 ? (
        <div className="space-y-3">
          {/* Total calories summary */}
          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Total Calories Burned
            </span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <Flame className="w-4 h-4" />
              {getTotalCalories()} cal
            </div>
          </div>

          {/* Exercise list */}
          <div className="space-y-2">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <span className="font-medium text-gray-800 capitalize">
                  {exercise.name}
                </span>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Flame className="w-4 h-4" />
                  <span className="font-medium">{exercise.calories}</span>
                  <span className="text-sm text-gray-500">cal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-gray-400">
          <Dumbbell className="w-8 h-8 mb-2 opacity-50" />
          <span>No exercises added today</span>
        </div>
      )}

      <AddExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExercise}
      />
    </div>
  );
};

export default ExercisesCard;
