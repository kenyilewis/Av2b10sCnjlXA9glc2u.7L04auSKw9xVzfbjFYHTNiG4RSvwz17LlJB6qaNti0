export class User {
  private readonly _id?: string;
  private _username: string;
  private _email: string;
  private _password: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date | null;

  constructor(user: {
    id?: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }) {
    this._id = user.id;
    this._username = user.username;
    this._email = user.email;
    this._password = user.password;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._deletedAt = user.deletedAt ?? null;
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  updateEmail(email: string): void {
    this._email = email;
    this._updatedAt = new Date();
  }

  updatePassword(password: string): void {
    this._password = password;
    this._updatedAt = new Date();
  }

  updateUsername(username: string): void {
    this._username = username;
    this._updatedAt = new Date();
  }

  delete(): void {
    const now = new Date();
    this._deletedAt = now;
    this._updatedAt = now;
  }
}
