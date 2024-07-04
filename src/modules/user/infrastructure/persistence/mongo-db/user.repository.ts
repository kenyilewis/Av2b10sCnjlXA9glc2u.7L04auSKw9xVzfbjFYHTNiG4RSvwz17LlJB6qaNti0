import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUserRepository } from '../../../domain/user.repository';
import { User } from '../../../domain/user';
import { UserDocument } from './user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async userEmailExists(email: string): Promise<User | null> {
    const userDocument = await this.userModel.findOne({ email }).exec();

    return userDocument ? this.toDomain(userDocument) : null;
  }

  async createUser(user: User): Promise<User> {
    const createdUser = new this.userModel(this.toPersistence(user));
    const savedUser = await createdUser.save();

    return this.toDomain(savedUser);
  }

  async updateUser(user: User): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(user.id, this.toPersistence(user), { new: true })
      .exec();

    return this.toDomain(updatedUser);
  }

  //Auth method
  async findUserToAuth(email: string): Promise<User | null> {
    const userDocument = await this.userModel
      .findOne({ email })
      .where({ isDeleted: false })
      .exec();

    return userDocument ? this.toDomain(userDocument) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDocument = await this.userModel
      .findById(id)
      .where({ isDeleted: false })
      .exec();

    return userDocument ? this.toDomain(userDocument) : null;
  }

  private toDomain(userDocument: UserDocument): User {
    return new User({
      id: userDocument._id.toString(),
      username: userDocument.username,
      email: userDocument.email,
      password: userDocument.password,
      isDeleted: userDocument.isDeleted,
      createdAt: userDocument.get('createdAt'),
      updatedAt: userDocument.get('updatedAt'),
      roles: userDocument.roles,
    });
  }

  private toPersistence(user: User): any {
    return {
      username: user.username,
      email: user.email,
      password: user.password,
      isDeleted: user.isDeleted,
      roles: user.roles,
    };
  }
}
