import AllergyOption from "@/components/preferences-page/AllergyOption";
import ContinueButton from "@/components/preferences-page/ContinueButton";
import OptionCard from "@/components/preferences-page/OptionCard";
import ProgressHeader from "@/components/preferences-page/ProgressHeader";
import { PreferencePage } from "@/types/preferencesTypes";
import { Allergy } from "@/types/userTypes";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PAGES,
  PAGE_HEADINGS,
  PAGE_OPTIONS,
} from "../components/preferences-page/preferencesConstants";

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
      // Reset on invalid
      setInput(value.toString());
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
  const currentOptions = PAGE_OPTIONS[currentPage];
  const totalSteps = PAGES.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const navigate = useNavigate();

  const handleSelect = (value: any) => {
    if (currentPage === "allergy") {
      // Handle "None" selection
      if (value === Allergy.ALLERGY_NONE) {
        if (selectedAllergies.includes(Allergy.ALLERGY_NONE)) {
          // If "None" is already selected, deselect it
          setSelectedAllergies([]);
        } else {
          // Select "None" and clear all others
          setSelectedAllergies([Allergy.ALLERGY_NONE]);
        }
      } else {
        // Handle regular allergy selection
        let newAllergies = [...selectedAllergies];

        // Remove "None" if it exists
        newAllergies = newAllergies.filter((a) => a !== Allergy.ALLERGY_NONE);

        if (newAllergies.includes(value)) {
          // If allergy is already selected, remove it
          newAllergies = newAllergies.filter((a) => a !== value);
        } else {
          // Add the new allergy
          newAllergies.push(value);
        }

        setSelectedAllergies(newAllergies);
      }
    } else {
      // For all other options (including numeric inputs)
      setSelections({ ...selections, [currentPage]: value });
    }
  };

  const handleContinue = () => {
    // Update selections with the latest allergies if we're on the allergy page
    const updatedSelections = { ...selections };
    if (currentPage === "allergy") {
      updatedSelections.allergy = selectedAllergies;
    }

    if (step < totalSteps - 1) {
      setSelections(updatedSelections);
      setStep(step + 1);
    } else {
      // Create complete UserProfile object
      const userProfile = {
        age: updatedSelections.age as number,
        gender: updatedSelections.gender,
        weight_kg: updatedSelections.weight as number,
        height_cm: updatedSelections.height as number,
        activity_level: updatedSelections.activity,
        weight_goal: updatedSelections.goal,
        goal_intensity: updatedSelections.intensity,
        dietary_restrictions: updatedSelections.diet,
        allergies: selectedAllergies,
      };

      console.log("Complete UserProfile:", userProfile);
      // Here you could save to your backend or context
      navigate("/");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canContinue = () => {
    if (currentPage === "allergy") {
      return selectedAllergies.length > 0;
    }

    // Handle numeric input pages
    if (currentPage === "age") {
      const age = selections.age;
      return age !== "" && age >= 13 && age <= 120;
    }
    if (currentPage === "weight") {
      const weight = selections.weight;
      return weight !== "" && weight >= 20 && weight <= 300;
    }
    if (currentPage === "height") {
      const height = selections.height;
      return height !== "" && height >= 100 && height <= 250;
    }

    return selections[currentPage] !== undefined;
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "age":
        return (
          <div className="space-y-6">
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
          </div>
        );

      case "weight":
        return (
          <div className="space-y-6">
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
          </div>
        );

      case "height":
        return (
          <div className="space-y-6">
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
          </div>
        );

      case "allergy":
        return (
          <>
            <AllergyOption
              option={PAGE_OPTIONS.allergy[0]}
              isSelected={selectedAllergies.includes(Allergy.ALLERGY_NONE)}
              onClick={() => handleSelect(Allergy.ALLERGY_NONE)}
            />

            {/* Always show other allergies, but disable them if "None" is selected */}
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
            {currentOptions?.map((option) => (
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

      <div className="p-4 bg-white border-t border-gray-200 mb-[10%]">
        <ContinueButton canContinue={canContinue()} onClick={handleContinue} />
      </div>
    </div>
  );
};

export default UserPreferences;
