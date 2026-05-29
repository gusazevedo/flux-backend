# 00 — Project Setup

## Overview
Initialize the Flux Backend project: install all dependencies, scaffold the folder structure,
configure TypeScript, ESLint, Husky, Drizzle.

---

## Dependencies

### Production

```bash
npm install fastify @fastify/jwt @fastify/cors @sinclair/typebox @fastify/type-provider-typebox drizzle-orm postgres
```

| Package | Purpose |
|---|---|
| `fastify` | Web framework |
| `@fastify/jwt` | Verifies Supabase-issued JWTs locally using the Supabase JWT secret |
| `@fastify/cors` | CORS headers so the frontend can consume the API |
| `@sinclair/typebox` | Defines request/response schemas as TypeScript objects that compile to valid JSON Schema |
| `@fastify/type-provider-typebox` | Wires TypeBox into Fastify so schemas produce TypeScript types automatically |
| `drizzle-orm` | Type-safe ORM |
| `postgres` | PostgreSQL driver used by Drizzle to connect to Supabase |

### Dev

```bash
npm install -D typescript tsx @types/node drizzle-kit eslint typescript-eslint @eslint/js eslint-plugin-import husky lint-staged @commitlint/cli @commitlint/config-conventional
```

| Package | Purpose |
|---|---|
| `typescript` | TypeScript compiler |
| `tsx` | Runs `.ts` files directly without compiling step (replaces `ts-node`) |
| `@types/node` | Node.js type definitions |
| `drizzle-kit` | CLI for generating and running database migrations |
| `eslint` | Linter |
| `typescript-eslint` | TypeScript-aware ESLint rules and parser (replaces separate `@typescript-eslint/*` packages) |
| `@eslint/js` | ESLint recommended base rules |
| `eslint-plugin-import` | Enforces clean import ordering and prevents missing modules |
| `husky` | Git hooks manager |
| `lint-staged` | Runs linters only on staged files (used in pre-commit hook) |
| `@commitlint/cli` | Validates commit messages against a convention (used in commit-msg hook) |
| `@commitlint/config-conventional` | Conventional Commits ruleset for commitlint |
---

## Scripts
- Lint checker
- Typescript checker
- Development server

## Linting
Mandatory coding rules. Do not write the lint file with .cjs
- Should use space between curly braces: `{ foo }`
- Empty line on the file end
- Use primarily singles quotes: `import library from 'foo´`, `import service from '.foo.service.ts'`;
- Mandatory semicolon
- No console logs
- Files under src should use dash case: `user-database.ts`
- Prefer nullish coalescing
- Prefer optional chain
- Import list should be order by extern libraries first followed by a blank line then the local files
- Trim lines
- Avoid loo long lines. Max of 80

## Commits
Before commit husky script should trigger looking for lint errors/warnign and typescript issues.

## Composing
Create a basic get health route that should return in good conditions