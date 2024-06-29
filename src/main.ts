import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { AppModule } from './modules/app/app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
  });

  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.info(`
    Server running on http://localhost:${port} in environment ${process.env.NODE_ENV}
  `);
}

bootstrap().catch((err) => {
  console.error('Error starting server:', err);
});
