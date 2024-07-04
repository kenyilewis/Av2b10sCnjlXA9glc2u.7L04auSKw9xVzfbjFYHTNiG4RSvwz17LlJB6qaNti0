import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { ScraperService } from './application/scraper.service';
import { ScraperController } from './infrastructure/scraper.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Newsfeed.name, schema: FeedSchema }]),
  ],
  providers: [
    ScraperService,
    {
      provide: 'NewsfeedRepository',
      useClass: NewsfeedRepository,
    }],
  controllers: [ScraperController],
})
export class ScraperModule {}
