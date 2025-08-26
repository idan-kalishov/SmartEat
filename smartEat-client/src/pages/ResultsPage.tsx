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
          calories: ing.nutrition.per100g.calories?.value ?? 0,
          protein: ing.nutrition.per100g.protein?.value ?? 0,
          totalFat: ing.nutrition.per100g.totalFat?.value ?? 0,
          totalCarbohydrates: ing.nutrition.per100g.totalCarbohydrates?.value ?? 0,
          fiber: ing.nutrition.per100g.fiber?.value ?? 0,
          sugars: ing.nutrition.per100g.sugars?.value ?? 0,
          iron: ing.nutrition.per100g.iron?.value ?? 0,
          vitaminA: ing.nutrition.per100g.vitaminA?.value ?? 0,
          vitaminC: ing.nutrition.per100g.vitaminC?.value ?? 0,
          vitaminD: ing.nutrition.per100g.vitaminD?.value ?? 0,
          vitaminB12: ing.nutrition.per100g.vitaminB12?.value ?? 0,
          calcium: ing.nutrition.per100g.calcium?.value ?? 0,
          magnesium: ing.nutrition.per100g.magnesium?.value ?? 0,
        }
      }
    }));

    await logMealToBackend(name, ingredients, image);
    navigate("/home");
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <ResultsHeader
        name={name}
        image={image}
        onBack={() => window.history.back()}
      />

      <div className="max-w-md mx-auto relative h-[calc(100vh-12rem)]">
        <Card className="z-10 relative shadow-lg mt-[-20px] h-full">
          <CardContent className="pt-6 pb-2 h-full overflow-y-auto">
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

            <Button onClick={handleLogAndNavigate} className="w-full mt-4 mb-4">
              Log Meal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
