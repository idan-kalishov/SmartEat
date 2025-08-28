import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  // HTTP Server
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  dotenv.config();

  const exerciseGrpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'exercise',
      protoPath: join(__dirname, './proto/exercise.proto'),
      url: `0.0.0.0:${process.env.EXERCISE_GRPC_PORT || 50055}`,
    },
  };

  app.connectMicroservice<MicroserviceOptions>(exerciseGrpcOptions);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3003, '0.0.0.0');
}
bootstrap();
