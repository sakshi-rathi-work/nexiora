import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExistingApplication(candidateId: string, jobId: string) {
    return this.prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId,
          candidateId,
        },
      },
    });
  }

  async findCandidateResumeUrl(candidateId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId: candidateId },
      select: { resumeUrl: true },
    });
    return profile?.resumeUrl;
  }

  async createApplication(data: {
    jobId: string;
    candidateId: string;
    resumeUrl: string;
    coverLetter?: string;
  }) {
    return this.prisma.application.create({
      data: {
        jobId: data.jobId,
        candidateId: data.candidateId,
        resumeUrl: data.resumeUrl,
        coverLetter: data.coverLetter,
        status: ApplicationStatus.SUBMITTED,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async findCandidateApplications(candidateId: string) {
    return this.prisma.application.findMany({
      where: { candidateId },
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            slug: true,
            title: true,
            location: true,
            employmentType: true,
            experienceLevel: true,
            salaryMin: true,
            salaryMax: true,
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                industry: true,
              },
            },
          },
        },
      },
    });
  }

  async findJobApplications(jobId: string) {
    return this.prisma.application.findMany({
      where: { jobId },
      orderBy: { appliedAt: 'desc' },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            candidateProfile: true,
          },
        },
      },
    });
  }

  async findRecruiterApplications(recruiterId: string) {
    return this.prisma.application.findMany({
      where: {
        job: {
          postedById: recruiterId,
        },
      },
      orderBy: { appliedAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
          },
        },
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            candidateProfile: true,
          },
        },
      },
    });
  }

  async findApplicationById(id: string) {
    return this.prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      },
    });
  }

  async updateStatus(id: string, status: ApplicationStatus) {
    return this.prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
