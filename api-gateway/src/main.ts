import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('192.168.1.145-key.pem'),
    cert: fs.readFileSync('192.168.1.145.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
