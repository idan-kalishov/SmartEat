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
      try {
        const fallbackAdvice =
          await this.verificationService.getFallbackAdvice();
        verifiedRecommendations.push(fallbackAdvice);
      } catch (error) {
        console.warn('Fallback advice unavailable, using default:', error);
        verifiedRecommendations.push(
          'Focus on balanced nutrition and regular exercise for the remainder of today.',
        );
      }
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

  async getDailyOpinion(request: any): Promise<any> {
    const prompt = this.buildDailyOpinionPrompt(request);
    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();
    let response = this.parseDailyOpinionResponse(responseText);

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
      try {
        const fallbackAdvice =
          await this.verificationService.getFallbackAdvice();
        verifiedRecommendations.push(fallbackAdvice);
      } catch (error) {
        console.warn('Fallback advice unavailable, using default:', error);
        verifiedRecommendations.push(
          'Focus on balanced nutrition and regular exercise for the remainder of today.',
        );
      }
    }

    return {
      ...response,
      recommendations: verifiedRecommendations,
      verificationStatus: anyInvalid ? 'modified' : 'original',
    };
  }

  private buildDailyOpinionPrompt(request: any): string {
    const user = request.user;
    const currentProgress = request.currentProgress;
    const remainingNeeds = request.remainingNeeds;
    const dailyGoals = request.dailyGoals;
    const currentTime = request.currentTime;

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
      Act as a professional yet approachable nutritionist and fitness coach providing personalized advice for the remainder of the day.
      
      CRITICAL: You have ALL the data needed. Do NOT ask for more information. Focus ONLY on the current day (today), never mention tomorrow or future days.
      
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

      CURRENT PROGRESS (${currentTime}):
      - Calories consumed: ${currentProgress.nutrition.calories} / ${dailyGoals.nutrition.calories}
      - Protein consumed: ${currentProgress.nutrition.protein}g / ${dailyGoals.nutrition.protein}g
      - Fats consumed: ${currentProgress.nutrition.fats}g / ${dailyGoals.nutrition.fats}g
      - Carbs consumed: ${currentProgress.nutrition.carbs}g / ${dailyGoals.nutrition.carbs}g
      - Exercise completed: ${currentProgress.exercise} minutes / ${dailyGoals.exercise} minutes

      REMAINING NEEDS:
      - Calories needed: ${remainingNeeds.nutrition.calories}
      - Protein needed: ${remainingNeeds.nutrition.protein}g
      - Fats needed: ${remainingNeeds.nutrition.fats}g
      - Carbs needed: ${remainingNeeds.nutrition.carbs}g
      - Exercise needed: ${remainingNeeds.exercise} minutes

      Instructions:
      1. Start with one encouraging sentence about their progress so far TODAY.
      2. Provide 2-3 specific, actionable recommendations for the REMAINDER OF TODAY ONLY.
      3. Consider the current time and what's realistic to achieve in the remaining hours of today.
      4. Focus on both nutrition and exercise balance for today.
      5. Keep suggestions practical and aligned with their goals and restrictions.
      6. NEVER ask for more data - you have everything needed.
      7. NEVER mention tomorrow, next week, or future days - only focus on today.

      Response format (JSON):
      {
        "positive_feedback": "string",
        "recommendations": ["string"]
      }

      Guidelines:
      - Be encouraging and supportive about today's progress
      - Provide realistic, time-sensitive advice for today only
      - Consider their dietary restrictions and preferences
      - Balance nutrition and exercise recommendations for today
      - Keep the tone motivating and actionable
      - Use the data provided - do not request additional information
      - Focus on immediate, actionable steps for the remainder of today
    `;
  }

  private parseDailyOpinionResponse(text: string): {
    recommendations: string[];
    positiveFeedback: string;
  } {
    const response: { recommendations: string[]; positiveFeedback: string } = {
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
          'Focus on balanced meals for the remainder of today',
          'Consider light exercise to meet your daily activity goals for today',
        ];
      }

      // Set positive feedback
      response.positiveFeedback =
        json.positive_feedback || "You're making great progress today!";
    } catch (e) {
      console.error('Failed to parse Gemini daily opinion response:', e);
      response.recommendations = [
        'Maintain a balanced approach to nutrition and exercise for the remainder of today',
        'Listen to your body and adjust as needed for today',
      ];
      response.positiveFeedback =
        "You're doing great today! Keep up the momentum for the rest of the day.";
    }

    return response;
  }
}
