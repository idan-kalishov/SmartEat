import { OptionCardProps } from "@/types/preferencesTypes";
import React from "react";

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="text-2xl mr-4">{option.emoji}</div>
      <div>
        <div className="font-medium">{option.label}</div>
        {option.description && (
          <div className="text-sm text-gray-500">{option.description}</div>
        )}
      </div>
    </div>
  );
};

export default OptionCard;
