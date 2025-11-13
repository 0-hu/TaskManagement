import { IsString, IsNotEmpty } from 'class-validator';

export class RejectSubmissionDto {
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
