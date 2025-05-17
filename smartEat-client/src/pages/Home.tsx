import React, { useState } from "react";
import HorizontalDatePicker from "../components/HorizontalDatePicker";

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-200 py-4 px-2 sm:py-8">
      <div className="w-full max-w-md flex flex-col items-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-center text-green-800">
          בחר תאריך
        </h2>
        <HorizontalDatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          daysBefore={10}
          daysAfter={10}
        />
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow p-4 sm:p-6 flex flex-col items-center">
        <span className="text-gray-500 text-sm sm:text-base">
          Meal logs for the selected date will appear here.
        </span>
      </div>
    </div>
  );
};

export default Home;
