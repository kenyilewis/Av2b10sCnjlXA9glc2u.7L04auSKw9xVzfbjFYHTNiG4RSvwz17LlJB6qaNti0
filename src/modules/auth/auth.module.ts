import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserService } from '../user/application/user.service';
import { UserOdmRepository } from '../user/infrastructure/persistence/user.odm-repository';
import {
  UserDocument,
  UserSchema,
} from '../user/infrastructure/persistence/user.odm-entity';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('config.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('config.jwt.expiresIn'),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    { provide: 'UserRepository', useClass: UserOdmRepository },
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
