import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LlamaVerificationService {
  constructor(private readonly httpService: HttpService) {}

  private async queryLlama(prompt: string): Promise<string> {
    const groqApiKey = process.env.GROQ_API_KEY ?? '';
    console.log(`this api key ${groqApiKey}`);
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          {
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.1, // Lower temperature for more deterministic responses
            max_tokens: 50,
          },
          {
            headers: {
              Authorization: `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return response.data.choices[0]?.message?.content?.trim() || '';
    } catch (error) {
      console.error('Llama verification failed', error);
      throw new Error('AI verification service unavailable');
    }
  }

  async verifyNutritionAdvice(advice: string): Promise<{
    isValid: boolean;
    correctedAdvice?: string;
    reason?: string;
  }> {
    // First check with simple rules
    const quickCheck = this.quickSafetyCheck(advice);
    if (!quickCheck.isValid) {
      return quickCheck;
    }

    // Then verify with Llama
    try {
      const validationPrompt = `Analyze this nutrition advice strictly. Respond ONLY with:
- "VALID" if the advice is scientifically sound and safe and does not include any fictional data or ingredient
- "INVALID: [reason]" if problematic
- "UNCERTAIN" if unsure

Advice: ${advice}`;

      const llamaResponse = await this.queryLlama(validationPrompt);

      if (llamaResponse.startsWith('VALID')) {
        return { isValid: true };
      }

      if (llamaResponse.startsWith('INVALID')) {
        const reason = llamaResponse.split(':')[1]?.trim();
        const corrected = await this.getCorrectedAdvice(advice, reason);
        return {
          isValid: false,
          correctedAdvice: corrected,
          reason: reason || 'Invalid nutrition advice',
        };
      }

      // If uncertain or error, fall back to conservative approach
      return {
        isValid: false,
        correctedAdvice: await this.getFallbackAdvice(),
        reason: 'Uncertain verification result',
      };
    } catch (error) {
      console.warn(
        'Falling back to conservative advice due to verification error',
      );
      return {
        isValid: false,
        correctedAdvice: await this.getFallbackAdvice(),
        reason: 'Verification service failed',
      };
    }
  }

  private quickSafetyCheck(advice: string): {
    isValid: boolean;
    correctedAdvice?: string;
    reason?: string;
  } {
    const DANGEROUS_PATTERNS = [
      {
        pattern: /fast(?:ing)? for \d+ hours/i,
        reason: 'Extreme fasting recommendations',
      },
      {
        pattern: /eliminate all (carbs|fats)/i,
        reason: 'Overly restrictive diet',
      },
      {
        pattern: /(miracle|instant) (weight loss|results)/i,
        reason: 'Unrealistic claims',
      },
      {
        pattern: /(detox|cleanse)(?!ification|r)/i,
        reason: 'Pseudoscientific concepts',
      },
    ];

    for (const { pattern, reason } of DANGEROUS_PATTERNS) {
      if (pattern.test(advice)) {
        return {
          isValid: false,
          reason,
          correctedAdvice:
            'Consider consulting a nutritionist for personalized advice',
        };
      }
    }

    return { isValid: true };
  }

  private async getCorrectedAdvice(
    originalAdvice: string,
    problem: string,
  ): Promise<string> {
    const correctionPrompt = `The following nutrition advice was rejected because: ${problem}
    
Original advice: ${originalAdvice}

Please provide a corrected version that maintains the original intent but is scientifically valid and safe. Respond ONLY with the corrected advice.`;

    try {
      return await this.queryLlama(correctionPrompt);
    } catch (error) {
      return this.getFallbackAdvice();
    }
  }

  async getFallbackAdvice(): Promise<string> {
    // Pre-approved generic advice
    const FALLBACK_ADVICES = [
      'A balanced meal with lean protein, whole grains, and vegetables is recommended',
      'Consider including a variety of colorful vegetables with your meal',
      'Portion control and balanced macronutrients are key for healthy eating',
    ];
    return FALLBACK_ADVICES[
      Math.floor(Math.random() * FALLBACK_ADVICES.length)
    ];
  }
}
