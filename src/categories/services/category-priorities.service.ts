import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category, CategoryPriority, User } from '../../db/models';
import { getRepository } from 'typeorm';
import { Parser } from 'json2csv';

@Injectable()
export class CategoryPrioritiesService {
  public async addPriority(
    username: string,
    categoryName: string,
    priority: number,
  ): Promise<CategoryPriority> {
    // TODO: Maybe outsource some functionality to the controller.
    const { id: userId } = await getRepository(User).findOne({ username });
    const category = await getRepository(Category).findOne({
      name: categoryName,
    });

    if (!category) {
      throw new NotFoundException("Category with this name doesn't exist.");
    }

    const categoryPriority = await getRepository(CategoryPriority).findOne({
      userId,
      categoryId: category.id,
    });

    if (categoryPriority) {
      throw new ConflictException('Priority already exists.');
    }

    const createdCategoryPriority = await getRepository(CategoryPriority).save({
      userId,
      categoryId: category.id,
      priority,
    });

    return getRepository(CategoryPriority).create(createdCategoryPriority);
  }

  public async deletePriority(
    username: string,
    categoryName: string,
  ): Promise<void> {
    const { id: userId } = await getRepository(User).findOne({ username });
    const { id: categoryId } = await getRepository(Category).findOne({
      name: categoryName,
    });

    const categoryPriority = await getRepository(CategoryPriority).findOne({
      userId,
      categoryId,
    });

    if (!categoryPriority) {
      throw new NotFoundException(
        "Priority for this category name doesn't exist.",
      );
    }

    await getRepository(CategoryPriority).remove(categoryPriority);
  }

  public async export(): Promise<string> {
    const priorities = await getRepository(CategoryPriority).find();

    const users = await getRepository(User).find();
    const userMapping = users.reduce((mapping, user) => {
      mapping[user.id] = user.username;
      return mapping;
    }, {});
    const categories = await getRepository(Category).find();
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
