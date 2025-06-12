import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import { DropletIcon } from "lucide-react";

interface WaterTrackerProps {
  selectedDate: Date;
}

const cupsPerRow = 10;
const cupVolume = 0.2;

const WaterTracker: React.FC<WaterTrackerProps> = ({ selectedDate }) => {
  const dateKey = selectedDate.toISOString().split("T")[0];
  const [filledCups, setFilledCups] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const initialLoad = useRef(true);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout>();
  const [retryCount, setRetryCount] = useState(0);

  // Cache functions (unchanged)
  const getCachedWaterData = useCallback((date: string) => {
    const cached = localStorage.getItem(`water-${date}`);
    return cached ? JSON.parse(cached) : null;
  }, []);

  const cacheWaterData = useCallback((date: string, amount: number) => {
    localStorage.setItem(
      `water-${date}`,
      JSON.stringify({ amountLiters: amount })
    );
  }, []);

  // Save function (unchanged)
  const saveWaterIntake = useCallback(async () => {
    try {
      const amountLiters = filledCups * cupVolume;
      await api.post("/water", { amountLiters, date: dateKey });
      cacheWaterData(dateKey, amountLiters);
      setRetryCount(0);
    } catch (err) {
      console.error("Failed to save water intake:", err);
      if (retryCount < 3) {
        setTimeout(saveWaterIntake, 1000 * (retryCount + 1));
        setRetryCount((c) => c + 1);
      }
    }
  }, [filledCups, dateKey, retryCount, cacheWaterData]);

  // Load water data (unchanged)
  useEffect(() => {
    const loadWaterData = async () => {
      const cached = getCachedWaterData(dateKey);
      if (cached) {
        setFilledCups(Math.round(cached.amountLiters / cupVolume));
      }

      try {
        const response = await api.get(`/water/by-date/${dateKey}`);
        const data = response.data;
        const cups = Math.round(data.amountLiters / cupVolume);
        setFilledCups(cups);
        cacheWaterData(dateKey, cups * cupVolume);
      } catch (error) {
        console.warn("Failed to load water data:", error);
        setFilledCups(cached ? Math.round(cached.amountLiters / cupVolume) : 0);
      } finally {
        setIsLoading(false);
      }
    };

    loadWaterData();
  }, [dateKey, getCachedWaterData, cacheWaterData]);

  // Save water data with debounce (unchanged)
  useEffect(() => {
    if (!isLoading && !initialLoad.current && filledCups >= 0) {
      if (saveTimeout) clearTimeout(saveTimeout);
      const timeout = setTimeout(saveWaterIntake, 500);
      setSaveTimeout(timeout);
    }
    initialLoad.current = false;

    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
    };
  }, [filledCups, isLoading, saveWaterIntake]);

  const handleCupClick = (index: number) => {
    const newAmount = index < filledCups ? index : index + 1;
    setFilledCups(newAmount);
  };

  const rows = Math.floor(filledCups / cupsPerRow) + 1;

  const renderCups = useMemo(() => {
    return Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-5 gap-2 justify-center">
        {Array.from({ length: cupsPerRow }).map((_, cupIndex) => {
          const globalIndex = rowIndex * cupsPerRow + cupIndex;
          const isFilled = globalIndex < filledCups;
          const isLastFilled = globalIndex === filledCups - 1;
          const isNextEmpty = globalIndex === filledCups;

          // Determine which image to show
          let cupImage;
          if (isFilled) {
            cupImage = isLastFilled
              ? "/cups/filledMinus.png"
              : "/cups/filled1.png";
          } else {
            cupImage = isNextEmpty ? "/cups/emptyPlus.png" : "/cups/empty1.png";
          }

          return (
            <img
              key={globalIndex}
              src={cupImage}
              alt={isFilled ? "Filled cup" : "Empty cup"}
              onClick={() => handleCupClick(globalIndex)}
              className="w-10 h-20 cursor-pointer transition-transform duration-150 hover:scale-110"
            />
          );
        })}
      </div>
    ));
  }, [rows, filledCups]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 mt-[5%]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DropletIcon className="w-4 h-4" />
          <h2 className="text-lg font-semibold text-gray-800">Water Tracker</h2>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Total water summary */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Total Consumed
          </span>
          <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
            <DropletIcon className="w-4 h-4" />
            {(filledCups * cupVolume).toFixed(2)} L
          </div>
        </div>

        {/* Cups Grid */}
        <div className="p-2">{renderCups}</div>
      </div>
    </div>
  );
};

export default WaterTracker;
