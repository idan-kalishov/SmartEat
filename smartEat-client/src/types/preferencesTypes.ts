import {Allergy} from "../types/userTypes";

// Updated to include the fun new numeric input pages! 🎉
export type PreferencePage =
    | "age" // 🎂 How many candles?
    | "weight" // ⚖️ Scale confession time!
    | "height" // 📏 Reach for the stars!
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
