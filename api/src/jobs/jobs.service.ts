import { Injectable, NotFoundException } from '@nestjs/common';
import { JobsRepository } from './jobs.repository';
import { JobQueryDto } from './dto/job-query.dto';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}

  async findAll(query: JobQueryDto) {
    return this.jobsRepository.findAll(query);
  }

  async findByIdOrSlug(idOrSlug: string) {
    const job = await this.jobsRepository.findByIdOrSlug(idOrSlug);
    if (!job) {
      throw new NotFoundException(`Job listing "${idOrSlug}" not found`);
    }

    const relatedJobs = await this.jobsRepository.findRelatedJobs(
      job.companyId,
      job.id,
    );

    return {
      ...job,
      relatedJobs,
    };
  }
}
