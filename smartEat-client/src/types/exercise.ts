export type ExerciseType = 'cardio' | 'strength';
export type IntensityLevel = 'low' | 'medium' | 'high';

export interface Exercise {
  id: string;
  type: ExerciseType;
  intensity: IntensityLevel;
  duration: number; // in minutes
  caloriesBurned: number;
  createdAt: string;
} 