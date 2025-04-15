import React from "react";
import { AllergyOptionProps } from "../../types/preferencesTypes";

const AllergyOption: React.FC<AllergyOptionProps> = ({
  option,
  isSelected,
  onClick,
  isGridItem = false,
  disabled = false,
}) => {
  const baseClasses = `rounded-xl border cursor-pointer transition-all ${
    isSelected
      ? "border-green-500 bg-green-50"
      : "border-gray-200 hover:border-gray-300"
  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;

  if (isGridItem) {
    return (
      <div
        onClick={!disabled ? onClick : undefined}
        className={`flex flex-col items-center justify-center p-3 rounded-lg ${baseClasses}`}
      >
        <div className="text-2xl mb-1">{option.emoji}</div>
        <div className="text-sm text-center">{option.label}</div>
      </div>
    );
  }

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center p-4 mb-4 ${baseClasses}`}
    >
      <div className="text-2xl mr-4">{option.emoji}</div>
      <div className="flex-1">{option.label}</div>
    </div>
  );
};

export default AllergyOption;
