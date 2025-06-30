export type ExerciseType =
  | "weight lifting"
  | "basketball"
  | "football"
  | "swimming"
  | "cardio";
export type IntensityLevel = "Low" | "Medium" | "High";

export type ExcerciseSelect = {
  value: ExerciseType | "";
  label: ExerciseType | "Select type";
  caloriesPerHour: number;
};

export type IntensityType = {
  value: IntensityLevel | "";
  label: IntensityLevel | "Select intensity";
  multiplier: number;
};

export interface Exercise {
  id: string;
  userId: string;
  name: string;
  calories: string;
  minutes: number;
  createdAt: string;
}
