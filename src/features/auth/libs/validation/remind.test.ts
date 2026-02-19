import { describe, it, expect } from 'vitest';
import { RemindFormSchema } from './remind';
import { validateData } from '../../../../shared/libs/validation/helpers/validateData';
import { AUTH_BACKEND_ERROR_KEY } from '../../../../entities/auth/api/types';

describe('RemindFormSchema', () => {
  it('should validate complete valid registration form', () => {
    const validData = {
      login: 'test@example.com',
    };

    const { errors } = validateData(RemindFormSchema, validData);
    expect(errors).toBeNull();
  });

  it('should reject form with invalid email', () => {
    const invalidData = { login: 'invalid-email' };
    const { errors } = validateData(RemindFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT);
  });

  it('should accept email with special characters', () => {
    const validDataSpecialEmail = { login: 'test+tag@example.com' };
    const { errors } = validateData(RemindFormSchema, validDataSpecialEmail);
    expect(errors).toBeNull();
  });

  it('should accept email with subdomain', () => {
    const validDataSubdomainEmail = { login: 'user@mail.company.com' };
    const { errors } = validateData(RemindFormSchema, validDataSubdomainEmail);
    expect(errors).toBeNull();
  });

  it('should reject email without domain', () => {
    const invalidData = { login: 'test@' };
    const { errors } = validateData(RemindFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT);
  });

  it('should reject email without @ symbol', () => {
    const invalidData = { login: 'testexample.com' };
    const { errors } = validateData(RemindFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT);
  });
});