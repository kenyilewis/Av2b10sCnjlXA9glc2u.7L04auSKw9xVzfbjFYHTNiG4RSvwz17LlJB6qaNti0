import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const data = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
