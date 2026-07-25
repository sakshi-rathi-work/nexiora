import { Test, TestingModule } from '@nestjs/testing';
import { UploadsService } from './uploads.service';
import { StorageService } from '../storage/storage.service';
import { UploadsRepository } from './uploads.repository';

describe('UploadsService', () => {
  let service: UploadsService;
  let storageService: jest.Mocked<Partial<StorageService>>;
  let uploadsRepository: jest.Mocked<Partial<UploadsRepository>>;

  beforeEach(async () => {
    storageService = {
      saveAvatar: jest.fn(),
      saveResume: jest.fn(),
      deleteFile: jest.fn(),
    };

    uploadsRepository = {
      findUserAvatar: jest.fn(),
      findCandidateResume: jest.fn(),
      updateUserAvatar: jest.fn(),
      updateCandidateResume: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        { provide: StorageService, useValue: storageService },
        { provide: UploadsRepository, useValue: uploadsRepository },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it('should upload avatar and update database', async () => {
    const mockFile = {
      buffer: Buffer.from('mock image data'),
      originalname: 'avatar.png',
      mimetype: 'image/png',
      size: 1024,
    } as Express.Multer.File;

    uploadsRepository.findUserAvatar!.mockResolvedValue(null);
    storageService.saveAvatar!.mockResolvedValue({
      filename: 'avatar_123.png',
      relativePath: 'avatars/avatar_123.png',
      url: '/uploads/avatars/avatar_123.png',
    });

    const result = await service.uploadAvatar('user-1', mockFile);

    expect(result.avatarUrl).toBe('/uploads/avatars/avatar_123.png');
    expect(uploadsRepository.updateUserAvatar).toHaveBeenCalledWith(
      'user-1',
      '/uploads/avatars/avatar_123.png',
    );
  });

  it('should upload resume and update candidate profile', async () => {
    const mockFile = {
      buffer: Buffer.from('mock pdf data'),
      originalname: 'resume.pdf',
      mimetype: 'application/pdf',
      size: 2048,
    } as Express.Multer.File;

    uploadsRepository.findCandidateResume!.mockResolvedValue(null);
    storageService.saveResume!.mockResolvedValue({
      filename: 'resume_123.pdf',
      relativePath: 'resumes/resume_123.pdf',
      url: '/uploads/resumes/resume_123.pdf',
    });

    const result = await service.uploadResume('user-1', mockFile);

    expect(result.resumeUrl).toBe('/uploads/resumes/resume_123.pdf');
    expect(uploadsRepository.updateCandidateResume).toHaveBeenCalledWith(
      'user-1',
      '/uploads/resumes/resume_123.pdf',
    );
  });
});
