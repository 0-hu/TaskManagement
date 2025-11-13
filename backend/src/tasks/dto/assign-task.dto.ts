import { IsUUID, IsArray } from 'class-validator';

export class AssignTaskDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}
