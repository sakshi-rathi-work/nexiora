import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(3000)
  coverLetter?: string;
}
