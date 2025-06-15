import React, {useEffect, useState} from "react";
import {ArrowRight, Check, Clock, Clock4, Pause, Play, RotateCcw, Timer} from "lucide-react";
import Layout from "../../components/Layout";

const FastingTimer: React.FC = () => {
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
            console.log("Failed to load saved data", error);
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
    const [selectedPlan] = useState(savedData.selectedPlan);
    const [fastingHours, setFastingHours] = useState(savedData.fastingHours);
    const [completedFasting, setCompletedFasting] = useState(
        savedData.completedFasting
    );
    const [showPlanModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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
            console.log("Failed to save data", error);
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
        if (!startTime) return {hours: 0, minutes: 0, seconds: 0};

        const elapsed = currentTime.getTime() - startTime.getTime();
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

        return {hours, minutes, seconds};
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

    // חישוב זמן שנותר לצום
    const getRemainingTime = () => {
        if (!startTime || !fastingHours) return {hours: 0, minutes: 0};

        const totalFastingTime = fastingHours * 60 * 60 * 1000;
        const remaining = totalFastingTime - (currentTime.getTime() - startTime.getTime());
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        return {hours, minutes};
    };

    const remaining = getRemainingTime();

    if (fastingState === "completed" && completedFasting) {
        return (
            <Layout>
                <div
                    className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 px-2 sm:py-6">
                    <div className="w-full max-w-md mx-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 text-center">Intermittent
                            Fasting</h1>

                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                            <div className="p-6 text-center">
                                <div
                                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Check className="w-8 h-8 text-emerald-600"/>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Fasting Complete!</h2>
                                <p className="text-gray-600 mb-6">Great job on completing your fast!</p>
                                <button
                                    onClick={resetFasting}
                                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-emerald-600 transition-all"
                                >
                                    <RotateCcw className="w-5 h-5"/>
                                    Start New Fast
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 px-2 sm:py-6">
                <div className="w-full max-w-md mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 text-center">Intermittent
                        Fasting</h1>

                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col items-center mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Timer className="w-6 h-6 text-emerald-600"/>
                                    <h2 className="text-xl font-semibold text-gray-800">Fasting Timer</h2>
                                </div>
                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                                >
                                    <Clock4 className="w-4 h-4 text-gray-500"/>
                                    <span className="text-gray-600 text-sm font-medium">{fastingHours} hour fast</span>
                                </button>
                            </div>

                            {showSettings ? (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Fasting Duration
                                        </label>
                                        <select
                                            value={fastingHours}
                                            onChange={(e) => setFastingHours(Number(e.target.value))}
                                            className="w-full appearance-none bg-white px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-gray-800 pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat"
                                        >
                                            <option value={12}>12 hours</option>
                                            <option value={16}>16 hours</option>
                                            <option value={18}>18 hours</option>
                                            <option value={20}>20 hours</option>
                                            <option value={24}>24 hours</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-emerald-600 transition-all"
                                    >
                                        <ArrowRight className="w-5 h-5"/>
                                        Continue
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-48 h-48 mx-auto mb-4">
                                        {/* Progress Circle */}
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                className="stroke-current text-gray-200"
                                                strokeWidth="8"
                                                fill="none"
                                            />
                                            <circle
                                                cx="50%"
                                                cy="50%"
                                                r="45%"
                                                className="stroke-current text-emerald-500"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={`${progress * 283} 283`}
                                            />
                                        </svg>
                                        {/* Timer Display */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="text-3xl font-bold text-gray-800">
                                                {fastingState === "active"
                                                    ? `${elapsed.hours.toString().padStart(2, "0")}:${elapsed.minutes.toString().padStart(2, "0")}`
                                                    : `${fastingHours}h`}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {fastingState === "active" ? "elapsed" : "duration"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4">
                                        {fastingState === "active" ? (
                                            <button
                                                onClick={endFasting}
                                                className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-red-600 transition-all"
                                            >
                                                <Pause className="w-5 h-5"/>
                                                Stop Fast
                                            </button>
                                        ) : (
                                            <button
                                                onClick={startFasting}
                                                className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:bg-emerald-600 transition-all"
                                            >
                                                <Play className="w-5 h-5"/>
                                                Start Fast
                                            </button>
                                        )}
                                    </div>

                                    {fastingState === "active" && (
                                        <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                                            <div className="flex items-center gap-2 text-emerald-700">
                                                <Clock className="w-5 h-5"/>
                                                <span className="font-medium">
                                                    {`${remaining.hours.toString().padStart(2, "0")}:${remaining.minutes.toString().padStart(2, "0")}`} remaining
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FastingTimer;
