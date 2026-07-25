import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getProfile(userId: string) {
    const user = await this.usersRepository.findUserProfile(userId);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findUserProfile(userId);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return this.usersRepository.updateUserProfile(userId, dto);
  }

  async getCandidateProfile(userId: string) {
    const profile = await this.usersRepository.findCandidateProfile(userId);
    if (!profile) {
      return this.usersRepository.updateCandidateProfile(userId, {});
    }
    return profile;
  }

  async updateCandidateProfile(userId: string, dto: UpdateCandidateProfileDto) {
    return this.usersRepository.updateCandidateProfile(userId, dto);
  }
}
