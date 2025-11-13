import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../common/enums';

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
