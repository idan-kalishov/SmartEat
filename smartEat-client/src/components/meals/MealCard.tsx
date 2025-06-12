import { CustomeToastPromise } from "@/components/CustomeToastPromise";
import { deleteMeal } from "@/services/mealService";
import { Meal } from "@/types/meals/mealTypes";
import React, { useState } from "react";
import IngredientNutritionRow from "./IngredientNutritionRow";
import MealNutritionSummary from "./MealNutritionSummary";
import MenuActionButton from "./MenuActionButton";

interface MealCardProps {
  meal: Meal;
  // Optional handler for clicking the main part of the card
  // If provided, it overrides the default expand/collapse behavior
  onClick?: (meal: Meal) => void;
  // Indicates if the card is being used in a smaller preview context
  isPreview?: boolean;
  // Optional callback to refresh meals list after deletion
  onMealDeleted?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onClick, isPreview, onMealDeleted }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Expanded state is only used if not in preview mode
  const [expanded, setExpanded] = useState(false);

  // Use provided onClick if available, otherwise use internal expand/collapse (only if not in preview)
  const handleCardClick = onClick ? () => onClick(meal) : (isPreview ? () => { } : () => setExpanded(!expanded));

  const handleEditMeal = (meal: Meal) => {
    alert(`Edit meal: ${meal.id}`);
  };

  const handleDeleteMeal = async (meal: Meal) => {
    // Create the API promise first
    const apiPromise = deleteMeal(meal.id).then(response => {
      if (response.success) {
        // Call the callback to refresh the meals list
        onMealDeleted?.();
      }
      return response;
    });

    CustomeToastPromise(
      apiPromise,
      {
        loadingMessage: "Deleting meal...",
        successMessage: "Meal was successfully deleted!",
        errorMessage: "Failed to delete meal, Please try again",
      }
    );
  };

  // Close menu when clicking outside (simple approach)
  // You might want a more robust solution for production
  React.useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Prevent click from propagating to the parent div when clicking the menu button
  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    // Adjust padding and layout based on isPreview prop
    <div className={`bg-gray-50 rounded-lg shadow relative w-full max-w-full box-border overflow-hidden ${isPreview ? 'py-2' : 'p-4'}`}>
      {/* Meal Image (top, full width) - only show if imageUrl exists */}
      {meal.imageUrl && (
        <img
          src={meal.imageUrl}
          alt="Meal"
          className="w-full h-32 object-cover rounded-t-lg"
          onError={(e) => {
            // Hide the image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      {/* Meal Content (name, summary, etc.) */}
      <div
        className={`flex flex-col items-start space-y-2 w-full px-2 pt-2 pb-1 cursor-pointer ${onClick && !isPreview ? '' : ''}`}
        onClick={handleCardClick}
      >
        {/* Meal name and ellipsis button in a row */}
        <div className="w-full flex flex-row items-center justify-between">
          <div className="font-bold text-green-700 text-lg">
            {meal.name}
          </div>
          {/* Only show menu if not in preview mode */}
          {!isPreview && (
            <div className="relative z-10 ml-2" onClick={(e) => e.stopPropagation()}>
              <button
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none transition duration-150 hover:bg-gray-200 active:scale-90 focus-visible:ring focus-visible:ring-green-300"
                onClick={handleMenuButtonClick}
                type="button"
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>⋯</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg py-1">
                  <MenuActionButton
                    onClick={() => { setMenuOpen(false); handleEditMeal(meal); }}
                  >
                    Edit
                  </MenuActionButton>
                  <MenuActionButton
                    onClick={() => { setMenuOpen(false); handleDeleteMeal(meal); }}
                    colorClass="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </MenuActionButton>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Only show time if not in preview mode */}
        {!isPreview && (
          <div className="text-xs text-gray-500 mb-1">
            {new Date(meal.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
        <MealNutritionSummary meal={meal} />
      </div>

      {/* Ingredient List (expandable) */}
      {((expanded && !isPreview) || (isPreview && meal.ingredients.length > 0)) && meal.ingredients.length > 0 && (
        <div className={`pt-2 border-t border-gray-200 w-full bg-gray-50 ${isPreview ? 'block mt-3 px-2' : 'block'}`}>
          {meal.ingredients.map((ingredient, idx) => (
            <IngredientNutritionRow key={idx} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MealCard; 