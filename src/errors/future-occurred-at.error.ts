import { DomainError } from './domain-error';

export class FutureOccurredAtError extends DomainError {
  readonly statusCode = 400;
  readonly code = 'OCCURRED_AT_IN_FUTURE';

  constructor() {
    super('occurredAt cannot be in the future');
  }
}
