import { ROUTES } from "@/Routing/routes";
import api, { clearAuthHeader } from "@/services/api";
import { logout, persistor, RootState, setUser } from "@/store/appState";
import {
  Activity,
  ChevronRight,
  LogOut,
  PencilLine,
  Salad,
  Save,
  User,
  Weight,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  activityLevelLabels,
  allergyLabels,
  dietaryPreferenceLabels,
  genderLabels,
  getActivityLevelLabel,
  getAllergyLabel,
  getDietaryPreferenceLabel,
  getGenderLabel,
  getGoalIntensityLabel,
  getWeightGoalLabel,
  goalIntensityLabels,
  weightGoalLabels,
} from "@/utils/prefernces";
import { setUserProfile } from "@/store/userSlice";

interface ProfileSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  fields: {
    id: string;
    label: string;
    value: string | number;
    type: "text" | "number" | "select" | "multiselect";
    displayFunc?: Function;
    options?: Record<any, string>;
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
  const appState = useSelector((state: RootState) => state.appState);
  const [newUserProfile, setNewUserProfile] = useState(appState.userProfile);

  const sections: ProfileSection[] = [
    {
      id: "personal",
      label: "Personal Information",
      icon: <User className="w-5 h-5" />,
      fields: [
        {
          id: "age",
          label: "Age",
          value: newUserProfile.age,
          type: "number",
          min: 13,
          max: 120,
        },
        {
          id: "gender",
          label: "Gender",
          value: newUserProfile.gender,
          displayFunc: getGenderLabel,
          type: "select",
          options: genderLabels,
        },
      ],
    },
    {
      id: "body",
      label: "Body Metrics",
      icon: <Weight className="w-5 h-5" />,
      fields: [
        {
          id: "weight_kg",
          label: "Weight",
          value: newUserProfile.weight_kg,
          type: "number",
          unit: "kg",
          min: 20,
          max: 300,
        },
        {
          id: "height_cm",
          label: "Height",
          value: newUserProfile.height_cm,
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
          value: newUserProfile.activity_level,
          displayFunc: getActivityLevelLabel,
          type: "select",
          options: activityLevelLabels,
        },
        {
          id: "weight_goal",
          label: "Weight Goal",
          value: newUserProfile.weight_goal,
          displayFunc: getWeightGoalLabel,
          type: "select",
          options: weightGoalLabels,
        },
        {
          id: "goal_intensity",
          label: "Goal Intensity",
          value: newUserProfile.goal_intensity,
          displayFunc: getGoalIntensityLabel,
          type: "select",
          options: goalIntensityLabels,
        },
      ],
    },
    {
      id: "diet",
      label: "Dietary Preferences",
      icon: <Salad className="w-5 h-5" />,
      fields: [
        {
          id: "preference",
          label: "Diet Type",
          value: newUserProfile.dietary_restrictions.preference,
          displayFunc: getDietaryPreferenceLabel,
          type: "select",
          options: dietaryPreferenceLabels,
        },
        {
          id: "allergies",
          label: "Allergies",
          value: newUserProfile.dietary_restrictions.allergies
            .map((allergy) => getAllergyLabel(allergy))
            .join(", "),
          type: "multiselect",
          options: allergyLabels,
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

  const handleSave = async () => {
    setEditMode(false);
    setActiveSection(null);
    debugger;
    const userProfileData = {
      userProfile: {
        age: Number(newUserProfile.age),
        gender: Number(newUserProfile.gender),
        weight_kg: Number(newUserProfile.weight_kg),
        height_cm: Number(newUserProfile.height_cm),
        activity_level: Number(newUserProfile.activity_level),
        weight_goal: Number(newUserProfile.weight_goal),
        goal_intensity: Number(newUserProfile.goal_intensity),
        dietary_restrictions: {
          preference: Number(newUserProfile.dietary_restrictions.preference),
          allergies: newUserProfile.dietary_restrictions.allergies,
        },
      },
    };
    try {
      await api.put("/auth/update-profile", userProfileData);
      dispatch(setUserProfile(newUserProfile));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 px-2 sm:py-6 h-full overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto space-y-6">
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
                              onChange={(e) => {
                                debugger;
                                section.id !== "diet"
                                  ? setNewUserProfile({
                                      ...newUserProfile,
                                      [field.id]: e.target.value,
                                    })
                                  : setNewUserProfile({
                                      ...newUserProfile,
                                      dietary_restrictions: {
                                        ...newUserProfile.dietary_restrictions,
                                        [field.id]: e.target.value,
                                      },
                                    });
                              }}
                            >
                              {Object.entries(field.options).map(
                                ([key, value]) => (
                                  <option key={key} value={key}>
                                    {value}
                                  </option>
                                )
                              )}
                            </select>
                          ) : field.type === "multiselect" ? (
                            <div className="space-y-2">
                              {Object.entries(field.options).map(
                                ([key, value]) => {
                                  const allergyId = Number(key);
                                  const isChecked =
                                    newUserProfile.dietary_restrictions.allergies.includes(
                                      allergyId
                                    );
                                  return (
                                    <label
                                      key={key}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const currentAllergies = [
                                            ...newUserProfile
                                              .dietary_restrictions.allergies,
                                          ];

                                          if (e.target.checked) {
                                            // If checking "Unspecified" (ID 0), uncheck all others
                                            if (allergyId === 0) {
                                              setNewUserProfile({
                                                ...newUserProfile,
                                                dietary_restrictions: {
                                                  ...newUserProfile.dietary_restrictions,
                                                  allergies: [0],
                                                },
                                              });
                                            } else {
                                              // If checking any other allergy, uncheck "Unspecified" and add the new one
                                              const filteredAllergies =
                                                currentAllergies.filter(
                                                  (id) => id !== 0
                                                );
                                              if (
                                                !filteredAllergies.includes(
                                                  allergyId
                                                )
                                              ) {
                                                filteredAllergies.push(
                                                  allergyId
                                                );
                                              }
                                              setNewUserProfile({
                                                ...newUserProfile,
                                                dietary_restrictions: {
                                                  ...newUserProfile.dietary_restrictions,
                                                  allergies: filteredAllergies,
                                                },
                                              });
                                            }
                                          } else {
                                            // If unchecking, just remove the allergy
                                            const index =
                                              currentAllergies.indexOf(
                                                allergyId
                                              );
                                            if (index > -1) {
                                              currentAllergies.splice(index, 1);
                                            }
                                            setNewUserProfile({
                                              ...newUserProfile,
                                              dietary_restrictions: {
                                                ...newUserProfile.dietary_restrictions,
                                                allergies: currentAllergies,
                                              },
                                            });
                                          }
                                        }}
                                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                      />
                                      <span className="text-sm text-gray-700">
                                        {value}
                                      </span>
                                    </label>
                                  );
                                }
                              )}
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type={field.type}
                                defaultValue={field.value}
                                min={field.min}
                                max={field.max}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                onChange={(e) => {
                                  setNewUserProfile({
                                    ...newUserProfile,
                                    [field.id]: e.target.value,
                                  });
                                }}
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
                            {field.type === "multiselect"
                              ? field.value || "None selected"
                              : field.displayFunc
                              ? field.displayFunc(field.value)
                              : field.value}
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
  );
};

export default ProfilePage;
