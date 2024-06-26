import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { UserService } from '../application/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto,
} from '../application/dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      const user = await this.userService.create(createUserDto);
      return new ResponseUserDto(user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @Get()
  // async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
  //   return this.userService.findAll(page, limit);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
