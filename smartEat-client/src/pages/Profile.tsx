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

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const appState = useSelector((state: RootState) => state.appState);
  const [newUserProfile, setNewUserProfile] = useState(appState.userProfile);

  const updateProfileField = (
    fieldId: string,
    value: any,
    sectionId: string
  ) => {
    if (sectionId === "diet") {
      setNewUserProfile((prev) => ({
        ...prev,
        dietary_restrictions: {
          ...prev.dietary_restrictions,
          [fieldId]: value,
        },
      }));
    } else {
      setNewUserProfile((prev) => ({ ...prev, [fieldId]: value }));
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      clearAuthHeader();
      dispatch(logout());
      dispatch(setUser(null));
      await persistor.purge();
      localStorage.clear();
      navigate(ROUTES.SIGNIN);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSave = async () => {
    setEditMode(false);
    setActiveSection(null);
    const payload = {
      userProfile: {
        ...newUserProfile,
        age: +newUserProfile.age,
        gender: +newUserProfile.gender,
        weight_kg: +newUserProfile.weight_kg,
        height_cm: +newUserProfile.height_cm,
        activity_level: +newUserProfile.activity_level,
        weight_goal: +newUserProfile.weight_goal,
        goal_intensity: +newUserProfile.goal_intensity,
        dietary_restrictions: {
          preference: +newUserProfile.dietary_restrictions.preference,
          allergies: newUserProfile.dietary_restrictions.allergies,
        },
      },
    };
    try {
      await api.put("/auth/update-profile", payload);
      dispatch(setUserProfile(newUserProfile));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const FieldInput = ({ field, sectionId }: any) => {
    if (!editMode) {
      return (
        <p className="text-gray-800">
          {field.type === "multiselect"
            ? field.value || "None selected"
            : field.displayFunc
            ? field.displayFunc(field.value)
            : field.value}
          {field.unit && ` ${field.unit}`}
        </p>
      );
    }

    if (field.type === "select") {
      return (
        <select
          defaultValue={field.value}
          onChange={(e) =>
            updateProfileField(field.id, e.target.value, sectionId)
          }
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        >
          {Object.entries(field.options).map(([k, v]) => (
            <option key={k} value={k}>
              {v as string}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "multiselect") {
      return (
        <div className="space-y-2">
          {Object.entries(field.options).map(([k, v]) => {
            const id = +k;
            const checked =
              newUserProfile.dietary_restrictions.allergies.includes(id);
            return (
              <label key={k} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    let updated = [
                      ...newUserProfile.dietary_restrictions.allergies,
                    ];
                    if (e.target.checked) {
                      updated =
                        id === 0
                          ? [0]
                          : [...updated.filter((x) => x !== 0), id];
                    } else {
                      updated = updated.filter((x) => x !== id);
                    }
                    updateProfileField("allergies", updated, "diet");
                  }}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{v as string}</span>
              </label>
            );
          })}
        </div>
      );
    }

    return (
      <div className="relative">
        <input
          type={field.type}
          defaultValue={field.value}
          min={field.min}
          max={field.max}
          onChange={(e) =>
            updateProfileField(field.id, e.target.value, sectionId)
          }
          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
        {field.unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {field.unit}
          </span>
        )}
      </div>
    );
  };

  const sections = [
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
            .map((a) => getAllergyLabel(a))
            .join(", "),
          type: "multiselect",
          options: allergyLabels,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col items-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-4 px-2 sm:py-6 h-full overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto space-y-6">
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

              {activeSection === section.id && (
                <div className="mt-4 pl-12 space-y-4">
                  {section.fields.map((f) => (
                    <div key={f.id} className="flex flex-col gap-1">
                      <label className="text-sm text-gray-600">{f.label}</label>
                      <FieldInput field={f} sectionId={section.id} />
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    {editMode ? (
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                      >
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    ) : (
                      <button
                        onClick={() => setEditMode(true)}
                        className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      >
                        <PencilLine className="w-4 h-4" /> Edit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
