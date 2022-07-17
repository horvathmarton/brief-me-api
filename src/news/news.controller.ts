import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/roles';
import { extendArray } from '../shared/helpers';
import { Channel } from '../shared/payloads';
import { Article } from '../shared/payloads/article.response';
import { ApiResponsePayload } from '../shared/types';
import { ChannelsService, NewsService, TtsService } from './services';

@Controller({ path: 'news', version: '1' })
@ApiTags('channels')
@ApiBearerAuth()
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly ttsService: TtsService,
    private readonly authService: AuthService,
    private readonly channelsService: ChannelsService,
  ) {}

  @Get('channels')
  @Role('anonymous')
  @ApiOkResponse({
    description: 'Fetched channel list successfully.',
    type: [Channel],
  })
  public async listChannels(
    @Req() request: Request,
  ): Promise<ApiResponsePayload<Channel[]>> {
    if (!this.authService.isAuthenticated(request)) {
      return { payload: this.channelsService.ANONYMOUS_CHANNELS };
    }

    const user = await this.authService.getAuthenticatedUserId(request);
    const channels = await this.channelsService.list(user);

    return {
      payload: extendArray(
        channels,
        this.channelsService.ANONYMOUS_CHANNELS,
        4,
      ),
    };
  }

  @Get('channels/:channelId')
  @Role('anonymous')
  @ApiOkResponse({
    description: 'Text channel fetched successfully.',
    type: [Article],
  })
  public async fetchChannelText(
    @Req() request: Request,
    @Param('channelId') channelId: string,
  ): Promise<ApiResponsePayload<{ channel: Channel; news: Article[] }>> {
    const parsedChannelId = Number.parseInt(channelId);
    const user = await this.authService.getAuthenticatedUserId(request);
    const channel = this.channelsService.find(user, parsedChannelId);

    if (!channel) {
      throw new NotFoundException("Channel with this ID doesn't exist.");
    }

    const news = await this.newsService.list(channel.keywords);

    return { payload: { channel, news } };
  }

  @Get('channels/:channelId/voice')
  @Role('user')
  @ApiOkResponse({ description: 'Download stream started.' })
  public async fetchChannelVoice(
    @Req() request: Request,
    @Param('channelId') channelId: string,
  ): Promise<StreamableFile> {
    const parsedChannelId = Number.parseInt(channelId);
    const user = await this.authService.getAuthenticatedUserId(request);
    const channel = this.channelsService.find(user, parsedChannelId);

    if (!channel) {
      throw new NotFoundException("Channel with this ID doesn't exist.");
    }

    const news = await this.newsService.list(channel.keywords);

    const filePath = await this.ttsService.toFile(news[0].body);
    const file = createReadStream(join(process.cwd(), filePath));

    return new StreamableFile(file);
  }
}
