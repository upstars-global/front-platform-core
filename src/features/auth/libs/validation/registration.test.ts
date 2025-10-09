import { describe, it, expect } from 'vitest';
import { RegistrationFormSchema } from './registration';
import { ClientErrorKey, validateData } from 'src/shared';

describe('RegistrationFormSchema', () => {
  const validData = {
    login: 'test@example.com',
    password: 'Test123',
    chosen_country: 'US',
    currency: 'USD',
    accept_terms: true,
  };

  it('should validate complete valid registration form', () => {
    const errors = validateData(RegistrationFormSchema, validData);
    expect(errors).toBeNull();
  });

  it('should validate form with optional fields', () => {
    const dataWithOptional = {
      ...validData,
      promo_code: 'PROMO123',
      accept_notifications: true,
      localization: 'en',
      auth_type: 'email',
      captcha_key: 'captcha123',
      client_id: 'client123',
    };
    const errors = validateData(RegistrationFormSchema, dataWithOptional);
    expect(errors).toBeNull();
  });

  it('should reject form without accept_terms', () => {
    const invalidData = { ...validData, accept_terms: false };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(0);
    const termsError = errors!.find(e => e.field === 'accept_terms');
    console.log(errors)
    expect(termsError).toBeDefined();
    expect(termsError!.key).toBe('REGISTRATION.ACCEPT_TERMS_MUST_BE_CHECKED');
  });

  it('should reject form with invalid email', () => {
    const invalidData = { ...validData, login: 'invalid-email' };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(ClientErrorKey.EmailInvalid);
  });

  it('should reject form with short password', () => {
    const invalidData = { ...validData, password: '12345' };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(ClientErrorKey.PasswordLength);
  });

  it('should reject form without country', () => {
    const invalidData = { ...validData, chosen_country: '' };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const countryError = errors!.find(e => e.field === 'chosen_country');
    expect(countryError).toBeDefined();
    expect(countryError!.key).toBe(ClientErrorKey.CountryEmpty);
  });

  it('should reject form without currency', () => {
    const invalidData = { ...validData, currency: '' };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const currencyError = errors!.find(e => e.field === 'currency');
    expect(currencyError).toBeDefined();
    expect(currencyError!.key).toBe(ClientErrorKey.Required);
  });
});