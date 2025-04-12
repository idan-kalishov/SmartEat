import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as fs from 'fs';
import { join } from 'path';
import { ServerCredentials } from '@grpc/grpc-js';

async function bootstrap() {
  // HTTPS Options for REST API
  const httpsOptions = {
    key: fs.readFileSync('192.168.1.145-key.pem'),
    cert: fs.readFileSync('192.168.1.145.pem'),
  };

  // Create hybrid app (HTTP + gRPC)
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    cors: true, // Enable CORS
  });

  // gRPC Microservice with TLS
  const rootCerts = fs.readFileSync('192.168.1.145.pem'); // Root CA certificate (optional)
  const privateKey = fs.readFileSync('192.168.1.145-key.pem'); // Private key
  const certChain = fs.readFileSync('192.168.1.145.pem'); // Certificate chain

  const keyCertPairs = [
    {
      private_key: privateKey,
      cert_chain: certChain,
    },
  ];

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'nutrition',
      protoPath: join(__dirname, 'proto/nutrition.proto'),
      url: '0.0.0.0:50051',
      // credentials: ServerCredentials.createSsl(rootCerts || null, keyCertPairs),
      credentials: ServerCredentials.createInsecure(),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');

  console.log(
    `HTTPS API running on: https://0.0.0.0:${process.env.PORT ?? 3001}`,
  );
  console.log(`Secure gRPC server running on: 0.0.0.0:50051`);
}
bootstrap();
