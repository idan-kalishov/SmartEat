import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { nutritionDTO } from '../types/MealRecognitionResult.interface';
import { MealRecognitionResult } from 'src/generated/food-recognition';

@Injectable()
export class FoodRecognitionService {
  private readonly geminiPrompt = `
    The system should accurately detect and label various foods displayed in the image, providing the name, USDA-compatible food label, and approximate weight in grams for each item.
    Do not group multiple ingredients into a single label. Always separate combined dishes into their individual food components. For example, if the image shows creamy mushroom pasta, the output should include separate entries for cream, mushrooms, and pasta.
    Use a USDA-compatible food description for the usdaFoodLabel field, but prefer simplified, commonly used labels that are effective for general categorization and search. For example, use "Chicken thigh" instead of "Chicken, broiler, meat and skin" if that matches the image better.
    Avoid overly detailed or scientific USDA entries that may hinder usability. Prioritize clarity and search relevance over exact USDA phrasing when needed.
    If multiple items of the same food are present (e.g., two chicken thighs), **combine them into a single entry** and sum their total estimated weight.
    Do not specify whether the food is raw, cooked, or processed. For example, use "chicken" instead of "cooked chicken" or "raw chicken". This label should match the general item as it would appear in a typical meal.
    If the item is exotic, uncommon, or not listed in USDA FoodData Central (e.g., edamame, rambutan, mochi), use the common name for both the foodName and usdaFoodLabel fields.
    The final response must be a strictly valid JSON list. Each element in the list must be an object representing one single identified food item and must adhere precisely to the format below.
    Use this format:
    [
      {
        "foodName": "<common name as seen in image>",
        "usdaFoodLabel": "<USDA-compatible or simplified food label>",
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

    const input: any = [
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

  private async fetchNutritionData(foodName: string): Promise<any> {
    const apiBaseUrl = 'https://api.nal.usda.gov/fdc/v1/foods/search';
    const apiKey = process.env.USDA_API_KEY;

    // 1. Clean and prepare the search term
    const cleanedName = foodName
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\b(sliced|chopped|diced|raw|cooked)\b/gi, '')
      .trim()
      .toLowerCase();

    // 2. Execute parallel searches for Foundation and Branded data types
    const [foundationResults, brandedResults] = await Promise.all([
      this.searchUSDA(cleanedName, 'Foundation', 5),
      this.searchUSDA(cleanedName, 'Branded', 5),
    ]);

    // 3. Find best match across both result sets
    const allResults = [...foundationResults, ...brandedResults];
    const bestMatch =
      allResults.length > 0
        ? allResults.reduce((best, current) => {
            const currentScore = this.calculateMatchScore(
              cleanedName,
              current.description,
              current.dataType,
            );
            const bestScore = best
              ? this.calculateMatchScore(
                  cleanedName,
                  best.description,
                  best.dataType,
                )
              : 0;
            return currentScore > bestScore ? current : best;
          })
        : null;

    // 4. If no good match found, try a broader search
    const foodItem =
      bestMatch?.score >= 0.7
        ? bestMatch
        : await this.fallbackSearch(cleanedName);

    if (!foodItem) {
      throw new Error(`No nutritional data found for "${foodName}"`);
    }

    // 5. Extract and format the nutrition data
    const nutrientMap = {
      Energy: { key: 'calories', unit: 'kcal' },
      'Total lipid (fat)': { key: 'totalFat', unit: 'g' },
      'Carbohydrate, by difference': { key: 'totalCarbohydrates', unit: 'g' },
      'Sugars, total including NLEA': { key: 'sugars', unit: 'g' },
      Protein: { key: 'protein', unit: 'g' },
      'Iron, Fe': { key: 'iron', unit: 'mg' },
      'Fiber, total dietary': { key: 'fiber', unit: 'g' },
      'Vitamin A, RAE': { key: 'vitaminA', unit: 'µg' },
      'Vitamin C, total ascorbic acid': { key: 'vitaminC', unit: 'mg' },
      'Vitamin D (D2 + D3)': { key: 'vitaminD', unit: 'µg' },
      'Vitamin B-12': { key: 'vitaminB12', unit: 'µg' },
      'Calcium, Ca': { key: 'calcium', unit: 'mg' },
      'Magnesium, Mg': { key: 'magnesium', unit: 'mg' },
    };

    const result: any = {};

    Object.entries(nutrientMap).forEach(([nutrientName, { key, unit }]) => {
      const nutrient = foodItem.foodNutrients?.find((n: any) =>
        n.nutrientName?.toLowerCase().includes(nutrientName.toLowerCase()),
      );

      let value = nutrient?.value || 0;
      let actualUnit = nutrient?.unitName?.toLowerCase() || unit;

      // Special handling for energy units
      if (nutrientName === 'Energy' && actualUnit === 'kj') {
        value = value / 4.184; // Convert kJ to kcal
        actualUnit = 'kcal';
      }

      result[key] = { value, unit: actualUnit };
    });

    return result;
  }

  private async searchUSDA(
    query: string,
    dataType?: string,
    pageSize = 5,
  ): Promise<any[]> {
    const apiBaseUrl = 'https://api.nal.usda.gov/fdc/v1/foods/search';
    const apiKey = process.env.USDA_API_KEY;

    const params = {
      api_key: apiKey,
      query: encodeURIComponent(query),
      pageSize,
      ...(dataType && { dataType }),
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(apiBaseUrl, { params }),
      );
      return response.data.foods || [];
    } catch (error) {
      console.error(`USDA search failed for ${query} (${dataType}):`, error);
      return [];
    }
  }

  private async fallbackSearch(cleanedName: string): Promise<any | null> {
    const fallbackResults = await this.searchUSDA(cleanedName, undefined, 10);
    if (fallbackResults.length === 0) return null;

    return fallbackResults.reduce((best, current) => {
      const currentScore = this.calculateMatchScore(
        cleanedName,
        current.description,
        current.dataType,
      );
      const bestScore = best
        ? this.calculateMatchScore(cleanedName, best.description, best.dataType)
        : 0;
      return currentScore > bestScore && currentScore >= 0.5 ? current : best;
    }, null);
  }

  private calculateMatchScore(
    searchTerm: string,
    description: string,
    dataType?: string,
  ): number {
    const searchWords = searchTerm.split(' ').filter((w) => w.length > 2);
    const descWords = description.toLowerCase().split(/[ ,]+/);

    // Word matches (60% weight)
    const wordMatchScore =
      searchWords.reduce(
        (score, word) =>
          score + (descWords.some((dw) => dw.includes(word)) ? 1 : 0),
        0,
      ) / Math.max(1, searchWords.length);

    // Data type priority (30% weight) - with proper type safety
    const typeScores: Record<string, number> = {
      Foundation: 1.0,
      Branded: 0.9,
      'SR Legacy': 0.9,
      'Survey (FNDDS)': 0.8,
    };
    const typeScore = dataType ? (typeScores[dataType] ?? 0.5) : 0.6;

    // Length similarity (10% weight)
    const lengthScore =
      1 - Math.min(1, Math.abs(searchTerm.length - description.length) / 50);

    return wordMatchScore * 0.6 + typeScore * 0.3 + lengthScore * 0.1;
  }
}
