import { describe, it, expect } from 'vitest';
import { mapErrorFields } from './mapErrorFields';
import { BASE_CLIENT_ERROR_KEY } from '../config';

enum BackendKey {
  UserExists = 'USER_WITH_THIS_EMAIL_ALREADY_EXIST',
  PromoNotFound = 'PROMO_CODE_NOT_FOUND',
}

describe('mapErrorFields utility', () => {
  it('should map backend errors to validation errors', () => {
    const backendErrors = {
      email: ['USER_WITH_THIS_EMAIL_ALREADY_EXIST'],
    };
    const result = mapErrorFields({ errors: backendErrors });
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe('USER_WITH_THIS_EMAIL_ALREADY_EXIST');
    expect(result[0].field).toBe('email');
  });

  it('should map multiple backend errors', () => {
    const backendErrors = {
      email: ['USER_WITH_THIS_EMAIL_ALREADY_EXIST'],
      promo_code: ['PROMO_CODE_NOT_FOUND'],
    };
    const result = mapErrorFields({ errors: backendErrors });
    expect(result).toHaveLength(2);
  });

  it('should use field mapping when provided', () => {
    const backendErrors = {
      email: ['USER_WITH_THIS_EMAIL_ALREADY_EXIST'],
    };
    const fieldMap = {
      email: 'login',
    };
    const result = mapErrorFields({ errors: backendErrors, fieldMap });
    expect(result[0].field).toBe('login');
  });

  it('should handle errors without field mapping', () => {
    const backendErrors = {
      unknown_field: ['SOME_ERROR'],
    };
    const result = mapErrorFields({ errors: backendErrors });
    expect(result[0].field).toBe('unknown_field');
  });
});

describe('Error Keys', () => {
  it('should have unique client error keys', () => {
    const keys = Object.values(BASE_CLIENT_ERROR_KEY);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });

  it('should have unique backend error keys', () => {
    const keys = Object.values(BackendKey);
    const uniqueKeys = new Set(keys);
    expect(keys.length).toBe(uniqueKeys.size);
  });
});
