import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user';
import { UserDocument } from './user.odm-entity';

@Injectable()
export class UserOdmRepository implements UserRepository {
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

  async findById(id: string): Promise<User | null> {
    try {
      const userDocument = await this.userModel
        .findById(id)
        .where({ isDeleted: false })
        .exec();
      if (!userDocument) {
        return null;
      }

      return this.toDomain(userDocument);
    } catch (error) {
      console.info('Error in user findById', error.message);
      return null;
    }
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
    });
  }

  private toPersistence(user: User): any {
    return {
      username: user.username,
      email: user.email,
      password: user.password,
      isDeleted: user.isDeleted,
    };
  }
}
