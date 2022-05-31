import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService, TtsService } from './services';

@Module({
  controllers: [NewsController],
  providers: [NewsService, TtsService],
})
export class NewsModule {}
