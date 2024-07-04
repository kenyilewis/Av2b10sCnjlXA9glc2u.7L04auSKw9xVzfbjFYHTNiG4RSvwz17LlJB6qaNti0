import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from "mongoose";

import { INewsfeedRepository } from '../../../domain/newsfeed.repository';
import { NewsfeedDocument } from './newsfeed.entity';
import { Newsfeed } from '../../../domain/newsfeed';
import { Pagination } from '../../../../common/pagination';

@Injectable()
export class NewsfeedRepository implements INewsfeedRepository {
  private pagination: Pagination;

  constructor(
    @InjectModel(NewsfeedDocument.name)
    private readonly newsfeedModel: Model<NewsfeedDocument>,
  ) {
    this.pagination = new Pagination(this.newsfeedModel);
  }

  async createNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed> {
    const createdNewsfeed = new this.newsfeedModel(
      this.toPersistence(newsfeed),
    );
    const savedNewsfeed = await createdNewsfeed.save();
    return this.toDomain(savedNewsfeed);
  }

  async findAllNewsfeed(query: any, options: any): Promise<any> {
    const response = await this.pagination.paginate(query, options);
    const newsfeeds = await Promise.all(
      response.results.map((newsfeed) =>
        newsfeed.populate('author').execPopulate(),
      ),
    );

    return {
      ...response,
      results: newsfeeds,
    };
  }

  async findOneNewsfeed(id: string): Promise<Newsfeed | null> {
    const newsfeed = await this.newsfeedModel.findOne({ id }).exec();
    return newsfeed ? this.toDomain(newsfeed) : null;
  }

  async updateNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed> {
    const updatedNewsfeed = await this.newsfeedModel
      .findByIdAndUpdate(newsfeed.id, this.toPersistence(newsfeed), {
        new: true,
      })
      .exec();
    return this.toDomain(updatedNewsfeed);
  }

  async deleteNewsfeed(newsfeed): Promise<void> {
    await this.newsfeedModel.updateOne({ _id: newsfeed.id }, newsfeed).exec();
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
