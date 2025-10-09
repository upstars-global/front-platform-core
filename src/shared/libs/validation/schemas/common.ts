/* eslint-disable no-useless-escape */
import { string } from 'zod';
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

  return string({ required_error: requiredMsg }).min(MIN_LENGTH, { message: requiredMsg }).regex(EMAIL_REGEX, {
    message: invalidMsg,
  });
};

const PASSWORD_REGEX = /^[0-9a-zA-Z|@#$\^&="!№\';%:?()_+\-\/\,\.]*$/;

export const createPasswordSchema = ({
  emptyMessage,
  lengthMessage,
  charsMessage,
}: {
  emptyMessage?: string;
  lengthMessage?: string;
  charsMessage?: string;
} = {}) => {
  const emptyMsg = emptyMessage || ClientErrorKey.PasswordEmpty;
  const lengthMsg = lengthMessage || ClientErrorKey.PasswordLength;
  const charsMsg = charsMessage || ClientErrorKey.PasswordWrongChars;

  return string({ required_error: emptyMsg })
    .min(MIN_LENGTH, { message: emptyMsg })
    .min(PASSWORD_REQUIRED_LENGTH, {
      message: lengthMsg,
    })
    .regex(PASSWORD_REGEX, {
      message: charsMsg,
    });
};

const SMS_CHARS_REGEX = /^[0-9]*$/;

export const createSmsSchema = ({
  emptyMessage,
  charsMessage,
}: {
  emptyMessage?: string;
  charsMessage?: string;
} = {}) => {
  const emptyMsg = emptyMessage || ClientErrorKey.SmsEmpty;
  const charsMsg = charsMessage || ClientErrorKey.SmsChars;

  return string({ required_error: emptyMsg }).min(1, { message: emptyMsg }).regex(SMS_CHARS_REGEX, {
    message: charsMsg,
  });
};

export const createCountrySchema = (message?: string) => {
  const msg = message || ClientErrorKey.CountryEmpty;

  return string({ required_error: msg }).min(1, { message: msg });
};

export const createCurrencySchema = (message?: string) => {
  const msg = message || ClientErrorKey.Required;

  return string({ required_error: msg }).min(1, { message: msg });
};
