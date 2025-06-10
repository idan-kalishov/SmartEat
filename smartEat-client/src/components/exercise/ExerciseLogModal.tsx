import React, { useState } from "react";

interface MealsLogModalProps {
  onClose: () => void;
}

const ExerciseLogModal: React.FC<MealsLogModalProps> = ({ onClose }) => {
  const [exerciseType, setExerciseType] = useState("");
  const [minutes, setMinutes] = useState(0);

  const handleSubmit = () => {
    console.log(`${minutes} ${exerciseType}`);
    onClose();
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = event.target.value.replace(/[^0-9]/g, "");

    const cleanedValueNoZero = cleanedValue.replace(
      /^0+/,
      ""
    ) as unknown as number;

    setMinutes(cleanedValueNoZero < 1440 ? cleanedValueNoZero : minutes);
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
        <h2 className="text-xl font-bold mb-4 text-center">add exercise</h2>
        <div className="space-y-6 overflow-y-auto justify-items-center inline">
          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5"
            onChange={(event) => setExerciseType(event.target.value)}
          >
            <option selected>Choose an exercise type</option>
            <option value="weight lifting">weight lifting</option>
            <option value="basketball">basketball</option>
            <option value="football">football</option>
            <option value="swimming">swimming</option>
            <option value="light cardio">light cardio</option>
            <option value="moderate cardio">moderate cardio</option>
            <option value="intense cardio">intense cardio</option>
          </select>
          <input
            type="number"
            className="border border-gray-300 rounded-lg py-2 px-4 w-full"
            placeholder="minutes"
            value={minutes}
            onChange={handleMinuteChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg block mx-auto"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLogModal;
