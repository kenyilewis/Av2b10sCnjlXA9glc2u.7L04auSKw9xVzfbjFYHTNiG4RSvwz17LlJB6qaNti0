import { Module } from '@nestjs/common';
import { NewsfeedService } from './application/newsfeed.service';
import { NewsfeedController } from './infrastructure/newsfeed.controller';

@Module({
  controllers: [NewsfeedController],
  providers: [NewsfeedService],
})
export class NewsfeedModule {}
