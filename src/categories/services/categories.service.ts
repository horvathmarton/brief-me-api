import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from '../../db/models';

@Injectable()
export class CategoriesService {
  constructor(private readonly dataSource: DataSource) { }

  public async list(): Promise<Category[]> {
    return this.dataSource.getTreeRepository(Category).findTrees({ depth: 3 });
  }
}
