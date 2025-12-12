import { describe, it, expect } from 'vitest';
import { RemindFormSchema } from './remind';
import { validateData } from '../../../../shared/libs/validation/helpers/validateData';
import { AUTH_BACKEND_ERROR_KEY } from './config/keys';

describe('RemindFormSchema', () => {
  const validData = {
    login: 'test@example.com',
  };

  it('should validate complete valid registration form', () => {
    const { errors } = validateData(RemindFormSchema, validData);
    expect(errors).toBeNull();
  });

  it('should reject form with invalid email', () => {
    const invalidData = { ...validData, login: 'invalid-email' };
    const { errors } = validateData(RemindFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT);
  });

  it('should accept email with special characters', () => {
    const validDataSpecialEmail = { ...validData, login: 'test+tag@example.com' };
    const { errors } = validateData(RemindFormSchema, validDataSpecialEmail);
    expect(errors).toBeNull();
  });

  it('should accept email with subdomain', () => {
    const validDataSubdomainEmail = { ...validData, login: 'user@mail.company.com' };
    const { errors } = validateData(RemindFormSchema, validDataSubdomainEmail);
    expect(errors).toBeNull();
  });

  it('should reject email without domain', () => {
    const invalidData = { ...validData, login: 'test@' };
    const { errors } = validateData(RemindFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT);
  });

  it('should reject email without @ symbol', () => {
    const invalidData = { ...validData, login: 'testexample.com' };
    const { errors } = validateData(RemindFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(AUTH_BACKEND_ERROR_KEY.EMAIL_INVALID_FORMAT);
  });
});