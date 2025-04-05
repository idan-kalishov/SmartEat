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

  // All initial ingredients are editable (isNew = true)
  const initialIngredients = transferObject.foodRecognitionResponse.map(
    (item) => ({
      name: item.foodName,
      weight: `${item.weight}`,
      isNew: true,
    })
  );

  const [ingredients, setIngredients] =
    useState<{ name: string; weight: string; isNew: boolean }[]>(
      initialIngredients
    );

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", weight: "", isNew: true }]);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const updateIngredient = (
    index: number,
    field: keyof { name: string; weight: string },
    value: string
  ) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const saveIngredients = async () => {
    try {
      await fetch("/api/update-ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: mealName,
          image: mealImage,
          ingredients: ingredients.map(({ name, weight }) => ({
            name,
            weight,
          })),
        }),
      });
      alert("Ingredients saved successfully!");
      navigate("/results", {
        state: { name: mealName, image: mealImage, ingredients },
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
