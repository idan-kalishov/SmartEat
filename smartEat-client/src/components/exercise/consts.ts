import { ExerciseSelect, IntensityType } from "@/types/exercise";

export const exerciseTypes: ExerciseSelect[] = [
  { value: "", label: "Select type", caloriesPerHour: 0 },
  { value: "weight lifting", label: "weight lifting", caloriesPerHour: 400 },
  { value: "basketball", label: "basketball", caloriesPerHour: 600 },
  { value: "football", label: "football", caloriesPerHour: 600 },
  { value: "swimming", label: "swimming", caloriesPerHour: 600 },
  { value: "cardio", label: "cardio", caloriesPerHour: 600 },
];

export const intensityTypes: IntensityType[] = [
  { value: "", label: "Select intensity", multiplier: 0 },
  { value: "Low", label: "Low", multiplier: 0.7 },
  { value: "Medium", label: "Medium", multiplier: 1 },
  { value: "High", label: "High", multiplier: 1.3 },
];
