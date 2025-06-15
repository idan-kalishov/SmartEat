import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WaterTrackingController } from './controller/water-tracking.controller';
import { WaterTrackingClient } from '../grpc/clients/water-tracking.client';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';

@Module({
  imports: [HttpModule],
  controllers: [WaterTrackingController],
  providers: [WaterTrackingClient, AuthGatewayService],
})
export class WaterTrackingModule {}
