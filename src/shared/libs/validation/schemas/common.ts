/* eslint-disable no-useless-escape */
import { boolean, string } from 'zod';
import { ClientErrorKey, PASSWORD_REQUIRED_LENGTH } from '../config/keys';

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
  const requiredMsg = requiredMessage || ClientErrorKey.Required;
  const invalidMsg = invalidMessage || ClientErrorKey.EmailInvalid;

  return string({ error: requiredMsg }).min(MIN_LENGTH, { error: requiredMsg }).regex(EMAIL_REGEX, {
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
  const emptyMsg = emptyMessage || ClientErrorKey.PasswordEmpty;
  const lengthMsg = lengthMessage || ClientErrorKey.PasswordLength;
  const charsMsg = charsMessage || ClientErrorKey.PasswordWrongChars;

  return string({ error: emptyMsg })
    .min(MIN_LENGTH, { error: emptyMsg })
    .min(passwordMinLength, {
      error: lengthMsg,
    })
    .regex(PASSWORD_REGEX, {
      error: charsMsg,
    });
};

export const createCountrySchema = (message?: string) => {
  const msg = message || ClientErrorKey.CountryEmpty;

  return string({ error: msg }).min(1, { error: msg });
};

export const createCurrencySchema = (message?: string) => {
  const msg = message || ClientErrorKey.Required;

  return string({ error: msg }).min(1, { error: msg });
};

export const createAcceptTermsSchema = (message?: string) => {
  const msg = message || ClientErrorKey.Required;

  return boolean({
    error: msg,
  }).refine((value) => value, {
    error: msg,
  });
};
