import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './application/user.service';
import { UserController } from './infrastructure/user.controller';
import {
  UserSchema,
  UserDocument,
} from './infrastructure/persistence/mongo-db/user.entity';
import { UserRepository } from './infrastructure/persistence/mongo-db/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: 'UserRepository', useClass: UserRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
