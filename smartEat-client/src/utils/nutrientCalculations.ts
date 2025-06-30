// utils/nutrientCalculations.ts
import { Ingredient } from "@/types/common";

const nutrientKeys = [
    "calories",
    "totalFat",
    "totalCarbohydrates",
    "sugars",
    "protein",
    "fiber",
    "iron",
    "vitaminA",
    "vitaminC",
    "vitaminD",
    "vitaminB12",
    "calcium",
    "magnesium",
] as const;

export type NutrientKey = (typeof nutrientKeys)[number];

export const calculateTotalNutrition = (ingredients: Ingredient[]) => {
    const baseNutrition = nutrientKeys.reduce(
        (acc, key) => {
            acc[key] = 0;
            return acc;
        },
        { totalWeight: 0 } as Record<NutrientKey, number> & {
            totalWeight: number;
        }
    );

    return ingredients.reduce((acc, ingredient) => {
        const weight = ingredient.weight || 0;
        const factor = weight / 100;
        const data = ingredient.nutrition.per100g;

        acc.totalWeight += weight;
        nutrientKeys.forEach((key) => {
            acc[key] += (data[key]?.value || 0) * factor;
        });

        return acc;
    }, baseNutrition);
};

export const adjustNutritionForServing = (
    nutrition: ReturnType<typeof calculateTotalNutrition>,
    servingSize: number
) => {
    return {
        ...nutrition,
        ...nutrientKeys.reduce((acc, key) => {
            acc[key] = nutrition[key] * servingSize;
            return acc;
        }, {} as Record<NutrientKey, number>),
        totalWeight: nutrition.totalWeight * servingSize,
    };
};
