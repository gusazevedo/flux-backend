import { DomainError } from './domain-error';

export class CategoryNotFoundError extends DomainError {
  readonly statusCode = 404;
  readonly code = 'CATEGORY_NOT_FOUND';

  constructor() {
    super('Category not found');
  }
}
