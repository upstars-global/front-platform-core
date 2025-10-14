import type { $ZodIssue } from "zod/v4/core";

export const UNKNOWN_VALIDATION_ERROR_KEY = 'VALIDATION.COMMON.UNKNOWN_ERROR'

export enum ClientErrorKey {
  // EMAIL
  EmailInvalid = 'VALIDATION.EMAIL.INVALID',

  // SMS
  SmsFatal = 'VALIDATION.SMS.FATAL',
  SmsChars = 'VALIDATION.SMS.CHARS',
  SmsEmpty = 'VALIDATION.SMS.EMPTY',
  SmsInvalid = 'VALIDATION.SMS.INVALID',

  // PASSWORD
  PasswordWrongChars = 'VALIDATION.PASSWORD.WRONG_CHARTS',
  PasswordNotMatch = 'VALIDATION.PASSWORD.NOT_MATCH',
  PasswordLength = 'VALIDATION.PASSWORD.LENGTH',
  PasswordEmpty = 'VALIDATION.PASSWORD.EMPTY',

  // COUNTRY
  CountryEmpty = 'VALIDATION.COUNTRY.EMPTY',

  // ACCEPT TERMS
  RulesNotAccepted = 'VALIDATION.RULES_NOT_ACCEPTED',

  // GENERAL
  Required = 'VALIDATION.COMMON.REQUIRED',
}

export const BACKEND_PREFIX = 'VALIDATION_BACK';

export const PASSWORD_REQUIRED_LENGTH = 6;

export type ValidationErrorKey<T extends string> = T | typeof UNKNOWN_VALIDATION_ERROR_KEY;

export type ValidationError<T extends string, U extends string> = {
  key: ValidationErrorKey<U>;
  field: T;
  zodIssue?: $ZodIssue;
  originalError?: string;
};
