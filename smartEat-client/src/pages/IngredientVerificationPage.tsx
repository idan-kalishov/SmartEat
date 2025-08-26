import { analyzeMeal } from "@/services/mealRatingService.tsx";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FoodVerifyTransferObject } from "../components/image-captch/CameraWithFrameAndLoading";
import IngredientsList from "../components/verfication-page/IngredientsList";
import IngredientVerificationHeader from "../components/verfication-page/IngredientVerificationHeader";
import MealImageDisplay from "../components/verfication-page/MealImageDisplay";
import MealNameInput from "../components/verfication-page/MealNameInput";
import SaveButton from "../components/verfication-page/SaveButton";
import { getDefaultUserProfile } from "../types/userTypes";
import { processAndSaveIngredients } from "../utils/ingredientProcessingUtils";
import LoadingScreen from "./loading/LoadingScreen";

const IngredientVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transferObject = location.state as FoodVerifyTransferObject & {
    isManual?: boolean;
  };

  if (!transferObject) {
    alert("No meal data found. Please try again.");
    navigate("/home");
    return null;
  }

  // Manual mode → start empty
  const isManual = transferObject.isManual;

  // Add state for the meal image
  const [mealImage, setMealImage] = useState(
    isManual ? null : transferObject.image ?? null
  );

  const [mealName, setMealName] = useState(
    isManual
      ? ""
      : transferObject.foodRecognitionResponse?.[0]?.foodName || "Unknown Meal"
  );
  const [ingredients, setIngredients] = useState(
    isManual
      ? []
      : transferObject.foodRecognitionResponse.map((item) => ({
          name: item.foodName,
          weight: item.weight,
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
          image: mealImage, // Use the state variable here
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
          mealImage={mealImage} // Pass the state variable
          mealName={mealName}
          isManual={isManual}
          onImageChange={setMealImage} // Pass the setter function
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
