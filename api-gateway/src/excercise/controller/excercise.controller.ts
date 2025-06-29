import { Controller, Post, Body, Get } from '@nestjs/common';
import { ExcerciseClient } from 'src/grpc/clients/excercise.client';
import {
  GetExercisesByDateRequest,
  SaveExerciseRequest,
} from '@generated/exercise';

@Controller('excercise')
export class ExcerciseController {
  constructor(private readonly excerciseClient: ExcerciseClient) {}

  @Post('save')
  async save(@Body() saveExerciseRequest: SaveExerciseRequest) {
    return this.excerciseClient.saveExcercise(saveExerciseRequest);
  }

  @Get('by-date')
  async getByDate(
    @Body() getExercisesByDateRequest: GetExercisesByDateRequest,
  ) {
    return this.excerciseClient.getExcercisesByDate(getExercisesByDateRequest);
  }
}
