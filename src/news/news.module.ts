import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService, TtsService } from './services';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [NewsController],
  providers: [NewsService, TtsService],
})
export class NewsModule {}
