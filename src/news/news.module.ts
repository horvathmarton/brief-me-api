import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth';
import { NewsController } from './news.controller';
import { ChannelsService, NewsService, TtsService } from './services';

@Module({
  imports: [HttpModule, AuthModule, ConfigModule],
  controllers: [NewsController],
  providers: [NewsService, TtsService, ChannelsService],
  exports: [ChannelsService],
})
export class NewsModule {}
