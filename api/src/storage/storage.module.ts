import { Module } from '@nestjs/common';
import { StorageService, LocalDiskStorageService } from './storage.service';

@Module({
  providers: [
    {
      provide: StorageService,
      useClass: LocalDiskStorageService,
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
