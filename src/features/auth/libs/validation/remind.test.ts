import { describe, it, expect } from 'vitest';
import { RemindFormSchema } from './remind';
import { BASE_CLIENT_ERROR_KEY } from '../../../../shared';
import { validateData } from '../../../../shared/libs/validation/helpers/validateData';

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
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
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
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
  });

  it('should reject email without @ symbol', () => {
    const invalidData = { ...validData, login: 'testexample.com' };
    const { errors } = validateData(RemindFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
  });
});