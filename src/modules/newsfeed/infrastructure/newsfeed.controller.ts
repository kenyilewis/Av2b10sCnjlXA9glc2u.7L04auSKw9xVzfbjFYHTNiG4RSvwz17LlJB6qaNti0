import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  Get,
  Param,
  Query,
  Put,
  Delete,
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
  ResponseNewsfeedDto,
  UpdateNewsfeedDto,
} from '../application/dto';
import { MongoIdPipe } from '../../common/validations/mongo-id.pipe';
import { PaginationOptionsDto } from '../../common/pagination/pagination-options.dto';

@ApiTags('newsfeed')
@ApiBearerAuth('access-token')
@Controller('newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Get()
  @ApiOperation({ summary: 'Get all newsfeeds' })
  async findAll(
    @Query() paginationOptions: PaginationOptionsDto,
    @Req() req: any,
  ) {
    return this.newsfeedService.findAllNewsfeed(
      paginationOptions,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Post()
  @ApiOperation({ summary: 'Create newsfeed' })
  async create(
    @Body() createNewsfeedDto: CreateNewsfeedDto,
    @Req() req: any,
  ): Promise<ResponseCreateNewsfeedDto> {
    await this.newsfeedService.createNewsfeed(
      createNewsfeedDto,
      req.user.userId,
    );
    return {
      message: 'Newsfeed created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiOperation({ summary: 'Get newsfeed' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Get(':id')
  async findOne(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: any,
  ): Promise<ResponseNewsfeedDto> {
    console.log('req.user.userId', req.user);
    return await this.newsfeedService.findOneNewsfeed(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Put(':id')
  @ApiOperation({ summary: 'Update a newsfeed' })
  async update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateNewsfeedDto: UpdateNewsfeedDto,
    @Req() req: any,
  ) {
    return this.newsfeedService.updateNewsfeed(
      id,
      updateNewsfeedDto,
      req.userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a newsfeed' })
  async delete(
    @Param('id', MongoIdPipe) id: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    await this.newsfeedService.deleteNewsfeed(id, req.user.userId);
    return { message: 'Newsfeed deleted successfully' };
  }
}
