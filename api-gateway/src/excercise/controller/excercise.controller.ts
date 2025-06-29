import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ExcerciseClient } from 'src/grpc/clients/excercise.client';
import {
  GetExercisesByDateRequest,
  SaveExerciseRequest,
} from '@generated/exercise';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';

@Controller('excercise')
export class ExcerciseController {
  constructor(
    private readonly excerciseClient: ExcerciseClient,
    private readonly authService: AuthGatewayService,
  ) {}

  @Post('save')
  async save(@Request() req, @Body() saveExerciseRequest: SaveExerciseRequest) {
    debugger;
    const userDetails = await this.authService.getUserDetails(req);
    if (!userDetails?.user?._id) {
      throw new BadRequestException('User not authenticated');
    }

    const userId = userDetails.user._id;

    return this.excerciseClient.saveExcercise({
      ...saveExerciseRequest,
      userId,
    });
  }

  @Get('by-date')
  async getByDate(
    @Body() getExercisesByDateRequest: GetExercisesByDateRequest,
  ) {
    return this.excerciseClient.getExcercisesByDate(getExercisesByDateRequest);
  }
}
