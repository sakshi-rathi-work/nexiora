import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import * as Joi from 'joi';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { ContactModule } from './contact/contact.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // Config — validates all required env vars at startup
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(4000),
        CORS_ALLOWED_ORIGINS: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
        JWT_REFRESH_EXPIRES_IN_REMEMBER_ME: Joi.string().default('30d'),
        BCRYPT_SALT_ROUNDS: Joi.number().default(12),
        MAIL_PROVIDER: Joi.string().valid('console').default('console'),
        STORAGE_PROVIDER: Joi.string().valid('local').default('local'),
        LOCAL_UPLOAD_DIR: Joi.string().default('./uploads'),
        MAX_RESUME_SIZE_MB: Joi.number().default(5),
        MAX_AVATAR_SIZE_MB: Joi.number().default(2),
        THROTTLE_TTL_SECONDS: Joi.number().default(60),
        THROTTLE_LIMIT: Joi.number().default(5),
      }),
    }),

    // Pino structured logging
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),

    // Rate limiting (in-memory at MVP)
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.THROTTLE_TTL_SECONDS ?? '60') * 1000,
        limit: parseInt(process.env.THROTTLE_LIMIT ?? '5'),
      },
    ]),

    // Global Modules
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    UploadsModule,
    CompaniesModule,
    JobsModule,
    ApplicationsModule,
    ContactModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
