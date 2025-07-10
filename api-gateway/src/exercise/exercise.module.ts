import { Module } from '@nestjs/common';
import { ExerciseController } from './controller/exercise.controller';
import { ExerciseClient } from 'src/grpc/clients/exercise.client';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ExerciseClient, AuthGatewayService],
  controllers: [ExerciseController],
})
export class ExerciseModule {}
