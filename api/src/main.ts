import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParser = require('cookie-parser') as typeof import('cookie-parser');
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const corsOrigins = configService.get<string>('CORS_ALLOWED_ORIGINS', 'http://localhost:3000');
  const uploadDir = path.resolve(configService.get<string>('LOCAL_UPLOAD_DIR', './uploads'));

  // Serve static files (uploaded avatars and resumes)
  app.useStaticAssets(uploadDir, {
    prefix: '/uploads/',
  });

  // Structured logging via Pino
  app.useLogger(app.get(Logger));

  // Security headers (configure crossOriginResourcePolicy for static uploads)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use((helmet as any).default({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // Cookie parser for httpOnly refresh-token cookie
  app.use(cookieParser());

  // CORS — allow-listed origins only, never *
  app.enableCors({
    origin: corsOrigins.split(',').map((o) => o.trim()),
    credentials: true, // required for httpOnly cookies
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global API prefix
  app.setGlobalPrefix('api/v1');

  // Global DTO validation: reject unknown fields, strip nothing
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter — standard error shape
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(port);
  console.log(`🚀 NEXIORA API running on http://localhost:${port}/api/v1`);
}

bootstrap();
