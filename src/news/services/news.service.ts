import { Injectable } from '@nestjs/common';
import { NEWS } from '../data/news.data';
import { Article } from '../interfaces';

@Injectable()
export class NewsService {
  public async list(channelId: number): Promise<Article[]> {
    return NEWS[channelId] ?? [];
  }
}
