import zod from "zod";

export const UNKNOWN_VALIDATION_ERROR_KEY = 'COMMON.UNKNOWN_ERROR'

export const BASE_CLIENT_ERROR_KEY = {
  // EMAIL
  EMAIL_INVALID: 'EMAIL.INVALID',

  // PASSWORD
  PASSWORD_WRONG_CHARS: 'PASSWORD.WRONG_CHARTS',
  PASSWORD_NOT_MATCH: 'PASSWORD.NOT_MATCH',
  PASSWORD_LENGTH: 'PASSWORD.LENGTH',
  PASSWORD_EMPTY: 'PASSWORD.EMPTY',

  // COUNTRY
  COUNTRY_EMPTY: 'COUNTRY.EMPTY',

  // GENERAL
  REQUIRED: 'COMMON.REQUIRED',

  UNKNOWN_ERROR: 'COMMON.UNKNOWN_ERROR'
} as const

export type BaseClientErrorKey = typeof BASE_CLIENT_ERROR_KEY[keyof typeof BASE_CLIENT_ERROR_KEY];

export const PASSWORD_REQUIRED_LENGTH = 6;

export type ValidationErrorKey<T extends string> = T | typeof UNKNOWN_VALIDATION_ERROR_KEY;

type ZodIssue = zod.core.$ZodIssue

export type ValidationError<FieldKey extends string, ErrorKey extends string> = {
  key: ValidationErrorKey<ErrorKey>;
  field: FieldKey;
  zodIssue?: ZodIssue;
  originalError?: unknown;
};
