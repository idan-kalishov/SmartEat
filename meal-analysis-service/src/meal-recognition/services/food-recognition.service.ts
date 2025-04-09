import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { MealRecognitionResult } from '../types/MealRecognitionResult.interface';

@Injectable()
export class FoodRecognitionService {
  private readonly geminiPrompt = `
    The system should accurately detect and label various foods displayed in the image, providing the name, USDA-compatible food label, and approximate weight in grams for each item.
    Do not group multiple ingredients into a single label. Always separate combined dishes into their individual food components. For example, if the image shows creamy mushroom pasta, the output should include separate entries for cream, mushrooms, and pasta.
    Whenever possible, use a USDA-standard food description for the usdaFoodLabel field to avoid ambiguity,
    Do not specify whether the food is raw, cooked, or processed. For example, use "chicken" instead of "cooked chicken" or "raw chicken.". This label should match closely with how the USDA FoodData Central describes the food item (e.g., "Rice, white, long-grain" instead of just "rice").
    If the item is exotic, uncommon, or not listed in USDA FoodData Central (e.g., edamame, rambutan, mochi), use the common name for both the foodName and usdaFoodLabel fields.
    The final response must be a strictly valid JSON list. Each element in the list must be an object representing one single identified food item and must adhere precisely to the format below.
    Use this format:
    [
      {
        "foodName": "<common name as seen in image>",
        "usdaFoodLabel": "<USDA-standardized description>",
        "weight": <weight_in_grams>
      }
    ]
    Do not include any additional text, explanations, or comments outside the JSON structure.
      `;

  constructor(private readonly httpService: HttpService) {}

  async analyzeMeal(
    file: Express.Multer.File,
  ): Promise<MealRecognitionResult[]> {
    // Step 1: Use Gemini to identify food items
    const geminiResponse = await this.callGeminiApi(file);

    const results = await Promise.all(
      geminiResponse.map(async (item) => {
        try {
          const nutrition = await this.fetchNutritionData(
            item.usdaFoodLabel?.replace(/['"`]/g, '').trim() || item.foodName,
          );
          return {
            foodName: item.foodName,
            weight: item.weight,
            nutrition: {
              per100g: nutrition,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching nutritional data for "${item.foodName}":`,
            error,
          );
          return {
            foodName: item.foodName,
            weight: item.weight,
            nutrition: {
              per100g: null, // Indicate missing data
            },
          };
        }
      }),
    );

    return results;
  }

  private async callGeminiApi(
    file: Express.Multer.File,
  ): Promise<MealRecognitionResult[]> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const input = [
      { text: this.geminiPrompt },
      {
        inlineData: {
          mimeType: file.mimetype,
          data: file.buffer.toString('base64'),
        },
      },
    ];

    const result = await model.generateContent(input);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json|```/g, '').trim();

    try {
      const parsedResponse = JSON.parse(responseText);
      return parsedResponse;
    } catch (error) {
      throw new Error('Invalid JSON response from Gemini API');
    }
  }

  /**
   * Fetch nutritional data for multiple food items.
   * @param foodNames Array of food item names.
   * @returns Array of objects containing food name and nutrition details.
   */
  async fetchNutritionDataForIngredients(foodNames: string[]) {
    console.log(foodNames);
    const results = await Promise.all(
      foodNames.map(async (foodName) => {
        try {
          const nutrition = await this.fetchNutritionData(foodName);
          return {
            name: foodName,
            nutrition: {
              per100g: nutrition,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching nutritional data for "${foodName}":`,
            error,
          );
          return {
            name: foodName,
            nutrition: null, // Return null if data cannot be fetched
          };
        }
      }),
    );

    return results;
  }

  private async fetchNutritionData(foodName: string) {
    console.log(foodName);
    const apiBaseUrl = 'https://api.nal.usda.gov/fdc/v1/foods/search';
    const apiKey = process.env.USDA_API_KEY;

    const dataTypePriority = [
      'Branded',
      'Foundation',
      'Survey (FNDDS)',
      'SRLegacy',
    ];
    const fetchDataForType = async (dataType: string) => {
      const url = `${apiBaseUrl}?api_key=${apiKey}&query=${encodeURIComponent(foodName)}&dataType=${dataType}&pageSize=1`;
      const response = await lastValueFrom(this.httpService.get(url));
      return response.data.foods[0]; // Return the first result
    };

    let foodItem = null;
    for (const dataType of dataTypePriority) {
      foodItem = await fetchDataForType(dataType);
      if (foodItem) break;
    }

    if (!foodItem) {
      throw new Error(`No nutritional data found for "${foodName}"`);
    }

    // Define the nutrient definitions
    const nutrientDefinitions = [
      { name: 'Energy', unit: 'kcal' },
      { name: 'Total lipid (fat)', unit: 'g' },
      { name: 'Carbohydrate, by difference', unit: 'g' },
      { name: 'Sugars, total including NLEA', unit: 'g' },
      { name: 'Protein', unit: 'g' },
      { name: 'Iron, Fe', unit: 'mg' },
      { name: 'Fiber, total dietary', unit: 'g' },
      { name: 'Vitamin A, RAE', unit: 'µg' },
      { name: 'Vitamin C, total ascorbic acid', unit: 'mg' },
      { name: 'Vitamin D (D2 + D3)', unit: 'µg' },
      { name: 'Vitamin B-12', unit: 'µg' },
      { name: 'Calcium, Ca', unit: 'mg' },
      { name: 'Magnesium, Mg', unit: 'mg' },
    ];

    const nutritionData = nutrientDefinitions.reduce(
      (acc, nutrient) => {
        const nutrientInfo = (foodItem as any).foodNutrients.find(
          (n) =>
            n.nutrientName &&
            n.nutrientName.toLowerCase().includes(nutrient.name.toLowerCase()),
        );
        let value = nutrientInfo?.value || 0;
        let unit = nutrientInfo?.unitName
          ? nutrientInfo.unitName.toLowerCase()
          : nutrient.unit;

        if (nutrient.name === 'Energy' && unit === 'kj') {
          value = value / 4.184; // Convert kJ to kcal
          unit = 'kcal';
        }

        acc[nutrient.name] = { value, unit };
        return acc;
      },
      {} as Record<string, { value: number; unit: string }>,
    );

    // Return the structured nutrition data
    return {
      calories: nutritionData['Energy'],
      totalFat: nutritionData['Total lipid (fat)'],
      totalCarbohydrates: nutritionData['Carbohydrate, by difference'],
      sugars: nutritionData['Sugars, total including NLEA'],
      protein: nutritionData['Protein'],
      iron: nutritionData['Iron, Fe'],
      fiber: nutritionData['Fiber, total dietary'],
      vitaminA: nutritionData['Vitamin A, RAE'],
      vitaminC: nutritionData['Vitamin C, total ascorbic acid'],
      vitaminD: nutritionData['Vitamin D (D2 + D3)'],
      vitaminB12: nutritionData['Vitamin B-12'],
      calcium: nutritionData['Calcium, Ca'],
      magnesium: nutritionData['Magnesium, Mg'],
    };
  }
}
