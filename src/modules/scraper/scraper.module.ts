import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ScraperService } from './application/scraper.service';
import { ScraperController } from './infrastructure/scraper.controller';
import { NewsfeedRepository } from "../newsfeed/infrastructure/persistence/mongo-db/newsfeed.repository";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ ScraperService, { provide: 'NewsfeedRepository', useClass: NewsfeedRepository }],
  controllers: [ScraperController],
})
export class ScraperModule {}
