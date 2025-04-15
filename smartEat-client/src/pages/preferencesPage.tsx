import AllergyOption from "@/components/preferences-page/AllergyOption";
import ContinueButton from "@/components/preferences-page/ContinueButton";
import OptionCard from "@/components/preferences-page/OptionCard";
import ProgressHeader from "@/components/preferences-page/ProgressHeader";
import { PreferencePage } from "@/types/preferencesTypes";
import { Allergy } from "@/types/userTypes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PAGES,
  PAGE_HEADINGS,
  PAGE_OPTIONS,
} from "../components/preferences-page/preferencesConstants";

const UserPreferences: React.FC = () => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<PreferencePage, any>>(
    {} as Record<PreferencePage, any>
  );
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

      // Update selections with the latest allergies
      setSelections({ ...selections, [currentPage]: selectedAllergies });
    } else {
      // For non-allergy options, just set the single value
      setSelections({ ...selections, [currentPage]: value });
    }
  };
  const handleContinue = () => {
    if (currentPage === "allergy") {
      setSelections({ ...selections, [currentPage]: selectedAllergies });
    }

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      console.log("All data collected:", selections);
      // Here you could map these selections to your UserProfile type
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
    return selections[currentPage] !== undefined;
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

        {currentPage === "allergy" ? (
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
        ) : (
          <div className="space-y-4">
            {currentOptions.map((option) => (
              <OptionCard
                key={option.value}
                option={option}
                isSelected={selections[currentPage] === option.value}
                onClick={() => handleSelect(option.value)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <ContinueButton canContinue={canContinue()} onClick={handleContinue} />
      </div>
    </div>
  );
};

export default UserPreferences;
