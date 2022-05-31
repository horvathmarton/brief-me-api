import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Role } from 'src/auth/roles';
import { ApiResponse } from '../shared/types';
import { Article, Channel } from './interfaces';
import { NewsService, TtsService } from './services';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly ttsService: TtsService,
  ) {}

  @Get('channels')
  @Role('user')
  public listChannels(): ApiResponse<Channel[]> {
    const CHANNELS = [
      { id: 1, title: 'For me' },
      { id: 2, title: 'About the war' },
      { id: 3, title: 'US elections' },
      { id: 4, title: 'Celebrity news' },
    ];

    return { payload: CHANNELS };
  }

  @Get('channels/:channelId')
  @Role('user')
  public async fetchChannelVoice(
    @Param('channelId') channelId: number,
  ): Promise<StreamableFile> {
    const news = await this.newsService.list(channelId);

    const filePath = await this.ttsService.toFile(news[0].content);
    const file = createReadStream(join(process.cwd(), filePath));

    return new StreamableFile(file);
  }

  @Get('channels/:channelId/text')
  @Role('user')
  public async fetchChannelText(
    @Param('channelId') channelId: number,
  ): Promise<ApiResponse<Article[]>> {
    const news = await this.newsService.list(channelId);

    return { payload: news };
  }
}
