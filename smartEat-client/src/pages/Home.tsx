import { ROUTES } from "@/Routing/routes";
import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-8 sm:text-3xl">
        Welcome to My PWA
      </h1>

      {/* Plus Button */}
      <Link to="/upload">
        <button className="w-24 h-24 rounded-full bg-blue-500 text-white text-5xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors sm:w-28 sm:h-28 sm:text-6xl">
          +
        </button>
      </Link>

      <Link to="/profile">
        <div className="w-24 h-24  bg-blue-500 text-white text-5xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors sm:w-28 sm:h-28 sm:text-6xl">
          goal
        </div>
      </Link>
      <Link to={ROUTES.USER_PROFILE}>
        <div className="w-24 h-24  bg-blue-500 text-white text-5xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors sm:w-28 sm:h-28 sm:text-6xl">
          profile
        </div>
      </Link>
    </div>
  );
};

export default Home;
