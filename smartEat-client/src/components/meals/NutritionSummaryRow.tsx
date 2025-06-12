import React from "react";

interface NutritionSummaryRowProps {
  calories: number;
  protein: string | number;
  fat: string | number;
  carbs: string | number;
  className?: string;
  icons?: {
    calories?: React.ReactNode;
    protein?: React.ReactNode;
    fat?: React.ReactNode;
    carbs?: React.ReactNode;
  };
}

const NutritionSummaryRow: React.FC<NutritionSummaryRowProps> = ({
  calories,
  protein,
  fat,
  carbs,
  className = "",
  icons
}) => {
  const items = [
    { label: "cal", value: calories, icon: icons?.calories },
    { label: "p", value: protein, icon: icons?.protein },
    { label: "f", value: fat, icon: icons?.fat },
    { label: "c", value: carbs, icon: icons?.carbs }
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {item.icon && (
            <span className="text-gray-500">{item.icon}</span>
          )}
          <span className="text-sm">
            <span className="font-medium text-gray-900">{item.value}</span>
            <span className="text-gray-500 ml-0.5">{item.label}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default NutritionSummaryRow; 