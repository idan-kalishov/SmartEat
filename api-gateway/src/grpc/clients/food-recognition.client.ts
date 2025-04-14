// src/food-recognition/food-recognition.client.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { foodRecognitionGrpcOptions } from '../food-recognition.config';
import {
  AnalyzeMealResponse,
  FoodRecognitionServiceClient,
  IngredientDetailsRequest,
  IngredientDetailsResponse,
} from '@generated/food-recognition';

interface AnalyzeMealRequest {
  image: Buffer;
}

@Injectable()
export class FoodRecognitionClient implements OnModuleInit {
  @Client(foodRecognitionGrpcOptions)
  private readonly client: ClientGrpc;

  private foodRecognitionService: FoodRecognitionServiceClient;

  onModuleInit() {
    this.foodRecognitionService = this.client.getService(
      'FoodRecognitionService',
    );
  }

  async analyzeMeal(image: Buffer): Promise<AnalyzeMealResponse> {
    try {
      const request: AnalyzeMealRequest = { image };
      return await this.foodRecognitionService.analyzeMeal(request).toPromise();
    } catch (error) {
      console.error('Error analyzing meal:', error);
      throw new Error('Failed to analyze meal');
    }
  }

  async fetchIngredientDetails(
    names: string[],
  ): Promise<IngredientDetailsResponse> {
    try {
      const request: IngredientDetailsRequest = { names };
      return await this.foodRecognitionService
        .fetchIngredientDetails(request)
        .toPromise();
    } catch (error) {
      console.error('Error fetching ingredient details:', error);
      throw new Error('Failed to fetch ingredient details');
    }
  }
}
