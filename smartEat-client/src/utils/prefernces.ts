import {
  ActivityLevel,
  DietaryPreference,
  Gender,
  GoalIntensity,
  WeightGoal,
} from "@/types/userTypes";

const genderLabels: Record<Gender, string> = {
  [Gender.GENDER_UNSPECIFIED]: "Unspecified",
  [Gender.GENDER_MALE]: "Male",
  [Gender.GENDER_FEMALE]: "Female",
};

export const activityLevelLabels: Record<ActivityLevel, string> = {
  [ActivityLevel.ACTIVITY_LEVEL_UNSPECIFIED]: "Unspecified",
  [ActivityLevel.ACTIVITY_LEVEL_SEDENTARY]: "Sedentary",
  [ActivityLevel.ACTIVITY_LEVEL_LIGHT]: "Light",
  [ActivityLevel.ACTIVITY_LEVEL_MODERATE]: "Moderate",
  [ActivityLevel.ACTIVITY_LEVEL_ACTIVE]: "Active",
  [ActivityLevel.ACTIVITY_LEVEL_VERY_ACTIVE]: "Very Active",
};

export const weightGoalLabels: Record<WeightGoal, string> = {
  [WeightGoal.WEIGHT_GOAL_UNSPECIFIED]: "Unspecified",
  [WeightGoal.WEIGHT_GOAL_LOSE]: "Lose",
  [WeightGoal.WEIGHT_GOAL_MAINTAIN]: "Maintain",
  [WeightGoal.WEIGHT_GOAL_GAIN]: "Gain",
};

export const goalIntensityLabels: Record<GoalIntensity, string> = {
  [GoalIntensity.GOAL_INTENSITY_UNSPECIFIED]: "Unspecified",
  [GoalIntensity.GOAL_INTENSITY_MILD]: "Mild",
  [GoalIntensity.GOAL_INTENSITY_MODERATE]: "Moderate",
  [GoalIntensity.GOAL_INTENSITY_AGGRESSIVE]: "Aggressive",
};

export const dietaryPreferenceLabels: Record<DietaryPreference, string> = {
  [DietaryPreference.DIETARY_PREFERENCE_UNSPECIFIED]: "Unspecified",
  [DietaryPreference.DIETARY_PREFERENCE_NONE]: "None",
  [DietaryPreference.DIETARY_PREFERENCE_VEGETARIAN]: "Vegetarian",
  [DietaryPreference.DIETARY_PREFERENCE_VEGAN]: "Vegan",
  [DietaryPreference.DIETARY_PREFERENCE_PESCETARIAN]: "Pescetarian",
  [DietaryPreference.DIETARY_PREFERENCE_KETO]: "Keto",
  [DietaryPreference.DIETARY_PREFERENCE_PALEO]: "Paleo",
};

export const getGenderLabel = (gender: Gender): string => {
  return genderLabels[gender] || "Unknown";
};

export const getActivityLevelLabel = (level: ActivityLevel): string => {
  return activityLevelLabels[level] || "Unknown";
};

export const getWeightGoalLabel = (goal: WeightGoal): string => {
  return weightGoalLabels[goal] || "Unknown";
};

export const getGoalIntensityLabel = (intensity: GoalIntensity): string => {
  return goalIntensityLabels[intensity] || "Unknown";
};

export const getDietaryPreferenceLabel = (
  preference: DietaryPreference
): string => {
  return dietaryPreferenceLabels[preference] || "Unknown";
};
