import { Allergy } from "../types/userTypes";

export type PreferencePage =
  | "gender"
  | "activity"
  | "goal"
  | "intensity"
  | "diet"
  | "allergy";

export interface PreferenceOption {
  value: number;
  label: string;
  emoji: string;
  description?: string;
}

export interface UserPreferencesProps {
  selections: Record<PreferencePage, any>;
  selectedAllergies: Allergy[];
  onSelect: (page: PreferencePage, value: any) => void;
  onContinue: () => void;
  onBack: () => void;
  currentPage: PreferencePage;
  progress: number;
}

export interface OptionCardProps {
  option: PreferenceOption;
  isSelected: boolean;
  onClick: () => void;
}

export interface AllergyOptionProps {
  option: PreferenceOption;
  isSelected: boolean;
  onClick: () => void;
  isGridItem?: boolean;
  disabled?: boolean;
}
