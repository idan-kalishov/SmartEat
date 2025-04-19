import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  // HTTP Server
  const httpsOptions = {
    key: fs.readFileSync('192.168.1.145-key.pem'),
    cert: fs.readFileSync('192.168.1.145.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();

  // gRPC Server
  const grpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'foodrecognition',
      protoPath: join(__dirname, '../src/proto/food-recognition.proto'),
      url: `0.0.0.0:${process.env.FOOD_RECOGNITION_GRPC_PORT || 50052}`,
    },
  };

  app.connectMicroservice<MicroserviceOptions>(grpcOptions);

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
