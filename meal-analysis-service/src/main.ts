import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('192.168.1.145-key.pem'),
  //   cert: fs.readFileSync('192.168.1.145.pem'),
  // };
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
