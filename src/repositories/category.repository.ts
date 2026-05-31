import { and, eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { categories } from '../db/schema';
import type * as schema from '../db/schema';
import type { ICategoryRepository } from '../interfaces/i-category-repository';

type Database = PostgresJsDatabase<typeof schema>;

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly db: Database) {}

  async existsForUser(categoryId: string, userId: string): Promise<boolean> {
    const rows = await this.db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(eq(categories.id, categoryId), eq(categories.userId, userId)),
      )
      .limit(1);

    return rows.length > 0;
  }
}
