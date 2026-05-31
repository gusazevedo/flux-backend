import { and, desc, eq, gte, lt, lte, or, type SQL } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { transactions } from '../db/schema';
import type * as schema from '../db/schema';
import type {
  CursorKeyset,
  FindTransactionsParams,
  ITransactionRepository,
} from '../interfaces/i-transaction-repository';
import type {
  CreateTransactionDTO,
  Transaction,
} from '../interfaces/transaction';

type Database = PostgresJsDatabase<typeof schema>;
type TransactionRow = typeof transactions.$inferSelect;

export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly db: Database) {}

  async create(data: CreateTransactionDTO): Promise<Transaction> {
    const [row] = await this.db
      .insert(transactions)
      .values({
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description ?? null,
        occurredAt: data.occurredAt ? new Date(data.occurredAt) : undefined,
      })
      .returning();

    return this.toEntity(row);
  }

  async findManyByUser(
    params: FindTransactionsParams,
  ): Promise<Transaction[]> {
    const conditions: SQL[] = [eq(transactions.userId, params.userId)];

    if (params.type) {
      conditions.push(eq(transactions.type, params.type));
    }
    if (params.categoryId) {
      conditions.push(eq(transactions.categoryId, params.categoryId));
    }
    if (params.from) {
      conditions.push(gte(transactions.occurredAt, new Date(params.from)));
    }
    if (params.to) {
      conditions.push(lte(transactions.occurredAt, new Date(params.to)));
    }
    if (params.cursor) {
      conditions.push(this.keysetPredicate(params.cursor));
    }

    const rows = await this.db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(desc(transactions.occurredAt), desc(transactions.id))
      .limit(params.take);

    return rows.map((row) => this.toEntity(row));
  }

  private keysetPredicate(cursor: CursorKeyset): SQL {
    const occurredAt = new Date(cursor.occurredAt);

    return or(
      lt(transactions.occurredAt, occurredAt),
      and(
        eq(transactions.occurredAt, occurredAt),
        lt(transactions.id, cursor.id),
      ),
    ) as SQL;
  }

  private toEntity(row: TransactionRow): Transaction {
    return {
      id: row.id,
      userId: row.userId,
      type: row.type,
      amount: row.amount,
      categoryId: row.categoryId,
      description: row.description,
      occurredAt: row.occurredAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    };
  }
}
