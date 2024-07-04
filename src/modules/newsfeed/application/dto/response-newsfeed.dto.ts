import { Newsfeed } from '../../domain/newsfeed';
import { Types } from 'mongoose';

export class ResponseCreateNewsfeedDto {
  message: string;
  statusCode: number;
}

export class ResponseNewsfeedDto {
  id: string | Types.ObjectId;
  title: string;
  content: string;
  author: string | object;
  url?: string;
  image?: string;

  constructor(newsfeed: Newsfeed) {
    this.id = newsfeed.id;
    this.title = newsfeed.title;
    this.content = newsfeed.content;
    this.author = newsfeed.author;
    this.url = newsfeed.url;
    this.image = newsfeed.image;
  }
}

export class ResponseNewsfeeds {
  results: ResponseNewsfeedDto[];
  total: number;
  page: number;
  limit: number;
  statusCode: number;
}
