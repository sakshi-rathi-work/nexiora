import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        candidateProfile: true,
      },
    });
  }

  async updateUserProfile(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        candidateProfile: true,
      },
    });
  }

  async findCandidateProfile(userId: string) {
    return this.prisma.candidateProfile.findUnique({
      where: { userId },
    });
  }

  async updateCandidateProfile(userId: string, dto: UpdateCandidateProfileDto) {
    return this.prisma.candidateProfile.upsert({
      where: { userId },
      create: {
        userId,
        headline: dto.headline,
        summary: dto.bio,
        experienceYears: dto.experienceYears,
        location: dto.location,
        skills: dto.skills ?? [],
      },
      update: {
        ...(dto.headline !== undefined && { headline: dto.headline }),
        ...(dto.bio !== undefined && { summary: dto.bio }),
        ...(dto.experienceYears !== undefined && { experienceYears: dto.experienceYears }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.skills !== undefined && { skills: dto.skills }),
      },
    });
  }
}
