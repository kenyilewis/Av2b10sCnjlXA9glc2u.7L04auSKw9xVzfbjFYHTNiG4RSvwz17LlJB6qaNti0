import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationOptionsDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @ApiProperty({ default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(10)
  limit?: number;

  @ApiProperty()
  @IsOptional()
  sort?: any;

  @ApiProperty()
  @IsOptional()
  select?: string;
}
