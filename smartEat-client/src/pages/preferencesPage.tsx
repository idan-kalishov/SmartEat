import AllergyOption from "@/components/preferences-page/AllergyOption";
import ContinueButton from "@/components/preferences-page/ContinueButton";
import OptionCard from "@/components/preferences-page/OptionCard";
import {
  PAGE_HEADINGS,
  PAGE_OPTIONS,
  PAGES,
} from "@/components/preferences-page/preferencesConstants";
import ProgressHeader from "@/components/preferences-page/ProgressHeader";
import api from "@/services/api";
import { RootState } from "@/store/appState";
import { PreferencePage } from "@/types/preferencesTypes";
import { Allergy, UserProfile } from "@/types/userTypes";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface UpdateUserProfileRequest {
  userProfile: UserProfile;
}

const NumericInput: React.FC<{
  emoji: string;
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  placeholder: string;
  unit: string;
  min?: number;
  max?: number;
  funFact?: string;
}> = ({
  emoji,
  label,
  value,
  onChange,
  placeholder,
  unit,
  min,
  max,
  funFact,
}) => {
  const [input, setInput] = useState(value.toString());
  useEffect(() => {
    setInput(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val === "") {
      onChange("");
      return;
    }
    const num = parseFloat(val);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    const num = parseFloat(input);
    if (
      input === "" ||
      isNaN(num) ||
      (min && num < min) ||
      (max && num > max)
    ) {
      setInput(value.toString()); // Reset on invalid
    } else {
      setInput(num.toString());
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">{emoji}</div>
        <h2 className="text-xl font-semibold text-gray-800">{label}</h2>
      </div>
      <div className="relative mb-4">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-4 text-2xl text-center border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-semibold"
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-lg">
          {unit}
        </span>
      </div>
      {funFact && (
        <div className="text-center text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          💡 {funFact}
        </div>
      )}
    </div>
  );
};

const UserPreferences: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state: RootState) => state.user);

  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<PreferencePage, any>>({
    age: "",
    weight: "",
    height: "",
    gender: undefined,
    activity: undefined,
    goal: undefined,
    intensity: undefined,
    diet: undefined,
    allergy: [],
  });
  const [selectedAllergies, setSelectedAllergies] = useState<Allergy[]>([]);

  const currentPage = PAGES[step];
  const totalSteps = PAGES.length;
  const progress = ((step + 1) / totalSteps) * 100;

  // 🧠 Prefill selections from Redux store if userProfile exists
  useEffect(() => {
    if (userProfile) {
      setSelections({
        age: userProfile.age || "",
        weight: userProfile.weight_kg || "",
        height: userProfile.height_cm || "",
        gender: userProfile.gender,
        activity: userProfile.activity_level,
        goal: userProfile.weight_goal,
        intensity: userProfile.goal_intensity,
        diet: userProfile.dietary_restrictions?.preference,
        allergy: [],
      });

      if (userProfile.dietary_restrictions?.allergies?.length > 0) {
        setSelectedAllergies(userProfile.dietary_restrictions.allergies);
      }
    }
  }, [userProfile]);

  const handleSelect = (value: any) => {
    if (currentPage === "allergy") {
      if (value === Allergy.ALLERGY_NONE) {
        setSelectedAllergies((prev) =>
          prev.includes(Allergy.ALLERGY_NONE) ? [] : [Allergy.ALLERGY_NONE]
        );
      } else {
        setSelectedAllergies((prev) => {
          const newAllergies = [...prev].filter(
            (a) => a !== Allergy.ALLERGY_NONE
          );
          if (newAllergies.includes(value)) {
            return newAllergies.filter((a) => a !== value);
          } else {
            return [...newAllergies, value];
          }
        });
      }
    } else {
      setSelections({ ...selections, [currentPage]: value });
    }
  };

  const handleContinue = () => {
    const updatedSelections = { ...selections };
    if (currentPage === "allergy") {
      updatedSelections.allergy = selectedAllergies;
    }

    if (step < totalSteps - 1) {
      setSelections(updatedSelections);
      setStep(step + 1);
    } else {
      const userProfileData = {
        userProfile: {
          age: Number(updatedSelections.age),
          gender: Number(updatedSelections.gender),
          weight_kg: Number(updatedSelections.weight),
          height_cm: Number(updatedSelections.height),
          activity_level: Number(updatedSelections.activity),
          weight_goal: Number(updatedSelections.goal),
          goal_intensity: Number(updatedSelections.intensity),
          dietary_restrictions: {
            preference: Number(updatedSelections.diet),
            allergies: selectedAllergies,
            disliked_ingredients: [],
          },
        },
      };

      updateUserProfile(userProfileData)
        .then(() => {
          console.log("Profile updated successfully");
          navigate("/");
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
          alert("Failed to save your preferences. Please try again.");
        });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canContinue = () => {
    if (currentPage === "allergy") {
      return selectedAllergies.length > 0;
    }
    if (["age", "weight", "height"].includes(currentPage)) {
      const value = selections[currentPage];
      const rules = {
        age: { min: 13, max: 120 },
        weight: { min: 20, max: 300 },
        height: { min: 100, max: 250 },
      }[currentPage];

      return value !== "" && value >= rules.min && value <= rules.max;
    }
    return selections[currentPage] !== undefined;
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "age":
        return (
          <NumericInput
            emoji="🎂"
            label="How many candles on your cake?"
            value={selections.age}
            onChange={(value) => handleSelect(value)}
            placeholder="25"
            unit="years"
            min={13}
            max={120}
            funFact="Don't worry, we won't tell anyone your real age! 😉"
          />
        );
      case "weight":
        return (
          <NumericInput
            emoji="⚖️"
            label="What does the scale say?"
            value={selections.weight}
            onChange={(value) => handleSelect(value)}
            placeholder="70"
            unit="kg"
            min={20}
            max={300}
            funFact="Remember, muscle weighs more than fat! 💪"
          />
        );
      case "height":
        return (
          <NumericInput
            emoji="📏"
            label="How tall are you?"
            value={selections.height}
            onChange={(value) => handleSelect(value)}
            placeholder="175"
            unit="cm"
            min={100}
            max={250}
            funFact="Fun fact: You're actually tallest in the morning! 🌅"
          />
        );
      case "allergy":
        return (
          <>
            <AllergyOption
              option={PAGE_OPTIONS.allergy[0]}
              isSelected={selectedAllergies.includes(Allergy.ALLERGY_NONE)}
              onClick={() => handleSelect(Allergy.ALLERGY_NONE)}
            />
            <div className="grid grid-cols-2 gap-3">
              {PAGE_OPTIONS.allergy.slice(1).map((option) => (
                <AllergyOption
                  key={option.value}
                  option={option}
                  isSelected={selectedAllergies.includes(option.value)}
                  onClick={() =>
                    !selectedAllergies.includes(Allergy.ALLERGY_NONE) &&
                    handleSelect(option.value)
                  }
                  isGridItem
                  disabled={selectedAllergies.includes(Allergy.ALLERGY_NONE)}
                />
              ))}
            </div>
          </>
        );
      default:
        return (
          <div className="space-y-4">
            {PAGE_OPTIONS[currentPage]?.map((option) => (
              <OptionCard
                key={option.value}
                option={option}
                isSelected={selections[currentPage] === option.value}
                onClick={() => handleSelect(option.value)}
              />
            ))}
          </div>
        );
    }
  };

  const updateUserProfile = async (
    data: UpdateUserProfileRequest
  ): Promise<void> => {
    try {
      await api.put("/auth/update-profile", data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ProgressHeader
        progress={progress}
        onBack={handleBack}
        showBackButton={step > 0}
      />
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          {PAGE_HEADINGS[currentPage]}
        </h1>
        {renderCurrentPage()}
      </div>
      <div className="p-7 bg-white border-t border-gray-200 mb-[10%]">
        <ContinueButton canContinue={canContinue()} onClick={handleContinue} />
      </div>
    </div>
  );
};

export default UserPreferences;
