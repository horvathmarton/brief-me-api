import {
  Controller,
  Get,
  NotFoundException,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Role } from 'src/auth/roles';
import { Channel } from 'src/shared/payloads';
import { Article } from 'src/shared/payloads/article.response';
import { ApiResponse } from '../shared/types';
import { NewsService, TtsService } from './services';

@Controller({ path: 'news', version: '1' })
export class NewsController {
  private readonly CHANNELS = [
    new Channel({
      id: 1,
      title: 'For me',
      keywords: ['investing', 'engineering', 'software'],
    }),
    new Channel({
      id: 2,
      title: 'About the war',
      keywords: ['Ukraine', 'war', 'Russia', 'Donbas'],
    }),
    new Channel({
      id: 3,
      title: 'US elections',
      keywords: ['elections', 'politics', 'Joe Biden', 'Donald Trump'],
    }),
    new Channel({ id: 4, title: 'Celebrity news', keywords: ['celebrity'] }),
  ];

  constructor(
    private readonly newsService: NewsService,
    private readonly ttsService: TtsService,
  ) {}

  @Get('channels')
  @Role('user')
  public listChannels(): ApiResponse<Channel[]> {
    return { payload: this.CHANNELS };
  }

  @Get('channels/:channelId')
  @Role('user')
  public async fetchChannelVoice(
    @Param('channelId') channelId: string,
  ): Promise<StreamableFile> {
    const parsedChannelId = Number.parseInt(channelId);
    const channel = this.CHANNELS.find((c) => c.id === parsedChannelId);

    if (!channel) {
      throw new NotFoundException("Channel with this ID doesn't exist.");
    }

    const news = await this.newsService.list(channel.keywords);

    const filePath = await this.ttsService.toFile(news[0].body);
    const file = createReadStream(join(process.cwd(), filePath));

    return new StreamableFile(file);
  }

  @Get('channels/:channelId/text')
  @Role('user')
  public async fetchChannelText(
    @Param('channelId') channelId: string,
  ): Promise<ApiResponse<Article[]>> {
    const parsedChannelId = Number.parseInt(channelId);
    const channel = this.CHANNELS.find((c) => c.id === parsedChannelId);

    if (!channel) {
      throw new NotFoundException("Channel with this ID doesn't exist.");
    }

    const news = await this.newsService.list(channel.keywords);

    return { payload: news };
  }
}
