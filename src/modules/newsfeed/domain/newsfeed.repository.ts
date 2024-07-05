import { Newsfeed } from './newsfeed';
import { Types } from 'mongoose';

export interface INewsfeedRepository {
  findAllNewsfeed(
    query: any,
    options: any,
    populateData?: any,
  ): Promise<object>;
  createNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed>;
  findOneNewsfeed(id: string | Types.ObjectId): Promise<Newsfeed | null>;
  updateNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed>;
  deleteNewsfeed(newsfeed: Newsfeed): Promise<void>;
}
