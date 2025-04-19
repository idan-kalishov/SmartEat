import {
  Gender,
  ActivityLevel,
  WeightGoal,
  GoalIntensity,
  DietaryPreference,
  Allergy,
} from "../../types/userTypes";
import { PreferencePage, PreferenceOption } from "../../types/preferencesTypes";

export const PAGES: PreferencePage[] = [
  "gender",
  "activity",
  "goal",
  "intensity",
  "diet",
  "allergy",
];

export const PAGE_HEADINGS: Record<PreferencePage, string> = {
  gender: "What is your gender?",
  activity: "What is your activity level?",
  goal: "What is your main goal?",
  intensity: "Select your goal intensity",
  diet: "Dietary preference",
  allergy: "Any food allergies?",
};

export const PAGE_OPTIONS: Record<PreferencePage, PreferenceOption[]> = {
  gender: [
    { value: Gender.GENDER_MALE, label: "Male", emoji: "👨" },
    { value: Gender.GENDER_FEMALE, label: "Female", emoji: "👩" },
  ],
  activity: [
    {
      value: ActivityLevel.ACTIVITY_LEVEL_SEDENTARY,
      label: "Sedentary",
      emoji: "🪑",
      description: "Little or no exercise",
    },
    {
      value: ActivityLevel.ACTIVITY_LEVEL_LIGHT,
      label: "Light",
      emoji: "🚶‍♂️",
      description: "Exercise 1-3 days/week",
    },
    {
      value: ActivityLevel.ACTIVITY_LEVEL_MODERATE,
      label: "Moderate",
      emoji: "🏃",
      description: "Exercise 3-5 days/week",
    },
    {
      value: ActivityLevel.ACTIVITY_LEVEL_ACTIVE,
      label: "Active",
      emoji: "🏋️",
      description: "Exercise 6-7 days/week",
    },
    {
      value: ActivityLevel.ACTIVITY_LEVEL_VERY_ACTIVE,
      label: "Very Active",
      emoji: "🤸",
      description: "Hard exercise daily",
    },
  ],
  goal: [
    { value: WeightGoal.WEIGHT_GOAL_LOSE, label: "Lose weight", emoji: "⚖️" },
    { value: WeightGoal.WEIGHT_GOAL_MAINTAIN, label: "Maintain", emoji: "🔄" },
    { value: WeightGoal.WEIGHT_GOAL_GAIN, label: "Gain weight", emoji: "💪" },
  ],
  intensity: [
    {
      value: GoalIntensity.GOAL_INTENSITY_MILD,
      label: "Mild",
      emoji: "🐢",
      description: "Slower pace, easier to maintain",
    },
    {
      value: GoalIntensity.GOAL_INTENSITY_MODERATE,
      label: "Moderate",
      emoji: "🐇",
      description: "Balanced approach",
    },
    {
      value: GoalIntensity.GOAL_INTENSITY_AGGRESSIVE,
      label: "Aggressive",
      emoji: "🐆",
      description: "Faster results, more challenging",
    },
  ],
  diet: [
    {
      value: DietaryPreference.DIETARY_PREFERENCE_NONE,
      label: "None",
      emoji: "🍽️",
    },
    {
      value: DietaryPreference.DIETARY_PREFERENCE_VEGETARIAN,
      label: "Vegetarian",
      emoji: "🥦",
    },
    {
      value: DietaryPreference.DIETARY_PREFERENCE_VEGAN,
      label: "Vegan",
      emoji: "🌱",
    },
    {
      value: DietaryPreference.DIETARY_PREFERENCE_PESCETARIAN,
      label: "Pescetarian",
      emoji: "🐟",
    },
    {
      value: DietaryPreference.DIETARY_PREFERENCE_KETO,
      label: "Keto",
      emoji: "🥩",
    },
    {
      value: DietaryPreference.DIETARY_PREFERENCE_PALEO,
      label: "Paleo",
      emoji: "🍖",
    },
  ],
  allergy: [
    { value: Allergy.ALLERGY_NONE, label: "None", emoji: "✅" },
    { value: Allergy.ALLERGY_DAIRY, label: "Dairy", emoji: "🥛" },
    { value: Allergy.ALLERGY_EGGS, label: "Eggs", emoji: "🍳" },
    { value: Allergy.ALLERGY_GLUTEN, label: "Gluten", emoji: "🌾" },
    { value: Allergy.ALLERGY_PEANUTS, label: "Peanuts", emoji: "🥜" },
    { value: Allergy.ALLERGY_TREE_NUTS, label: "Tree Nuts", emoji: "🌰" },
    { value: Allergy.ALLERGY_FISH, label: "Fish", emoji: "🐟" },
    { value: Allergy.ALLERGY_SHELLFISH, label: "Shellfish", emoji: "🦐" },
    { value: Allergy.ALLERGY_SOY, label: "Soy", emoji: "🌿" },
  ],
};
