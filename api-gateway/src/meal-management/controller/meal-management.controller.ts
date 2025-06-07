import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MealManagementClient } from 'src/grpc/clients/meal-management.client';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';
import {
  Meal,
  GetMealsByDateResponse,
} from '@generated/meal-management';

@Controller('meals')
export class MealManagementController {
  constructor(
    private readonly client: MealManagementClient,
    private readonly authService: AuthGatewayService,
  ) {}

  private validateMealData(meal: Meal): void {
    if (!meal.ingredients || !Array.isArray(meal.ingredients) || meal.ingredients.length === 0) {
      throw new BadRequestException('Meal must have at least one ingredient');
    }

    meal.ingredients.forEach(ingredient => {
      if (!ingredient.name) {
        throw new BadRequestException('Each ingredient must have a name');
      }
      if (typeof ingredient.weight !== 'number' || ingredient.weight <= 0) {
        throw new BadRequestException(`Invalid weight for ingredient ${ingredient.name}`);
      }
    });
  }

  @Post()
  async saveMeal(
    @Request() req,
    @Body() meal: Omit<Meal, 'id' | 'userId' | 'createdAt'>,
  ): Promise<{ mealId: string; success: boolean }> {
    try {
      this.validateMealData(meal as Meal);
      const userDetails = await this.authService.getUserDetails(req);
      
      if (!userDetails?.user?._id) {
        throw new BadRequestException('User not authenticated');
      }

      const userId = userDetails.user._id;
      const completeMeal: Meal = {
        id: '',
        userId,
        createdAt: new Date().toISOString(),
        name: meal.name,
        ingredients: meal.ingredients,
      };

      return await this.client.saveMeal(userId, completeMeal);
    } catch (error) {
      console.error('Error in saveMeal controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to save meal: ' + error.message);
    }
  }

  @Delete(':mealId')
  async deleteMeal(
    @Request() req,
    @Param('mealId') mealId: string,
  ): Promise<{ success: boolean }> {
    try {
      if (!mealId) {
        throw new BadRequestException('Meal ID is required');
      }

      const userDetails = await this.authService.getUserDetails(req);
      if (!userDetails?.user?._id) {
        throw new BadRequestException('User not authenticated');
      }

      return await this.client.deleteMeal(userDetails.user._id, mealId);
    } catch (error) {
      console.error('Error in deleteMeal controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete meal: ' + error.message);
    }
  }

  @Get('by-date/:date')
  async getMealsByDate(
    @Request() req,
    @Param('date') date: string,
  ): Promise<GetMealsByDateResponse> {
    try {
      if (!date) {
        throw new BadRequestException('Date is required');
      }

      const userDetails = await this.authService.getUserDetails(req);
      if (!userDetails?.user?._id) {
        throw new BadRequestException('User not authenticated');
      }

      return await this.client.getMealsByDate(userDetails.user._id, date);
    } catch (error) {
      console.error('Error in getMealsByDate controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get meals by date: ' + error.message);
    }
  }
}
