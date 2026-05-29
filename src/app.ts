import fastify from 'fastify';
import cors from '@fastify/cors';
import {
  TypeBoxTypeProvider,
} from '@fastify/type-provider-typebox';

import authPlugin from './plugins/auth';
import { authRoutes } from './routes/auth/index';
import { healthRoutes } from './routes/health/index';

export function buildApp() {
  const app = fastify({ logger: true })
    .withTypeProvider<TypeBoxTypeProvider>();

  app.register(cors);
  app.register(authPlugin);
  app.register(healthRoutes);
  app.register(authRoutes);

  return app;
}
