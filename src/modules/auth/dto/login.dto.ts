import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'the email of user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "the user's password" })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class JWTPayload {
  userId: string;
  email: string;
}
