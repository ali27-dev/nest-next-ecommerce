import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // project description
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if extra properties are sent
      transform: true, // auto-converts payloads into DTO class instances
      transformOptions: {
        enableImplicitConversion: true, // e.g. query param "5" -> number 5
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap().catch((error) => {
  Logger.error('Error starting server', error);
  process.exit(1);
});
