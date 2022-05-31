import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import { Role } from '../../auth/roles';
import { CategoryPriorityPayload } from '../../shared/payloads';
import { ApiResponse } from '../../shared/types';
import { CategoryPrioritiesService } from '../services';

@Controller('category-priorities')
export class CategoryPrioritiesController {
  constructor(
    private readonly authService: AuthService,
    private readonly categoryPrioritiesService: CategoryPrioritiesService,
  ) {}

  @Post(':categoryName')
  @Role('user')
  public async addPriority(
    @Req() request: Request,
    @Param('categoryName') categoryName: string,
    @Body() payload: CategoryPriorityPayload,
  ): Promise<ApiResponse<unknown>> {
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
  public async deletePriority(
    @Req() request: Request,
    @Param('categoryName') categoryName: string,
  ): Promise<void> {
    const token = this.authService.parseToken(request);
    const { username } = this.authService.decodeToken(token);

    await this.categoryPrioritiesService.deletePriority(username, categoryName);
  }

  @Get('export')
  @Role('user')
  public async exportCategoryPrioritiesMatrix(): Promise<void> {
    const csv = await this.categoryPrioritiesService.export();

    return csv;
  }
}
