import { Roles } from "../../common/enums/roles.enum";

export class User {
  private readonly _id?: string;
  private _username: string;
  private _email: string;
  private _password: string;
  private readonly _createdAt?: Date;
  private _updatedAt?: Date;
  private _isDeleted?: boolean;
  private _roles: Roles[];

  constructor(user: {
    id?: string;
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    roles: Roles[];
  }) {
    this._id = user.id;
    this._username = user.username;
    this._email = user.email;
    this._password = user.password;
    this._createdAt = user.createdAt;
    this._updatedAt = user.updatedAt;
    this._isDeleted = user.isDeleted ?? false;
    this._roles = user.roles;
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

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get roles(): Roles[] {
    return this._roles;
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

  updateRoles(roles: Roles[]): void {  // Método para actualizar roles
    this._roles = roles;
    this._updatedAt = new Date();
  }

  delete(): void {
    this._isDeleted = true;
    this._updatedAt = new Date();
  }
}
