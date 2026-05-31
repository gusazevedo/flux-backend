import { DomainError } from './domain-error';

export class InvalidCursorError extends DomainError {
  readonly statusCode = 400;
  readonly code = 'INVALID_CURSOR';

  constructor() {
    super('Malformed pagination cursor');
  }
}
