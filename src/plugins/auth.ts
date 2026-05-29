import jwt from '@fastify/jwt';
import type {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: { id: string; email: string };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<void>;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  fastify.register(jwt, {
    secret: process.env.SUPABASE_JWT_SECRET!,
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = await request.jwtVerify<{
          sub: string;
          email: string;
        }>();
        request.user = {
          id: payload.sub,
          email: payload.email,
        };
      } catch {
        reply.status(401).send({ message: 'Unauthorized' });
      }
    },
  );
}

export default fp(authPlugin);
