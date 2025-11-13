import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: '사용자 이메일',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호 (최소 6자)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({
    example: '홍길동',
    description: '사용자 이름',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'USER',
    description: '사용자 역할',
    enum: Role,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
