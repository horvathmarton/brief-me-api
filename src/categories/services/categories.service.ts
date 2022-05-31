import { Injectable } from '@nestjs/common';
import { getTreeRepository } from 'typeorm';
import { Category } from '../../db/models';

@Injectable()
export class CategoriesService {
  public async list(): Promise<Category[]> {
    return getTreeRepository(Category).findTrees({ depth: 3 });
  }
}
