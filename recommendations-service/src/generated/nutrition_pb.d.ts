// package: nutrition
// file: nutrition.proto

import * as jspb from "google-protobuf";

export class Nutrient extends jspb.Message {
  hasValue(): boolean;
  clearValue(): void;
  getValue(): number;
  setValue(value: number): void;

  getUnit(): string;
  setUnit(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Nutrient.AsObject;
  static toObject(includeInstance: boolean, msg: Nutrient): Nutrient.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Nutrient, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Nutrient;
  static deserializeBinaryFromReader(message: Nutrient, reader: jspb.BinaryReader): Nutrient;
}

export namespace Nutrient {
  export type AsObject = {
    value: number,
    unit: string,
  }
}

export class NutritionData extends jspb.Message {
  hasCalories(): boolean;
  clearCalories(): void;
  getCalories(): Nutrient | undefined;
  setCalories(value?: Nutrient): void;

  hasProtein(): boolean;
  clearProtein(): void;
  getProtein(): Nutrient | undefined;
  setProtein(value?: Nutrient): void;

  hasFats(): boolean;
  clearFats(): void;
  getFats(): Nutrient | undefined;
  setFats(value?: Nutrient): void;

  hasCarbs(): boolean;
  clearCarbs(): void;
  getCarbs(): Nutrient | undefined;
  setCarbs(value?: Nutrient): void;

  hasFiber(): boolean;
  clearFiber(): void;
  getFiber(): Nutrient | undefined;
  setFiber(value?: Nutrient): void;

  hasVitaminA(): boolean;
  clearVitaminA(): void;
  getVitaminA(): Nutrient | undefined;
  setVitaminA(value?: Nutrient): void;

  hasVitaminD(): boolean;
  clearVitaminD(): void;
  getVitaminD(): Nutrient | undefined;
  setVitaminD(value?: Nutrient): void;

  hasVitaminB12(): boolean;
  clearVitaminB12(): void;
  getVitaminB12(): Nutrient | undefined;
  setVitaminB12(value?: Nutrient): void;

  hasVitaminC(): boolean;
  clearVitaminC(): void;
  getVitaminC(): Nutrient | undefined;
  setVitaminC(value?: Nutrient): void;

  hasIron(): boolean;
  clearIron(): void;
  getIron(): Nutrient | undefined;
  setIron(value?: Nutrient): void;

  hasCalcium(): boolean;
  clearCalcium(): void;
  getCalcium(): Nutrient | undefined;
  setCalcium(value?: Nutrient): void;

  hasMagnesium(): boolean;
  clearMagnesium(): void;
  getMagnesium(): Nutrient | undefined;
  setMagnesium(value?: Nutrient): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NutritionData.AsObject;
  static toObject(includeInstance: boolean, msg: NutritionData): NutritionData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NutritionData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NutritionData;
  static deserializeBinaryFromReader(message: NutritionData, reader: jspb.BinaryReader): NutritionData;
}

export namespace NutritionData {
  export type AsObject = {
    calories?: Nutrient.AsObject,
    protein?: Nutrient.AsObject,
    fats?: Nutrient.AsObject,
    carbs?: Nutrient.AsObject,
    fiber?: Nutrient.AsObject,
    vitaminA?: Nutrient.AsObject,
    vitaminD?: Nutrient.AsObject,
    vitaminB12?: Nutrient.AsObject,
    vitaminC?: Nutrient.AsObject,
    iron?: Nutrient.AsObject,
    calcium?: Nutrient.AsObject,
    magnesium?: Nutrient.AsObject,
  }
}

export class MealAnalysisRequest extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): UserProfile | undefined;
  setUser(value?: UserProfile): void;

  clearIngredientsList(): void;
  getIngredientsList(): Array<string>;
  setIngredientsList(value: Array<string>): void;
  addIngredients(value: string, index?: number): string;

  hasNutrition(): boolean;
  clearNutrition(): void;
  getNutrition(): NutritionData | undefined;
  setNutrition(value?: NutritionData): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MealAnalysisRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MealAnalysisRequest): MealAnalysisRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MealAnalysisRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MealAnalysisRequest;
  static deserializeBinaryFromReader(message: MealAnalysisRequest, reader: jspb.BinaryReader): MealAnalysisRequest;
}

export namespace MealAnalysisRequest {
  export type AsObject = {
    user?: UserProfile.AsObject,
    ingredientsList: Array<string>,
    nutrition?: NutritionData.AsObject,
  }
}

export class MealRating extends jspb.Message {
  getLetterGrade(): string;
  setLetterGrade(value: string): void;

