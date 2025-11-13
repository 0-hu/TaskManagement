import { IsEnum, IsOptional, IsUUID, IsInt, Min } from 'class-validator';
import { SubmissionStatus } from '../../common/enums';
import { Type } from 'class-transformer';

export class QuerySubmissionDto {
  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;

  @IsUUID()
  @IsOptional()
  taskId?: string;

  @IsUUID()
  @IsOptional()
  submittedBy?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
