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

// TODO implement the ResponseNewsfeedListDto
export class ResponseNewsfeedListDto {
  results: ResponseNewsfeedDto[];
  total: number;
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;

  constructor(response: {
    results: Newsfeed[];
    total: number;
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  }) {
    this.results = response.results.map(
      (newsfeed) => new ResponseNewsfeedDto(newsfeed),
    );
    this.total = response.total;
    this.page = response.page;
    this.limit = response.limit;
    this.totalCount = response.totalCount;
    this.totalPages = response.totalPages;
  }
}
