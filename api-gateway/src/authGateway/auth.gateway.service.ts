import { Injectable, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response as ExpressResponse } from 'express';

@Injectable()
export class AuthGatewayService {
  private authServiceBaseUrl: string;

  constructor(private readonly httpService: HttpService) {
    // Get the auth service URL from environment variables
    this.authServiceBaseUrl = 'http://localhost:3000/auth';
  }

  async forwardLogin(loginData: { email: string; password: string }, res: ExpressResponse) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceBaseUrl}/login`, loginData, {
        withCredentials: true,
      }));

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    return res.send(response.data);
  }

  async forwardRegister(registerData: {
    email: string;
    userName: string;
    password: string;
  }) {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.authServiceBaseUrl}/register`,
        registerData,
      ),
    );
    return response.data;
  }

  async forwardGoogle() {
    await this.httpService.get(`${this.authServiceBaseUrl}/google`);
  }
  async forwardGoogleCallback(req: any) {
    // For OAuth callbacks, we need to preserve query parameters
    const response = await firstValueFrom(
      this.httpService.get(`${this.authServiceBaseUrl}/google/callback`, {
        params: req.query,
        headers: {
          // Forward necessary headers for OAuth flow
          Cookie: req.headers.cookie,
        },
      }),
    );
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceBaseUrl}/refresh`, {
        refreshToken,
      }),
    );
    return response.data;
  }

  async logout() {
    const response = await firstValueFrom(
      this.httpService.post(`${this.authServiceBaseUrl}/logout`),
    );
    return response.data;
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

  async getUserDetails(req: Request) {
    const sanitizedHeaders = this.getSanitizedHeaders(req);

    const response = await firstValueFrom(
      this.httpService.get(`${this.authServiceBaseUrl}/me`, {
        headers: sanitizedHeaders
      }),
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
}
