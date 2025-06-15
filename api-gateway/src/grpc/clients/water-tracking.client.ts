import {
  GetWaterIntakeByDateRequest,
  GetWaterIntakeByDateResponse,
  SaveWaterIntakeRequest,
  SaveWaterIntakeResponse,
  WaterTrackingServiceClient,
} from '@generated/water-tracking';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { waterTrackingGrpcOptions } from './water-tracking.config';

@Injectable()
export class WaterTrackingClient implements OnModuleInit {
  @Client(waterTrackingGrpcOptions)
  private readonly client: ClientGrpc;

  private waterService: WaterTrackingServiceClient;

  onModuleInit() {
    this.waterService = this.client.getService<WaterTrackingServiceClient>(
      'WaterTrackingService',
    );
  }

  async saveWaterIntake(
    userId: string,
    amountLiters: number,
    date: string,
  ): Promise<SaveWaterIntakeResponse> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (amountLiters < 0) {
        throw new BadRequestException('Amount must be non-negative');
      }

      const request: SaveWaterIntakeRequest = {
        userId,
        amountLiters,
        date: date || new Date().toISOString(),
      };

      return await firstValueFrom(this.waterService.saveWaterIntake(request));
    } catch (error) {
      console.error('Error in client saveWaterIntake:', error);
      throw new BadRequestException(
        'Failed to save water intake: ' + error.message,
      );
    }
  }

  async getWaterIntakeByDate(
    userId: string,
    date: string,
  ): Promise<GetWaterIntakeByDateResponse> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!date) {
        throw new BadRequestException('Date is required');
      }

      const request: GetWaterIntakeByDateRequest = {
        userId,
        date,
      };

      return await firstValueFrom(
        this.waterService.getWaterIntakeByDate(request),
      );
    } catch (error) {
      console.error('Error getting water data:', error);
      throw new BadRequestException(
        'Failed to fetch water intake: ' + error.message,
      );
    }
  }
}
