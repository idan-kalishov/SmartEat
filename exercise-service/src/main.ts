import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3003, '0.0.0.0');
}
bootstrap();
