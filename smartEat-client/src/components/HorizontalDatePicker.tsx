import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-0.5 rounded-full shadow-md hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      
      <div 
        ref={scrollContainerRef}
        className="w-full flex overflow-x-auto no-scrollbar space-x-1.5 py-2 px-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm"
      >
        {dates.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={date.toISOString()}
              ref={(el) => {
                dateRefs.current[i] = el;
              }}
              onClick={() => onDateChange(date)}
              className={`
                flex flex-col items-center px-3 py-1.5 rounded-lg min-w-[60px]
                transition-all duration-200 ease-in-out
                ${isSelected 
                  ? "bg-green-500 text-white shadow-lg scale-105 border-none" 
                  : "bg-white hover:bg-green-50 border border-gray-100"}
                ${isToday && !isSelected ? "border-green-300" : ""}
              `}
            >
              <span className={`text-xs font-medium ${isSelected ? "text-green-100" : "text-gray-500"}`}>
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className={`text-base font-bold ${isSelected ? "text-white" : "text-gray-800"}`}>
                {date.getDate()}
              </span>
              {isToday && !isSelected && (
                <div className="w-1 h-1 bg-green-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-0.5 rounded-full shadow-md hover:bg-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default HorizontalDatePicker; 