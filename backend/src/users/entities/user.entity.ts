import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  password: string; // Not exposed in API responses

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
