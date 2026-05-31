export type TransactionType = 'income' | 'outcome';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface CreateTransactionDTO {
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description?: string;
  occurredAt?: string;
}

export interface ListTransactionsQuery {
  userId: string;
  limit: number;
  cursor?: string;
  type?: TransactionType;
  categoryId?: string;
  from?: string;
  to?: string;
}
