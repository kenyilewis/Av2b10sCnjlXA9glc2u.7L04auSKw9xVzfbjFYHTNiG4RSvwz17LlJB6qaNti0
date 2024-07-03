import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateNewsfeedDto } from './dto/';
import { INewsfeedRepository } from '../domain/newsfeed.repository';
import { Newsfeed } from '../domain/newsfeed';

@Injectable()
export class NewsfeedService {
  constructor(
    @Inject('NewsfeedRepository')
    private readonly newsfeedRepository: INewsfeedRepository,
  ) {}

  async createNewsfeed(
    createNewsfeedDto: CreateNewsfeedDto,
    userId: string,
  ): Promise<void> {
    try {
      const newsfeed = new Newsfeed({
        ...createNewsfeedDto,
        author: userId,
      });
      await this.create(newsfeed);
    } catch (error) {
      console.error('Error creating newsfeed', JSON.stringify(error));
      throw (
        error || new InternalServerErrorException('Error creating newsfeed')
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
}
