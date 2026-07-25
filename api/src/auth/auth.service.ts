import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthRepository } from './auth.repository';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User, Role } from '@prisma/client';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isEmailVerified: boolean;
  avatarUrl: string | null;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Helper to hash token string (SHA-256) for DB storage
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Helper to remove sensitive fields
  private sanitizeUser(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };
  }

  async signup(dto: SignupDto) {
    const existing = await this.authRepository.findUserByEmail(dto.email);
    if (existing) {
      throw new ConflictException('An account with this email address already exists');
    }

    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS', '12'),
      10,
    );
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.authRepository.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? Role.CANDIDATE,
    });

    // Generate verification token
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawVerificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.authRepository.createEmailVerificationToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    // Console mock email log
    console.log(
      `\n===================================================\n` +
      `[EMAIL MOCK] Verification link for ${user.email}:\n` +
      `http://localhost:3000/verify-email?token=${rawVerificationToken}\n` +
      `===================================================\n`,
    );

    return {
      message: 'Account created successfully. Please verify your email.',
      user: this.sanitizeUser(user),
      // Included in development response for easy testing
      debugVerificationToken:
        process.env.NODE_ENV !== 'production' ? rawVerificationToken : undefined,
    };
  }

  async verifyEmail(token: string) {
    const tokenHash = this.hashToken(token);
    const verificationRecord =
      await this.authRepository.findEmailVerificationToken(tokenHash);

    if (!verificationRecord) {
      // Check if user has already been verified via this token
      const anyRecord = await this.authRepository.findAnyEmailVerificationToken(tokenHash);
      if (anyRecord && anyRecord.user.isEmailVerified) {
        return { message: 'Email address verified successfully' };
      }
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.authRepository.markEmailVerificationTokenUsed(
      verificationRecord.id,
    );
    await this.authRepository.markEmailAsVerified(verificationRecord.userId);

    return { message: 'Email address verified successfully' };
  }

  async login(dto: LoginDto, deviceInfo?: string) {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Access JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Refresh Token Rotation
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = this.hashToken(rawRefreshToken);

    const days = dto.rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenHash,
      deviceInfo,
      expiresAt,
    });

    return {
      accessToken,
      refreshTokenRaw: rawRefreshToken,
      rememberMe: dto.rememberMe ?? false,
      user: this.sanitizeUser(user),
    };
  }

  async refreshTokens(rawRefreshToken: string, deviceInfo?: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const oldHash = this.hashToken(rawRefreshToken);
    const tokenRecord = await this.authRepository.findRefreshToken(oldHash);

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke old refresh token (rotation)
    await this.authRepository.deleteRefreshToken(oldHash);

    const user = tokenRecord.user;
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    // Issue new refresh token
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newRefreshTokenHash = this.hashToken(newRawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: newRefreshTokenHash,
      deviceInfo,
      expiresAt,
    });

    return {
      accessToken,
      refreshTokenRaw: newRawRefreshToken,
      user: this.sanitizeUser(user),
    };
  }

  async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const hash = this.hashToken(rawRefreshToken);
      await this.authRepository.deleteRefreshToken(hash);
    }
    return { message: 'Successfully logged out' };
  }

  async forgotPassword(email: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (user) {
      const rawResetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = this.hashToken(rawResetToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await this.authRepository.createPasswordResetToken({
        userId: user.id,
        tokenHash,
        expiresAt,
      });

      console.log(
        `\n===================================================\n` +
        `[EMAIL MOCK] Password reset link for ${user.email}:\n` +
        `http://localhost:3000/reset-password?token=${rawResetToken}\n` +
        `===================================================\n`,
      );
    }

    // Always return neutral response to prevent email enumeration
    return {
      message:
        'If an account with that email exists, password reset instructions have been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashToken(dto.token);
    const tokenRecord = await this.authRepository.findPasswordResetToken(tokenHash);

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    const saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS', '12'),
      10,
    );
    const newPasswordHash = await bcrypt.hash(dto.newPassword, saltRounds);

    await this.authRepository.updatePassword(
      tokenRecord.userId,
      newPasswordHash,
    );
    await this.authRepository.markPasswordResetTokenUsed(tokenRecord.id);

    // Invalidate all refresh tokens for security
    await this.authRepository.deleteAllUserRefreshTokens(tokenRecord.userId);

    return {
      message:
        'Password reset successfully. You can now log in with your new password.',
    };
  }
}
