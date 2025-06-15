import React, { useState } from "react";
import { Meal } from "@/types/meals/mealTypes";
import { Dialog, DialogContent } from "@mui/material";
import { X, Flame, Dumbbell, Cookie, Wheat, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { calculateTotalNutrition } from "@/utils/nutrientCalculations";
import { Ingredient as ImageAnalyzeIngredient, NutritionData } from "@/types/imageAnalyizeTypes";
import { Ingredient as MealIngredient } from "@/types/meals/mealTypes";
import { CustomToastPromise } from "@/components/CustomToastPromise.tsx";
import { deleteMeal } from "@/services/mealService";

interface MealDetailsModalProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onMealDeleted?: () => void;
}

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

export const MealDetailsModal: React.FC<MealDetailsModalProps> = ({ meal, isOpen, onClose, onMealDeleted }) => {
  const [expandedIngredients, setExpandedIngredients] = useState<{ [key: string]: boolean }>({});

  if (!meal) return null;

  const convertedIngredients = meal.ingredients.map(convertToImageAnalyzeIngredient);
  const totalNutrition = calculateTotalNutrition(convertedIngredients);

  const handleDeleteMeal = async () => {
    const apiPromise = deleteMeal(meal.id).then(response => {
      if (response.success) {
        onMealDeleted?.();
        onClose();
      }
      return response;
    });

    CustomToastPromise(
      apiPromise,
      {
        loadingMessage: "Deleting meal...",
        successMessage: "Meal was successfully deleted!",
        errorMessage: "Failed to delete meal, Please try again",
      }
    );
  };

  const toggleIngredient = (index: number) => {
    setExpandedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">{meal.name}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteMeal}
              className="text-gray-500 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Meal Image */}
        {meal.imageUrl && (
          <div className="mb-6">
            <img
              src={meal.imageUrl}
              alt={meal.name}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Total Nutrition Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-gray-700">Calories</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {Math.round(totalNutrition.calories)} kcal
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="w-4 h-4 text-rose-600" />
                <span className="font-medium text-gray-700">Protein</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {Math.round(totalNutrition.protein)}g
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <Cookie className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700">Fat</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {Math.round(totalNutrition.totalFat)}g
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <Wheat className="w-4 h-4 text-amber-600" />
                <span className="font-medium text-gray-700">Carbs</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {Math.round(totalNutrition.totalCarbohydrates)}g
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Ingredients</h3>
          <div className="space-y-2">
            {meal.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div 
                  className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleIngredient(index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-800">{ingredient.name}</div>
                      <div className="text-sm text-gray-500">{ingredient.weight}g</div>
                    </div>
                    {expandedIngredients[index] ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Per 100g Nutrition */}
                {expandedIngredients[index] && ingredient.nutrition?.per100g && (
                  <div className="grid grid-cols-4 gap-2 p-3 pt-0 text-sm border-t border-gray-100">
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Calories</div>
                      <div className="font-medium text-orange-600">
                        {Math.round((ingredient.nutrition.per100g.calories?.value || 0))} kcal
                      </div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Protein</div>
                      <div className="font-medium text-rose-600">
                        {ingredient.nutrition.per100g.protein?.value?.toFixed(1)}g
                      </div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Carbs</div>
                      <div className="font-medium text-amber-600">
                        {ingredient.nutrition.per100g.totalCarbohydrates?.value?.toFixed(1)}g
                      </div>
                    </div>
                    <div className="bg-white rounded p-2">
                      <div className="text-gray-500">Fat</div>
                      <div className="font-medium text-blue-600">
                        {ingredient.nutrition.per100g.totalFat?.value?.toFixed(1)}g
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 