import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'the user username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'the user email'})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'the user password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
