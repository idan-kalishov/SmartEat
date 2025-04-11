import { NutrientCircle } from "@/components/result-page/NutrientCircle";
import { NutritionGrade } from "@/components/result-page/NutritionGrade";
import { NutritionSummary } from "@/components/result-page/NutritionSummary";
import { ResultsHeader } from "@/components/result-page/ResultHeader";
import VitaminAndMinerals from "@/components/result-page/VitaminAndMinerals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useScrollLock from "@/hooks/useScrollLock";
import { logMealToBackend } from "@/services/mealSavingService";
import {
  adjustNutritionForServing,
  calculateTotalNutrition,
} from "@/utils/nutrientCalculations";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const vitaminAndMineralKeys = [
  "iron",
  "vitaminA",
  "vitaminC",
  "vitaminD",
  "vitaminB12",
  "calcium",
  "magnesium",
] as const;

export default function ResultsPage() {
  useScrollLock();

  const location = useLocation();
  const { name, image, ingredients } = location.state || {};
  const [servingSize, setServingSize] = useState(1);
  const navigate = useNavigate();

  const totalNutrition = calculateTotalNutrition(ingredients || []);
  const adjustedNutrition = adjustNutritionForServing(
    totalNutrition,
    servingSize
  );

  const handleLogAndNavigate = () => {
    logMealToBackend(name, servingSize, adjustedNutrition);
    navigate("/");
  };

  const adjustServingSize = (change: number) => {
    const newServingSize = Math.max(0.5, servingSize + change);
    setServingSize(newServingSize);
  };

  const vitaminAndMinerals = vitaminAndMineralKeys.reduce((acc, key) => {
    const value = adjustedNutrition[key];
    if (value != null && typeof value === "number") {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      <ResultsHeader
        name={name}
        image={image}
        onBack={() => window.history.back()}
      />

      <div className="max-w-md mx-auto relative">
        <Card className="z-10 relative shadow-lg mt-[-20px]">
          <CardContent className="pt-6 pb-2 max-h-[calc(100dvh-120px)] overflow-y-auto">
            <NutritionSummary
              calories={adjustedNutrition.calories}
              servingSize={servingSize}
              onServingSizeChange={adjustServingSize}
            />

            <div className="grid grid-cols-2 gap-6 mb-4">
              <NutrientCircle
                label="Carbs"
                value={adjustedNutrition.totalCarbohydrates}
                color="#facc15"
                totalWeight={adjustedNutrition.totalWeight}
              />
              <NutrientCircle
                label="Protein"
                value={adjustedNutrition.protein}
                color="#f87171"
                totalWeight={adjustedNutrition.totalWeight}
              />
              <NutrientCircle
                label="Fat"
                value={adjustedNutrition.totalFat}
                color="#60a5fa"
                totalWeight={adjustedNutrition.totalWeight}
              />
              <NutrientCircle
                label="Fibre"
                value={adjustedNutrition.fiber}
                color="#4ade80"
                totalWeight={adjustedNutrition.totalWeight}
              />
            </div>

            <VitaminAndMinerals nutrients={vitaminAndMinerals} />
            <NutritionGrade />

            <Button onClick={handleLogAndNavigate} className="w-full mt-4 mb-4">
              Log Meal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
