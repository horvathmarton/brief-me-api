import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import {
  CategoriesController,
  CategoryPrioritiesController,
} from './controllers';
import { CategoriesService, CategoryPrioritiesService } from './services';

@Module({
  imports: [AuthModule],
  controllers: [CategoryPrioritiesController, CategoriesController],
  providers: [CategoryPrioritiesService, CategoriesService],
})
export class CategoriesModule {}
