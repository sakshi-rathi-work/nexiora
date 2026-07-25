import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import cookieParser from 'cookie-parser';

describe('Auth & Users Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testEmail = `e2e_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let verificationToken: string;
  let accessToken: string;
  let refreshTokenCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Cleanup test user
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });
    await app.close();
  });

  it('1. POST /api/v1/auth/signup — should create user and return verification token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/signup')
      .send({
        email: testEmail,
        password: testPassword,
        firstName: 'E2E',
        lastName: 'TestUser',
      })
      .expect(201);

    expect(res.body.message).toContain('Account created successfully');
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.debugVerificationToken).toBeDefined();
    verificationToken = res.body.debugVerificationToken;
  });

  it('2. GET /api/v1/auth/verify-email — should verify user email', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/auth/verify-email?token=${verificationToken}`)
      .expect(200);

    expect(res.body.message).toBe('Email address verified successfully');

    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });
    expect(user?.isEmailVerified).toBe(true);
  });

  it('3. POST /api/v1/auth/login — should authenticate and set httpOnly cookie', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: testPassword,
      })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
    accessToken = res.body.accessToken;

    const cookies = res.headers['set-cookie'] as string[];
    expect(cookies).toBeDefined();
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    expect(refreshCookie).toBeDefined();
    refreshTokenCookie = refreshCookie!;
  });

  it('4. GET /api/v1/users/me — should return authenticated user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.email).toBe(testEmail);
    expect(res.body.firstName).toBe('E2E');
    expect(res.body.candidateProfile).toBeDefined();
  });

  it('5. POST /api/v1/auth/refresh — should rotate refresh token and issue new access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .set('Cookie', [refreshTokenCookie])
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    const cookies = res.headers['set-cookie'] as string[];
    expect(cookies).toBeDefined();
    const newRefreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    expect(newRefreshCookie).toBeDefined();
    expect(newRefreshCookie).not.toBe(refreshTokenCookie);
    refreshTokenCookie = newRefreshCookie!;
  });

  it('6. POST /api/v1/auth/logout — should revoke token and clear cookies', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Cookie', [refreshTokenCookie])
      .expect(200);

    expect(res.body.message).toBe('Successfully logged out');
  });
});
