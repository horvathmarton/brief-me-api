import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { NewsModule } from '../news';
import {
  CategoriesController,
  CategoryPrioritiesController,
} from './controllers';
import { CategoriesService, CategoryPrioritiesService } from './services';

@Module({
  imports: [AuthModule, NewsModule],
  controllers: [CategoryPrioritiesController, CategoriesController],
  providers: [CategoryPrioritiesService, CategoriesService],
})
export class CategoriesModule {}
