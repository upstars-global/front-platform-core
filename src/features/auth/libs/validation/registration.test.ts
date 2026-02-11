import { describe, it, expect } from 'vitest';
import { RegistrationFormSchema } from './registration';
import { BASE_CLIENT_ERROR_KEY } from '../../../../shared';
import { validateData } from '../../../../shared/libs/validation/helpers/validateData';

describe('RegistrationFormSchema', () => {
  const validData = {
    email: 'test@example.com',
    password: 'Test123',
    country: 'US',
    currency: 'USD',
    acceptTerms: true,
  };

  it('should validate complete valid registration form', () => {
    const { errors } = validateData(RegistrationFormSchema(), validData);
    expect(errors).toBeNull();
  });

  it('should validate form with optional fields', () => {
    const dataWithOptional = {
      ...validData,
      promoCode: 'PROMO123',
      acceptNotifications: true,
    };
    const { errors } = validateData(RegistrationFormSchema(), dataWithOptional);
    expect(errors).toBeNull();
  });

  it('should reject form without acceptTerms', () => {
    const invalidData = { ...validData, acceptTerms: false };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(0);
    const termsError = errors!.find(e => e.field === 'acceptTerms');
    expect(termsError).toBeDefined();
    expect(termsError!.key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED_FIELD);
  });

  it('should reject form with invalid email', () => {
    const invalidData = { ...validData, email: 'invalid-email' };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
  });

  it('should reject form with short password', () => {
    const invalidData = { ...validData, password: '12345' };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH);
  });

  it('should reject form without country', () => {
    const invalidData = { ...validData, country: '' };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const countryError = errors!.find(e => e.field === 'country');
    expect(countryError).toBeDefined();
    expect(countryError!.key).toBe(BASE_CLIENT_ERROR_KEY.COUNTRY_EMPTY);
  });

  it('should reject form without currency', () => {
    const invalidData = { ...validData, currency: '' };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const currencyError = errors!.find(e => e.field === 'currency');
    expect(currencyError).toBeDefined();
    expect(currencyError!.key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED_FIELD);
  });

  it('should reject form with empty password', () => {
    const invalidData = { ...validData, password: '' };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_EMPTY);
  });

  it('should reject form with password containing invalid characters', () => {
    const invalidData = { ...validData, password: '月月月123' }; 
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_WRONG_CHARS);
  });

  it('should accept password with exactly minimum length', () => {
    const validDataMinPassword = { ...validData, password: '123456' };
    const { errors } = validateData(RegistrationFormSchema(), validDataMinPassword);
    expect(errors).toBeNull();
  });

  it('should accept password with special characters', () => {
    const validDataSpecialPassword = { ...validData, password: 'Test@123' };
    const { errors } = validateData(RegistrationFormSchema(), validDataSpecialPassword);
    expect(errors).toBeNull();
  });

  it('should return multiple errors for form with multiple invalid fields', () => {
    const invalidData = {
      email: 'invalid-email',
      password: '123',
      country: '',
      currency: '',
      acceptTerms: false,
      acceptNotifications: true,
    };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(1);
    
    const emailError = errors!.find(e => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
    
    const passwordError = errors!.find(e => e.field === 'password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH);
    
    const countryError = errors!.find(e => e.field === 'country');
    expect(countryError).toBeDefined();
    expect(countryError!.key).toBe(BASE_CLIENT_ERROR_KEY.COUNTRY_EMPTY);
    
    const currencyError = errors!.find(e => e.field === 'currency');
    expect(currencyError).toBeDefined();
    expect(currencyError!.key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED_FIELD);
    
    const termsError = errors!.find(e => e.field === 'acceptTerms');
    expect(termsError).toBeDefined();
    expect(termsError!.key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED_FIELD);
  });

  it('should accept email with special characters', () => {
    const validDataSpecialEmail = { ...validData, email: 'test+tag@example.com' };
    const { errors } = validateData(RegistrationFormSchema(), validDataSpecialEmail);
    expect(errors).toBeNull();
  });

  it('should accept email with subdomain', () => {
    const validDataSubdomainEmail = { ...validData, email: 'user@mail.company.com' };
    const { errors } = validateData(RegistrationFormSchema(), validDataSubdomainEmail);
    expect(errors).toBeNull();
  });

  it('should reject email without domain', () => {
    const invalidData = { ...validData, email: 'test@' };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
  });

  it('should reject email without @ symbol', () => {
    const invalidData = { ...validData, email: 'testexample.com' };
    const { errors } = validateData(RegistrationFormSchema(), invalidData);
    expect(errors).not.toBeNull();
    const emailError = errors!.find(e => e.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
  });

  it('should validate form with all optional fields', () => {
    const dataWithAllOptional = {
      ...validData,
      promoCode: 'PROMO123',
      acceptNotifications: true,
    };
    const { errors } = validateData(RegistrationFormSchema(), dataWithAllOptional);
    expect(errors).toBeNull();
  });

  it('should validate form with empty optional fields', () => {
    const dataWithEmptyOptional = {
      ...validData,
      promoCode: '',
      acceptNotifications: false,
    };
    const { errors } = validateData(RegistrationFormSchema(), dataWithEmptyOptional);
    expect(errors).toBeNull();
  });
});