import { Flame, Clock, Plus } from "lucide-react";
import { useState } from "react";
import ExcerciseLogModal from "./ExcerciseLogModal";

const ExerciseCard = () => {
  const [showAddExcercise, setShowAddExcercise] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 m-2 w-[50%] align-right">
      <div className="flex justify-between items-center mb-4">
        <span className="text-black font-semibold text-lg">Exercise</span>
        <Plus
          className="w-5 h-5 text-black"
          onClick={() => setShowAddExcercise(true)}
        />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Flame className="text-orange-500 w-5 h-5" />
        <span className="text-gray-500 font-medium text-sm">0 cal</span>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="text-orange-500 w-5 h-5" />
        <span className="text-gray-500 font-medium text-sm">00:00 hr</span>
      </div>
      {showAddExcercise && (
        <ExcerciseLogModal onClose={() => setShowAddExcercise(false)} />
      )}
    </div>
  );
};

export default ExerciseCard;
