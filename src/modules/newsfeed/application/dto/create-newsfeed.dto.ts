import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsfeedDto {
  @ApiProperty({ description: 'the newsfeed title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'the newsfeed content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'the newsfeed url', required: false })
  @IsString()
  url: string;

  @ApiProperty({ description: 'the newsfeed author', required: false })
  @IsString()
  author: string;
}
