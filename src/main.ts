import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //yang tidak ada di dto akan di remove,
      transform: true, // memjadi objek
      forbidNonWhitelisted: true, //properti yang tidak diharapkan akan menyebabkan error
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
