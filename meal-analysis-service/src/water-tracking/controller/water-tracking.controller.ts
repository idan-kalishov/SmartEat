import { BadRequestException, Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { WaterTrackingService } from '../services/water-tracking.service';
import {
  SaveWaterIntakeRequest,
  SaveWaterIntakeResponse,
  GetWaterIntakeByDateRequest,
  GetWaterIntakeByDateResponse,
} from '../../generated/water-tracking';
import { Metadata } from '@grpc/grpc-js';

@Controller()
export class WaterTrackingController {
  constructor(private readonly waterTrackingService: WaterTrackingService) {}

  @GrpcMethod('WaterTrackingService', 'SaveWaterIntake')
  async saveWater(
    data: SaveWaterIntakeRequest,
    metadata: Metadata,
  ): Promise<SaveWaterIntakeResponse> {
    if (
      !data.userId ||
      (!data.amountLiters && data.amountLiters !== 0) ||
      !data.date
    ) {
      throw new BadRequestException('Missing required fields');
    }
    const id = await this.waterTrackingService.saveWater(data);

    return {
      success: true,
      waterId: id,
    };
  }

  @GrpcMethod('WaterTrackingService', 'GetWaterIntakeByDate')
  async getWaterIntakeByDate(
    data: GetWaterIntakeByDateRequest,
  ): Promise<GetWaterIntakeByDateResponse> {
    const entry = await this.waterTrackingService.getWaterByDate(
      data.userId,
      data.date,
    );
    return {
      amountLiters: entry?.amountLiters ?? 0,
      date: data.date,
    };
  }
}
