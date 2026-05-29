import fastify from 'fastify';
import cors from '@fastify/cors';
import {
  TypeBoxTypeProvider,
} from '@fastify/type-provider-typebox';

import { healthRoutes } from './routes/health/index';

export function buildApp() {
  const app = fastify({ logger: true })
    .withTypeProvider<TypeBoxTypeProvider>();

  app.register(cors);
  app.register(healthRoutes);

  return app;
}
