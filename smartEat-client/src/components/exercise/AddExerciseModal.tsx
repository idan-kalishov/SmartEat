import React, { useState } from "react";
import { X, Clock } from "lucide-react";
import { Select } from "../ui/select";
import {
  ExerciseSelect,
  ExerciseType,
  IntensityLevel,
  IntensityType,
} from "@/types/exercise";
import { exerciseTypes, intensityTypes } from "./consts";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    exercise: ExerciseSelect,
    intensity: IntensityType,
    duration: number
  ) => void;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [exerciseType, setExerciseType] = useState<ExerciseType | "">("");
  const [intensityLevel, setIntensityLevel] = useState<IntensityLevel | "">("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseType || !intensityLevel || !duration) return;

    const exercise = exerciseTypes.find(
      (exercise) => exercise.value === exerciseType
    );

    const intensity = intensityTypes.find(
      (intensityType) => intensityType.value === intensityLevel
    );

    onAdd(exercise, intensity, Number(duration));

    // Reset form
    setExerciseType("");
    setIntensityLevel("");
    setDuration("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-50 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-xl shadow-xl p-6 m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add Exercise</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Exercise Type"
            options={exerciseTypes}
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value as ExerciseType)}
          />

          <Select
            label="Intensity Level"
            options={intensityTypes}
            value={intensityLevel}
            onChange={(e) =>
              setIntensityLevel(e.target.value as IntensityLevel)
            }
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <div className="relative">
              <input
                type="number"
                value={duration}
                onChange={(e) => {
                  const value = Math.max(
                    0,
                    Math.min(1440, Number(e.target.value))
                  );
                  setDuration(value.toString());
                }}
                min="0"
                max="1440"
                placeholder="0"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                min
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!exerciseType || !intensityLevel || !duration}
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg font-medium shadow-sm hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Add Exercise
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExerciseModal;
