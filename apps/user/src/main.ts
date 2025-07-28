import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UsuarioModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UsuarioModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
