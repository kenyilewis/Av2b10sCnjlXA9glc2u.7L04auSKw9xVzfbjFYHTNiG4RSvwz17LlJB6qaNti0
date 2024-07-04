import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): Types.ObjectId {
    if (!isMongoId(value)) {
      throw new BadRequestException(`Invalid ID: ${value}`);
    }
    return new Types.ObjectId(value);
  }
}
