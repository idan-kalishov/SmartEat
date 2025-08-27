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
import { LlamaVerificationService } from './LlamaVerificationService.service';

@Injectable()
export class GeminiRecommendService {
  constructor(private readonly verificationService: LlamaVerificationService) {}

  private readonly genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY ?? '',
  );
  private readonly model = this.genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  async getRecommendations(
    request: AIRecommendRequest,
  ): Promise<AIRecommendResponse & { verificationStatus: string }> {
    const prompt = this.buildPrompt(request);
    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();
    let response = this.parseResponse(responseText);

    // Verify each recommendation individually
    const verifiedRecommendations: string[] = [];
    let anyInvalid = false;

    for (const recommendation of response.recommendations) {
      const verification =
        await this.verificationService.verifyNutritionAdvice(recommendation);

      if (verification.isValid) {
        verifiedRecommendations.push(recommendation);
      } else {
        anyInvalid = true;
        console.warn(
          `Invalid recommendation detected: ${verification.reason}`,
          { original: recommendation },
        );
        if (verification.correctedAdvice) {
          verifiedRecommendations.push(verification.correctedAdvice);
        }
      }
    }

    // If all recommendations were invalid, use completely fallback advice
    if (anyInvalid && verifiedRecommendations.length === 0) {
      verifiedRecommendations.push(
        await this.verificationService.getFallbackAdvice(),
      );
    }

    return {
      ...response,
      recommendations: verifiedRecommendations,
      verificationStatus: anyInvalid ? 'modified' : 'original',
    };
  }

  private buildPrompt(request: AIRecommendRequest): string {
    const user = request.user;
    const ingredients = request.ingredients;
    const nutrition = request.nutrition;

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
      if (disliked?.length > 0) {
        restrictionsText += `Avoid: ${disliked.join(', ')}\n`;
      }
    }

    return `
      Act as a professional yet approachable nutritionist providing meal recommendations.
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
      ${restrictionsText ? `\nDIETARY RESTRICTIONS:\n${restrictionsText}` : ''}`
          : 'No user profile provided'
      }

      MEAL DETAILS:
      - Ingredients: ${ingredients?.join(', ') || 'None listed'}
      ${
        nutrition
          ? `
      - Calories: ${nutrition.calories?.value || 'N/A'} ${nutrition.calories?.unit || ''}
      - Protein: ${nutrition.protein?.value || 'N/A'} ${nutrition.protein?.unit || ''}
      - Carbs: ${nutrition.carbs?.value || 'N/A'} ${nutrition.carbs?.unit || ''}
      - Fats: ${nutrition.fats?.value || 'N/A'} ${nutrition.fats?.unit || ''}`
          : 'No nutrition data provided'
      }

      Instructions:
     1. Start with one short sentence of positive feedback, highlighting what is already good about the meal.
    2. Provide specific recommendations one VERY specific improvement for THESE ingredients",
      Second precise suggestion for THESE ingredients, focusing on clear and actionable improvements.

      Response format (JSON):
      {
        "positive_feedback": "string",
        "recommendations": ["string"]
      }

      Guidelines:
      - Maintain a balance between warmth and professionalism.
      - Keep suggestions practical and easy to implement.
      - Avoid technical jargon; use approachable, conversational language.
      - Ensure feedback aligns with dietary restrictions and personal goals.
      - Keep the tone encouraging and supportive throughout.
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
