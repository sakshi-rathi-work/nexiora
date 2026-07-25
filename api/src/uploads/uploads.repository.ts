import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateUserAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }

  async updateCandidateResume(userId: string, resumeUrl: string) {
    return this.prisma.candidateProfile.upsert({
      where: { userId },
      create: {
        userId,
        resumeUrl,
      },
      update: {
        resumeUrl,
      },
    });
  }

  async findUserAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatarUrl: true },
    });
    return user?.avatarUrl;
  }

  async findCandidateResume(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      select: { resumeUrl: true },
    });
    return profile?.resumeUrl;
  }
}
