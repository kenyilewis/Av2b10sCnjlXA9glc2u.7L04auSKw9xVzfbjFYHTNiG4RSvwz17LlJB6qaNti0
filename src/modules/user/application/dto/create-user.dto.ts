import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../../common/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'the user username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'the user email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'the user password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'the user roles',
    isArray: true,
    enum: Roles,
    required: false,
  })
  @IsArray()
  @ValidateIf((u) => u.roles !== undefined)
  @IsEnum(Roles, { each: true })
  roles?: Roles[];
}
