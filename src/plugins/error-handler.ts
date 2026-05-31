import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fp from 'fastify-plugin';

import { DomainError } from '../errors/domain-error';

async function errorHandlerPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof DomainError) {
        return reply
          .status(error.statusCode)
          .send({ message: error.message });
      }

      if (error.validation) {
        return reply.status(400).send({ message: 'Validation failed' });
      }

      request.log.error(error);

      return reply
        .status(500)
        .send({ message: 'Internal Server Error' });
    },
  );
}

export default fp(errorHandlerPlugin);
