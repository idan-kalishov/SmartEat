import { Module } from '@nestjs/common';
import { MealManagementClient } from '../grpc/clients/meal-management.client';
import { MealManagementController } from './controller/meal-management.controller';
import { AuthGatewayService } from '../authGateway/auth.gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MealManagementClient, AuthGatewayService],
  controllers: [MealManagementController],
  exports: [MealManagementClient],
})
export class MealManagementModule { }
