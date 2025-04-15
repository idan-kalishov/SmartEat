import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGatewayService {
  constructor(private readonly httpService: HttpService) {}

  async forwardLogin(body: any) {
    const authServiceUrl = 'http://localhost:3001/auth/login'; // Or Docker internal URL if in Docker Compose
    const response = await firstValueFrom(this.httpService.post(authServiceUrl, body));
    return response.data;
  }
}
