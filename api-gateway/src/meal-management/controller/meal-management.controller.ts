import {
  GetMealsByDateResponse,
  Ingredient,
  Meal,
} from '@generated/meal-management';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';
import { MealManagementClient } from 'src/grpc/clients/meal-management.client';

// Proper type for the meal data from form data
interface MealFormData {
  meal?: string; // JSON string from form data
  name?: string;
  ingredients?: string; // JSON string from form data
}

// Type for parsed meal data
interface ParsedMealData {
  name: string;
  ingredients: Ingredient[];
}

@Controller('meals')
export class MealManagementController {
  constructor(
    private readonly client: MealManagementClient,
    private readonly authService: AuthGatewayService,
  ) { }

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

  private parseMealData(mealData: MealFormData): ParsedMealData {
    try {
      // If meal data is a JSON string (from form data), parse it
      if (mealData.meal && typeof mealData.meal === 'string') {
        return JSON.parse(mealData.meal);
      }

      // If individual fields are provided, construct the meal data
      if (mealData.name && mealData.ingredients) {
        return {
          name: mealData.name,
          ingredients: typeof mealData.ingredients === 'string'
            ? JSON.parse(mealData.ingredients)
            : mealData.ingredients,
        };
      }

      throw new Error('Invalid meal data format');
    } catch (parseError) {
      throw new BadRequestException('Invalid meal data format');
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async saveMeal(
    @Request() req,
    @Body() mealData: MealFormData,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<{ mealId: string; success: boolean }> {
    try {
      const parsedMeal = this.parseMealData(mealData);
      const userDetails = await this.authService.getUserDetails(req);

      if (!userDetails?.user?._id) {
        throw new BadRequestException('User not authenticated');
      }

      const userId = userDetails.user._id;
      const completeMeal: Meal = {
        id: '',
        userId,
        createdAt: new Date().toISOString(),
        name: parsedMeal.name,
        ingredients: parsedMeal.ingredients,
      };

      // Send complete meal data and image to the service
      return await this.client.saveMeal(userId, completeMeal, image);
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
