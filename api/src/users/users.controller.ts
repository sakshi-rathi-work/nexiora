import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getProfile(user.sub);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Get('me/candidate-profile')
  async getCandidateProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getCandidateProfile(user.sub);
  }

  @Patch('me/candidate-profile')
  async updateCandidateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateCandidateProfileDto,
  ) {
    return this.usersService.updateCandidateProfile(user.sub, dto);
  }
}
