import React, { useEffect, useState, useRef } from "react";

interface WaterTrackerProps {
  initialAmountLiters: number;
  selectedDate: Date;
  onWaterChange?: (newAmountLiters: number, date: Date) => void;
}

const cupsPerRow = 10;
const cupVolume = 0.2; // 0.2L per cup

const WaterTracker: React.FC<WaterTrackerProps> = ({
  initialAmountLiters,
  selectedDate,
  onWaterChange,
}) => {
  const dateKey = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
  const initialCups = Math.round(initialAmountLiters / cupVolume);

  const [filledCups, setFilledCups] = useState(initialCups);
  const prevCupsRef = useRef(filledCups);

  useEffect(() => {
    const saved = localStorage.getItem(`water-${dateKey}`);
    if (saved) {
      setFilledCups(parseInt(saved));
      prevCupsRef.current = parseInt(saved);
    } else {
      setFilledCups(initialCups);
      prevCupsRef.current = initialCups;
    }
  }, [dateKey, initialAmountLiters]);

  useEffect(() => {
    localStorage.setItem(`water-${dateKey}`, filledCups.toString());

    const liters = filledCups * cupVolume;
    if (onWaterChange) {
      onWaterChange(liters, selectedDate);
    }
  }, [filledCups, dateKey, selectedDate, onWaterChange]);

  const handleCupClick = (index: number) => {
    setFilledCups(index < filledCups ? index : index + 1);
  };

  const rows = Math.floor(filledCups / cupsPerRow) + 1;

  return (
    <div className="p-6 mt-6 rounded-xl shadow-md bg-white w-fit mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center text-blue-800">
        Water Tracker
        <span className="block text-gray-500 text-sm mt-1">
          {(filledCups * cupVolume).toFixed(2)} L
        </span>
      </h2>

      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-3">
            {Array.from({ length: cupsPerRow }).map((_, cupIndex) => {
              const globalIndex = rowIndex * cupsPerRow + cupIndex;
              const isFilled = globalIndex < filledCups;

              return (
                <img
                  key={globalIndex}
                  src={isFilled ? "/cups/filled.png" : "/cups/empty.png"}
                  alt={isFilled ? "Filled cup" : "Empty cup"}
                  onClick={() => handleCupClick(globalIndex)}
                  className="w-10 h-20 cursor-pointer transition-transform hover:scale-110"
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterTracker;
