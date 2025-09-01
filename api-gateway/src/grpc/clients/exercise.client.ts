import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ExerciseServiceClient,
  GetExercisesByDateRequest,
  GetExercisesByDateResponse,
  SaveExerciseRequest,
  SaveExerciseResponse,
  DeleteExerciseRequest,
  DeleteExerciseResponse,
} from '@generated/exercise';
import { ExerciseGrpcOptions } from './exercise.config';

@Injectable()
export class ExerciseClient implements OnModuleInit {
  @Client(ExerciseGrpcOptions)
  private readonly client: ClientGrpc;

  private exerciseService: ExerciseServiceClient;

  onModuleInit() {
    this.exerciseService =
      this.client.getService<ExerciseServiceClient>('ExerciseService');
  }

  async saveExercise(
    saveExerciseRequest: SaveExerciseRequest,
  ): Promise<SaveExerciseResponse> {
    try {
      if (!saveExerciseRequest.userId) {
        throw new BadRequestException('User ID is required');
      }

      return await firstValueFrom(
        this.exerciseService.saveExercise(saveExerciseRequest),
      );
    } catch (error) {
      console.error('Error in client saveExercise:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to save exercise: ' + error.message,
      );
    }
  }

  async getExercisesByDate(
    userId: string,
    date: string,
  ): Promise<GetExercisesByDateResponse> {
    try {
      const request: GetExercisesByDateRequest = {
        userId,
        date,
      };
      return await firstValueFrom(
        this.exerciseService.getExercisesByDate(request),
      );
    } catch (error) {
      console.error('Error getting exercises by date:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to get exercises by date: ' + error.message,
      );
    }
  }

  async deleteExercise(
    deleteExerciseRequest: DeleteExerciseRequest,
  ): Promise<DeleteExerciseResponse> {
    try {
      if (!deleteExerciseRequest.userId) {
        throw new BadRequestException('User ID is required');
      }

      if (!deleteExerciseRequest.mealId) {
        throw new BadRequestException('Exercise ID is required');
      }

      return await firstValueFrom(
        this.exerciseService.deleteExercise(deleteExerciseRequest),
      );
    } catch (error) {
      console.error('Error in client deleteExercise:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to delete exercise: ' + error.message,
      );
    }
  }
}
