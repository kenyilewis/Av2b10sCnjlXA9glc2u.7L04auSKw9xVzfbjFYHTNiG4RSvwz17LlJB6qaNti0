export class ResponseCreateNewsfeedDto {
  message: string;
  statusCode: number;
}

export class ResponsNewsfeedDto {
  id: string;
  title: string;
  content: string;
  author: string | object;
  url: string;
  image: string;

  constructor(newsfeed: {
    id: string;
    title: string;
    content: string;
    author: string | object;
    url: string;
    image: string;
  }) {
    this.id = newsfeed.id;
    this.title = newsfeed.title;
    this.content = newsfeed.content;
    this.author = newsfeed.author;
    this.url = newsfeed.url;
    this.image = newsfeed.image;
  }
}
