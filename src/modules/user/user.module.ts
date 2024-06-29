import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './application/user.service';
import { UserController } from './infrastructure/user.controller';
import {
  UserSchema,
  UserDocument,
} from './infrastructure/persistence/user.odm-entity';
import { UserOdmRepository } from './infrastructure/persistence/user.odm-repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: 'UserRepository', useClass: UserOdmRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
