import { PartialType } from '@nestjs/mapped-types';
import { CreateNewsfeedDto } from './create-newsfeed.dto';

export class UpdateNewsfeedDto extends PartialType(CreateNewsfeedDto) {}
