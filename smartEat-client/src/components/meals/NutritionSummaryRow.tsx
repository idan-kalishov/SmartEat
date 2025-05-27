import React from "react";
import { MdLocalFireDepartment } from "react-icons/md";
import { GiMuscleUp, GiDroplets, GiWheat } from "react-icons/gi";

interface NutritionSummaryRowProps {
  calories: number | string;
  protein: number | string;
  fat: number | string;
  carbs: number | string;
  className?: string;
}

const NutritionSummaryRow: React.FC<NutritionSummaryRowProps> = ({ calories, protein, fat, carbs, className = "" }) => (
  <div className={`flex space-x-4 text-sm ${className}`}>
    <span className="flex items-center text-orange-600 font-semibold">
      <MdLocalFireDepartment className="w-4 h-4 mr-1" />
      {calories}kcal
    </span>
    <span className="flex items-center text-blue-600 font-semibold">
      <GiMuscleUp className="w-4 h-4 mr-1" />
      {protein}g
    </span>
    <span className="flex items-center text-yellow-600 font-semibold">
      <GiDroplets className="w-4 h-4 mr-1" />
      {fat}g
    </span>
    <span className="flex items-center text-green-600 font-semibold">
      <GiWheat className="w-4 h-4 mr-1" />
      {carbs}g
    </span>
  </div>
);

export default NutritionSummaryRow; 