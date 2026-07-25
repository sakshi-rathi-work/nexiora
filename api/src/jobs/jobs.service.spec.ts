import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { JobsRepository } from './jobs.repository';
import { NotFoundException } from '@nestjs/common';
import { EmploymentType, ExperienceLevel, JobStatus } from '@prisma/client';

describe('JobsService', () => {
  let service: JobsService;
  let jobsRepository: jest.Mocked<Partial<JobsRepository>>;

  const mockJob = {
    id: 'job-1',
    slug: 'job-1-slug',
    companyId: 'comp-1',
    postedById: 'admin-1',
    title: 'Senior Full Stack Engineer',
    description: 'Great role description',
    location: 'Bengaluru, India',
    employmentType: EmploymentType.FULL_TIME,
    experienceLevel: ExperienceLevel.SENIOR,
    salaryMin: 1800000,
    salaryMax: 2500000,
    skills: ['React', 'Node.js'],
    status: JobStatus.PUBLISHED,
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: null,
    company: {
      id: 'comp-1',
      name: 'Acme Cloud Systems',
      logoUrl: null,
      industry: 'Cloud Infrastructure',
      website: 'https://cloud.acme.example',
      description: 'Acme description',
      isVerified: true,
      createdAt: new Date(),
    },
  };

  beforeEach(async () => {
    jobsRepository = {
      findAll: jest.fn(),
      findByIdOrSlug: jest.fn(),
      findRelatedJobs: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: JobsRepository, useValue: jobsRepository },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  it('should return paginated list of jobs', async () => {
    const mockResult = {
      jobs: [mockJob],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };
    jobsRepository.findAll!.mockResolvedValue(mockResult as any);

    const result = await service.findAll({});

    expect(result).toEqual(mockResult);
    expect(jobsRepository.findAll).toHaveBeenCalledWith({});
  });

  it('should return job by ID or slug with related jobs', async () => {
    jobsRepository.findByIdOrSlug!.mockResolvedValue(mockJob as any);
    jobsRepository.findRelatedJobs!.mockResolvedValue([]);

    const result = await service.findByIdOrSlug('job-1');

    expect(result.id).toBe('job-1');
    expect(result.relatedJobs).toEqual([]);
    expect(jobsRepository.findByIdOrSlug).toHaveBeenCalledWith('job-1');
  });

  it('should throw NotFoundException if job does not exist', async () => {
    jobsRepository.findByIdOrSlug!.mockResolvedValue(null);

    await expect(service.findByIdOrSlug('non-existent')).rejects.toThrow(
      NotFoundException,
    );
  });
});
