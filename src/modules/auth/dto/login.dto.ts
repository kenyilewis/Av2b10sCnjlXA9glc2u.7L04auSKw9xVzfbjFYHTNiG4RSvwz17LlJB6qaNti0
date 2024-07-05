import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Roles } from '../../common/enums/roles.enum';

export class LoginDto {
  @ApiProperty({ description: 'the user email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'the user password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class JWTPayload {
  userId: string;
  email: string;
  roles: Roles[];
}
