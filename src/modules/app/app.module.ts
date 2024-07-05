import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MorganMiddleware } from '../middleware/logger.middleware';
import appConfig from '../config/config';
import {
  UserModule,
  DatabaseModule,
  AuthModule,
  NewsfeedModule,
} from '../index';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    NewsfeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
