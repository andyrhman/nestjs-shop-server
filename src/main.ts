import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './http.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ? https://www.phind.com/search?cache=m7mtjap28zsv3jxtb6wu4znj
  // ! app.useGlobalFilters(new HttpExceptionFilter());

  // * Using api as the global url --> http://localhost:8000/api
  app.setGlobalPrefix('api');

  // * Adding this for the class validator
  app.useGlobalPipes(new ValidationPipe());

  // * Using cookie parser for jwt
  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const origins = [configService.get('ORIGIN_1'), configService.get('ORIGIN_2')];

  app.enableCors({
    origin: origins,
    credentials: true //passing cookie back and forth in every request remove {passtrough: true}
  });

  await app.listen(3000);
}
bootstrap();