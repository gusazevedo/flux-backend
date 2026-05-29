import { Type } from '@sinclair/typebox';
import {
  FastifyPluginAsyncTypebox,
} from '@fastify/type-provider-typebox';

const healthResponse = Type.Object({
  status: Type.String(),
});

export const healthRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '/health',
    {
      schema: {
        response: { 200: healthResponse },
      },
    },
    async () => ({ status: 'ok' }),
  );
};
