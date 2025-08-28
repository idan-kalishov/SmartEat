import { ServerCredentials } from '@grpc/grpc-js';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create hybrid app (HTTP + gRPC)
  const app = await NestFactory.create(AppModule, {
    cors: true, // Enable CORS
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'nutrition',
      protoPath: join(__dirname, 'proto/nutrition.proto'),
      url: `0.0.0.0:${process.env.RECOMMENDATIONS_GRPC_PORT || 50051}`,
      credentials: ServerCredentials.createInsecure(),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');

  console.log(
    `HTTP API running on: http://0.0.0.0:${process.env.PORT ?? 3001}`,
  );
  console.log(`Secure gRPC server running on: 0.0.0.0:50051`);
}
bootstrap();
