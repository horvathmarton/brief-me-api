import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CategoryPriority } from '../../db/models';
import { Channel } from '../../shared/payloads';

@Injectable()
export class ChannelsService {
  public readonly ANONYMOUS_CHANNELS = [
    new Channel({
      id: 1,
      title: 'Sport news',
      keywords: ['sports', 'betting', 'results'],
    }),
    new Channel({
      id: 2,
      title: 'Russo-Ukrainian war',
      keywords: ['war', 'Russia', 'Ukraine'],
    }),
    new Channel({
      id: 3,
      title: 'Politics',
      keywords: ['politics', 'elections'],
    }),
    new Channel({
      id: 4,
      title: 'Celebrity news',
      keywords: ['celebrity', 'celebrities'],
    }),
  ];

  private readonly cache: Record<number, Record<number, Channel>> = {};

  constructor(private readonly dataSource: DataSource) {}

  public async list(userId: number): Promise<Channel[]> {
    if (!(userId in this.cache)) {
      const priorities = await this.dataSource
        .getRepository(CategoryPriority)
        .find({
          where: { userId },
          relations: ['category'],
          order: { priority: 'DESC' },
          take: 4,
        });

      this.cache[userId] = priorities.reduce(
        (mapping, priority, index) => ({
          ...mapping,
          [index + this.ANONYMOUS_CHANNELS.length + 1]: new Channel({
            id: index + this.ANONYMOUS_CHANNELS.length + 1,
            title: priority.category.name,
            keywords: [priority.category.name],
          }),
        }),
        {},
      );
    }

    return Object.values(this.cache[userId]);
  }

  public find(userId: number | null, channelId: number): Channel | undefined {
    if (channelId <= this.ANONYMOUS_CHANNELS.length) {
      return this.ANONYMOUS_CHANNELS[channelId - 1];
    }

    return this.cache[userId]?.[channelId];
  }

  public invalidateCache(userId: number): void {
    this.cache[userId] = undefined;
  }
}
