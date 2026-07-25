import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<Partial<AuthRepository>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  const mockUser = {
    id: 'user-uuid-1',
    email: 'test@example.com',
    passwordHash: '',
    firstName: 'Test',
    lastName: 'User',
    role: Role.CANDIDATE,
    isEmailVerified: false,
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    phone: null,
  };

  beforeAll(async () => {
    mockUser.passwordHash = await bcrypt.hash('Password123!', 10);
  });

  beforeEach(async () => {
    authRepository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
      createEmailVerificationToken: jest.fn(),
      findEmailVerificationToken: jest.fn(),
      findAnyEmailVerificationToken: jest.fn(),
      markEmailVerificationTokenUsed: jest.fn(),
      markEmailAsVerified: jest.fn(),
      createRefreshToken: jest.fn(),
      findRefreshToken: jest.fn(),
      deleteRefreshToken: jest.fn(),
      deleteAllUserRefreshTokens: jest.fn(),
      createPasswordResetToken: jest.fn(),
      findPasswordResetToken: jest.fn(),
      markPasswordResetTokenUsed: jest.fn(),
      updatePassword: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-access-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: authRepository },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, defaultVal?: string) => {
              if (key === 'BCRYPT_SALT_ROUNDS') return '10';
              return defaultVal;
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should throw ConflictException if user email exists', async () => {
      authRepository.findUserByEmail!.mockResolvedValue(mockUser);

      await expect(
        authService.signup({
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a new user and return verification message', async () => {
      authRepository.findUserByEmail!.mockResolvedValue(null);
      authRepository.createUser!.mockResolvedValue(mockUser);
      authRepository.createEmailVerificationToken!.mockResolvedValue({} as any);

      const result = await authService.signup({
        email: 'new@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result.message).toContain('Account created successfully');
      expect(result.user.email).toBe('test@example.com');
      expect(authRepository.createUser).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      authRepository.findUserByEmail!.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password incorrect', async () => {
      authRepository.findUserByEmail!.mockResolvedValue(mockUser);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return accessToken and refreshToken when credentials valid', async () => {
      authRepository.findUserByEmail!.mockResolvedValue(mockUser);
      authRepository.createRefreshToken!.mockResolvedValue({} as any);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.accessToken).toBe('mock-jwt-access-token');
      expect(result.refreshTokenRaw).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('verifyEmail', () => {
    it('should throw BadRequestException if token is invalid or expired', async () => {
      authRepository.findEmailVerificationToken!.mockResolvedValue(null);

      await expect(authService.verifyEmail('invalid-token')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should mark token used and user email verified when token is valid', async () => {
      authRepository.findEmailVerificationToken!.mockResolvedValue({
        id: 'token-id-1',
        userId: 'user-uuid-1',
        tokenHash: 'hash',
        expiresAt: new Date(Date.now() + 10000),
        usedAt: null,
        user: mockUser,
      });

      authRepository.markEmailVerificationTokenUsed!.mockResolvedValue({} as any);
      authRepository.markEmailAsVerified!.mockResolvedValue(mockUser);

      const result = await authService.verifyEmail('valid-token');
      expect(result.message).toContain('verified successfully');
      expect(authRepository.markEmailAsVerified).toHaveBeenCalledWith('user-uuid-1');
    });
  });
});
