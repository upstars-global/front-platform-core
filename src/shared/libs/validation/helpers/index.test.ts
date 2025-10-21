import { describe, it, expect } from 'vitest';
import { createCountrySchema, createCurrencySchema, createEmailSchema, createPasswordSchema } from '../schemas';
import { mapBackendErrors, validateData } from './';
import { ClientErrorKey } from '../config';
import * as z from "zod";

enum BackendKey {
  UserExists = 'VALIDATION_BACK.USER_WITH_THIS_EMAIL_ALREADY_EXIST',
  PromoNotFound = 'VALIDATION_BACK.PROMO_CODE_NOT_FOUND',
}

describe('validateForm utility', () => {
  it('should return null for valid data', () => {
    const schema = createEmailSchema();
    const { errors } = validateData(schema, 'test@example.com');
    expect(errors).toBeNull();
  });

  it('should return validation errors for invalid data', () => {
    const schema = createEmailSchema();
    const { errors } = validateData(schema, 'invalid');
    expect(errors).not.toBeNull();
    expect(errors).toHaveLength(1);
    expect(errors![0].key).toBe(ClientErrorKey.EmailInvalid);
    expect(errors![0].field).toBe('');
  });

  it('should handle multiple validation errors with object schema', () => {
    const testSchema = z.object({
      email: createEmailSchema(),
      password: createPasswordSchema(),
      country: createCountrySchema(),
    });

    const { errors } = validateData(testSchema, {
      email: 'invalid',
      password: '123',
      country: '',
    });
    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(1);
  });

  it('should correctly map field paths in nested objects', () => {
    const testSchema = z.object({
      email: createEmailSchema(),
      password: createPasswordSchema(),
    });

    const { errors } = validateData(testSchema, {
      email: 'invalid@test.com',
      password: '123',
    });
    expect(errors).not.toBeNull();
    const passwordError = errors!.find((e) => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(ClientErrorKey.PasswordLength);
  });

  it('should handle validation of password schema', () => {
    const schema = createPasswordSchema();
    const { errors } = validateData(schema, '12345');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(ClientErrorKey.PasswordLength);
  });

  it('should handle validation of country schema', () => {
    const schema = createCountrySchema();
    const { errors } = validateData(schema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(ClientErrorKey.CountryEmpty);
  });

  it('should correctly map field paths in nested objects (two levels)', () => {
    const testSchema = z.object({
      user: z.object({
        credentials: z.object({
          email: createEmailSchema(),
          password: createPasswordSchema(),
        }),
        profile: z.object({
          country: createCountrySchema(),
          currency: createCurrencySchema(),
        }),
      }),
    });

    const { errors } = validateData(testSchema, {
      user: {
        credentials: {
          email: 'invalid',
          password: '123',
        },
        profile: {
          country: '',
          currency: '',
        },
      },
    });

    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(0);

    const emailError = errors!.find((e) => e.field === 'user.credentials.email');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(ClientErrorKey.EmailInvalid);

    const passwordError = errors!.find((e) => e.field === 'user.credentials.password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(ClientErrorKey.PasswordLength);

    const countryError = errors!.find((e) => e.field === 'user.profile.country');
    expect(countryError).toBeDefined();
    expect(countryError!.key).toBe(ClientErrorKey.CountryEmpty);

    const currencyError = errors!.find((e) => e.field === 'user.profile.currency');
    expect(currencyError).toBeDefined();
    expect(currencyError!.key).toBe(ClientErrorKey.Required);
  });
});

describe('mapBackendErrors utility', () => {
  it('should map backend errors to validation errors', () => {
    const backendErrors = {
      email: ['USER_WITH_THIS_EMAIL_ALREADY_EXIST'],
    };
    const result = mapBackendErrors({ errors: backendErrors, backendKeys: BackendKey });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('VALIDATION_BACK.USER_WITH_THIS_EMAIL_ALREADY_EXIST');
    expect(result[0].field).toBe('email');
  });

  it('should map multiple backend errors', () => {
    const backendErrors = {
      email: ['USER_WITH_THIS_EMAIL_ALREADY_EXIST'],
      promo_code: ['PROMO_CODE_NOT_FOUND'],
    };
    const result = mapBackendErrors({ errors: backendErrors, backendKeys: BackendKey });
    expect(result).toHaveLength(2);
  });

  it('should use field mapping when provided', () => {
    const backendErrors = {
      email: ['USER_WITH_THIS_EMAIL_ALREADY_EXIST'],
    };
    const fieldMap = {
      email: 'login',
    };
    const result = mapBackendErrors({ errors: backendErrors, backendKeys: BackendKey, fieldMap });
    expect(result[0].field).toBe('login');
  });

  it('should handle errors without field mapping', () => {
    const backendErrors = {
      unknown_field: ['SOME_ERROR'],
    };
    const result = mapBackendErrors({ errors: backendErrors, backendKeys: BackendKey });
    expect(result[0].field).toBe('unknown_field');
  });
});

describe('Error Keys', () => {
  it('should have unique client error keys', () => {
    const keys = Object.values(ClientErrorKey);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it('should have unique backend error keys', () => {
    const keys = Object.values(BackendKey);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it('should have all backend keys with correct prefix', () => {
    const keys = Object.values(BackendKey);
    keys.forEach((key) => {
      expect(key).toContain('VALIDATION_BACK');
    });
  });
});
