import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { MealRecognitionResult } from '../types/MealRecognitionResult.interface';

@Injectable()
export class FoodRecognitionService {
  private readonly geminiPrompt = `
    The system should accurately detect and label various foods displayed in the image, providing the name and approximate weight in grams for each item.
    Do not group multiple ingredients into a single label. Always separate combined dishes into their individual food components. For example, if the image shows creamy mushroom pasta, the output should include separate entries for cream, mushrooms, and pasta.
    The final response must be a strictly valid JSON list. Each element in the list must be an object representing one single identified food item and must adhere precisely to the format below.
    Use this format:
        [
          { 
            "foodName": "<name>", 
            "weight": <weight_in_grams>
          }
        ].
        Do not include any additional text, explanations, or comments outside the JSON structure.
      `;

  constructor(private readonly httpService: HttpService) {}

  async analyzeMeal(
    file: Express.Multer.File,
  ): Promise<MealRecognitionResult[]> {
    // Step 1: Use Gemini to identify food items
    const geminiResponse = await this.callGeminiApi(file);

    // Step 2: Fetch nutritional data for each identified food item
    const results = await Promise.all(
      geminiResponse.map(async (item) => {
        try {
          const nutrition = await this.fetchNutritionData(item.foodName);
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
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(foodName)}&dataType=Foundation,SRLegacy,Survey%20(FNDDS),Branded&pageSize=1`;
    const response = await lastValueFrom(this.httpService.get(url));
    console.log(JSON.stringify(response.data.foods[0]));
    const foodItem = response.data.foods[0];

    if (!foodItem) {
      throw new Error(`No nutritional data found for "${foodName}"`);
    }

    return {
      calories: {
        value:
          foodItem.foodNutrients.find((n) => n.nutrientName === 'Energy')
            ?.value || 0,
        unit:
          foodItem.foodNutrients.find((n) => n.nutrientName === 'Energy')
            ?.unitName || 'kcal',
      },
      totalFat: {
        value:
          foodItem.foodNutrients.find(
            (n) => n.nutrientName === 'Total lipid (fat)',
          )?.value || 0,
        unit:
          foodItem.foodNutrients.find(
            (n) => n.nutrientName === 'Total lipid (fat)',
          )?.unitName || 'g',
      },
      totalCarbohydrates: {
        value:
          foodItem.foodNutrients.find(
            (n) => n.nutrientName === 'Carbohydrate, by difference',
          )?.value || 0,
        unit:
          foodItem.foodNutrients.find(
            (n) => n.nutrientName === 'Carbohydrate, by difference',
          )?.unitName || 'g',
      },
      sugars: {
        value:
          foodItem.foodNutrients.find(
            (n) => n.nutrientName === 'Sugars, total including NLEA',
          )?.value || 0,
        unit:
          foodItem.foodNutrients.find(
            (n) => n.nutrientName === 'Sugars, total including NLEA',
          )?.unitName || 'g',
      },
      protein: {
        value:
          foodItem.foodNutrients.find((n) => n.nutrientName === 'Protein')
            ?.value || 0,
        unit:
          foodItem.foodNutrients.find((n) => n.nutrientName === 'Protein')
            ?.unitName || 'g',
      },
      iron: {
        value:
          foodItem.foodNutrients.find((n) => n.nutrientName === 'Iron, Fe')
            ?.value || 0,
        unit:
          foodItem.foodNutrients.find((n) => n.nutrientName === 'Iron, Fe')
            ?.unitName || 'mg',
      },
    };
  }
}
