# 01 — Auth

## Overview
Wire up Supabase JWT verification as a Fastify plugin and expose a single
protected route that returns the authenticated user's identity.

No custom users table is needed — Supabase owns the auth layer.

---

## Environment variables

| Variable | Description |
|---|---|
| `SUPABASE_JWT_SECRET` | Secret used to verify JWT signatures (found in Supabase dashboard → Project Settings → API) |

---

## Plugin — `src/plugins/auth.ts`

Register `@fastify/jwt` with the `SUPABASE_JWT_SECRET`.

Add a `authenticate` decorator to the Fastify instance that verifies the
Bearer token and populates `request.user`. Route handlers call this decorator
as a `preHandler` hook to protect themselves.

```typescript
fastify.decorate('authenticate', async (request, reply) => {
  await request.jwtVerify()
})
```

### Request type augmentation

Extend `FastifyRequest` so `request.user` is typed across the codebase:

```typescript
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      email: string
    }
  }
}
```

The JWT payload from Supabase includes `sub` (the user UUID) and `email`.
Map `sub` → `id` when attaching the user to the request.

---

## Routes — `src/routes/auth/`

### `GET /auth/me`
Protected. Returns the user extracted from the JWT — no database call.

**Response `200`**
```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

**Response `401`** — missing or invalid token.

---

## Error handling

- Missing `Authorization` header → `401 Unauthorized`
- Expired or tampered token → `401 Unauthorized`
- Never expose raw JWT errors to the client — map them to a generic `{ message: 'Unauthorized' }` body
