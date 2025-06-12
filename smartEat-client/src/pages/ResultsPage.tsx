import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Meal } from "@/types/meals/mealTypes";
import { calculateTotalNutrition } from "@/utils/nutrientCalculations";
import { Ingredient as ImageAnalyzeIngredient, NutritionData } from "@/types/imageAnalyizeTypes";
import { Ingredient as MealIngredient } from "@/types/meals/mealTypes";
import { ROUTES } from "@/Routing/routes";
import MealCard from "@/components/meals/MealCard";

const createEmptyNutritionData = (): NutritionData => ({
  calories: { value: 0, unit: "KCAL" },
  totalFat: { value: 0, unit: "G" },
  totalCarbohydrates: { value: 0, unit: "G" },
  sugars: { value: 0, unit: "G" },
  protein: { value: 0, unit: "G" },
  iron: { value: 0, unit: "MG" },
  fiber: { value: 0, unit: "G" },
  vitaminA: { value: 0, unit: "MCG" },
  vitaminC: { value: 0, unit: "MG" },
  vitaminD: { value: 0, unit: "MCG" },
  vitaminB12: { value: 0, unit: "MCG" },
  calcium: { value: 0, unit: "MG" },
  magnesium: { value: 0, unit: "MG" }
});

const convertToImageAnalyzeIngredient = (ingredient: MealIngredient): ImageAnalyzeIngredient => {
  const nutritionData = createEmptyNutritionData();
  
  // Map the per100g nutrition data to the required structure
  if (ingredient.nutrition?.per100g) {
    Object.entries(ingredient.nutrition.per100g).forEach(([key, nutrient]) => {
      const normalizedKey = key.toLowerCase();
      if (normalizedKey in nutritionData) {
        nutritionData[normalizedKey as keyof NutritionData] = {
          value: nutrient.value || 0,
          unit: nutrient.unit
        };
      }
    });
  }

  return {
    name: ingredient.name,
    weight: ingredient.weight.toString(),
    nutrition: { per100g: nutritionData }
  };
};

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const mealData = location.state?.meal;
    if (mealData) {
      setMeal(mealData);
    }
  }, [location.state]);

  const handleMealDeleted = () => {
    navigate(ROUTES.HOME);
  };

  if (!meal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Meal Data Found</h2>
          <p className="text-gray-600">Please try again or go back to the home page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <MealCard
          meal={meal}
          onMealDeleted={handleMealDeleted}
          onClick={() => {}} // Prevent default click behavior
        />
      </div>
    </div>
  );
};

export default ResultsPage;
