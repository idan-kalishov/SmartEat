import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FoodVerifyTransferObject } from "../components/image-captch/CameraWithFrameAndLoading";
import { getDefaultUserProfile } from "../types/userTypes";
import { analyzeMeal } from "@/services/mealRatingService.tsx";
import LoadingScreen from "./loading/LoadingScreen";
import IngredientVerificationHeader from "../components/verfication-page/IngredientVerificationHeader";
import MealImageDisplay from "../components/verfication-page/MealImageDisplay";
import MealNameInput from "../components/verfication-page/MealNameInput";
import IngredientsList from "../components/verfication-page/IngredientsList";
import SaveButton from "../components/verfication-page/SaveButton";
import { processAndSaveIngredients } from "../utils/ingredientProcessingUtils";

const IngredientVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transferObject: FoodVerifyTransferObject = location.state;

  if (!transferObject) {
    alert("No meal data found. Please try again.");
    navigate("/");
    return null;
  }

  // State management
  const [mealName, setMealName] = useState(
    transferObject.foodRecognitionResponse[0]?.foodName || "Unknown Meal"
  );
  const [ingredients, setIngredients] = useState(
    transferObject.foodRecognitionResponse.map((item) => ({
      name: item.foodName,
      weight: `${item.weight}`,
      isNew: false,
      nutrition: {
        per100g: item.nutrition.per100g,
      },
    }))
  );
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Saving...");

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await processAndSaveIngredients(
        ingredients,
        setLoadingMessage
      );

      const userProfile = getDefaultUserProfile();
      const analysisResult = await analyzeMeal(
        result.transformedIngredients,
        userProfile
      );

      navigate("/results", {
        state: {
          name: mealName,
          image: transferObject.image,
          ingredients: result.transformedIngredients,
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
      console.error("Error processing ingredients:", error);
      alert("Failed to process ingredients.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen message={loadingMessage} />}

      <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white px-4 py-6 overflow-hidden">
        <IngredientVerificationHeader />

        <MealImageDisplay
          mealImage={transferObject.image}
          mealName={mealName}
        />

        <MealNameInput mealName={mealName} setMealName={setMealName} />

        <IngredientsList
          ingredients={ingredients}
          setIngredients={setIngredients}
        />

        <SaveButton onClick={handleSave} />
      </div>
    </>
  );
};

export default IngredientVerificationPage;
