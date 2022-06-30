import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Category } from 'src/db/models';
import { ApiResponsePayload } from 'src/shared/types';
import { Role } from '../../auth/roles';
import { CategoriesService } from '../services';

@Controller({ path: 'categories', version: '1' })
@ApiTags('categories')
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Role('user')
  @ApiOkResponse({ description: 'Fetched category list successfully.' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  public async listCategories(): Promise<ApiResponsePayload<Category[]>> {
    const categories = await this.categoriesService.list();

    return { payload: categories };
  }
}
