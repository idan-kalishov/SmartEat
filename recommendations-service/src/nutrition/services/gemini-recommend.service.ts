import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  AIRecommendRequest,
  AIRecommendResponse,
  DietaryPreference,
  Allergy,
  ActivityLevel,
  WeightGoal,
  NutritionData,
  Gender,
} from '@generated/nutrition_pb';

@Injectable()
export class GeminiRecommendService {
  private readonly genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY ?? '',
  );
  private readonly model = this.genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  async getRecommendations(
    request: AIRecommendRequest,
  ): Promise<AIRecommendResponse> {
    const prompt = this.buildPrompt(request);
    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();

    return this.parseResponse(responseText);
  }

  private buildPrompt(request: AIRecommendRequest): string {
    const user = request.user; // Direct property access
    const ingredients = request.ingredients; // Direct property access
    const nutrition = request.nutrition; // Direct property access

    // Build dietary restrictions text
    let restrictionsText = '';
    if (user?.dietaryRestrictions) {
      const restrictions = user.dietaryRestrictions;

      // Dietary preferences
      if (
        restrictions.preference !== DietaryPreference.DIETARY_PREFERENCE_NONE
      ) {
        restrictionsText += `Dietary Preference: ${DietaryPreference[restrictions.preference]}\n`;
      }

      // Allergies
      const allergies = restrictions.allergies
        .filter((a) => a !== Allergy.ALLERGY_NONE)
        .map((a) => Allergy[a]);
      if (allergies.length > 0) {
        restrictionsText += `Allergies: ${allergies.join(', ')}\n`;
      }

      // Disliked ingredients
      const disliked = restrictions.dislikedIngredients;
      if (disliked.length > 0) {
        restrictionsText += `Avoid: ${disliked.join(', ')}\n`;
      }
    }

    return `
      Act as a professional nutritionist providing meal recommendations.
      
      USER PROFILE:
      ${
        user
          ? `
      - Age: ${user.age}
      - Gender: ${user.gender === Gender.GENDER_MALE ? 'Male' : 'Female'}
      - Weight: ${user.weightKg} kg
      - Height: ${user.heightCm} cm
      - Activity Level: ${ActivityLevel[user.activityLevel]}
      - Goal: ${WeightGoal[user.weightGoal]}
      ${restrictionsText ? `\nDIETARY RESTRICTIONS:\n${restrictionsText}` : ''}
      `
          : 'No user profile provided'
      }
      
      MEAL DETAILS:
      - Ingredients: ${ingredients.join(', ') || 'None listed'}
      ${
        nutrition
          ? `
      - Calories: ${nutrition.calories?.value || 'N/A'} ${nutrition.calories?.unit || ''}
      - Protein: ${nutrition.protein?.value || 'N/A'} ${nutrition.protein?.unit || ''}
      - Carbs: ${nutrition.carbs?.value || 'N/A'} ${nutrition.carbs?.unit || ''}
      - Fats: ${nutrition.fats?.value || 'N/A'} ${nutrition.fats?.unit || ''}
      `
          : 'No nutrition data provided'
      }
      
      Provide:
      1. 2-3 specific recommendations to improve this meal for the user's goals and restrictions
      2. One positive affirmation about the meal's current qualities
      
      Format your response as JSON with these keys:
      {
        "recommendations": ["string", "string", "string"],
        "positive_feedback": "string"
      }
      
      Important rules:
      - Never suggest anything that conflicts with dietary restrictions
      - Prioritize suggestions that align with both goals and restrictions
      - Keep recommendations practical and actionable
      - Make positive feedback genuine and specific
    `;
  }

  private parseResponse(text: string): AIRecommendResponse {
    // Create a plain object conforming to the AIRecommendResponse interface
    const response: AIRecommendResponse = {
      recommendations: [],
      positiveFeedback: '',
    };

    try {
      const cleanedText = text.replace(/```json|```/g, '');
      const json = JSON.parse(cleanedText);

      // Set recommendations (limit to 3)
      if (Array.isArray(json.recommendations)) {
        response.recommendations = json.recommendations.slice(0, 3);
      } else {
        response.recommendations = [
          'Consider adding more vegetables for fiber and nutrients',
          'Ensure protein portions align with your goals',
        ];
      }

      // Set positive feedback
      response.positiveFeedback =
        json.positive_feedback ||
        'Your meal has a good foundation to build upon';
    } catch (e) {
      console.error('Failed to parse Gemini response:', e);
      response.recommendations = [
        'Balance your plate with protein, carbs, and healthy fats',
        'Choose whole food options when possible',
      ];
      response.positiveFeedback =
        'Every meal is an opportunity for nourishment!';
    }

    return response;
  }
}
