import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { MealRecognitionResult } from '../types/MealRecognitionResult.interface';

@Injectable()
export class FoodRecognitionService {
  private readonly geminiPrompt = `
    You have to identify different types of food in images. 
    The system should accurately detect and label various foods displayed in the image, providing the name 
    based on the detected items. For each food item, provide its weight in grams, and detailed nutritional values per 100 grams.
    The nutritional values must include the following: calories, total fat, total carbohydrates, sugars, protein, iron.
    The response must be strictly valid JSON and adhere to this format: 
    [
      { 
        "foodName": "<name>", 
        "weight": <weight_in_grams>,
        "nutrition": {
          "calories": <calories>,
          "totalFat": <total_fat>,
          "sugars": <sugars>,
          "protein": <protein>,
          "iron": <iron>,
        }
      }
    ].
    Do not include any additional text, explanations, or comments outside the JSON structure.
  `;

  constructor(private readonly httpService: HttpService) {}

  async analyzeMeal(
    file: Express.Multer.File,
  ): Promise<MealRecognitionResult[]> {
    const geminiResponse = await this.callGeminiApi(file);

    const results: any[] = [];
    for (const item of geminiResponse) {
      results.push({
        ...item,
        nutrition: {
          per100g: item.nutrition,
        },
      });
    }
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
    console.log(responseText);

    try {
      const parsedResponse = JSON.parse(responseText);
      return parsedResponse;
    } catch (error) {
      throw new Error('Invalid JSON response from Gemini API');
    }
  }

  private async fetchNutritionData(foodName: string): Promise<any> {
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=${encodeURIComponent(foodName)}`;
    const response = await lastValueFrom(this.httpService.get(url));
    const foodItem = response.data.foods[0];
    return {
      calories:
        foodItem.foodNutrients.find((n) => n.nutrientName === 'Energy')
          ?.value || 0,
      totalFat:
        foodItem.foodNutrients.find(
          (n) => n.nutrientName === 'Total lipid (fat)',
        )?.value || 0,
      sodium:
        foodItem.foodNutrients.find((n) => n.nutrientName === 'Sodium, Na')
          ?.value || 0,
      sugars:
        foodItem.foodNutrients.find(
          (n) => n.nutrientName === 'Sugars, total including NLEA',
        )?.value || 0,
      protein:
        foodItem.foodNutrients.find((n) => n.nutrientName === 'Protein')
          ?.value || 0,
      calcium:
        foodItem.foodNutrients.find((n) => n.nutrientName === 'Calcium, Ca')
          ?.value || 0,
      iron:
        foodItem.foodNutrients.find((n) => n.nutrientName === 'Iron, Fe')
          ?.value || 0,
    };
  }
}
