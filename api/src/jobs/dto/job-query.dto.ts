import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class JobQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  employmentType?: string; // Single or comma-separated: FULL_TIME,CONTRACT

  @IsOptional()
  @IsString()
  experienceLevel?: string; // Single or comma-separated: SENIOR,LEAD

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minSalary?: number;

  @IsOptional()
  @IsString()
  datePosted?: string; // '24h', '7d', '30d'

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12; // 12 items per page for clean 3x4 grid
}
