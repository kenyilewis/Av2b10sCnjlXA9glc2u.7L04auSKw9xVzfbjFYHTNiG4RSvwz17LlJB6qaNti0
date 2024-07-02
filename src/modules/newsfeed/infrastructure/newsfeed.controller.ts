import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NewsfeedService } from '../application/newsfeed.service';
import { CreateNewsfeedDto } from '../application/dto/create-newsfeed.dto';
import { UpdateNewsfeedDto } from '../application/dto/update-newsfeed.dto';

@Controller('newsfeed')
export class NewsfeedController {
  constructor(private readonly newsfeedService: NewsfeedService) {}

  @Post()
  create(@Body() createNewsfeedDto: CreateNewsfeedDto) {
    return this.newsfeedService.create(createNewsfeedDto);
  }

  @Get()
  findAll() {
    return this.newsfeedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsfeedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsfeedDto: UpdateNewsfeedDto) {
    return this.newsfeedService.update(+id, updateNewsfeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsfeedService.remove(+id);
  }
}
