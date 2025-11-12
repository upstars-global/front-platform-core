import { describe, expect, it } from "vitest";
import z from "zod";
import { BASE_CLIENT_ERROR_KEY } from "../config";
import { createEmailSchema, createPasswordSchema, createCountrySchema, createCurrencySchema } from "../schemas";
import { validateData } from "./validateData";

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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);
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
    expect(passwordError!.key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH);
  });

  it('should handle validation of password schema', () => {
    const schema = createPasswordSchema();
    const { errors } = validateData(schema, '12345');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH);
  });

  it('should handle validation of country schema', () => {
    const schema = createCountrySchema();
    const { errors } = validateData(schema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.COUNTRY_EMPTY);
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
    expect(emailError!.key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_INVALID);

    const passwordError = errors!.find((e) => e.field === 'user.credentials.password');
    expect(passwordError).toBeDefined();
    expect(passwordError!.key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_LENGTH);

    const countryError = errors!.find((e) => e.field === 'user.profile.country');
    expect(countryError).toBeDefined();
    expect(countryError!.key).toBe(BASE_CLIENT_ERROR_KEY.COUNTRY_EMPTY);

    const currencyError = errors!.find((e) => e.field === 'user.profile.currency');
    expect(currencyError).toBeDefined();
    expect(currencyError!.key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED);
  });
});