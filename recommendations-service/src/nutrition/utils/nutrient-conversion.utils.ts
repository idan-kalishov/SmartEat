// src/utils/nutrient-conversion.utils.ts
export const convertNutrientToStandard = (nutrient: any): number | null => {
  if (nutrient.value === null) return null;

  const conversions: Record<string, (val: number) => number> = {
    // No conversion needed for these
    kcal: (val) => val,
    g: (val) => val,
    mg: (val) => val,
    µg: (val) => val,

    // Special cases
    'IU:vitaminD': (val) => val / 40, // Convert IU to mcg for vitamin D
    'IU:vitaminA': (val) => val / 3.33, // Convert IU to mcg RAE for vitamin A
  };

  const converter =
    conversions[`${nutrient.unit.toLowerCase()}:${nutrient.key}`] ||
    conversions[nutrient.unit.toLowerCase()] ||
    ((val) => val);

  return converter(nutrient.value);
};

export const standardizeNutritionData = (data: any) => {
  return {
    calories: convertNutrientToStandard(data.calories),
    protein: convertNutrientToStandard(data.protein),
    fats: convertNutrientToStandard(data.totalFat),
    carbs: convertNutrientToStandard(data.totalCarbohydrates),
    fiber: convertNutrientToStandard(data.fiber),
    micronutrients: {
      vitaminA: convertNutrientToStandard(data.vitaminA),
      vitaminC: convertNutrientToStandard(data.vitaminC),
      vitaminD: convertNutrientToStandard(data.vitaminD),
      vitaminB12: convertNutrientToStandard(data.vitaminB12),
      calcium: convertNutrientToStandard(data.calcium),
      iron: convertNutrientToStandard(data.iron),
      magnesium: convertNutrientToStandard(data.magnesium),
    },
  };
};
