import { ROUTES } from "@/Routing/routes";
import api, { clearAuthHeader } from "@/services/api";
import { logout, persistor, setUser } from "@/store/appState";
import {
  Activity,
  ChevronRight,
  ImagePlus,
  LogOut,
  PencilLine,
  Salad,
  Save,
  User,
  Weight,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

interface ProfileSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  fields: {
    id: string;
    label: string;
    value: string | number;
    type: "text" | "number" | "select";
    options?: string[];
    unit?: string;
    min?: number;
    max?: number;
  }[];
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections: ProfileSection[] = [
    {
      id: "personal",
      label: "Personal Information",
      icon: <User className="w-5 h-5" />,
      fields: [
        { id: "name", label: "Full Name", value: "Idan Janach", type: "text" },
        {
          id: "email",
          label: "Email",
          value: "idanjanach4455@gmail.com",
          type: "text",
        },
        {
          id: "age",
          label: "Age",
          value: 25,
          type: "number",
          min: 13,
          max: 120,
        },
        {
          id: "gender",
          label: "Gender",
          value: "Male",
          type: "select",
          options: ["Male", "Female", "Other"],
        },
      ],
    },
    {
      id: "body",
      label: "Body Metrics",
      icon: <Weight className="w-5 h-5" />,
      fields: [
        {
          id: "weight",
          label: "Weight",
          value: 70,
          type: "number",
          unit: "kg",
          min: 20,
          max: 300,
        },
        {
          id: "height",
          label: "Height",
          value: 175,
          type: "number",
          unit: "cm",
          min: 100,
          max: 250,
        },
      ],
    },
    {
      id: "activity",
      label: "Activity & Goals",
      icon: <Activity className="w-5 h-5" />,
      fields: [
        {
          id: "activity_level",
          label: "Activity Level",
          value: "Moderate",
          type: "select",
          options: ["Sedentary", "Light", "Moderate", "Active", "Very Active"],
        },
        {
          id: "goal",
          label: "Weight Goal",
          value: "Gain weight",
          type: "select",
          options: ["Lose weight", "Maintain", "Gain weight"],
        },
        {
          id: "intensity",
          label: "Goal Intensity",
          value: "Mild",
          type: "select",
          options: ["Mild", "Moderate", "Aggressive"],
        },
      ],
    },
    {
      id: "diet",
      label: "Dietary Preferences",
      icon: <Salad className="w-5 h-5" />,
      fields: [
        {
          id: "diet_type",
          label: "Diet Type",
          value: "Keto",
          type: "select",
          options: [
            "None",
            "Vegetarian",
            "Vegan",
            "Keto",
            "Paleo",
            "Mediterranean",
          ],
        },
        {
          id: "allergies",
          label: "Allergies",
          value: "None",
          type: "select",
          options: [
            "None",
            "Peanuts",
            "Tree Nuts",
            "Dairy",
            "Eggs",
            "Soy",
            "Wheat",
            "Fish",
            "Shellfish",
          ],
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await api.post("/auth/logout");
      clearAuthHeader();

      // Dispatch Redux logout action to clear state
      dispatch(logout());
      dispatch(setUser(null));
      await persistor.purge();

      // Navigate to sign-in page
      localStorage.clear();
      navigate(ROUTES.SIGNIN);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error toast or message
    }
  };
  const handleSave = () => {
    setEditMode(false);
    setActiveSection(null);
    // TODO: Save changes to backend
  };

  return (
    <Layout>
      <div className="flex flex-col items-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 px-2 sm:py-6 h-full overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1731499365752-cf90a04e0836?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg transition-all">
                  <ImagePlus className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <h1 className="text-xl font-semibold text-gray-800">
                Idan Janach
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                idanjanach4455@gmail.com
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm divide-y divide-gray-100">
            {sections.map((section) => (
              <div key={section.id} className="p-4">
                <button
                  onClick={() => {
                    setActiveSection(
                      activeSection === section.id ? null : section.id
                    );
                    setEditMode(false);
                  }}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      {section.icon}
                    </div>
                    <span className="font-medium text-gray-700">
                      {section.label}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeSection === section.id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Section Content */}
                {activeSection === section.id && (
                  <div className="mt-4 pl-12">
                    <div className="space-y-4">
                      {section.fields.map((field) => (
                        <div key={field.id} className="flex flex-col gap-1">
                          <label className="text-sm text-gray-600">
                            {field.label}
                          </label>
                          {editMode ? (
                            field.type === "select" ? (
                              <select
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                defaultValue={field.value}
                              >
                                {field.options?.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="relative">
                                <input
                                  type={field.type}
                                  defaultValue={field.value}
                                  min={field.min}
                                  max={field.max}
                                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                />
                                {field.unit && (
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {field.unit}
                                  </span>
                                )}
                              </div>
                            )
                          ) : (
                            <p className="text-gray-800">
                              {field.value}
                              {field.unit && ` ${field.unit}`}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Edit/Save Buttons */}
                      <div className="flex justify-end pt-2">
                        {editMode ? (
                          <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <PencilLine className="w-4 h-4" />
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
