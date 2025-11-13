import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID()
  taskId: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
