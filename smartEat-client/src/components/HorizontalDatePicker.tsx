import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalDatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

function getWeekDates(centerDate: Date): Date[] {
  const startOfWeek = new Date(centerDate);
  const day = centerDate.getDay();
  startOfWeek.setDate(centerDate.getDate() - day); // Start from Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  return weekDates;
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
}) => {
  const weekDates = getWeekDates(selectedDate);

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateChange(newDate);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={goToPreviousWeek}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="text-center">
          <span className="text-lg font-semibold text-gray-800">
            {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        
        <button 
          onClick={goToNextWeek}
          className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-sm">
        {weekDates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`
                flex flex-col items-center py-2 px-1 rounded-lg
                transition-all duration-200 ease-in-out
                ${isSelected 
                  ? "bg-green-500 text-white shadow-md" 
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
                <div className="w-1 h-1 bg-green-500 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalDatePicker; 