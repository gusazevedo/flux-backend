import { Type } from '@sinclair/typebox';
import {
  FastifyPluginAsyncTypebox,
} from '@fastify/type-provider-typebox';

const meResponse = Type.Object({
  id: Type.String(),
  email: Type.String(),
});

export const authRoutes: FastifyPluginAsyncTypebox = async (
  fastify,
) => {
  fastify.get(
    '/auth/me',
    {
      onRequest: [
        (req, reply) => fastify.authenticate(req, reply),
      ],
      schema: {
        response: { 200: meResponse },
      },
    },
    async (request) => ({
      id: request.user.id,
      email: request.user.email,
    }),
  );
};
