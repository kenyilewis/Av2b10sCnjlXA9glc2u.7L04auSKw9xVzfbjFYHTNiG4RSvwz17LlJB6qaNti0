import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/enums/roles.enum';
import { RolesDecorator } from '../../auth/decorators/roles.decorator';
import { NewsfeedService } from '../application/newsfeed.service';
import {
  CreateNewsfeedDto,
  ResponseCreateNewsfeedDto,
} from '../application/dto';

@ApiTags('newsfeed')
@ApiBearerAuth('access-token')
@Controller('newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  @Post()
  @ApiOperation({ summary: 'Create newsfeed' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  async create(
    @Body() createNewsfeedDto: CreateNewsfeedDto,
    @Req() req: any,
  ): Promise<ResponseCreateNewsfeedDto> {
    try {
      await this.newsfeedService.createNewsfeed(
        createNewsfeedDto,
        req.user.userId,
      );
      return {
        message: 'Newsfeed created successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
