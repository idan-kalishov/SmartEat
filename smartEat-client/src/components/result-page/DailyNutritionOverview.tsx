import React from "react";
import { Progress } from "@/components/ui/progress";
import { Smile, Leaf, Coffee } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DailyNutritionOverviewProps {
  adjustedNutrition: {
    calories: number;
    totalFat: number;
    totalCarbohydrates: number;
    protein: number;
  };
  dailyRecommendations: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export const DailyNutritionOverview: React.FC<DailyNutritionOverviewProps> = ({
  adjustedNutrition,
  dailyRecommendations,
}) => {
  const getPercentage = (value: number, total: number) =>
    total > 0 ? Math.min((value / total) * 100, 100) : 0;

  const nutritionItems = [
    {
      label: "Calories",
      value: adjustedNutrition.calories,
      total: dailyRecommendations.calories,
      unit: "kcal",
      icon: <Coffee className="text-orange-500 h-4 w-4" />,
    },
    {
      label: "Protein",
      value: adjustedNutrition.protein,
      total: dailyRecommendations.protein,
      unit: "g",
      icon: <Leaf className="text-green-500 h-4 w-4" />,
    },
    {
      label: "Carbs",
      value: adjustedNutrition.totalCarbohydrates,
      total: dailyRecommendations.carbs,
      unit: "g",
      icon: <Smile className="text-blue-500 h-4 w-4" />,
    },
    {
      label: "Fats",
      value: adjustedNutrition.totalFat,
      total: dailyRecommendations.fats,
      unit: "g",
      icon: <Leaf className="text-yellow-500 h-4 w-4" />,
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem
        value="macros"
        className="border-t border-gray-200 first:border-t-0"
      >
        <AccordionTrigger className="hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-500 h-5 w-5 transition-transform duration-200" />
            <span className="text-lg font-medium text-gray-800">
              Nutrition Overview
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {nutritionItems.map(({ label, value, total, unit, icon }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center space-y-1"
              >
                <div className="flex items-center gap-1 text-sm font-medium">
                  {icon}
                  <span>{label}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {value.toFixed(0)}/{total.toFixed(0)}
                  {unit}
                </div>
                <Progress
                  value={getPercentage(value, total)}
                  className="w-full h-2 rounded-full bg-gray-200"
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
