import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  CreateNewsfeedDto,
  ResponseNewsfeedDto,
  UpdateNewsfeedDto,
} from './dto/';
import { INewsfeedRepository } from '../domain/newsfeed.repository';
import { Newsfeed } from '../domain/newsfeed';
import { PaginationOptionsDto } from '../../common/pagination/pagination-options.dto';
import { UserService } from '../../user/application/user.service';

@Injectable()
export class NewsfeedService {
  constructor(
    @Inject('NewsfeedRepository')
    private readonly newsfeedRepository: INewsfeedRepository,
    private readonly userService: UserService,
  ) {}

  async createNewsfeed(
    createNewsfeedDto: CreateNewsfeedDto,
    authorId: string,
  ): Promise<void> {
    try {
      await this.userService.getUserById(authorId);
      const newsfeed = new Newsfeed({
        ...createNewsfeedDto,
        author: authorId,
      });
      await this.create(newsfeed);
    } catch (error) {
      console.error('Error creating newsfeed', JSON.stringify(error));
      throw error || new InternalServerErrorException('Error getting newsfeed');
    }
  }

  async findAllNewsfeed(options: PaginationOptionsDto, authorId: string) {
    try {
      await this.userService.getUserById(authorId);
      const query = {
        isDeleted: false,
      };

      return this.newsfeedRepository.findAllNewsfeed(query, options);
    } catch (error) {
      console.error('Error getting newsfeeds', JSON.stringify(error));
      throw (
        error || new InternalServerErrorException('Error getting newsfeeds')
      );
    }
  }

  async findOneNewsfeed(
    id: string,
    authorId: string,
  ): Promise<ResponseNewsfeedDto> {
    try {
      console.log('authorId', authorId);
      console.log('id', id);
      await this.userService.getUserById(authorId);
      const response: Newsfeed = await this.existingNewsfeed(id);

      return new ResponseNewsfeedDto(response);
    } catch (error) {
      console.error('Error getting newsfeed', JSON.stringify(error));
      throw error || new InternalServerErrorException('Error getting newsfeed');
    }
  }

  async updateNewsfeed(
    id: string,
    updateNewsfeedDto: UpdateNewsfeedDto,
    authorId: string,
  ): Promise<Newsfeed> {
    try {
      await this.userService.getUserById(authorId);
      const existingNewfeed = await this.existingNewsfeed(id);
      const { title, content, url, image } = updateNewsfeedDto;

      title && existingNewfeed.updateTitle(title);
      content && existingNewfeed.updateContent(content);
      url && existingNewfeed.updateUrl(url);
      image && existingNewfeed.updateImage(image);

      return this.newsfeedRepository.updateNewsfeed(existingNewfeed);
    } catch (error) {
      console.error('Error updating newsfeed', JSON.stringify(error));
      throw (
        error || new InternalServerErrorException('Error updating newsfeed')
      );
    }
  }

  async deleteNewsfeed(id: string, authorId: string): Promise<void> {
    try {
      await this.userService.getUserById(authorId);
      const newsfeed = await this.existingNewsfeed(id);
      newsfeed.delete();
      this.newsfeedRepository.deleteNewsfeed(newsfeed);
    } catch (error) {
      console.error('Error deleting newsfeed', JSON.stringify(error));
      throw (
        error || new InternalServerErrorException('Error deleting newsfeed')
      );
    }
  }

  private async create(newsfeed: Newsfeed): Promise<Newsfeed> {
    const newsfeedCreated = await this.newsfeedRepository.createNewsfeed(
      newsfeed,
    );
    if (!newsfeedCreated) {
      throw new InternalServerErrorException('Error creating newsfeed');
    }
    return newsfeedCreated;
  }

  private async existingNewsfeed(id: string): Promise<Newsfeed> {
    const newsfeed = await this.newsfeedRepository.findOneNewsfeed(id);
    if (!newsfeed) {
      throw new InternalServerErrorException('Newsfeed not found');
    }
    return newsfeed;
  }
}
