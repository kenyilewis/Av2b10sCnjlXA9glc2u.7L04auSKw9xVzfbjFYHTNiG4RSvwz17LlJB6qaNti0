import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { INewsfeedRepository } from '../../../domain/newsfeed.repository';
import { NewsfeedDocument } from './newsfeed.entity';
import { Newsfeed } from '../../../domain/newsfeed';

@Injectable()
export class NewsfeedRepository implements INewsfeedRepository {
  constructor(
    @InjectModel(NewsfeedDocument.name)
    private readonly newsfeedModel: Model<NewsfeedDocument>,
  ) {}

  async createNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed> {
    const createdNewsfeed = new this.newsfeedModel(
      this.toPersistence(newsfeed),
    );
    const savedNewsfeed = await createdNewsfeed.save();
    return this.toDomain(savedNewsfeed);
  }

  private toDomain(newsfeedDocument: NewsfeedDocument): Newsfeed {
    return new Newsfeed({
      id: newsfeedDocument._id.toString(),
      title: newsfeedDocument.title,
      content: newsfeedDocument.content,
      author: newsfeedDocument.author,
      url: newsfeedDocument.url,
      image: newsfeedDocument.image,
      createdAt: newsfeedDocument.get('createdAt'),
      updatedAt: newsfeedDocument.get('updatedAt'),
      isDeleted: newsfeedDocument.isDeleted,
    });
  }

  private toPersistence(newsfeed: Newsfeed): any {
    return {
      title: newsfeed.title,
      content: newsfeed.content,
      author: newsfeed.author,
      url: newsfeed.url,
      image: newsfeed.image,
      isDeleted: newsfeed.isDeleted,
    };
  }
}
