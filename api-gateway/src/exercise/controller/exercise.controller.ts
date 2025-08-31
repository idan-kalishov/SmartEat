import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  BadRequestException,
  Param,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { ExerciseClient } from 'src/grpc/clients/exercise.client';
import {
  Exercise,
  GetExercisesByDateRequest,
  SaveExerciseRequest,
} from '@generated/exercise';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';

@Controller('exercise')
export class ExerciseController {
  constructor(
    private readonly exerciseClient: ExerciseClient,
    private readonly authService: AuthGatewayService,
  ) {}

  @Post('save')
  async save(@Request() req, @Body() saveExerciseRequest: SaveExerciseRequest) {
    const userDetails = await this.authService.getUserDetails(req);
    if (!userDetails?.user?._id) {
      throw new BadRequestException('User not authenticated');
    }

    const userId = userDetails.user._id;

    if (userId !== saveExerciseRequest.userId) {
      throw new BadRequestException('User missmatch');
    }

    return this.exerciseClient.saveExercise(saveExerciseRequest);
  }

  @Get('by-date/:date')
  async getByDate(@Request() req, @Param('date') date: string) {
    try {
      if (!date) {
        throw new BadRequestException('Date is required');
      }

      const userDetails = await this.authService.getUserDetails(req);
      if (!userDetails?.user?._id) {
        throw new BadRequestException('User not authenticated');
      }

      return this.exerciseClient.getExercisesByDate(userDetails.user._id, date);
    } catch (error) {
      console.error('Error in getExercisesByDate controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to get exercises by date: ' + error.message,
      );
    }
  }

  @Delete(':exerciseId')
  async delete(@Request() req, @Param('exerciseId') exerciseId: string) {
    try {
      if (!exerciseId) {
        throw new BadRequestException('Exercise ID is required');
      }

      const userDetails = await this.authService.getUserDetails(req);
      if (!userDetails?.user?._id) {
        throw new BadRequestException('User not authenticated');
      }

      const deleteRequest = {
        userId: userDetails.user._id,
        mealId: exerciseId, // Using mealId for now due to generated types
      };

      return this.exerciseClient.deleteExercise(deleteRequest);
    } catch (error) {
      console.error('Error in deleteExercise controller:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to delete exercise: ' + error.message,
      );
    }
  }
}
