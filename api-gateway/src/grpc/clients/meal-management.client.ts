import {
    Meal,
    MealIdRequest,
    MealsByDateRequest,
    MealServiceClient,
    SaveMealRequest,
    UserIdRequest,
    UserMealHistoryResponse
} from '@generated/food-recognition';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { foodRecognitionGrpcOptions } from '../food-recognition.config';

interface AnalyzeMealRequest {
    image: Buffer;
}

@Injectable()
export class MealManagementClient implements OnModuleInit {
    @Client(foodRecognitionGrpcOptions)
    private readonly client: ClientGrpc;

    private mealService: MealServiceClient;

    onModuleInit() {
        this.mealService = this.client.getService(
            'MealService',
        );
    }

    async saveMeal(request: SaveMealRequest): Promise<Meal> {
        try {
            return await this.mealService.saveMeal(request).toPromise();
        } catch (error) {
            console.error('Error analyzing meal:', error);
            throw new Error('Failed to analyze meal');
        }
    }

    async getUserMealHistory(request: UserIdRequest): Promise<UserMealHistoryResponse> {
        try {
            return await this.mealService.getUserMealHistory(request).toPromise();
        } catch (error) {
            console.error('Error getting user meal history:', error);
            throw new Error('Failed to get user meal history');
        }
    }

    async getMealById(request: MealIdRequest): Promise<Meal> {
        try {
            return await this.mealService.getMealById(request).toPromise();
        } catch (error) {
            console.error('Error getting meal by id:', error);
            throw new Error('Failed to get meal by id');
        }
    }

    async deleteMeal(request: MealIdRequest): Promise<Meal> {
        try {
            return await this.mealService.deleteMeal(request).toPromise();
        } catch (error) {
            console.error('Error deleting meal:', error);
            throw new Error('Failed to delete meal');
        }
    }

    async getMealsByDate(request: MealsByDateRequest): Promise<UserMealHistoryResponse> {
        try {
            return await this.mealService.getMealsByDate(request).toPromise();
        } catch (error) {
            console.error('Error getting meals by date:', error);
            throw new Error('Failed to get meals by date');
        }
    }
}