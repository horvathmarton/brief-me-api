import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class Article {
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

  source: {
    id: string;
    name: string;
  };
  author: string | null;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;

  constructor(partial: Partial<Article>) {
    Object.assign(this, partial);
  }
}
