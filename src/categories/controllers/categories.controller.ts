import { Controller, Get } from '@nestjs/common';
import { Category } from 'src/db/models';
import { ApiResponse } from 'src/shared/types';
import { Role } from '../../auth/roles';
import { CategoriesService } from '../services';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Role('user')
  public async listCategories(): Promise<ApiResponse<Category[]>> {
    const categories = await this.categoriesService.list();

    return { payload: categories };
  }
}
