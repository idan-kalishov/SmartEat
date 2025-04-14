import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { FoodVerifyTransferObject } from "../components/image-captch/CameraWithFrameAndLoading";
import { mergeNutritionData } from "../utils/ingredientUtils";
import {
  fetchNutritionalDataForIngredients,
  transformIngredientsForResults,
} from "../utils/mealAnalysisApi";
import LoadingScreen from "./loading/LoadingScreen";
import { Ingredient, TransformedIngredient } from "../types/imageAnalyizeTypes";
import { getDefaultUserProfile } from "../types/userTypes";
import { analyzeMeal } from "@/services/mealReatingService";

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
      nutrition: {
        per100g: item.nutrition.per100g,
      },
    })
  );

  const [ingredients, setIngredients] =
    useState<
      { name: string; weight: string; isNew: boolean; nutrition?: any }[]
    >(initialIngredients);

  // State for loading screen
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Saving...");

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
    // Separate ingredients that need nutritional data
    const ingredientsWithoutNutrition = ingredients.filter(
      (ingredient) => !ingredient.nutrition
    );

    setLoading(true);
    setLoadingMessage("Processing ingredients...");

    try {
      // Check if there are any ingredients without nutritional data
      if (ingredientsWithoutNutrition.length > 0) {
        // Validate that all ingredients have names
        const hasInvalidIngredients = ingredientsWithoutNutrition.some(
          (ingredient) => !ingredient.name.trim()
        );
        if (hasInvalidIngredients) {
          setLoading(false);
          alert("Please provide valid names for all ingredients.");
          return;
        }

        // Fetch nutritional data for ingredients without it
        const ingredientNames = ingredientsWithoutNutrition.map(
          (ingredient) => ingredient.name
        );
        const fetchedNutritionData = await fetchNutritionalDataForIngredients(
          ingredientNames
        );
        // Merge fetched nutritional data with existing ingredients
        const updatedIngredients = mergeNutritionData(
          ingredients,
          fetchedNutritionData
        );
        // Transform ingredients data for the result page
        const transformedIngredients =
          transformIngredientsForResults(updatedIngredients);

        // Proceed with analysis
        await processAndNavigate(transformedIngredients);
      } else {
        // No missing nutritional data, so directly transform and analyze
        const transformedIngredients = transformIngredientsForResults(
          ingredients.map(({ isNew, ...rest }) => rest as Ingredient)
        );

        // Proceed with analysis
        await processAndNavigate(transformedIngredients);
      }
    } catch (error) {
      console.error("Error saving ingredients:", error);
      alert("Failed to save ingredients.");
      setLoading(false);
    }
  };

  // Function to process the meal analysis and navigate to results
  const processAndNavigate = async (
    transformedIngredients: TransformedIngredient[]
  ) => {
    try {
      setLoadingMessage("Analyzing nutritional value...");

      // Get user profile using our helper function
      const userProfile = getDefaultUserProfile();

      // Analyze the meal using the API
      const analysisResult = await analyzeMeal(
        transformedIngredients,
        userProfile
      );

      // Navigate to the results page with the transformed data and analysis results
      navigate("/results", {
        state: {
          name: mealName,
          image: mealImage,
          ingredients: transformedIngredients,
          analysis: {
            grade: analysisResult.rating.letter_grade,
            score: analysisResult.rating.score,
            recommendations: analysisResult.recommendations,
            positiveFeedback: analysisResult.positive_feedback,
            dailyRecommendations: analysisResult.daily_recommendations,
          },
        },
      });
    } catch (error) {
      console.error("Error analyzing meal:", error);
      alert("Failed to analyze meal. Continuing without analysis.");

      // If analysis fails, still navigate to results without analysis data
      navigate("/results", {
        state: {
          name: mealName,
          image: mealImage,
          ingredients: transformedIngredients,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading Screen */}
      {loading && <LoadingScreen message={loadingMessage} />}

      {/* Main Content */}
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
          <label className="text-sm text-gray-600 mb-1 block">
            Meal title:
          </label>
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="px-4 py-2 w-full border border-green-300 bg-white rounded-xl focus:outline-none"
          />
        </div>

        {/* Ingredients */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 mb-2 block">
            Ingredients
          </label>
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
    </>
  );
};

export default IngredientVerificationPage;
