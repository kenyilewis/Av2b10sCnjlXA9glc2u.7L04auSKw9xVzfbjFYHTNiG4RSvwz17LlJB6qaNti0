import { Newsfeed } from './newsfeed';

export interface INewsfeedRepository {
  createNewsfeed(newsfeed: Newsfeed): Promise<Newsfeed>;
}
