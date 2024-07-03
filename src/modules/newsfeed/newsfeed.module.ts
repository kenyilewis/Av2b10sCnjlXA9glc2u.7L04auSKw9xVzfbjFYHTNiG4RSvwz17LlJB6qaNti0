import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NewsfeedService } from './application/newsfeed.service';
import { NewsfeedController } from './infrastructure/newsfeed.controller';
import { NewsfeedRepository } from './infrastructure/persistence/mongo-db/newsfeed.repository';
import {
  NewsfeedDocument,
  NewsfeedSchema,
} from './infrastructure/persistence/mongo-db/newsfeed.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NewsfeedDocument.name, schema: NewsfeedSchema },
    ]),
  ],
  controllers: [NewsfeedController],
  providers: [
    NewsfeedService,
    { provide: 'NewsfeedRepository', useClass: NewsfeedRepository },
  ],
  exports: [NewsfeedService],
})
export class NewsfeedModule {}
