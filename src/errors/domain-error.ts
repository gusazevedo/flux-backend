export abstract class DomainError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
}
