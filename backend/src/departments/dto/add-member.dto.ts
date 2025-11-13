import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { DepartmentRole } from '../../common/enums';

export class AddMemberDto {
  @IsUUID()
  userId: string;

  @IsEnum(DepartmentRole)
  @IsOptional()
  role?: DepartmentRole = DepartmentRole.MEMBER;
}
