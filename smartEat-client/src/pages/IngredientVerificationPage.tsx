// src/pages/IngredientVerificationPage.tsx

import { analyzeMeal } from "@/services/mealRatingService";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FoodVerifyTransferObject } from "../components/image-captch/CameraWithFrameAndLoading";
import IngredientsList from "../components/verfication-page/IngredientsList";
import IngredientVerificationHeader from "../components/verfication-page/IngredientVerificationHeader";
import MealImageDisplay from "../components/verfication-page/MealImageDisplay";
import MealNameInput from "../components/verfication-page/MealNameInput";
import SaveButton from "../components/verfication-page/SaveButton";
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

  const isManual = transferObject.isManual;

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
          nutrition: item.nutrition
            ? {
                per100g: item.nutrition.per100g,
              }
            : undefined,
        }))
  );
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Saving...");
  const [failedIngredients, setFailedIngredients] = useState<string[]>([]);

  const handleSave = async () => {
    setLoading(true);
    setFailedIngredients([]);

    try {
      const result = await processAndSaveIngredients(
        ingredients,
        setLoadingMessage
      );

      if (result.failedIngredients.length > 0) {
        setFailedIngredients(result.failedIngredients);
        setLoading(false);
        return; // Block navigation
      }

      const analysisResult = await analyzeMeal(
        result.transformedIngredients
      );

      navigate("/results", {
        state: {
          name: mealName,
          image: mealImage,
          ingredients: result.transformedIngredients,
          analysis: {
            grade: analysisResult.rating.letterGrade,
            score: analysisResult.rating.score,
            recommendations: analysisResult.recommendations,
            positiveFeedback: analysisResult.positiveFeedback,
            dailyRecommendations: analysisResult.dailyRecommendations,
          },
        },
      });
    } catch (error: any) {
      console.error("Error processing ingredients:", error);
      alert(
        error.message ||
          "Failed to process ingredients. Please check all ingredient names."
      );
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
          mealImage={mealImage}
          mealName={mealName}
          isManual={isManual}
          onImageChange={setMealImage}
        />

        <MealNameInput mealName={mealName} setMealName={setMealName} />

        {failedIngredients.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm">
            <strong>
              {failedIngredients.length === 1
                ? "Could not find nutritional data for ingredient:"
                : "Could not find nutritional data for ingredients:"}
            </strong>{" "}
            {failedIngredients.join(", ")}.
            <br />
            Please correct the spelling or remove{" "}
            {failedIngredients.length === 1 ? "it" : "them"}.
          </div>
        )}

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
