import { CategoryNotFoundError } from '../errors/category-not-found.error';
import { FutureOccurredAtError } from '../errors/future-occurred-at.error';
import type { ICategoryRepository } from '../interfaces/i-category-repository';
import type {
  FindTransactionsParams,
  ITransactionRepository,
} from '../interfaces/i-transaction-repository';
import type {
  CreateTransactionDTO,
  ListTransactionsQuery,
  Transaction,
} from '../interfaces/transaction';
import { decodeCursor, encodeCursor } from '../utils/cursor';

export interface ListTransactionsResult {
  data: Transaction[];
  nextCursor: string | null;
}

export class TransactionService {
  constructor(
    private readonly transactions: ITransactionRepository,
    private readonly categories: ICategoryRepository,
  ) {}

  async createTransaction(input: CreateTransactionDTO): Promise<Transaction> {
    const ownsCategory = await this.categories.existsForUser(
      input.categoryId,
      input.userId,
    );

    if (!ownsCategory) {
      throw new CategoryNotFoundError();
    }

    return this.transactions.create({
      ...input,
      occurredAt: this.resolveOccurredAt(input.occurredAt),
      description: this.normalizeDescription(input.description),
    });
  }

  async listTransactions(
    query: ListTransactionsQuery,
  ): Promise<ListTransactionsResult> {
    const params: FindTransactionsParams = {
      userId: query.userId,
      take: query.limit + 1,
      type: query.type,
      categoryId: query.categoryId,
      from: query.from,
      to: query.to,
      cursor: query.cursor ? decodeCursor(query.cursor) : undefined,
    };

    const rows = await this.transactions.findManyByUser(params);
    const hasNextPage = rows.length > query.limit;
    const data = hasNextPage ? rows.slice(0, query.limit) : rows;
    const last = data.at(-1);
    const nextCursor =
      hasNextPage && last
        ? encodeCursor({ occurredAt: last.occurredAt, id: last.id })
        : null;

    return { data, nextCursor };
  }

  private resolveOccurredAt(occurredAt?: string): string {
    if (!occurredAt) {
      return new Date().toISOString();
    }

    if (Date.parse(occurredAt) > Date.now()) {
      throw new FutureOccurredAtError();
    }

    return occurredAt;
  }

  private normalizeDescription(description?: string): string | undefined {
    if (description === undefined) {
      return undefined;
    }

    return description.trim().length === 0 ? undefined : description;
  }
}
