import type {
  CreateTransactionDTO,
  Transaction,
  TransactionType,
} from './transaction';

export interface CursorKeyset {
  occurredAt: string;
  id: string;
}

export interface FindTransactionsParams {
  userId: string;
  take: number;
  type?: TransactionType;
  categoryId?: string;
  from?: string;
  to?: string;
  cursor?: CursorKeyset;
}

export interface ITransactionRepository {
  create(data: CreateTransactionDTO): Promise<Transaction>;
  findManyByUser(params: FindTransactionsParams): Promise<Transaction[]>;
}
