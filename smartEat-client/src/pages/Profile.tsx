import GoalCube from "@/components/profile-page/GoalCube";
import { ROUTES } from "@/Routing/routes";
import { setUser } from "@/store/appState";
import React from "react";
import {
  LuWeight,
  LuClock,
  LuFootprints,
  LuGlassWater,
  LuPencil, LuLogOut,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import apiClient from "@/services/authService.ts";
import {useDispatch} from "react-redux";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiClient.post("/auth/logout");
    dispatch(setUser(null));
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="bg-linear-to-b from-green-300 to-white-500 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-gray-200">
            <img
              src={
                "https://plus.unsplash.com/premium_photo-1731499365752-cf90a04e0836?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="absolute bottom-0 right-0">
            <div className="bg-white rounded-md p-2 shadow-sm">
              <LuPencil className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="w-[90%] max-w-md text-center space-y-2 bg-white rounded-xl p-2 shadow-md">
          <h1 className="text-2xl font-bold">idan janach</h1>
          <p className="text-gray-500 cursor-pointer text-sm">
            idanjanach4455@gmail.com
          </p>

          <button className="mt-1">Edit Profile</button>
        </div>
      </div>

      <div className="px-6 py-8">
        <h2 className="text-3xl font-bold mb-4">My Goals</h2>
        <div className="grid grid-cols-2 gap-2">
          <GoalCube
            title="target weight"
            value="80kg"
            icon={<LuWeight className="w-6 h-6 mr-2 text-gray-700" />}
          />
          <GoalCube
            title="Calorie Goal"
            value="2000 kcal"
            icon={<LuClock className="w-6 h-6 mr-2 text-gray-700" />}
          />
          <GoalCube
            title="Step Goal"
            value="8000 steps"
            icon={<LuFootprints className="w-6 h-6 mr-2 text-gray-700" />}
          />
          <GoalCube
            title="Water Goal"
            value="3L"
            icon={<LuGlassWater className="w-6 h-6 mr-2 text-gray-700" />}
          />
        </div>
      </div>

      <div className="flex justify-center pb-10">
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition"
        >
          <LuLogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
