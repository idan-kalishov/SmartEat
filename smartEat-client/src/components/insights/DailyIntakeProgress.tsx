import React from "react";
import { Flame, Dumbbell, Cookie, Wheat } from "lucide-react";

interface NutrientProgress {
  current: number;
  target: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const DailyIntakeProgress: React.FC = () => {
  // Mock data - replace with real data later
  const nutrients: NutrientProgress[] = [
    {
      current: 1850,
      target: 2500,
      label: "Calories",
      icon: Flame,
      color: "from-orange-500 to-red-500"
    },
    {
      current: 65,
      target: 80,
      label: "Protein",
      icon: Dumbbell,
      color: "from-rose-500 to-red-500"
    },
    {
      current: 45,
      target: 65,
      label: "Fat",
      icon: Cookie,
      color: "from-blue-500 to-indigo-500"
    },
    {
      current: 220,
      target: 300,
      label: "Carbs",
      icon: Wheat,
      color: "from-amber-500 to-yellow-600"
    }
  ];

  const getProgressPercentage = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const formatValue = (value: number, label: string) => {
    if (label === "Calories") return value.toLocaleString();
    return value + "g";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Daily Progress</h3>
        <span className="text-sm text-gray-500">Today</span>
      </div>

      <div className="grid gap-3">
        {nutrients.map((nutrient, index) => {
          const progress = getProgressPercentage(nutrient.current, nutrient.target);
          
          return (
            <div key={index} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${nutrient.color} bg-opacity-10`}>
                    <nutrient.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">{nutrient.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatValue(nutrient.current, nutrient.label)}
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
                <span className="text-xs font-medium" style={{ color: progress > 100 ? '#ef4444' : '#6b7280' }}>
                  {progress > 100 ? 'Exceeded' : `${Math.round(progress)}%`}
                </span>
                <span className="text-xs text-gray-500">
                  {formatValue(nutrient.target - nutrient.current, nutrient.label)} remaining
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