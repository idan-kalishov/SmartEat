import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  ExerciseServiceClient,
  GetExercisesByDateRequest,
  GetExercisesByDateResponse,
  SaveExerciseRequest,
  SaveExerciseResponse,
} from '@generated/exercise';
import { ExcerciseGrpcOptions } from './excercise.config';

@Injectable()
export class ExcerciseClient implements OnModuleInit {
  @Client(ExcerciseGrpcOptions)
  private readonly client: ClientGrpc;

  private excerciseService: ExerciseServiceClient;

  onModuleInit() {
    this.excerciseService =
      this.client.getService<ExerciseServiceClient>('ExcerciseService');
  }

  async saveExcercise(
    saveExerciseRequest: SaveExerciseRequest,
  ): Promise<SaveExerciseResponse> {
    try {
      if (!saveExerciseRequest.userId) {
        throw new BadRequestException('User ID is required');
      }

      return await firstValueFrom(
        this.excerciseService.saveExercise(saveExerciseRequest),
      );
    } catch (error) {
      console.error('Error in client saveExcercise:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to save excercise: ' + error.message,
      );
    }
  }

  async getExcercisesByDate(
    getExercisesByDateRequest: GetExercisesByDateRequest,
  ): Promise<GetExercisesByDateResponse> {
    try {
      if (!getExercisesByDateRequest.userId) {
        throw new BadRequestException('User ID is required');
      }
      if (!getExercisesByDateRequest.date) {
        throw new BadRequestException('Date is required');
      }

      return await firstValueFrom(
        this.excerciseService.getExercisesByDate(getExercisesByDateRequest),
      );
    } catch (error) {
      console.error('Error getting excercises by date:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to get excercises by date: ' + error.message,
      );
    }
  }
}
