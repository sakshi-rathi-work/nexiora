import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(Role.CANDIDATE)
  async apply(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationsService.applyForJob(user.sub, dto);
  }

  @Get('me')
  @Roles(Role.CANDIDATE)
  async getMyApplications(@CurrentUser() user: JwtPayload) {
    return this.applicationsService.getCandidateApplications(user.sub);
  }

  @Get('recruiter')
  @Roles(Role.RECRUITER, Role.ADMIN)
  async getRecruiterApplications(@CurrentUser() user: JwtPayload) {
    return this.applicationsService.getRecruiterApplications(user.sub);
  }

  @Get('job/:jobId')
  @Roles(Role.RECRUITER, Role.ADMIN)
  async getJobApplications(
    @CurrentUser() user: JwtPayload,
    @Param('jobId') jobId: string,
  ) {
    return this.applicationsService.getJobApplications(user.sub, jobId);
  }

  @Patch(':id/status')
  @Roles(Role.RECRUITER, Role.ADMIN)
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      user.sub,
      user.role,
      id,
      dto.status,
    );
  }

  @Patch(':id/withdraw')
  @Roles(Role.CANDIDATE)
  async withdraw(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.applicationsService.withdrawApplication(user.sub, id);
  }
}
