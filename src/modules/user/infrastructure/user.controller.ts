import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from '../application/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ResponseUserDto,
} from '../application/dto';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { MongoIdPipe } from '../../common/validations/mongo-id.pipe';
import { Roles } from '../../common/enums/roles.enum';
import { RolesDecorator } from '../../auth/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(
        error.response,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  async updateUser(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ): Promise<ResponseUserDto> {
    try {
      return await this.userService.updateUser(id, updateUserDto, req.user);
    } catch (error) {
      throw new HttpException(
        error.response,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  async getUserById(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: any,
  ): Promise<ResponseUserDto> {
    try {
      return await this.userService.getUserById(id, req.user);
    } catch (error) {
      throw new HttpException(
        error.response,
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUser(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    try {
      await this.userService.deleteUser(id, req.user);
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.response,
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }
}
