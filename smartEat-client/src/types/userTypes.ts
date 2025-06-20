// src/types/userTypes.ts

export enum Gender {
    GENDER_UNSPECIFIED = 0,
    GENDER_MALE = 1,
    GENDER_FEMALE = 2,
}

export enum ActivityLevel {
    ACTIVITY_LEVEL_UNSPECIFIED = 0,
    ACTIVITY_LEVEL_SEDENTARY = 1,
    ACTIVITY_LEVEL_LIGHT = 2,
    ACTIVITY_LEVEL_MODERATE = 3,
    ACTIVITY_LEVEL_ACTIVE = 4,
    ACTIVITY_LEVEL_VERY_ACTIVE = 5,
}

export enum WeightGoal {
    WEIGHT_GOAL_UNSPECIFIED = 0,
    WEIGHT_GOAL_LOSE = 1,
    WEIGHT_GOAL_MAINTAIN = 2,
    WEIGHT_GOAL_GAIN = 3,
}

export enum GoalIntensity {
    GOAL_INTENSITY_UNSPECIFIED = 0,
    GOAL_INTENSITY_MILD = 1,
    GOAL_INTENSITY_MODERATE = 2,
    GOAL_INTENSITY_AGGRESSIVE = 3,
}

export enum DietaryPreference {
    DIETARY_PREFERENCE_UNSPECIFIED = 0,
    DIETARY_PREFERENCE_NONE = 1,
    DIETARY_PREFERENCE_VEGETARIAN = 2,
    DIETARY_PREFERENCE_VEGAN = 3,
    DIETARY_PREFERENCE_PESCETARIAN = 4,
    DIETARY_PREFERENCE_KETO = 5,
    DIETARY_PREFERENCE_PALEO = 6,
}

export enum Allergy {
    ALLERGY_UNSPECIFIED = 0,
    ALLERGY_NONE = 1,
    ALLERGY_DAIRY = 2,
    ALLERGY_EGGS = 3,
    ALLERGY_GLUTEN = 4,
    ALLERGY_PEANUTS = 5,
    ALLERGY_TREE_NUTS = 6,
    ALLERGY_FISH = 7,
    ALLERGY_SHELLFISH = 8,
    ALLERGY_SOY = 9,
}

export interface DietaryRestrictions {
    preference: DietaryPreference;
    allergies: Allergy[];
    disliked_ingredients: string[];
}

export interface UserProfile {
    age: number;
    gender: Gender;
    weight_kg: number;
    height_cm: number;
    activity_level: ActivityLevel;
    weight_goal: WeightGoal;
    goal_intensity: GoalIntensity;
    dietary_restrictions: DietaryRestrictions;
}

// Function to create a default user profile with proper enum values
export function getDefaultUserProfile(): UserProfile {
    return {
        age: 30,
        gender: Gender.GENDER_MALE,
        weight_kg: 70,
        height_cm: 175,
        activity_level: ActivityLevel.ACTIVITY_LEVEL_MODERATE,
        weight_goal: WeightGoal.WEIGHT_GOAL_MAINTAIN,
        goal_intensity: GoalIntensity.GOAL_INTENSITY_MODERATE,
        dietary_restrictions: {
            preference: DietaryPreference.DIETARY_PREFERENCE_NONE,
            allergies: [Allergy.ALLERGY_NONE],
            disliked_ingredients: [],
        },
    };
}
