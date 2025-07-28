import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UrlModule } from './url.module';

async function bootstrap() {
  const app = await NestFactory.create(UrlModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
