import { describe, it, expect } from 'vitest';
import { RegistrationFormSchema } from './registration';
import { ClientErrorKey, validateData } from '../../../../shared';

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

  it('should reject form with empty password', () => {
    const invalidData = { ...validData, password: '' };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(ClientErrorKey.PasswordEmpty);
  });

  it('should reject form with password containing invalid characters', () => {
    const invalidData = { ...validData, password: '月月月123' }; 
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(ClientErrorKey.PasswordWrongChars);
  });

  it('should accept password with exactly minimum length', () => {
    const validDataMinPassword = { ...validData, password: '123456' };
    const errors = validateData(RegistrationFormSchema, validDataMinPassword);
    expect(errors).toBeNull();
  });

  it('should accept password with special characters', () => {
    const validDataSpecialPassword = { ...validData, password: 'Test@123' };
    const errors = validateData(RegistrationFormSchema, validDataSpecialPassword);
    expect(errors).toBeNull();
  });

  it('should return multiple errors for form with multiple invalid fields', () => {
    const invalidData = {
      login: 'invalid-email',
      password: '123',
      chosen_country: '',
      currency: '',
      accept_terms: false,
      accept_notifications: true,
    };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(1);
    
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(ClientErrorKey.EmailInvalid);
    
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(ClientErrorKey.PasswordLength);
    
    const countryError = errors!.find(e => e.field === 'chosen_country');
    expect(countryError).toBeDefined();
    expect(countryError!.key).toBe(ClientErrorKey.CountryEmpty);
    
    const currencyError = errors!.find(e => e.field === 'currency');
    expect(currencyError).toBeDefined();
    expect(currencyError!.key).toBe(ClientErrorKey.Required);
    
    const termsError = errors!.find(e => e.field === 'accept_terms');
    expect(termsError).toBeDefined();
    expect(termsError!.key).toBe('REGISTRATION.ACCEPT_TERMS_MUST_BE_CHECKED');
  });

  it('should accept email with special characters', () => {
    const validDataSpecialEmail = { ...validData, login: 'test+tag@example.com' };
    const errors = validateData(RegistrationFormSchema, validDataSpecialEmail);
    expect(errors).toBeNull();
  });

  it('should accept email with subdomain', () => {
    const validDataSubdomainEmail = { ...validData, login: 'user@mail.company.com' };
    const errors = validateData(RegistrationFormSchema, validDataSubdomainEmail);
    expect(errors).toBeNull();
  });

  it('should reject email without domain', () => {
    const invalidData = { ...validData, login: 'test@' };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(ClientErrorKey.EmailInvalid);
  });

  it('should reject email without @ symbol', () => {
    const invalidData = { ...validData, login: 'testexample.com' };
    const errors = validateData(RegistrationFormSchema, invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'login');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(ClientErrorKey.EmailInvalid);
  });

  it('should validate form with all optional fields', () => {
    const dataWithAllOptional = {
      ...validData,
      promo_code: 'PROMO123',
      accept_notifications: true,
    };
    const errors = validateData(RegistrationFormSchema, dataWithAllOptional);
    expect(errors).toBeNull();
  });

  it('should validate form with empty optional fields', () => {
    const dataWithEmptyOptional = {
      ...validData,
      promo_code: '',
      accept_notifications: false,
    };
    const errors = validateData(RegistrationFormSchema, dataWithEmptyOptional);
    expect(errors).toBeNull();
  });
});