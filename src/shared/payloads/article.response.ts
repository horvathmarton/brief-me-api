import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { NewsSource } from '../../news/interfaces';

@Exclude()
export class Article {
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  body: string;

  uri: string;
  lang: string;
  isDuplicate: boolean;
  date: string;
  time: string;
  dateTime: Date;
  dateTimePub: Date;
  dataType: string;
  sim: number;
  url: string;
  source: NewsSource;
  authors: string[];
  image: string;
  eventUri: string | null;
  sentiment: number | null;
  wgt: number;
  relevance: number;

  constructor(partial: Partial<Article>) {
    Object.assign(this, partial);
  }
}
