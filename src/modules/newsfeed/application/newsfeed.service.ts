import { Injectable } from '@nestjs/common';
import { CreateNewsfeedDto } from './dto/create-newsfeed.dto';
import { UpdateNewsfeedDto } from './dto/update-newsfeed.dto';

@Injectable()
export class NewsfeedService {
  create(createNewsfeedDto: CreateNewsfeedDto) {
    return 'This action adds a new newsfeed';
  }

  findAll() {
    return `This action returns all newsfeed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newsfeed`;
  }

  update(id: number, updateNewsfeedDto: UpdateNewsfeedDto) {
    return `This action updates a #${id} newsfeed`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsfeed`;
  }
}
