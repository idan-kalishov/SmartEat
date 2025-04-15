import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { AuthGatewayService } from './auth.gateway.service';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authGatewayService: AuthGatewayService) {}

  @Post('login')
  async login(@Body() body: any) {
    try {
      return await this.authGatewayService.forwardLogin(body);
    } catch (err) {
      throw new HttpException(err.response?.data || 'Auth error', err.response?.status || 500);
    }
  }
}