import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FoodVerifyTransferObject } from "../components/image-captch/CameraWithFrameAndLoading";
import { ArrowLeft, Trash2, Plus } from "lucide-react";

const IngredientVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transferObject: FoodVerifyTransferObject = location.state;

  if (!transferObject) {
    alert("No meal data found. Please try again.");
    navigate("/");
    return null;
  }

  // Meal name state — now editable
  const [mealName, setMealName] = useState(
    transferObject.foodRecognitionResponse[0]?.foodName || "Unknown Meal"
  );
  const mealImage = transferObject.image;

  // All initial ingredients are editable (isNew = false)
  const initialIngredients = transferObject.foodRecognitionResponse.map(
    (item) => ({
      name: item.foodName,
      weight: `${item.weight}`,
      isNew: false,
      nutrition: item.nutrition.per100g, // Include nutrition data for existing ingredients
    })
  );

  const [ingredients, setIngredients] =
    useState<
      { name: string; weight: string; isNew: boolean; nutrition?: any }[]
    >(initialIngredients);

  // Add a new ingredient
  const addIngredient = () => {
    const newIngredient = { name: "", weight: "", isNew: true };
    setIngredients([...ingredients, newIngredient]);
  };

  // Remove an ingredient
  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  // Update an ingredient's field
  const updateIngredient = (
    index: number,
    field: keyof { name: string; weight: string },
    value: string
  ) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  // Save all ingredients
  const saveIngredients = async () => {
    try {
      // Separate new ingredients from existing ones
      const newIngredients = ingredients.filter(
        (ingredient) => ingredient.isNew
      );

      // Validate that all new ingredients have names
      const hasInvalidNewIngredients = newIngredients.some(
        (ingredient) => !ingredient.name.trim()
      );
      if (hasInvalidNewIngredients) {
        alert("Please provide valid names for all new ingredients.");
        return;
      }

      // Fetch nutritional data for all new ingredients
      const newIngredientNames = newIngredients.map(
        (ingredient) => ingredient.name
      );
      const response = await fetch("/api/ingredient-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names: newIngredientNames }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch nutritional data for new ingredients."
        );
      }

      const fetchedNutritionData = await response.json(); // Array of { name, nutrition }

      // Merge fetched nutritional data with existing ingredients
      const updatedIngredients = ingredients.map((ingredient) => {
        if (ingredient.isNew) {
          const matchedNutrition = fetchedNutritionData.find(
            (data: { name: string }) => data.name === ingredient.name
          );
          return {
            ...ingredient,
            nutrition: matchedNutrition?.nutrition.per100g,
            isNew: false, // Mark as no longer new
          };
        }
        return ingredient;
      });

      // Save the complete data to the server
      await fetch("/api/update-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mealName,
          image: mealImage,
          ingredients: updatedIngredients.map(
            ({ name, weight, nutrition }) => ({
              name,
              weight,
              nutrition,
            })
          ),
        }),
      });

      alert("Ingredients saved successfully!");
      navigate("/results", {
        state: {
          name: mealName,
          image: mealImage,
          ingredients: updatedIngredients,
        },
      });
    } catch (error) {
      console.error("Error saving ingredients:", error);
      alert("Failed to save ingredients.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white px-4 py-6 overflow-hidden">
      {/* Header */}
      <div className="relative mb-4 flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 ml-2 p-0 focus:outline-none"
        >
          <ArrowLeft className="text-gray-700 w-5 h-5" />
        </button>
        <p className="text-2xl font-semibold text-gray-800">Meal Summary</p>
      </div>

      {/* Meal Image */}
      <div className="flex justify-center mb-4">
        <img
          src={mealImage}
          alt={`${mealName} image`}
          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-md"
        />
      </div>

      {/* Editable Meal Name */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 mb-1 block">Meal title:</label>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          className="px-4 py-2 w-full border border-green-300 bg-white rounded-xl focus:outline-none"
        />
      </div>

      {/* Ingredients */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 mb-2 block">Ingredients</label>
        <p className="text-sm text-gray-400 mb-4">
          You can modify the ingredients as needed.
        </p>

        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3 mb-3 shadow-sm"
          >
            {/* Name - editable if isNew */}
            <div className="flex-1 min-w-0 mr-2 text-gray-800 truncate">
              {ingredient.isNew ? (
                <input
                  type="text"
                  value={ingredient.name}
                  placeholder="Enter ingredient name"
                  onChange={(e) =>
                    updateIngredient(index, "name", e.target.value)
                  }
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                />
              ) : (
                ingredient.name
              )}
            </div>

            {/* Weight - always editable */}
            <div className="flex items-center w-24 justify-end mr-2 relative">
              <input
                type="number"
                value={ingredient.weight}
                onChange={(e) =>
                  updateIngredient(index, "weight", e.target.value)
                }
                className="w-full text-right bg-transparent focus:outline-none pr-4 text-gray-600"
              />
              <span className="absolute right-2 text-sm text-gray-500 pointer-events-none">
                g
              </span>
            </div>

            {/* Delete */}
            <button onClick={() => removeIngredient(index)}>
              <Trash2 className="text-red-400 hover:text-red-600 w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Add More Button */}
        <button
          onClick={addIngredient}
          className="flex items-center justify-center w-full border border-gray-300 bg-white text-gray-600 py-2 rounded-xl hover:bg-gray-100 transition"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add more ingredients
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={saveIngredients}
        className="w-[50%] bg-green-500 text-white py-3 ml-[25%] rounded-xl font-medium hover:bg-green-600 transition"
      >
        Save and Continue
      </button>
    </div>
  );
};

export default IngredientVerificationPage;
