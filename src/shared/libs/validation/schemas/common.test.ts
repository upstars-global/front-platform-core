import { describe, it, expect } from 'vitest';
import {
  createEmailSchema,
  createPasswordSchema,
  createSmsSchema,
  createCountrySchema,
  createCurrencySchema,
} from './common';
import { ClientErrorKey } from '../config/keys';
import { validateData } from '../helpers';

describe('Email Schema', () => {
  const emailSchema = createEmailSchema();

  it('should validate correct email', () => {
    const { errors } = validateData(emailSchema, 'test@example.com');
    expect(errors).toBeNull();
  });

  it('should validate email with subdomain', () => {
    const { errors } = validateData(emailSchema, 'user@mail.company.com');
    expect(errors).toBeNull();
  });

  it('should reject invalid email format', () => {
    const { errors } = validateData(emailSchema, 'invalid-email');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.EmailInvalid);
    expect(errors![0].field).toBe('');
  });

  it('should reject email without @', () => {
    const { errors } = validateData(emailSchema, 'testexample.com');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.EmailInvalid);
  });

  it('should reject empty string', () => {
    const { errors } = validateData(emailSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(ClientErrorKey.Required);
    expect(errors![0].field).toBe('');
  });

  it('should use custom error messages', () => {
    const customSchema = createEmailSchema({
      requiredMessage: 'Custom required',
      invalidMessage: 'Custom invalid',
    });
    const { errors } = validateData(customSchema, 'invalid');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Custom invalid');
  });
});

describe('Password Schema', () => {
  const passwordSchema = createPasswordSchema();

  it('should validate correct password', () => {
    const { errors } = validateData(passwordSchema, 'Test123');
    expect(errors).toBeNull();
  });

  it('should validate password with special characters', () => {
    const { errors } = validateData(passwordSchema, 'Pass@123#');
    expect(errors).toBeNull();
  });

  it('should reject password shorter than 6 characters', () => {
    const { errors } = validateData(passwordSchema, 'Test1');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.PasswordLength);
    expect(errors![0].field).toBe('');
  });

  it('should reject empty password', () => {
    const { errors } = validateData(passwordSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(ClientErrorKey.PasswordEmpty);
    expect(errors![0].field).toBe('');
  });

  it('should reject password with invalid characters', () => {
    const { errors } = validateData(passwordSchema, 'Test123<>');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.PasswordWrongChars);
    expect(errors![0].field).toBe('');
  });

  it('should accept password with allowed special chars', () => {
    const { errors } = validateData(passwordSchema, 'Test@#$^&="!№\';%:?()_+-/,.');
    expect(errors).toBeNull();
  });

  it('should use custom error messages', () => {
    const customSchema = createPasswordSchema({
      emptyMessage: 'Empty',
      lengthMessage: 'Too short',
      charsMessage: 'Bad chars',
    });
    const { errors } = validateData(customSchema, '12345');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Too short');
  });
});

describe('SMS Schema', () => {
  const smsSchema = createSmsSchema();

  it('should validate correct SMS code', () => {
    const { errors } = validateData(smsSchema, '123456');
    expect(errors).toBeNull();
  });

  it('should reject empty SMS', () => {
    const { errors } = validateData(smsSchema, '');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.SmsEmpty);
    expect(errors![0].field).toBe('');
  });

  it('should reject SMS with letters', () => {
    const { errors } = validateData(smsSchema, '12a456');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.SmsChars);
    expect(errors![0].field).toBe('');
  });

  it('should reject SMS with special characters', () => {
    const { errors } = validateData(smsSchema, '123-456');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(ClientErrorKey.SmsChars);
  });

  it('should use custom error messages', () => {
    const customSchema = createSmsSchema({
      emptyMessage: 'Custom empty',
      charsMessage: 'Custom chars',
    });
    const { errors } = validateData(customSchema, 'abc');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Custom chars');
  });
});

describe('Country Schema', () => {
  const countrySchema = createCountrySchema();

  it('should validate country code', () => {
    const { errors } = validateData(countrySchema, 'US');
    expect(errors).toBeNull();
  });

  it('should reject empty country', () => {
    const { errors } = validateData(countrySchema, '');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.CountryEmpty);
    expect(errors![0].field).toBe('');
  });

  it('should use custom error message', () => {
    const customSchema = createCountrySchema('Custom message');
    const { errors } = validateData(customSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Custom message');
  });
});

describe('Currency Schema', () => {
  const currencySchema = createCurrencySchema();

  it('should validate currency code', () => {
    const { errors } = validateData(currencySchema, 'USD');
    expect(errors).toBeNull();
  });

  it('should reject empty currency', () => {
    const { errors } = validateData(currencySchema, '');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.Required);
    expect(errors![0].field).toBe('');
  });

  it('should use custom error message', () => {
    const customSchema = createCurrencySchema('Custom message');
    const { errors } = validateData(customSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Custom message');
  });
});
