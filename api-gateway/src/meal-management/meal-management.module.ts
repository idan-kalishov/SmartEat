import { Module } from '@nestjs/common';
import { MealManagementClient } from 'src/grpc/clients/meal-management.client';
import { MealManagementController } from './controller/meal-management.controller';

@Module({
  providers: [MealManagementClient],
  controllers: [MealManagementController],
  exports: [MealManagementClient],
})
export class MealManagementModule { }
