import { DailyNutritionOverview } from "@/components/result-page/DailyNutritionOverview";
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

interface MealAnalysis {
  grade: string;
  score: number;
  recommendations: string[];
  positiveFeedback: string;
  dailyRecommendations?: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    fiber: number;
    micronutrients?: {
      vitamin_a: number;
      vitamin_c: number;
      vitamin_d: number;
      vitamin_b12: number;
      calcium: number;
      iron: number;
      magnesium: number;
    };
  };
}

export default function ResultsPage() {
  useScrollLock();
  const location = useLocation();
  const {
    name,
    image,
    ingredients: mealIngredients,
    analysis,
  } = location.state || {};
  const [servingSize, setServingSize] = useState(1);
  const navigate = useNavigate();

  // Default values if no analysis is provided
  const mealAnalysis: MealAnalysis = analysis || {
    grade: "B",
    score: 75,
    recommendations: [],
    positiveFeedback: "Your meal appears to be well-balanced.",
  };

  const totalNutrition = calculateTotalNutrition(mealIngredients || []);
  const adjustedNutrition = adjustNutritionForServing(
    totalNutrition,
    servingSize
  );

  const handleLogAndNavigate = async () => {
    if (!mealIngredients || !name) {
      // Handle case where ingredients or name are not available
      return;
    }

    const ingredients = mealIngredients.map((ing) => ({
      name: ing.name,
      weight: ing.weight * servingSize, // Adjust weight by serving size
      nutrition: {
        per100g: {
          calories:
            (adjustedNutrition.calories /
              (adjustedNutrition.totalWeight * servingSize)) *
            100,
          protein:
            (adjustedNutrition.protein /
              (adjustedNutrition.totalWeight * servingSize)) *
            100,
          totalFat:
            (adjustedNutrition.totalFat /
              (adjustedNutrition.totalWeight * servingSize)) *
            100,
          totalCarbohydrates:
            (adjustedNutrition.totalCarbohydrates /
              (adjustedNutrition.totalWeight * servingSize)) *
            100,
          fiber:
            (adjustedNutrition.fiber /
              (adjustedNutrition.totalWeight * servingSize)) *
            100,
          ...Object.entries(vitaminAndMinerals).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]:
                (value / (adjustedNutrition.totalWeight * servingSize)) * 100,
            }),
            {}
          ),
        },
      },
    }));

    await logMealToBackend(name, ingredients, image);
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

            {mealAnalysis.dailyRecommendations && (
              <DailyNutritionOverview
                adjustedNutrition={adjustedNutrition}
                dailyRecommendations={mealAnalysis.dailyRecommendations}
              />
            )}

            {/* Use our updated NutritionGrade component with the analysis data */}
            <NutritionGrade
              grade={mealAnalysis.grade}
              score={mealAnalysis.score}
              recommendations={mealAnalysis.recommendations}
              positiveFeedback={mealAnalysis.positiveFeedback}
            />

            {/* Display daily recommendations if available */}

            <Button
              onClick={handleLogAndNavigate}
              className="w-full mt-4 mb-[10%]"
            >
              Log Meal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
