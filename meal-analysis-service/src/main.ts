import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function bootstrap() {
  // HTTP Server
  const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();

  dotenv.config();

  // Food Recognition gRPC Server
  const foodRecognitionGrpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'foodrecognition',
      protoPath: join(__dirname, '../src/proto/food-recognition.proto'),
      url: `0.0.0.0:${process.env.FOOD_RECOGNITION_GRPC_PORT || 50052}`,
    },
  };

  // Meal Management gRPC Server
  const mealManagementGrpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'mealmgmt',
      protoPath: join(__dirname, '../src/proto/meal-management.proto'),
      url: `0.0.0.0:${process.env.MEAL_MANAGEMENT_GRPC_PORT || 50053}`,
    },
  };

  const waterTrackerGrpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'watertmgmt',
      protoPath: join(__dirname, '../src/proto/water-tracking.proto'),
      url: `0.0.0.0:${process.env.MEAL_MANAGEMENT_GRPC_PORT || 50054}`,
    },
  };

  app.connectMicroservice<MicroserviceOptions>(foodRecognitionGrpcOptions);
  app.connectMicroservice<MicroserviceOptions>(mealManagementGrpcOptions);
  app.connectMicroservice<MicroserviceOptions>(waterTrackerGrpcOptions);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
