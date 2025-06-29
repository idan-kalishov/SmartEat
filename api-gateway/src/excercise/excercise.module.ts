import { Module } from '@nestjs/common';
import { ExcerciseController } from './controller/excercise.controller';
import { ExcerciseClient } from 'src/grpc/clients/excercise.client';
import { AuthGatewayService } from 'src/authGateway/auth.gateway.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ExcerciseClient, AuthGatewayService],
  controllers: [ExcerciseController],
})
export class ExcerciseModule {}
