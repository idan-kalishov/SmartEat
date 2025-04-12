import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NutritionModule } from './nutrition/nutrition.module';
import { join } from 'path';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from './grpc.config';

@Module({
  imports: [NutritionModule, ClientsModule.register([grpcClientOptions])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