  getScore(): number;
  setScore(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MealRating.AsObject;
  static toObject(includeInstance: boolean, msg: MealRating): MealRating.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MealRating, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MealRating;
  static deserializeBinaryFromReader(message: MealRating, reader: jspb.BinaryReader): MealRating;
}

export namespace MealRating {
  export type AsObject = {
    letterGrade: string,
    score: number,
  }
}

export class AIRecommendRequest extends jspb.Message {
  hasUser(): boolean;
  clearUser(): void;
  getUser(): UserProfile | undefined;
  setUser(value?: UserProfile): void;

  clearIngredientsList(): void;
  getIngredientsList(): Array<string>;
  setIngredientsList(value: Array<string>): void;
  addIngredients(value: string, index?: number): string;

  hasNutrition(): boolean;
  clearNutrition(): void;
  getNutrition(): NutritionData | undefined;
  setNutrition(value?: NutritionData): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AIRecommendRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AIRecommendRequest): AIRecommendRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AIRecommendRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AIRecommendRequest;
  static deserializeBinaryFromReader(message: AIRecommendRequest, reader: jspb.BinaryReader): AIRecommendRequest;
}

export namespace AIRecommendRequest {
  export type AsObject = {
    user?: UserProfile.AsObject,
    ingredientsList: Array<string>,
    nutrition?: NutritionData.AsObject,
  }
}

export class AIRecommendResponse extends jspb.Message {
  clearRecommendationsList(): void;
  getRecommendationsList(): Array<string>;
  setRecommendationsList(value: Array<string>): void;
  addRecommendations(value: string, index?: number): string;

  getPositiveFeedback(): string;
  setPositiveFeedback(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AIRecommendResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AIRecommendResponse): AIRecommendResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AIRecommendResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AIRecommendResponse;
  static deserializeBinaryFromReader(message: AIRecommendResponse, reader: jspb.BinaryReader): AIRecommendResponse;
}

export namespace AIRecommendResponse {
  export type AsObject = {
    recommendationsList: Array<string>,
    positiveFeedback: string,
  }
}

export class DietaryRestrictions extends jspb.Message {
  getPreference(): DietaryPreferenceMap[keyof DietaryPreferenceMap];
  setPreference(value: DietaryPreferenceMap[keyof DietaryPreferenceMap]): void;

  clearAllergiesList(): void;
  getAllergiesList(): Array<AllergyMap[keyof AllergyMap]>;
  setAllergiesList(value: Array<AllergyMap[keyof AllergyMap]>): void;
  addAllergies(value: AllergyMap[keyof AllergyMap], index?: number): AllergyMap[keyof AllergyMap];

  clearDislikedIngredientsList(): void;
  getDislikedIngredientsList(): Array<string>;
  setDislikedIngredientsList(value: Array<string>): void;
  addDislikedIngredients(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DietaryRestrictions.AsObject;
  static toObject(includeInstance: boolean, msg: DietaryRestrictions): DietaryRestrictions.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DietaryRestrictions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DietaryRestrictions;
  static deserializeBinaryFromReader(message: DietaryRestrictions, reader: jspb.BinaryReader): DietaryRestrictions;
}

export namespace DietaryRestrictions {
  export type AsObject = {
    preference: DietaryPreferenceMap[keyof DietaryPreferenceMap],
    allergiesList: Array<AllergyMap[keyof AllergyMap]>,
    dislikedIngredientsList: Array<string>,
  }
}

export class UserProfile extends jspb.Message {
  getAge(): number;
  setAge(value: number): void;

  getGender(): GenderMap[keyof GenderMap];
  setGender(value: GenderMap[keyof GenderMap]): void;

  getWeightKg(): number;
  setWeightKg(value: number): void;

  getHeightCm(): number;
  setHeightCm(value: number): void;

  getActivityLevel(): ActivityLevelMap[keyof ActivityLevelMap];
  setActivityLevel(value: ActivityLevelMap[keyof ActivityLevelMap]): void;

  getWeightGoal(): WeightGoalMap[keyof WeightGoalMap];
  setWeightGoal(value: WeightGoalMap[keyof WeightGoalMap]): void;

  getGoalIntensity(): GoalIntensityMap[keyof GoalIntensityMap];
  setGoalIntensity(value: GoalIntensityMap[keyof GoalIntensityMap]): void;

  hasDietaryRestrictions(): boolean;
  clearDietaryRestrictions(): void;
  getDietaryRestrictions(): DietaryRestrictions | undefined;
  setDietaryRestrictions(value?: DietaryRestrictions): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserProfile.AsObject;
  static toObject(includeInstance: boolean, msg: UserProfile): UserProfile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UserProfile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserProfile;
  static deserializeBinaryFromReader(message: UserProfile, reader: jspb.BinaryReader): UserProfile;
}

export namespace UserProfile {
  export type AsObject = {
    age: number,
    gender: GenderMap[keyof GenderMap],
    weightKg: number,
    heightCm: number,
    activityLevel: ActivityLevelMap[keyof ActivityLevelMap],
    weightGoal: WeightGoalMap[keyof WeightGoalMap],
    goalIntensity: GoalIntensityMap[keyof GoalIntensityMap],
    dietaryRestrictions?: DietaryRestrictions.AsObject,
  }
}

export class Micronutrients extends jspb.Message {
  getVitaminA(): number;
  setVitaminA(value: number): void;

