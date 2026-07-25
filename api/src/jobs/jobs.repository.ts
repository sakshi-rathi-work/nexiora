import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobQueryDto } from './dto/job-query.dto';
import { Prisma, JobStatus, EmploymentType, ExperienceLevel } from '@prisma/client';

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: JobQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      status: JobStatus.PUBLISHED,
    };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
        { skills: { has: query.q } },
      ];
    }

    if (query.location) {
      where.location = { contains: query.location, mode: 'insensitive' };
    }

    // Support comma-separated multi-select (e.g. FULL_TIME,CONTRACT)
    if (query.employmentType) {
      const types = query.employmentType.split(',').filter(Boolean) as EmploymentType[];
      if (types.length === 1) {
        where.employmentType = types[0];
      } else if (types.length > 1) {
        where.employmentType = { in: types };
      }
    }

    // Support comma-separated multi-select (e.g. SENIOR,LEAD)
    if (query.experienceLevel) {
      const levels = query.experienceLevel.split(',').filter(Boolean) as ExperienceLevel[];
      if (levels.length === 1) {
        where.experienceLevel = levels[0];
      } else if (levels.length > 1) {
        where.experienceLevel = { in: levels };
      }
    }

    // Minimum salary filter
    if (query.minSalary) {
      where.salaryMax = { gte: query.minSalary };
    }

    // Date posted filter ('24h', '7d', '30d')
    if (query.datePosted) {
      const now = new Date();
      let sinceDate: Date | null = null;
      if (query.datePosted === '24h') {
        sinceDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (query.datePosted === '7d') {
        sinceDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (query.datePosted === '30d') {
        sinceDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      if (sinceDate) {
        where.createdAt = { gte: sinceDate };
      }
    }

    if (query.companyId) {
      where.companyId = query.companyId;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              industry: true,
              website: true,
            },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByIdOrSlug(idOrSlug: string) {
    return this.prisma.job.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        status: JobStatus.PUBLISHED,
      },
      include: {
        company: true,
      },
    });
  }

  async findRelatedJobs(companyId: string, currentJobId: string, limit = 3) {
    return this.prisma.job.findMany({
      where: {
        companyId,
        id: { not: currentJobId },
        status: JobStatus.PUBLISHED,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    });
  }
}
