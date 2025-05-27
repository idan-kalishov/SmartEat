import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { MealManagementClient } from 'src/grpc/clients/meal-management.client';
import {
  Meal,
  SaveMealRequest,
  GetMealsByDateResponse,
} from '@generated/meal-management';

@Controller('meals')
export class MealManagementController {
  constructor(private readonly client: MealManagementClient) {}

  @Post()
  async saveMeal(@Body() body: SaveMealRequest): Promise<{ mealId: string; success: boolean }> {
    return this.client.saveMeal(body);
  }

  @Delete(':mealId')
  async deleteMeal(
    @Param('mealId') mealId: string,
    @Body('userId') userId: string,
  ): Promise<{ success: boolean }> {
    return this.client.deleteMeal({ userId, mealId });
  }

  @Get('by-date/:date')
  async getMealsByDate(
    @Param('date') date: string,
    @Body('userId') userId: string,
  ): Promise<GetMealsByDateResponse> {
    return this.client.getMealsByDate({ userId, date });
  }
}
