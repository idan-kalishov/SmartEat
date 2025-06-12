import React from "react";
import { Meal } from "@/types/meals/mealTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { calculateTotalNutrition } from "@/utils/nutrientCalculations";
import { Ingredient as ImageAnalyzeIngredient } from "@/types/imageAnalyizeTypes";
import { Ingredient as MealIngredient } from "@/types/meals/mealTypes";
import { NutritionGrade } from "@/components/result-page/NutrientCircle";
import { VitaminAndMinerals } from "@/components/result-page/VitaminAndMinerals";

interface MealDetailsProps {
  meal: Meal;
  onDelete: (mealId: string) => void;
}

const convertToImageAnalyzeIngredient = (ingredient: MealIngredient): ImageAnalyzeIngredient => ({
  name: ingredient.name,
  weight: ingredient.weight.toString(),
  nutrition: ingredient.nutrition || { per100g: {} }
});

export const MealDetails: React.FC<MealDetailsProps> = ({ meal, onDelete }) => {
  const convertedIngredients = meal.ingredients.map(convertToImageAnalyzeIngredient);
  const nutrition = calculateTotalNutrition(convertedIngredients);

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        {/* Header with image and basic info */}
        <div className="flex gap-4 mb-6">
          {meal.image ? (
            <img
              src={meal.image}
              alt={meal.name}
              className="w-24 h-24 rounded-lg object-cover shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-800">{meal.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(meal.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{new Date(meal.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="text-sm text-emerald-600 font-medium">Calories</div>
            <div className="text-2xl font-bold text-emerald-700">
              {Math.round(nutrition.calories)} kcal
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-600 font-medium">Protein</div>
            <div className="text-2xl font-bold text-blue-700">
              {Math.round(nutrition.protein)}g
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h3>
          <div className="space-y-3">
            {meal.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-800">{ingredient.name}</div>
                  <div className="text-sm text-gray-500">{ingredient.weight}g</div>
                </div>
                {ingredient.nutrition?.per100g && (
                  <div className="text-sm text-gray-600">
                    {Math.round((ingredient.nutrition.per100g.calories?.value || 0) * ingredient.weight / 100)} kcal
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Nutrition */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Nutrition Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 font-medium">Carbs</div>
              <div className="text-xl font-bold text-gray-800">
                {Math.round(nutrition.totalCarbohydrates)}g
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 font-medium">Fat</div>
              <div className="text-xl font-bold text-gray-800">
                {Math.round(nutrition.totalFat)}g
              </div>
            </div>
          </div>
        </div>

        {/* Vitamins and Minerals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Vitamins & Minerals</h3>
          <VitaminAndMinerals nutrients={nutrition} />
        </div>
      </CardContent>
    </Card>
  );
}; 