import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadedFileResult {
  filename: string;
  relativePath: string;
  url: string;
}

export abstract class StorageService {
  abstract saveResume(
    file: Express.Multer.File,
  ): Promise<UploadedFileResult>;

  abstract saveAvatar(
    file: Express.Multer.File,
  ): Promise<UploadedFileResult>;

  abstract deleteFile(relativePath: string): Promise<void>;
}

@Injectable()
export class LocalDiskStorageService implements StorageService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = path.resolve(
      this.configService.get<string>('LOCAL_UPLOAD_DIR', './uploads'),
    );

    // Ensure upload directories exist on startup
    this.ensureDirectoryExists(path.join(this.uploadDir, 'resumes'));
    this.ensureDirectoryExists(path.join(this.uploadDir, 'avatars'));
  }

  private ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async saveResume(file: Express.Multer.File): Promise<UploadedFileResult> {
    if (!file) {
      throw new BadRequestException('No resume file provided');
    }

    // Validate MIME type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF and DOC/DOCX files are allowed for resumes.',
      );
    }

    // Validate file size (max 5MB)
    const maxMb = this.configService.get<number>('MAX_RESUME_SIZE_MB', 5);
    if (file.size > maxMb * 1024 * 1024) {
      throw new BadRequestException(
        `Resume file size exceeds the maximum limit of ${maxMb}MB.`,
      );
    }

    const ext = path.extname(file.originalname) || '.pdf';
    const filename = `resume_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    const relativePath = `resumes/${filename}`;
    const fullPath = path.join(this.uploadDir, 'resumes', filename);

    await fs.promises.writeFile(fullPath, file.buffer);

    return {
      filename,
      relativePath,
      url: `/uploads/${relativePath}`,
    };
  }

  async saveAvatar(file: Express.Multer.File): Promise<UploadedFileResult> {
    if (!file) {
      throw new BadRequestException('No avatar image file provided');
    }

    // Validate MIME type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid image type. Only JPEG, PNG, and WebP images are allowed for avatars.',
      );
    }

    // Validate file size (max 2MB)
    const maxMb = this.configService.get<number>('MAX_AVATAR_SIZE_MB', 2);
    if (file.size > maxMb * 1024 * 1024) {
      throw new BadRequestException(
        `Avatar file size exceeds the maximum limit of ${maxMb}MB.`,
      );
    }

    const ext = path.extname(file.originalname) || '.png';
    const filename = `avatar_${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    const relativePath = `avatars/${filename}`;
    const fullPath = path.join(this.uploadDir, 'avatars', filename);

    await fs.promises.writeFile(fullPath, file.buffer);

    return {
      filename,
      relativePath,
      url: `/uploads/${relativePath}`,
    };
  }

  async deleteFile(relativePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadDir, relativePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
    } catch {
      // Ignore errors when deleting non-existent files
    }
  }
}
