import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Response as ExpressResponse, Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from '../generated/nutrition';

@Injectable()
export class AuthGatewayService {
  private readonly authServiceBaseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.authServiceBaseUrl =
      `${process.env.AUTH_SERVICE_URL || 'http://localhost:3000'}/auth`;
  }

  async forwardLogin(
    loginData: { email: string; password: string },
    res: ExpressResponse,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceBaseUrl}/login`, loginData, {
          withCredentials: true,
        }),
      );

      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        res.setHeader('Set-Cookie', setCookieHeader);
      }

      return res.send(response.data);
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  async forwardRegister(registerData: {
    email: string;
    userName: string;
    password: string;
  }) {
    const a = this.httpService.post(
      `${this.authServiceBaseUrl}/register`,
      registerData,
    );
    const response = await firstValueFrom(a);
    return response.data;
  }

  async forwardGoogleAuth(googleAuthData: { idToken: string }, res: ExpressResponse) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceBaseUrl}/google`, googleAuthData, {
          withCredentials: true,
        }),
      );

      // Forward cookies from auth service to client
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        res.setHeader('Set-Cookie', setCookieHeader);
      }

      return res.send(response.data);
    } catch (error) {
      console.error('Google auth error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    const a = this.httpService.post(`${this.authServiceBaseUrl}/refresh`, {
      refreshToken,
    });
    const response = await firstValueFrom(a);
    return response.data;
  }

  async logout(res: ExpressResponse) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceBaseUrl}/logout`, null, {
        withCredentials: true,
      }),
    );

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    return res.send(response.data);
  }

  async verifyToken(req: Request) {
    const headers = this.getEssentialHeaders(req);

    const response = await this.httpService.axiosRef.get(
      `${this.authServiceBaseUrl}/verify`,
      {
        headers,
        withCredentials: true,
      },
    );

    return response.data;
  }



  private getEssentialHeaders(req: Request) {
    const essentialHeaders: Record<string, string> = {};

    // Only forward specific headers we need
    if (req.headers['cookie']) {
      essentialHeaders['cookie'] = req.headers['cookie'];
    }
    if (req.headers['authorization']) {
      essentialHeaders['authorization'] = req.headers['authorization'];
    }

    return essentialHeaders;
  }

  async getUserDetails(req: Request) {
    try {
      const headers = this.getEssentialHeaders(req);
      const url = `${this.authServiceBaseUrl}/me`;

      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers,
          withCredentials: true,
          timeout: 5000,
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error in getUserDetails:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateUser(userData: any, req: Request) {
    try {
      const headers = this.getEssentialHeaders(req);
      const url = `${this.authServiceBaseUrl}/update`;

      const response = await firstValueFrom(
        this.httpService.put(url, userData, {
          headers,
          withCredentials: true,
          timeout: 5000,
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error in updateUser:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        stack: error.stack,
      });
      throw error;
    }
  }

  async updateUserProfile(profileData: any, req: Request) {
    try {
      const headers = this.getEssentialHeaders(req);
      const url = `${this.authServiceBaseUrl}/update-profile`;

      const response = await firstValueFrom(
        this.httpService.put(url, profileData, {
          headers,
          withCredentials: true,
          timeout: 5000,
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error in updateUserProfile:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        stack: error.stack,
      });
      throw error;
    }
  }

  async getUserProfile(req: Request): Promise<UserProfile> {
    const userDetails = await this.getUserDetails(req);
    const profile = userDetails?.user?.userProfile;

    // Check if profile exists and has required fields
    const hasValidProfile = profile &&
      typeof profile.age === 'number' &&
      typeof profile.weight_kg === 'number' &&
      typeof profile.height_cm === 'number';

    if (!hasValidProfile) {
      console.warn('No valid user profile found, using default values');
      // Return a complete default profile with all required fields
      return {
        age: 30,
        gender: 0, // GENDER_UNSPECIFIED
        weightKg: 70,
        heightCm: 175,
        activityLevel: 3, // ACTIVITY_LEVEL_MODERATE
        weightGoal: 2, // WEIGHT_GOAL_MAINTAIN
        goalIntensity: 2, // GOAL_INTENSITY_MODERATE
        dietaryRestrictions: {
          preference: 1, // DIETARY_PREFERENCE_NONE
          allergies: [1], // ALLERGY_NONE
          dislikedIngredients: [],
        },
      } as UserProfile;
    }

    return {
      age: profile.age,
      gender: profile.gender ?? 0, // GENDER_UNSPECIFIED
      weightKg: profile.weight_kg,
      heightCm: profile.height_cm,
      activityLevel: profile.activity_level ?? 3, // ACTIVITY_LEVEL_MODERATE
      weightGoal: profile.weight_goal ?? 2, // WEIGHT_GOAL_MAINTAIN
      goalIntensity: profile.goal_intensity ?? 2, // GOAL_INTENSITY_MODERATE
      dietaryRestrictions: profile.dietary_restrictions
        ? {
          preference: profile.dietary_restrictions.preference ?? 1, // DIETARY_PREFERENCE_NONE
          allergies: profile.dietary_restrictions.allergies ?? [1], // ALLERGY_NONE
          dislikedIngredients:
            profile.dietary_restrictions.disliked_ingredients ?? [],
        }
        : {
          preference: 1, // DIETARY_PREFERENCE_NONE
          allergies: [1], // ALLERGY_NONE
          dislikedIngredients: [],
        },
    } as UserProfile;
  }
}
