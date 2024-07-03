export class Newsfeed {
  private readonly _id?: string;
  private _title: string;
  private _content: string;
  private _url?: string | null;
  private _image?: string | null;
  private readonly _author: object | string;
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;
  private _isDeleted?: boolean;

  constructor(newsfeed: {
    id?: string;
    title: string;
    content: string;
    author: string | object;
    url?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
  }) {
    this._id = newsfeed.id;
    this._title = newsfeed.title;
    this._content = newsfeed.content;
    this._url = newsfeed.url ?? null;
    this._image = newsfeed.image ?? null;
    this._author = newsfeed.author;
    this._createdAt = newsfeed.createdAt;
    this._updatedAt = newsfeed.updatedAt;
    this._isDeleted = newsfeed.isDeleted ?? false;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get content(): string {
    return this._content;
  }

  get author(): string | object {
    return this._author;
  }

  get image(): string | null {
    return this._image;
  }

  get url(): string | null {
    return this._url;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  updateTitle(title: string): void {
    this._title = title;
    this._updatedAt = new Date();
  }

  updateContent(content: string): void {
    this._content = content;
    this._updatedAt = new Date();
  }

  updateUrl(url: string): void {
    this._url = url;
    this._updatedAt = new Date();
  }

  updateImage(image: string): void {
    this._image = image;
    this._updatedAt = new Date();
  }

  delete(): void {
    this._isDeleted = true;
    this._updatedAt = new Date();
  }
}
