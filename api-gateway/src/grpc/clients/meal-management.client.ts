import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { mealManagementGrpcOptions } from '../meal-management.config';
import {
  MealManagementServiceClient,
  SaveMealRequest,
  SaveMealResponse,
  DeleteMealRequest,
  DeleteMealResponse,
  GetMealsByDateRequest,
  GetMealsByDateResponse,
  Meal,
} from '@generated/meal-management';

@Injectable()
export class MealManagementClient implements OnModuleInit {
    @Client(mealManagementGrpcOptions)
    private readonly client: ClientGrpc;

    private mealService: MealManagementServiceClient;

    onModuleInit() {
        this.mealService = this.client.getService<MealManagementServiceClient>(
            'MealManagementService',
        );
    }

    async saveMeal(request: SaveMealRequest): Promise<SaveMealResponse> {
        try {
            return await this.mealService.saveMeal(request).toPromise();
        } catch (error) {
            console.error('Error saving meal:', error);
            throw new Error('Failed to save meal');
        }
    }

    async deleteMeal(request: DeleteMealRequest): Promise<DeleteMealResponse> {
        try {
            return await this.mealService.deleteMeal(request).toPromise();
        } catch (error) {
            console.error('Error deleting meal:', error);
            throw new Error('Failed to delete meal');
        }
    }

    async getMealsByDate(request: GetMealsByDateRequest): Promise<GetMealsByDateResponse> {
        try {
            return await this.mealService.getMealsByDate(request).toPromise();
        } catch (error) {
            console.error('Error getting meals by date:', error);
            throw new Error('Failed to get meals by date');
        }
    }
}