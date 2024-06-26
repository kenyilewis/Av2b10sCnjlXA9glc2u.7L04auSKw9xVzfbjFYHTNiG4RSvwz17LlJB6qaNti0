import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { UserRepository } from '../../domain/user.repository';

export class UserOdmRepository<T> implements Model<T> {
  constructor(@InjectModel('User') private readonly userModel: Model<T>) {}

  async create(item: T): Promise<T> {
    const createdItem = new this.model(item);
    return createdItem.save();
  }

  async update(id: string, item: T): Promise<T> {
    return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(conditions: Partial<T>): Promise<T | null> {
    return this.model.findOne(conditions).exec();
  }

  async findAll(page: number, limit: number, conditions: Partial<T>): Promise<T[]> {
    return this.model
      .find(conditions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
