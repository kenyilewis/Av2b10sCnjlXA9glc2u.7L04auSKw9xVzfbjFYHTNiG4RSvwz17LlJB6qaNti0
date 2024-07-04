import { Newsfeed } from './newsfeed';
import { Types } from 'mongoose';

export interface INewsfeedRepository {
  findAllNewsfeed(query: any, options: any): Promise<any>;
  createNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed>;
  findOneNewsfeed(id: string | Types.ObjectId): Promise<Newsfeed>;
  updateNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed>;
  deleteNewsfeed(newsfeed: Newsfeed): Promise<void>;
}
