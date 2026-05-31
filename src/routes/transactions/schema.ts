import { Type } from '@sinclair/typebox';

const transactionTypeSchema = Type.Union([
  Type.Literal('income'),
  Type.Literal('outcome'),
]);

export const createTransactionBody = Type.Object({
  type: transactionTypeSchema,
  amount: Type.Integer({ minimum: 1 }),
  categoryId: Type.String({ format: 'uuid' }),
  description: Type.Optional(Type.String({ maxLength: 255 })),
  occurredAt: Type.Optional(Type.String({ format: 'date-time' })),
});

export const listTransactionsQuerystring = Type.Object({
  limit: Type.Optional(
    Type.Integer({ minimum: 1, maximum: 100, default: 20 }),
  ),
  cursor: Type.Optional(Type.String()),
  type: Type.Optional(transactionTypeSchema),
  categoryId: Type.Optional(Type.String({ format: 'uuid' })),
  from: Type.Optional(Type.String({ format: 'date-time' })),
  to: Type.Optional(Type.String({ format: 'date-time' })),
});

const transactionResponse = Type.Object({
  id: Type.String({ format: 'uuid' }),
  type: transactionTypeSchema,
  amount: Type.Integer(),
  categoryId: Type.String({ format: 'uuid' }),
  description: Type.Union([Type.String(), Type.Null()]),
  occurredAt: Type.String({ format: 'date-time' }),
  createdAt: Type.String({ format: 'date-time' }),
});

export const createTransactionResponse = transactionResponse;

export const listTransactionsResponse = Type.Object({
  data: Type.Array(transactionResponse),
  nextCursor: Type.Union([Type.String(), Type.Null()]),
});
