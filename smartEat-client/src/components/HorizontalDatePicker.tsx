import React, { useRef, useEffect } from "react";

interface HorizontalDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  daysBefore?: number;
  daysAfter?: number;
}

function getDatesArray(centerDate: Date, daysBefore = 10, daysAfter = 10) {
  const base = new Date(centerDate);
  base.setHours(0, 0, 0, 0);
  const dates = [];
  for (let i = -daysBefore; i <= daysAfter; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const HorizontalDatePicker: React.FC<HorizontalDatePickerProps> = ({
  selectedDate,
  onDateChange,
  daysBefore = 10,
  daysAfter = 10,
}) => {
  const dates = getDatesArray(selectedDate, daysBefore, daysAfter);
  const dateRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const idx = dates.findIndex((d) => isSameDay(d, selectedDate));
    if (idx !== -1 && dateRefs.current[idx]) {
      dateRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate, dates]);

  return (
    <div className="w-full flex overflow-x-auto no-scrollbar space-x-2 py-2 bg-white rounded-lg shadow">
      {dates.map((date, i) => {
        const isSelected = isSameDay(date, selectedDate);
        return (
          <button
            key={date.toISOString()}
            ref={(el) => {
              dateRefs.current[i] = el;
            }}
            onClick={() => onDateChange(date)}
            className={`flex flex-col items-center px-3 py-2 rounded-lg min-w-[56px] border-2
              ${
                isSelected
                  ? "bg-green-500 text-white border-green-700 shadow-md"
                  : "bg-white text-green-800 border-green-200 hover:bg-green-100"
              }
            `}
          >
            <span className="text-xs font-medium">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className="text-lg font-bold">{date.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
};

export default HorizontalDatePicker; 