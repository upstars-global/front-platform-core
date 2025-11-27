import { describe, it, expect } from 'vitest';
import {
  createEmailSchema,
  createPasswordSchema,
  createCountrySchema,
  createCurrencySchema,
} from './common';
import { BASE_CLIENT_ERROR_KEY, PASSWORD_REQUIRED_LENGTH } from '../config/keys';
import { validateData } from '../helpers/validateData';

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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
    expect(errors![0].field).toBe('');
  });

  it('should reject email without @', () => {
    const { errors } = validateData(emailSchema, 'testexample.com');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
  });

  it('should reject empty string', () => {
    const { errors } = validateData(emailSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED);
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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH);
    expect(errors![0].field).toBe('');
  });

  it('should reject empty password', () => {
    const { errors } = validateData(passwordSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH);
    expect(errors![0].field).toBe('');
  });

  it('should reject password with invalid characters', () => {
    const { errors } = validateData(passwordSchema, 'Test123<>');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_WRONG_CHARS);
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
      passwordMinLength: PASSWORD_REQUIRED_LENGTH
    });
    const { errors } = validateData(customSchema, '12345');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Too short');
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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.COUNTRY_EMPTY);
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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED);
    expect(errors![0].field).toBe('');
  });

  it('should use custom error message', () => {
    const customSchema = createCurrencySchema('Custom message');
    const { errors } = validateData(customSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Custom message');
  });
});
