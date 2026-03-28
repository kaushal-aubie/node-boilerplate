import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { createMessageObjectSchema } from 'stoker/openapi/schemas';

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: 'Required',
  NO_UPDATES: 'No updates provided',
} as const;

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: 'invalid_updates',
} as const;

/** Generic `{ message: string }` error body for OpenAPI responses. */
export const messageResponseSchema = createMessageObjectSchema();

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
