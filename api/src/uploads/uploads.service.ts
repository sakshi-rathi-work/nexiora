import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { UploadsRepository } from './uploads.repository';

@Injectable()
export class UploadsService {
  constructor(
    private readonly storageService: StorageService,
    private readonly uploadsRepository: UploadsRepository,
  ) {}

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Delete old avatar if present
    const oldAvatarUrl = await this.uploadsRepository.findUserAvatar(userId);
    if (oldAvatarUrl && oldAvatarUrl.startsWith('/uploads/')) {
      const relativePath = oldAvatarUrl.replace('/uploads/', '');
      await this.storageService.deleteFile(relativePath);
    }

    // Save new avatar
    const result = await this.storageService.saveAvatar(file);
    await this.uploadsRepository.updateUserAvatar(userId, result.url);

    return {
      avatarUrl: result.url,
      message: 'Avatar uploaded successfully',
    };
  }

  async uploadResume(userId: string, file: Express.Multer.File) {
    // Delete old resume if present
    const oldResumeUrl = await this.uploadsRepository.findCandidateResume(userId);
    if (oldResumeUrl && oldResumeUrl.startsWith('/uploads/')) {
      const relativePath = oldResumeUrl.replace('/uploads/', '');
      await this.storageService.deleteFile(relativePath);
    }

    // Save new resume
    const result = await this.storageService.saveResume(file);
    await this.uploadsRepository.updateCandidateResume(
      userId,
      result.url,
    );

    return {
      resumeUrl: result.url,
      resumeOriginalName: file.originalname,
      message: 'Resume uploaded successfully',
    };
  }
}
