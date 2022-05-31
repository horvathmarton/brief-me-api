import { Injectable } from '@nestjs/common';
import { NEWS } from '../data/news.data';

@Injectable()
export class NewsService {
  public async list(channelId: number): Promise<unknown> {
    return NEWS[channelId] ?? [];
  }
}
