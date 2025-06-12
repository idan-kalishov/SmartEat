import { Controller, BadRequestException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExerciseService } from '../services/exercise.service';
import { Exercise as MongoExercise } from '../schemas/exercise.schema';
import {
  GetExercisesByDateRequest,
  GetExercisesByDateResponse,
  Exercise as GrpcExercise,
  SaveExerciseRequest,
  SaveExerciseResponse,
} from 'src/generated/exercise';

@Controller()
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  private transformToGrpcExercise(exercise: MongoExercise): GrpcExercise {
    return {
      id: exercise._id.toString(),
      userId: exercise.userId,
      createdAt: exercise.createdAt.toISOString(),
      calories: exercise.calories,
      minutes: exercise.minutes,
      name: exercise.name,
    };
  }

  @GrpcMethod('ExerciseService', 'SaveExercise')
  async saveExercise(data: SaveExerciseRequest): Promise<SaveExerciseResponse> {
    try {
      if (!data.exercise) {
        throw new BadRequestException('Exercise data is required');
      }

      if (!data.userId) {
        throw new BadRequestException('User ID is required');
      }

      if (data.userId !== data.exercise.userId) {
        throw new BadRequestException('User ID mismatch');
      }

      const exerciseId = await this.exerciseService.saveExercise(data.exercise);

      return {
        exerciseId,
        success: true,
      };
    } catch (error) {
      console.error('Error saving exercise:', error);
      throw error;
    }
  }

  @GrpcMethod('ExerciseService', 'GetExercisesByDate')
  async getExercisesByDate(
    data: GetExercisesByDateRequest,
  ): Promise<GetExercisesByDateResponse> {
    try {
      const exercises = await this.exerciseService.getExercisesByDate(
        data.userId,
        data.date,
      );

      return {
        exercises: exercises.map((exercise) =>
          this.transformToGrpcExercise(exercise),
        ),
      };
    } catch (error) {
      console.error('Error getting exercises by date:', error);
      throw error;
    }
  }
}