  getVitaminC(): number;
  setVitaminC(value: number): void;

  getVitaminD(): number;
  setVitaminD(value: number): void;

  getVitaminB12(): number;
  setVitaminB12(value: number): void;

  getCalcium(): number;
  setCalcium(value: number): void;

  getIron(): number;
  setIron(value: number): void;

  getMagnesium(): number;
  setMagnesium(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Micronutrients.AsObject;
  static toObject(includeInstance: boolean, msg: Micronutrients): Micronutrients.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Micronutrients, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Micronutrients;
  static deserializeBinaryFromReader(message: Micronutrients, reader: jspb.BinaryReader): Micronutrients;
}

export namespace Micronutrients {
  export type AsObject = {
    vitaminA: number,
    vitaminC: number,
    vitaminD: number,
    vitaminB12: number,
    calcium: number,
    iron: number,
    magnesium: number,
  }
}

export class NutrientRecommendation extends jspb.Message {
  getCalories(): number;
  setCalories(value: number): void;

  getProtein(): number;
  setProtein(value: number): void;

  getFats(): number;
  setFats(value: number): void;

  getCarbs(): number;
  setCarbs(value: number): void;

  getFiber(): number;
  setFiber(value: number): void;

  hasMicronutrients(): boolean;
  clearMicronutrients(): void;
  getMicronutrients(): Micronutrients | undefined;
  setMicronutrients(value?: Micronutrients): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NutrientRecommendation.AsObject;
  static toObject(includeInstance: boolean, msg: NutrientRecommendation): NutrientRecommendation.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NutrientRecommendation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NutrientRecommendation;
  static deserializeBinaryFromReader(message: NutrientRecommendation, reader: jspb.BinaryReader): NutrientRecommendation;
}

export namespace NutrientRecommendation {
  export type AsObject = {
    calories: number,
    protein: number,
    fats: number,
    carbs: number,
    fiber: number,
    micronutrients?: Micronutrients.AsObject,
  }
}

export interface GenderMap {
  GENDER_UNSPECIFIED: 0;
  GENDER_MALE: 1;
  GENDER_FEMALE: 2;
}

export const Gender: GenderMap;

export interface ActivityLevelMap {
  ACTIVITY_LEVEL_UNSPECIFIED: 0;
  ACTIVITY_LEVEL_SEDENTARY: 1;
  ACTIVITY_LEVEL_LIGHT: 2;
  ACTIVITY_LEVEL_MODERATE: 3;
  ACTIVITY_LEVEL_ACTIVE: 4;
  ACTIVITY_LEVEL_VERY_ACTIVE: 5;
}

export const ActivityLevel: ActivityLevelMap;

export interface WeightGoalMap {
  WEIGHT_GOAL_UNSPECIFIED: 0;
  WEIGHT_GOAL_LOSE: 1;
  WEIGHT_GOAL_MAINTAIN: 2;
  WEIGHT_GOAL_GAIN: 3;
}

export const WeightGoal: WeightGoalMap;

export interface GoalIntensityMap {
  GOAL_INTENSITY_UNSPECIFIED: 0;
  GOAL_INTENSITY_MILD: 1;
  GOAL_INTENSITY_MODERATE: 2;
  GOAL_INTENSITY_AGGRESSIVE: 3;
}

export const GoalIntensity: GoalIntensityMap;

export interface DietaryPreferenceMap {
  DIETARY_PREFERENCE_UNSPECIFIED: 0;
  DIETARY_PREFERENCE_NONE: 1;
  DIETARY_PREFERENCE_VEGETARIAN: 2;
  DIETARY_PREFERENCE_VEGAN: 3;
  DIETARY_PREFERENCE_PESCETARIAN: 4;
  DIETARY_PREFERENCE_KETO: 5;
  DIETARY_PREFERENCE_PALEO: 6;
}

export const DietaryPreference: DietaryPreferenceMap;

export interface AllergyMap {
  ALLERGY_UNSPECIFIED: 0;
  ALLERGY_NONE: 1;
  ALLERGY_DAIRY: 2;
  ALLERGY_EGGS: 3;
  ALLERGY_GLUTEN: 4;
  ALLERGY_PEANUTS: 5;
  ALLERGY_TREE_NUTS: 6;
  ALLERGY_FISH: 7;
  ALLERGY_SHELLFISH: 8;
  ALLERGY_SOY: 9;
}

export const Allergy: AllergyMap;

