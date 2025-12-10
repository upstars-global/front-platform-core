/* eslint-disable no-useless-escape */
import * as z from 'zod';
import { BASE_CLIENT_ERROR_KEY, PASSWORD_REQUIRED_LENGTH } from '../config/keys';

export const createFormSchema = <T extends z.ZodRawShape>(schema: T) => {
  return z.object({
    ...schema,
    global: z.string().optional(),
  });
};

const MIN_LENGTH = 1;

const EMAIL_REGEX =
  /^[\w.!#$%&'*+\/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;

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

  return z
    .string({ error: emptyMsg })
    .regex(PASSWORD_REGEX, {
      error: charsMsg,
    })
    .min(passwordMinLength, {
      error: lengthMsg,
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

  return z
    .boolean({
      error: msg,
    })
    .refine((value) => value, {
      error: msg,
    });
};

export const createPasswordMatchSchema = <
  T extends z.ZodObject<{ password: z.ZodTypeAny; confirmPassword: z.ZodTypeAny }>,
>(
  schema: T,
  message?: string,
) => {
  const msg = message || BASE_CLIENT_ERROR_KEY.PASSWORD_NOT_MATCH;

  return schema.refine((data) => {
    return data.password === data.confirmPassword
  }, {
    message: msg,
    path: ['confirmPassword'],
  });
};
