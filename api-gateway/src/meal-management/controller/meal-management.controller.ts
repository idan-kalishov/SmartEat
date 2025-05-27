import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post
} from '@nestjs/common';

import { Meal, SaveMealRequest, UserMealHistoryResponse } from '@generated/food-recognition';
import { MealManagementClient } from 'src/grpc/clients/meal-management.client';

@Controller('meals')
export class MealManagementController {
  constructor(private readonly client: MealManagementClient) { }

  @Post()
  async saveMeal(@Body() body: SaveMealRequest): Promise<Meal> {
    return this.client.saveMeal({ ...body, userId: 'to be filled' });
  }

  @Get('/by-id/:id')
  async getMealById(@Param('id') id: string): Promise<Meal> {
    return this.client.getMealById({ mealId: id });
  }

  @Get('/meal-history')
  async getUserMealHistory(): Promise<UserMealHistoryResponse> {
    return this.client.getUserMealHistory({ userId: 'to be filled' });
  }

  @Delete('/:id')
  async deleteMeal(@Param('id') id: string): Promise<Meal> {
    return this.client.deleteMeal({ mealId: id });
  }

  @Get('/by-date/:date')
  async getMealsByDate(@Param('date') date: string): Promise<UserMealHistoryResponse> {
    return this.client.getMealsByDate({ userId: 'to be filled', date });
  }
}
