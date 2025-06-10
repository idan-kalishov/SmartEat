import { Injectable, Req, Request } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthGatewayService {
  private readonly authServiceBaseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.authServiceBaseUrl = 'http://localhost:3000/auth';
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
        status: error.response?.status
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

  async verifyToken(@Req() req: Request) {
    const sanitizedHeaders = this.getSanitizedHeaders(req);

    const response = await this.httpService.axiosRef.get(
      `${this.authServiceBaseUrl}/verify`,
      {
        headers: sanitizedHeaders,
      },
    );

    return response.data;
  }

  private getSanitizedHeaders(req: Request) {
    const sanitizedHeaders: Record<string, string> = {};

    for (const [key, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') {
        sanitizedHeaders[key] = value;
      } else if (Array.isArray(value)) {
        sanitizedHeaders[key] = value.join(', ');
      }
    }
    return sanitizedHeaders;
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
          timeout: 5000
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error in getUserDetails:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        stack: error.stack
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
          timeout: 5000
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error in updateUser:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        stack: error.stack
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
          timeout: 5000
        }),
      );

      return response.data;
    } catch (error) {
      console.error('Error in updateUserProfile:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        stack: error.stack
      });
      throw error;
    }
  }
}
