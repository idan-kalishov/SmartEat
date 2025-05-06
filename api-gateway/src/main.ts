import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, origin); // Reflect the request origin
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
