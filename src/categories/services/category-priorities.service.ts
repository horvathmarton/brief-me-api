import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Parser } from 'json2csv';
import { DataSource } from 'typeorm';
import { Category, CategoryPriority, User } from '../../db/models';

@Injectable()
export class CategoryPrioritiesService {
  constructor(private readonly dataSource: DataSource) {}

  public async addPriority(
    userId: number,
    categoryName: string,
    priority: number,
  ): Promise<CategoryPriority> {
    const category = await this.dataSource.getRepository(Category).findOne({
      where: { name: categoryName },
    });

    if (!category) {
      throw new NotFoundException("Category with this name doesn't exist.");
    }

    const categoryPriority = await this.dataSource
      .getRepository(CategoryPriority)
      .findOne({
        where: {
          userId,
          categoryId: category.id,
        },
      });

    if (categoryPriority) {
      throw new ConflictException('Priority already exists.');
    }

    const createdCategoryPriority = await this.dataSource
      .getRepository(CategoryPriority)
      .save({
        userId,
        categoryId: category.id,
        priority,
      });

    return this.dataSource
      .getRepository(CategoryPriority)
      .create(createdCategoryPriority);
  }

  public async deletePriority(
    userId: number,
    categoryName: string,
  ): Promise<void> {
    const { id: categoryId } = await this.dataSource
      .getRepository(Category)
      .findOne({
        where: { name: categoryName },
      });

    const categoryPriority = await this.dataSource
      .getRepository(CategoryPriority)
      .findOne({
        where: { userId, categoryId },
      });

    if (!categoryPriority)
      throw new NotFoundException(
        "Priority for this category name doesn't exist.",
      );

    await this.dataSource
      .getRepository(CategoryPriority)
      .remove(categoryPriority);
  }

  public async export(): Promise<string> {
    const priorities = await this.dataSource
      .getRepository(CategoryPriority)
      .find();

    const users = await this.dataSource.getRepository(User).find();
    const userMapping = users.reduce((mapping, user) => {
      mapping[user.id] = user.username;
      return mapping;
    }, {});
    const categories = await this.dataSource.getRepository(Category).find();
    const categoryMapping = categories.reduce((mapping, category) => {
      mapping[category.id] = category.name;
      return mapping;
    }, {});
    const categoryNames = categories.map((category) => category.name);

    const grouped = Object.entries(
      priorities.reduce<Record<string, Record<string, number>>>(
        (matrix, { userId, categoryId, priority }) => {
          const username = userMapping[userId];
          const categoryName = categoryMapping[categoryId];

          matrix[username] = matrix[username] ?? {};
          matrix[username][categoryName] = priority;

          return matrix;
        },
        {},
      ),
    ).reduce(
      (matrix, [username, priorities]) =>
        matrix.concat({ ...priorities, username }),
      [],
    );

    return new Parser({ fields: ['username', ...categoryNames] }).parse(
      grouped,
    );
  }
}
