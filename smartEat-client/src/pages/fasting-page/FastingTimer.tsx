import { ArrowRight, Droplets, Edit } from "lucide-react";
import { useEffect, useState } from "react";

const FastingTimer = () => {
  // טעינת נתונים מהשמירה
  const loadSavedData = () => {
    try {
      const saved = sessionStorage.getItem("fastingData");
      if (saved) {
        const data = JSON.parse(saved);
        return {
          fastingState: data.fastingState || null,
          startTime: data.startTime ? new Date(data.startTime) : null,
          selectedPlan: data.selectedPlan || "16",
          fastingHours: data.fastingHours || 16,
          completedFasting: data.completedFasting || null,
        };
      }
    } catch (error) {
      console.log("Failed to load saved data");
    }
    return {
      fastingState: null,
      startTime: null,
      selectedPlan: "16:8",
      fastingHours: 16,
      completedFasting: null,
    };
  };

  const savedData = loadSavedData();
  const [fastingState, setFastingState] = useState(savedData.fastingState);
  const [startTime, setStartTime] = useState(savedData.startTime);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPlan, setSelectedPlan] = useState(savedData.selectedPlan);
  const [fastingHours, setFastingHours] = useState(savedData.fastingHours);
  const [completedFasting, setCompletedFasting] = useState(
    savedData.completedFasting
  );
  const [showPlanModal, setShowPlanModal] = useState(false);

  // שמירת נתונים
  const saveData = () => {
    try {
      const dataToSave = {
        fastingState,
        startTime: startTime ? startTime.toISOString() : null,
        selectedPlan,
        fastingHours,
        completedFasting,
      };
      sessionStorage.setItem("fastingData", JSON.stringify(dataToSave));
    } catch (error) {
      console.log("Failed to save data");
    }
  };

  // שמירה אוטומטית כשמשהו משתנה
  useEffect(() => {
    saveData();
  }, [
    fastingState,
    startTime,
    selectedPlan,
    fastingHours,
    completedFasting,
    showPlanModal,
  ]);

  // עדכון השעה כל שנייה
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // חישוב זמן שעבר מתחילת הצום
  const getElapsedTime = () => {
    if (!startTime) return { hours: 0, minutes: 0, seconds: 0 };

    const elapsed = currentTime.getTime() - startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  // חישוב אחוז התקדמות
  const getProgress = () => {
    if (!startTime) return 0;
    const elapsed = currentTime.getTime() - startTime.getTime();
    const totalFastingTime = fastingHours * 60 * 60 * 1000;
    return Math.min(100, (elapsed / totalFastingTime) * 100);
  };

  // התחלת צום
  const startFasting = () => {
    setStartTime(new Date());
    setFastingState("active");
    setCompletedFasting(null);
  };

  // סיום צום
  const endFasting = () => {
    const elapsed = getElapsedTime();
    setCompletedFasting({
      duration: elapsed,
      startTime,
      endTime: new Date(),
    });
    setFastingState("completed");
    setStartTime(null);
  };

  // איפוס
  const resetFasting = () => {
    setFastingState(null);
    setStartTime(null);
    setCompletedFasting(null);
  };

  const elapsed = getElapsedTime();
  const progress = getProgress();
  const progressAngle = (progress / 100) * 360;

  // חישוב שלב הצום הנוכחי
  const getCurrentStage = () => {
    if (elapsed.hours < 3)
      return { stage: 0, name: "Start of the fast", icon: "⬆️" };
    if (elapsed.hours < 8)
      return { stage: 1, name: "Sugar burning", icon: "⬇️" };
    if (elapsed.hours < 12)
      return { stage: 2, name: "Fat burning", icon: "🔥" };
    return { stage: 3, name: "Ketosis", icon: "🧠" };
  };

  const currentStage = getCurrentStage();

  // Preset fasting plans
  const presetPlans = [
    { name: "12", hours: 12, description: "For beginners" },
    { name: "14", hours: 14, description: "Easy and convenient" },
    { name: "16", hours: 16, description: "Popular" },
    { name: "18", hours: 18, description: "Advanced" },
    { name: "20", hours: 20, description: "Challenge" },
    { name: "24", hours: 24, description: "Full day" },
  ];

  // עדכון תוכנית הצום
  const updateFastingPlan = (plan) => {
    setSelectedPlan(plan.name);
    setFastingHours(plan.hours);
    setShowPlanModal(false);
  };

  if (fastingState === "completed" && completedFasting) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <button
              onClick={resetFasting}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>

            <h1 className="text-xl font-bold mb-8">Fasting Overview</h1>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-green-600 mb-6">
                You did amazing!
              </h2>

              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="w-full h-full rounded-full bg-green-100 flex items-center justify-center">
                    <div className="text-4xl">🥑</div>
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-pulse">
                    ✨
                  </div>
                  <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse">
                    ⭐
                  </div>
                  <div className="absolute top-4 -right-4 text-green-500 font-bold text-lg">
                    Nice!
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-2">You have fasted for</p>
              <p className="text-2xl font-bold text-gray-800">
                {completedFasting.duration.hours} hours and{" "}
                {completedFasting.duration.minutes} minutes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Started</p>
                <p className="font-semibold">
                  Today,{" "}
                  {completedFasting.startTime.toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ended</p>
                <p className="font-semibold">
                  Today,{" "}
                  {completedFasting.endTime.toLocaleTimeString("he-IL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-800 font-semibold mb-4">
                How did you feel during fasting?
              </p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={resetFasting}
              className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Fasting</h1>
          </div>

          {/* Main Timer Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">
                {fastingState === "active" ? "Active Fast" : "Upcoming Fast"}
              </span>
              <button
                onClick={() => setShowPlanModal(true)}
                className="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors"
              >
                <span className="font-semibold">{selectedPlan} Plan</span>
                <Edit className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Circular Timer */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray={`${progress * 2.827} 282.7`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Timer Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {fastingState === "active" ? (
                  <>
                    <div className="text-3xl font-bold text-gray-800">
                      {elapsed.hours.toString().padStart(2, "0")}:
                      {elapsed.minutes.toString().padStart(2, "0")}:
                      {elapsed.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">elapsed</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl font-bold text-gray-800">
                      {fastingHours} hours
                    </div>
                    <div className="text-sm text-gray-500">plan duration</div>
                  </>
                )}
              </div>

              {/* Corner Icons */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <Droplets className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
                <Droplets className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                <Edit className="w-5 h-5 text-gray-400" />
              </div>
              <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                <Droplets className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={fastingState === "active" ? endFasting : startFasting}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                fastingState === "active"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {fastingState === "active" ? "End Fasting" : "Start Fasting"}
            </button>
          </div>

          {/* Current Stage Indicator */}
          {fastingState === "active" && (
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{currentStage.icon}</div>
                <div>
                  <p className="font-semibold text-green-800">
                    {currentStage.name}
                  </p>
                  <p className="text-sm text-green-600">
                    stage {currentStage.stage + 1}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stages of Body */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Stages of Body
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: "⬆️", time: "0-3h", active: elapsed.hours < 3 },
                {
                  icon: "⬇️",
                  time: "3-8h",
                  active: elapsed.hours >= 3 && elapsed.hours < 8,
                },
                {
                  icon: "🔥",
                  time: "8-12h",
                  active: elapsed.hours >= 8 && elapsed.hours < 12,
                },
                { icon: "🧠", time: "12-15h", active: elapsed.hours >= 12 },
              ].map((stage, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    fastingState === "active" && stage.active
                      ? "bg-green-100 border-2 border-green-300"
                      : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`text-2xl mb-2 ${
                      fastingState === "active" && stage.active
                        ? "animate-pulse"
                        : ""
                    }`}
                  >
                    {stage.icon}
                  </div>
                  <span className="text-xs text-gray-600">{stage.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* During Fasting Tips */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-3">
              During Fasting
            </h3>
            <div className="flex items-start space-x-3 mb-3">
              <div className="text-2xl">🥑</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">
                    Stay hydrated by consuming water or herbal infusions.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">
                    Refrain from engaging in intense physical activities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Choose Fasting Plan
              </h2>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {presetPlans.map((plan, index) => (
                <button
                  key={index}
                  onClick={() => updateFastingPlan(plan)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    selectedPlan === plan.name
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">
                      {plan.name}
                    </span>
                    <span className="text-sm text-gray-500">{plan.hours}h</span>
                  </div>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">Custom Plan</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={fastingHours}
                  onChange={(e) =>
                    setFastingHours(parseInt(e.target.value) || 1)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Hours"
                />
                <button
                  onClick={() => {
                    setSelectedPlan(`${fastingHours}:${24 - fastingHours}`);
                    setShowPlanModal(false);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FastingTimer;
