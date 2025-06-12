import {
  GetWaterIntakeByDateResponse,
  SaveWaterIntakeResponse,
} from '@generated/water-tracking';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';
import { WaterTrackingClient } from '../../grpc/clients/water-tracking.client';

@Controller('water')
export class WaterTrackingController {
  constructor(
    private readonly waterClient: WaterTrackingClient,
    private readonly authService: AuthGatewayService,
  ) {}

  @Post()
  async saveWaterIntake(
    @Request() req,
    @Body() body: { amountLiters: number; date?: string },
  ): Promise<SaveWaterIntakeResponse> {
    try {
      const userDetails = await this.authService.getUserDetails(req);
      const userId = userDetails.user?._id;

      if (!userId) {
        throw new BadRequestException('User not authenticated');
      }

      const { amountLiters, date } = body;
      if (amountLiters === undefined || amountLiters < 0) {
        throw new BadRequestException('Invalid water amount');
      }

      console.log('Received:', amountLiters, date);

      return await this.waterClient.saveWaterIntake(
        userId,
        amountLiters,
        date || new Date().toISOString().split('T')[0],
      );
    } catch (error) {
      console.error('Error saving water intake:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to save water intake');
    }
  }

  @Get('by-date/:date')
  async getWaterIntakeByDate(
    @Request() req,
    @Param('date') date: string,
  ): Promise<GetWaterIntakeByDateResponse> {
    try {
      const userDetails = await this.authService.getUserDetails(req);
      const userId = userDetails.user?._id;

      if (!userId) {
        throw new BadRequestException('User not authenticated');
      }

      return await this.waterClient.getWaterIntakeByDate(userId, date);
    } catch (error) {
      console.error('Error fetching water intake:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get water intake');
    }
  }
}
