import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@mui/material";
import { useLocation } from "react-router-dom";
import VitaminAndMinerals from "./VitaminAndMinerals";
import {
  Ingredient,
  NutritionData,
  vitaminAndMineralKeys,
} from "@/types/imageAnalyizeTypes";

const getNutritionValue = (value: number | null) => {
  return value !== null ? value.toFixed(0) : "-";
};

const nutritionKeyMap: { [K in keyof NutritionData]: string } = {
  calories: "Calories",
  totalFat: "Fat",
  totalCarbohydrates: "Carbs",
  sugars: "Sugars",
  protein: "Protein",
  fiber: "Fiber",
  iron: "Iron",
  vitaminA: "Vitamin A",
  vitaminC: "Vitamin C",
  vitaminD: "Vitamin D",
  vitaminB12: "Vitamin B12",
  calcium: "Calcium",
  magnesium: "Magnesium",
};

const nutrientKeys = Object.keys(nutritionKeyMap) as (keyof NutritionData)[];

const NutrientCircle = ({
  label,
  value,
  color,
  totalWeight,
}: {
  label: string;
  value: number | null;
  color: string;
  totalWeight: number;
}) => {
  const percentage =
    value && totalWeight ? Math.min((value / totalWeight) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={80}
          thickness={5}
          style={{ color }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {getNutritionValue(value)}g
        </div>
      </div>
      <span className="mt-1 text-sm">{label}</span>
    </div>
  );
};

export default function ResultsPage() {
  const location = useLocation();
  const { name, image, ingredients } = location.state || {};

  // State to track the current serving size
  const [servingSize, setServingSize] = useState(1);

  // Calculate total nutrition values for 1 serving
  const baseNutrition = nutrientKeys.reduce(
    (acc, key) => {
      acc[key] = 0;
      return acc;
    },
    { totalWeight: 0 } as Record<keyof NutritionData, number> & {
      totalWeight: number;
    }
  );
  console.log(ingredients);
  const totalNutrition = ingredients?.reduce(
    (acc: any, ingredient: Ingredient) => {
      const weight = parseFloat(ingredient.weight) || 0;
      const factor = weight / 100;
      const data = ingredient.nutrition.per100g;

      acc.totalWeight += weight;
      nutrientKeys.forEach((key) => {
        acc[key] += (data[key]?.value || 0) * factor;
      });

      return acc;
    },
    baseNutrition
  );

  const adjustedNutrition = {
    ...totalNutrition,
    ...nutrientKeys.reduce((acc, key) => {
      acc[key] = totalNutrition?.[key] * servingSize;
      return acc;
    }, {} as Record<keyof NutritionData, number>),
    totalWeight: totalNutrition?.totalWeight * servingSize,
  };

  const adjustServingSize = (change: number) => {
    const newServingSize = Math.max(0.5, servingSize + change);
    setServingSize(newServingSize);
  };

  const vitaminAndMinerals = vitaminAndMineralKeys.reduce((acc, key) => {
    const value = adjustedNutrition?.[key];
    if (value != null && typeof value === "number") {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-100">
      <div
        className="h-60 bg-cover bg-center relative"
        style={{ backgroundImage: `${image}` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end px-4 py-3">
          <h1 className="text-white text-2xl font-bold">{name}</h1>
        </div>
      </div>

      <Card className="max-w-md mx-auto mt-[-40px] z-10 relative shadow-lg">
        <CardContent className="pt-6 pb-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Total Calories</h2>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-20 border rounded px-2 py-1"
                value={getNutritionValue(adjustedNutrition?.calories)}
                readOnly
              />
              <span className="text-sm">cal</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span>Servings</span>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                onClick={() => adjustServingSize(-0.5)} // Decrease by 0.5
              >
                -
              </Button>
              <span>{servingSize}</span>
              <Button
                variant="outline"
                onClick={() => adjustServingSize(0.5)} // Increase by 0.5
              >
                +
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <NutrientCircle
              label="Carbs"
              value={adjustedNutrition?.totalCarbohydrates}
              color="#facc15"
              totalWeight={adjustedNutrition?.totalWeight}
            />
            <NutrientCircle
              label="Protein"
              value={adjustedNutrition?.protein}
              color="#f87171"
              totalWeight={adjustedNutrition?.totalWeight}
            />
            <NutrientCircle
              label="Fat"
              value={adjustedNutrition?.totalFat}
              color="#60a5fa"
              totalWeight={adjustedNutrition?.totalWeight}
            />
            <NutrientCircle
              label="Fibre"
              value={adjustedNutrition?.fiber}
              color="#4ade80"
              totalWeight={adjustedNutrition?.totalWeight}
            />
          </div>
          <VitaminAndMinerals nutrients={vitaminAndMinerals} />
          <div className="bg-yellow-100 rounded-lg p-3 text-sm mt-4">
            <div className="font-semibold">Nutrition Grade: B</div>
            <div>
              Nice work! Your meal is quite nutritious and well-balanced.
            </div>
          </div>

          <Button className="w-full mt-4">Log Meal</Button>
        </CardContent>
      </Card>
    </div>
  );
}
