import type { Static } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';

import { db } from '../../db/client';
import { CategoryRepository } from '../../repositories/category.repository';
import {
  TransactionRepository,
} from '../../repositories/transaction.repository';
import { TransactionService } from '../../services/transaction.service';
import {
  createTransactionBody,
  createTransactionResponse,
  listTransactionsQuerystring,
  listTransactionsResponse,
} from './schema';

type CreateTransactionBody = Static<typeof createTransactionBody>;
type ListQuerystring = Static<typeof listTransactionsQuerystring>;

const DEFAULT_LIMIT = 20;

export async function transactionRoutes(fastify: FastifyInstance) {
  const service = new TransactionService(
    new TransactionRepository(db),
    new CategoryRepository(db),
  );

  fastify.post<{ Body: CreateTransactionBody }>(
    '/transactions',
    {
      preHandler: (request, reply) => fastify.authenticate(request, reply),
      schema: {
        body: createTransactionBody,
        response: { 201: createTransactionResponse },
      },
    },
    async (request, reply) => {
      const transaction = await service.createTransaction({
        userId: request.user.id,
        ...request.body,
      });

      return reply.status(201).send(transaction);
    },
  );

  fastify.get<{ Querystring: ListQuerystring }>(
    '/transactions',
    {
      preHandler: (request, reply) => fastify.authenticate(request, reply),
      schema: {
        querystring: listTransactionsQuerystring,
        response: { 200: listTransactionsResponse },
      },
    },
    async (request, reply) => {
      const result = await service.listTransactions({
        userId: request.user.id,
        limit: request.query.limit ?? DEFAULT_LIMIT,
        cursor: request.query.cursor,
        type: request.query.type,
        categoryId: request.query.categoryId,
        from: request.query.from,
        to: request.query.to,
      });

      return reply.send(result);
    },
  );
}
