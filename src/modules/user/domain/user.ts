export class User {
  private readonly _id?: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt?: Date | null;

  constructor(user: User) {
    this._id = user.id;
    this._name = user.name;
    this._email = user.email;
    this._password = user.password;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._deletedAt = user.deletedAt ?? null;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
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

  updateUser(user: { name: string; email: string, password: string }): void {
    this._name = user.name;
    this._email = user.email;
    this._password = user.password;
    this._updatedAt = new Date();
  }

  delete(): void {
    const now = new Date();
    this._deletedAt = now;
    this._updatedAt = now;
  }

  restore(): void {
    this._deletedAt = null;
    this._updatedAt = new Date();
  }
}