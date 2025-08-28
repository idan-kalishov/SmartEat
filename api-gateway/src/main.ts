import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, origin); // Reflect the request origin
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
