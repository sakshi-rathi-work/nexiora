import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApplicationsRepository } from './applications.repository';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
  ) {}

  async applyForJob(candidateId: string, dto: CreateApplicationDto) {
    // 1. Check duplicate application
    const existing = await this.applicationsRepository.findExistingApplication(
      candidateId,
      dto.jobId,
    );
    if (existing) {
      throw new ConflictException(
        'You have already submitted an application for this job opening.',
      );
    }

    // 2. Check candidate resume
    const resumeUrl = await this.applicationsRepository.findCandidateResumeUrl(
      candidateId,
    );
    if (!resumeUrl) {
      throw new BadRequestException(
        'Please upload your resume in your Profile before applying for jobs.',
      );
    }

    // 3. Create application
    const application = await this.applicationsRepository.createApplication({
      jobId: dto.jobId,
      candidateId,
      resumeUrl,
      coverLetter: dto.coverLetter,
    });

    return {
      message: 'Application submitted successfully',
      application,
    };
  }

  async getCandidateApplications(candidateId: string) {
    return this.applicationsRepository.findCandidateApplications(candidateId);
  }

  async getRecruiterApplications(recruiterId: string) {
    return this.applicationsRepository.findRecruiterApplications(recruiterId);
  }

  async getJobApplications(recruiterId: string, jobId: string) {
    return this.applicationsRepository.findJobApplications(jobId);
  }

  async updateStatus(
    userId: string,
    userRole: string,
    applicationId: string,
    status: ApplicationStatus,
  ) {
    const app = await this.applicationsRepository.findApplicationById(applicationId);
    if (!app) {
      throw new NotFoundException('Application not found');
    }

    if (userRole !== 'ADMIN' && app.job.postedById !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this application status.',
      );
    }

    return this.applicationsRepository.updateStatus(applicationId, status);
  }

  async withdrawApplication(candidateId: string, applicationId: string) {
    const app = await this.applicationsRepository.findApplicationById(applicationId);
    if (!app) {
      throw new NotFoundException('Application not found');
    }

    if (app.candidateId !== candidateId) {
      throw new ForbiddenException('You can only withdraw your own applications.');
    }

    if (app.status === ApplicationStatus.WITHDRAWN) {
      throw new BadRequestException('This application has already been withdrawn.');
    }

    return this.applicationsRepository.updateStatus(
      applicationId,
      ApplicationStatus.WITHDRAWN,
    );
  }
}
