import React, { useState } from "react";

interface MealsLogModalProps {
  onClose: () => void;
}

const ExerciseLogModal: React.FC<MealsLogModalProps> = ({ onClose }) => {
  const [exerciseType, setExerciseType] = useState("");
  const [intensityLevel, setIntensityLevel] = useState("");

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-lg p-4 sm:p-6 mx-2 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">add exercise</h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) => setExerciseType(event.target.value)}
          >
            <option selected>Choose an exercise type</option>
            <option value="cardio">cardio</option>
            <option value="strength">strength</option>
          </select>
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(event) => setIntensityLevel(event.target.value)}
          >
            <option selected>Choose intensity level</option>
            <option value="Light">Light</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLogModal;
