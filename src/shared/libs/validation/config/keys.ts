import zod from "zod";

export const UNKNOWN_VALIDATION_ERROR_KEY = 'VALIDATION.COMMON.UNKNOWN_ERROR'

export enum ClientErrorKey {
  // EMAIL
  EmailInvalid = 'VALIDATION.EMAIL.INVALID',

  // PASSWORD
  PasswordWrongChars = 'VALIDATION.PASSWORD.WRONG_CHARTS',
  PasswordNotMatch = 'VALIDATION.PASSWORD.NOT_MATCH',
  PasswordLength = 'VALIDATION.PASSWORD.LENGTH',
  PasswordEmpty = 'VALIDATION.PASSWORD.EMPTY',

  // COUNTRY
  CountryEmpty = 'VALIDATION.COUNTRY.EMPTY',

  // GENERAL
  Required = 'VALIDATION.COMMON.REQUIRED',
}

export const BACKEND_PREFIX = 'VALIDATION_BACK';

export const PASSWORD_REQUIRED_LENGTH = 6;

export type ValidationErrorKey<T extends string> = T | typeof UNKNOWN_VALIDATION_ERROR_KEY;

type Issue = zod.core.$ZodIssue

export type ValidationError<T extends string, U extends string> = {
  key: ValidationErrorKey<U>;
  field: T;
  zodIssue?: Issue;
  originalError?: string;
};
