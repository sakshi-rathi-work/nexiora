import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { ApplicationsRepository } from './applications.repository';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApplicationStatus } from '@prisma/client';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: jest.Mocked<Partial<ApplicationsRepository>>;

  beforeEach(async () => {
    repository = {
      findExistingApplication: jest.fn(),
      findCandidateResumeUrl: jest.fn(),
      createApplication: jest.fn(),
      findCandidateApplications: jest.fn(),
      findRecruiterApplications: jest.fn(),
      findApplicationById: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: ApplicationsRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should throw ConflictException if candidate already applied', async () => {
    repository.findExistingApplication!.mockResolvedValue({ id: 'app-1' } as any);

    await expect(
      service.applyForJob('cand-1', { jobId: 'job-1' }),
    ).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException if candidate has no resume', async () => {
    repository.findExistingApplication!.mockResolvedValue(null);
    repository.findCandidateResumeUrl!.mockResolvedValue(null);

    await expect(
      service.applyForJob('cand-1', { jobId: 'job-1' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create application when candidate has resume and has not applied', async () => {
    repository.findExistingApplication!.mockResolvedValue(null);
    repository.findCandidateResumeUrl!.mockResolvedValue('/uploads/resumes/resume.pdf');
    repository.createApplication!.mockResolvedValue({ id: 'app-1' } as any);

    const result = await service.applyForJob('cand-1', {
      jobId: 'job-1',
      coverLetter: 'Hello!',
    });

    expect(result.message).toBe('Application submitted successfully');
    expect(repository.createApplication).toHaveBeenCalledWith({
      jobId: 'job-1',
      candidateId: 'cand-1',
      resumeUrl: '/uploads/resumes/resume.pdf',
      coverLetter: 'Hello!',
    });
  });

  it('should withdraw application for matching candidate', async () => {
    repository.findApplicationById!.mockResolvedValue({
      id: 'app-1',
      candidateId: 'cand-1',
      status: ApplicationStatus.SUBMITTED,
    } as any);
    repository.updateStatus!.mockResolvedValue({
      id: 'app-1',
      status: ApplicationStatus.WITHDRAWN,
    } as any);

    const result = await service.withdrawApplication('cand-1', 'app-1');

    expect(repository.updateStatus).toHaveBeenCalledWith(
      'app-1',
      ApplicationStatus.WITHDRAWN,
    );
  });
});
