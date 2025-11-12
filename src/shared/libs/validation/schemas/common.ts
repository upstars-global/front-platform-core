/* eslint-disable no-useless-escape */
import * as z from "zod";
import { BASE_CLIENT_ERROR_KEY, PASSWORD_REQUIRED_LENGTH } from '../config/keys';

export const createFormSchema = <T extends z.ZodRawShape>(schema: T) => {
  return z.object({
    ...schema,
    global: z.string().optional(),
  });
};

const MIN_LENGTH = 1;

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const createEmailSchema = ({
  requiredMessage,
  invalidMessage,
}: {
  requiredMessage?: string;
  invalidMessage?: string;
} = {}) => {
  const requiredMsg = requiredMessage || BASE_CLIENT_ERROR_KEY.REQUIRED;
  const invalidMsg = invalidMessage || BASE_CLIENT_ERROR_KEY.EMAIL_INVALID;

  return z.string({ error: requiredMsg }).min(MIN_LENGTH, { error: requiredMsg }).regex(EMAIL_REGEX, {
    error: invalidMsg,
  });
};

const PASSWORD_REGEX = /^[0-9a-zA-Z|@#$\^&="!№\';%:?()_+\-\/\,\.]*$/;

export const createPasswordSchema = (
  {
    emptyMessage,
    lengthMessage,
    charsMessage,
    passwordMinLength,
  }: {
    emptyMessage?: string;
    lengthMessage?: string;
    charsMessage?: string;
    passwordMinLength: number;
  } = { passwordMinLength: PASSWORD_REQUIRED_LENGTH },
) => {
  const emptyMsg = emptyMessage || BASE_CLIENT_ERROR_KEY.PASSWORD_EMPTY;
  const lengthMsg = lengthMessage || BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH;
  const charsMsg = charsMessage || BASE_CLIENT_ERROR_KEY.PASSWORD_WRONG_CHARS;

  return z.string({ error: emptyMsg })
    .min(MIN_LENGTH, { error: emptyMsg })
    .min(passwordMinLength, {
      error: lengthMsg,
    })
    .regex(PASSWORD_REGEX, {
      error: charsMsg,
    });
};

export const createCountrySchema = (message?: string) => {
  const msg = message || BASE_CLIENT_ERROR_KEY.COUNTRY_EMPTY;

  return z.string({ error: msg }).min(1, { error: msg });
};

export const createCurrencySchema = (message?: string) => {
  const msg = message || BASE_CLIENT_ERROR_KEY.REQUIRED;

  return z.string({ error: msg }).min(1, { error: msg });
};

export const createAcceptTermsSchema = (message?: string) => {
  const msg = message || BASE_CLIENT_ERROR_KEY.REQUIRED;

  return z.boolean({
    error: msg,
  }).refine((value) => value, {
    error: msg,
  });
};
