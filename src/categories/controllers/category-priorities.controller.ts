import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CategoryPriority } from 'src/db/models';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../auth/roles';
import { CategoryPriorityPayload } from '../../shared/payloads';
import { ApiResponsePayload } from '../../shared/types';
import { CategoryPrioritiesService } from '../services';

@Controller({ path: 'category-priorities', version: '1' })
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryPrioritiesController {
  constructor(
    private readonly authService: AuthService,
    private readonly categoryPrioritiesService: CategoryPrioritiesService,
  ) {}

  @Post(':categoryName')
  @Role('user')
  @ApiCreatedResponse({ description: 'Priority added successfully.' })
  @ApiBadRequestResponse({ description: 'Malformed payload.' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  @ApiNotFoundResponse({ description: 'Category name not found.' })
  @ApiConflictResponse({
    description: 'Category priority already exists for this user.',
  })
  public async addPriority(
    @Req() request: Request,
    @Param('categoryName') categoryName: string,
    @Body() payload: CategoryPriorityPayload,
  ): Promise<ApiResponsePayload<CategoryPriority>> {
    const { priority } = payload;
    const token = this.authService.parseToken(request);
    const { username } = this.authService.decodeToken(token);

    const categoryPriority = await this.categoryPrioritiesService.addPriority(
      username,
      categoryName,
      priority,
    );

    return { payload: categoryPriority };
  }

  @Delete(':categoryName')
  @Role('user')
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Priority deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Category name not found.' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  public async deletePriority(
    @Req() request: Request,
    @Param('categoryName') categoryName: string,
  ): Promise<void> {
    const token = this.authService.parseToken(request);
    const { username } = this.authService.decodeToken(token);

    await this.categoryPrioritiesService.deletePriority(username, categoryName);
  }

  @Get('export')
  @Role('admin')
  @ApiOkResponse({ description: 'Matrix exported successfully.' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated.' })
  @ApiForbiddenResponse({ description: 'User is not administrator.' })
  public async exportCategoryPrioritiesMatrix(): Promise<StreamableFile> {
    const csv = await this.categoryPrioritiesService.export();

    return new StreamableFile(Buffer.from(csv));
  }
}
