import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { UploadsRepository } from './uploads.repository';

@Module({
  imports: [StorageModule],
  controllers: [UploadsController],
  providers: [UploadsService, UploadsRepository],
  exports: [UploadsService, UploadsRepository],
})
export class UploadsModule {}
