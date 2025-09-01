import React, { useState, useEffect } from "react";
import { Brain, Lightbulb, TrendingUp, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/appState";
import { Meal } from "@/types/meals/meal";
import { Exercise } from "@/types/exercise";
import { getAIOpinion, AIOpinionResponse } from "@/services/aiOpinionService";
import {
  getDailyRecommendations,
  getDailyExerciseGoal,
} from "@/services/dailyRecommendationsService";

interface AIOpinionCardProps {
  meals: Meal[];
  exercises: Exercise[];
  selectedDate: Date;
}

const AIOpinionCard: React.FC<AIOpinionCardProps> = ({
  meals,
  exercises,
  selectedDate,
}) => {
  const [aiOpinion, setAiOpinion] = useState<AIOpinionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userProfile = useSelector((state: RootState) => state.user.userProfile);

  const fetchAIOpinion = async () => {
    if (!userProfile) {
      setError("User profile not available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get daily recommendations and exercise goals
      const [dailyRecommendations, dailyExerciseGoal] = await Promise.all([
        getDailyRecommendations(userProfile),
        getDailyExerciseGoal(userProfile),
      ]);

      // Get current time
      const now = new Date();
      const currentTime = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Get AI opinion
      const opinion = await getAIOpinion({
        userProfile,
        meals,
        exercises,
        dailyRecommendations,
        dailyExerciseGoal,
        currentTime,
      });

      setAiOpinion(opinion);
    } catch (err) {
      console.error("Failed to fetch AI opinion:", err);
      setError("Failed to get AI opinion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchAIOpinion();
    }
  }, [userProfile, meals, exercises, selectedDate]);

  if (!userProfile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-medium">
            Complete your profile to get personalized AI insights
          </span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Opinion</h3>
        </div>
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Opinion</h3>
        </div>
        <div className="text-red-500 text-sm mb-3">{error}</div>
        <button
          onClick={fetchAIOpinion}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!aiOpinion) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">AI Opinion</h3>
        </div>
        <div className="text-gray-500 text-sm">
          No AI opinion available yet. Add some meals to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-800">AI Opinion</h3>
      </div>

      {/* Positive Feedback */}
      {aiOpinion.positiveFeedback && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-800 text-sm">
              {aiOpinion.positiveFeedback}
            </p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {aiOpinion.recommendations && aiOpinion.recommendations.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-sm">
            Recommendations for the rest of your day:
          </h4>
          <div className="space-y-2">
            {aiOpinion.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchAIOpinion}
        className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
      >
        Refresh opinion
      </button>
    </div>
  );
};

export default AIOpinionCard;
