import {
  Controller,
  Post,
  Body,
  HttpException,
  Get,
  Res,
  Req,
  Put,
} from '@nestjs/common';
import { AuthGatewayService } from './auth.gateway.service';
import { Request, Response as ExpressResponse } from 'express';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly authGatewayService: AuthGatewayService) {}

  @Post('login')
  async login(
    @Body() body: any,
    @Res() res: ExpressResponse,
  ) {
    try {
      return await this.authGatewayService.forwardLogin(body, res);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Auth error',
        err.response?.status || 500,
      );
    }
  }

  @Post('register')
  async register(@Body() body: any) {
    try {
      return await this.authGatewayService.forwardRegister(body);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        err.response?.data || 'Registration error',
        err.response?.status || 500,
      );
    }
  }

  @Post('refresh')
  async refresh(@Body() body: any) {
    try {
      return await this.authGatewayService.refreshToken(body.refreshToken);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Token refresh error',
        err.response?.status || 500,
      );
    }
  }

  @Post('logout')
  async logout(
    @Res() res: ExpressResponse,
  ) {
    try {
      return await this.authGatewayService.logout(res);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Logout error',
        err.response?.status || 500,
      );
    }
  }

  @Post('google')
  async google(@Body() body: any, @Res() res: ExpressResponse) {
    try {
      return await this.authGatewayService.forwardGoogleAuth(body, res);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Google auth error',
        err.response?.status || 500,
      );
    }
  }

  @Get('me')
  async me(@Req() req: Request) {
    try {
      return await this.authGatewayService.getUserDetails(req);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'getting user details error',
        err.response?.status || 401,
      );
    }
  }

  @Get('verify')
  async verify(@Req() req: Request) {
    try {
      return await this.authGatewayService.verifyToken(req);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Verification error',
        err.response?.status || 401,
      );
    }
  }

  @Put('update')
  async updateUser(@Body() body: any, @Req() req: Request) {
    try {
      return await this.authGatewayService.updateUser(body, req);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Update user error',
        err.response?.status || 500,
      );
    }
  }

  @Put('update-profile')
  async updateUserProfile(@Body() body: any, @Req() req: Request) {
    try {
      return await this.authGatewayService.updateUserProfile(body, req);
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Update profile error',
        err.response?.status || 500,
      );
    }
  }
}
