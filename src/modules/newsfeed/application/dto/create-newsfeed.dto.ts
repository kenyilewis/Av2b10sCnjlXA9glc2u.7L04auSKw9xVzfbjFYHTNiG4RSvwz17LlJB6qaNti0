import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNewsfeedDto {
  @ApiProperty({ description: 'the newsfeed title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'the newsfeed content', required: false })
  @IsString()
  content: string;

  @ApiProperty({ description: 'the newsfeed url', required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ description: 'the newsfeed image', required: false })
  @IsString()
  @IsOptional()
  image?: string;
}
