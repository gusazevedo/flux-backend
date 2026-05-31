import { InvalidCursorError } from '../errors/invalid-cursor.error';
import type { CursorKeyset } from '../interfaces/i-transaction-repository';

const SEPARATOR = '|';

export function encodeCursor(keyset: CursorKeyset): string {
  const raw = `${keyset.occurredAt}${SEPARATOR}${keyset.id}`;
  return Buffer.from(raw, 'utf8').toString('base64');
}

export function decodeCursor(cursor: string): CursorKeyset {
  const raw = Buffer.from(cursor, 'base64').toString('utf8');
  const separatorIndex = raw.indexOf(SEPARATOR);

  if (separatorIndex === -1) {
    throw new InvalidCursorError();
  }

  const occurredAt = raw.slice(0, separatorIndex);
  const id = raw.slice(separatorIndex + 1);

  if (!occurredAt || !id || Number.isNaN(Date.parse(occurredAt))) {
    throw new InvalidCursorError();
  }

  return { occurredAt, id };
}
