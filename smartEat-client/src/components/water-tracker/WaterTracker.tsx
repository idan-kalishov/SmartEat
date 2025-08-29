import React, { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { DropletIcon } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";
import { formatDateLocal } from "@/services/mealService";

const cupsPerRow = 10;
const cupVolume = 0.2; // liters

interface WaterTrackerProps {
  selectedDate: Date;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ selectedDate }) => {
  const dateKey = formatDateLocal(selectedDate);
  const [filledCups, setFilledCups] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load water data when date changes
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/water/by-date/${dateKey}?_=${Date.now()}`
        );
        const data = response.data;

        if (data?.amountLiters !== undefined) {
          const cups = Math.round(data.amountLiters / cupVolume);
          setFilledCups(cups);
        } else {
          setFilledCups(0); // No data → 0 cups
        }
      } catch (error: any) {
        console.warn(`Failed to load water for ${dateKey}`, error);
        setFilledCups(0); // Assume 0 if error (e.g., 404)
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [dateKey]);

  // Save immediately on cup click
  const handleCupClick = async (index: number) => {
    const newAmount = index < filledCups ? index : index + 1;
    const newLiters = newAmount * cupVolume;

    setFilledCups(newAmount); // Update UI instantly

    try {
      await api.post("/water", { amountLiters: newLiters, date: dateKey });
    } catch (err) {
      console.error("Failed to save water intake", err);
      // Optionally: show toast, or revert
      // For now, just leave UI optimistic
    }
  };

  const rows = Math.max(1, Math.floor(filledCups / cupsPerRow) + 1);

  const renderCups = useMemo(() => {
    return Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid grid-cols-5 gap-2 justify-center">
        {Array.from({ length: cupsPerRow }).map((_, cupIndex) => {
          const globalIndex = rowIndex * cupsPerRow + cupIndex;
          const isFilled = globalIndex < filledCups;
          const isLastFilled = globalIndex === filledCups - 1;
          const isNextEmpty = globalIndex === filledCups;

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
              draggable={false}
            />
          );
        })}
      </div>
    ));
  }, [rows, filledCups]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 mt-[5%]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DropletIcon className="w-4 h-4" />
          <h2 className="text-lg font-semibold text-gray-800">Water Tracker</h2>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Total Consumed
          </span>
          <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
            <DropletIcon className="w-4 h-4" />
            {(filledCups * cupVolume).toFixed(2)} L
          </div>
        </div>

        <div className="p-2">{renderCups}</div>
      </div>
    </div>
  );
};

export default WaterTracker;
