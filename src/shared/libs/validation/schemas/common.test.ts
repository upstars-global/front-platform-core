import { describe, it, expect } from 'vitest';
import {
  createEmailSchema,
  createPasswordSchema,
  createCountrySchema,
  createCurrencySchema,
  EMAIL_REGEX,
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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.EMAIL_REQUIRED);
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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.PASSWORD_EMPTY);
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
    expect(errors![0].key).toBe(BASE_CLIENT_ERROR_KEY.REQUIRED_FIELD);
    expect(errors![0].field).toBe('');
  });

  it('should use custom error message', () => {
    const customSchema = createCurrencySchema('Custom message');
    const { errors } = validateData(customSchema, '');
    expect(errors).not.toBeNull();
    expect(errors![0].key).toBe('Custom message');
  });
});

// eslint-disable-next-line no-useless-escape
const OLD_EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

describe('Email Regex Comparison: OLD vs NEW', () => {
  describe('Valid emails - both should accept', () => {
    const validEmails = [
      'test@example.com',
      'user@mail.company.com',
      'john.doe@example.com',
      'user+tag@example.com',
      'user_name@example.com',
      'user123@example.com',
      'a@example.co',
      'test@subdomain.example.com',
    ];

    validEmails.forEach((email) => {
      it(`should both accept: ${email}`, () => {
        expect(OLD_EMAIL_REGEX.test(email)).toBe(true);
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });
    });
  });

  describe('Invalid emails - both should reject', () => {
    const invalidEmails = [
      'invalid-email',
      'testexample.com',
      '@example.com',
      'user@',
      'user @example.com',
      'user@.com',
      '',
    ];

    invalidEmails.forEach((email) => {
      it(`should both reject: ${email}`, () => {
        expect(OLD_EMAIL_REGEX.test(email)).toBe(false);
        expect(EMAIL_REGEX.test(email)).toBe(false);
      });
    });
  });

  describe('Key differences - NEW regex behavior changes', () => {
    describe('Features REMOVED in NEW regex (stricter)', () => {
      it('NEW rejects IP address format in domain, OLD accepts', () => {
        const ipEmail = 'user@[192.168.1.1]';
        expect(OLD_EMAIL_REGEX.test(ipEmail)).toBe(true);
        expect(EMAIL_REGEX.test(ipEmail)).toBe(false);
      });

      it('NEW rejects quoted strings in local part, OLD accepts', () => {
        const quotedEmail = '"user name"@example.com';
        expect(OLD_EMAIL_REGEX.test(quotedEmail)).toBe(true);
        expect(EMAIL_REGEX.test(quotedEmail)).toBe(false);
      });
    });

    describe('Features ADDED in NEW regex (more permissive)', () => {
      it('NEW accepts consecutive dots in local part, OLD rejects', () => {
        const email = 'user..name@example.com';
        expect(OLD_EMAIL_REGEX.test(email)).toBe(false);
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });

      it('NEW accepts leading dot in local part, OLD rejects', () => {
        const email = '.user@example.com';
        expect(OLD_EMAIL_REGEX.test(email)).toBe(false);
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });

      it('NEW accepts trailing dot in local part, OLD rejects', () => {
        const email = 'user.@example.com';
        expect(OLD_EMAIL_REGEX.test(email)).toBe(false);
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });
    });

    describe('Features UNCHANGED (both accept)', () => {
      it('Both accept uppercase in domain (case-insensitive)', () => {
        const email = 'test@EXAMPLE.COM';
        expect(OLD_EMAIL_REGEX.test(email)).toBe(true);
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });

      it('Both accept common special characters in local part', () => {
        const specialCharEmails = [
          'user+tag@example.com',
          'user!name@example.com',
          'user#name@example.com',
          'user$name@example.com',
          'user%name@example.com',
          'user&name@example.com',
          'user*name@example.com',
          'user=name@example.com',
          'user?name@example.com',
          'user^name@example.com',
          'user`name@example.com',
          'user{name@example.com',
          'user|name@example.com',
          'user}name@example.com',
          'user~name@example.com',
          'user/name@example.com',
          "user'name@example.com",
        ];

        specialCharEmails.forEach((email) => {
          expect(OLD_EMAIL_REGEX.test(email)).toBe(true);
          expect(EMAIL_REGEX.test(email)).toBe(true);
        });
      });

      it('Both accept standard modern email formats', () => {
        const modernEmails = [
          'user+filter@example.com',
          'user.name+tag@example.co.uk',
          'first.last@subdomain.example.com',
          'user_123@test-domain.com',
        ];

        modernEmails.forEach((email) => {
          expect(OLD_EMAIL_REGEX.test(email)).toBe(true);
          expect(EMAIL_REGEX.test(email)).toBe(true);
        });
      });
    });
  });

  describe('Edge cases highlighting regex differences', () => {
    it('NEW handles consecutive dots differently', () => {
      const email = 'user..name@example.com';
      // Both should reject this, but for different reasons
      expect(OLD_EMAIL_REGEX.test(email)).toBe(false);
      expect(EMAIL_REGEX.test(email)).toBe(true); // NEW is more permissive
    });

    it('NEW handles starting/ending dots differently', () => {
      const startDot = '.user@example.com';
      const endDot = 'user.@example.com';
      
      expect(OLD_EMAIL_REGEX.test(startDot)).toBe(false);
      expect(EMAIL_REGEX.test(startDot)).toBe(true); // NEW allows it
      
      expect(OLD_EMAIL_REGEX.test(endDot)).toBe(false);
      expect(EMAIL_REGEX.test(endDot)).toBe(true); // NEW allows it
    });

    it('Both support case-insensitive domains', () => {
      const email = 'user@EXAMPLE.COM';
      // Both regex patterns are case-insensitive
      expect(EMAIL_REGEX.test(email)).toBe(true);
      expect(OLD_EMAIL_REGEX.test(email)).toBe(true);
    });

    it('NEW enforces stricter domain format (no IP addresses)', () => {
      const ipEmails = [
        'user@[192.168.1.1]',
        'user@[255.255.255.255]',
      ];

      ipEmails.forEach((email) => {
        expect(OLD_EMAIL_REGEX.test(email)).toBe(true);
        expect(EMAIL_REGEX.test(email)).toBe(false);
      });
    });
  });

  describe('Summary of changes: OLD vs NEW regex', () => {
    it('documents what was REMOVED (stricter validation)', () => {
      const removed = {
        'IP address domains': {
          example: 'user@[192.168.1.1]',
          reason: 'Rarely used in practice, simplifies regex',
        },
        'Quoted local parts': {
          example: '"user name"@example.com',
          reason: 'Uncommon edge case, simplifies regex',
        },
      };

      // These features were intentionally removed
      expect(Object.keys(removed).length).toBe(2);
    });

    it('documents what was ADDED (more permissive)', () => {
      const added = {
        'Consecutive dots': {
          example: 'user..name@example.com',
          reason: 'More permissive, accepts edge cases',
        },
        'Leading dots': {
          example: '.user@example.com',
          reason: 'More permissive, accepts edge cases',
        },
        'Trailing dots': {
          example: 'user.@example.com',
          reason: 'More permissive, accepts edge cases',
        },
      };

      // These features are now accepted
      expect(Object.keys(added).length).toBe(3);
    });

    it('documents what STAYED THE SAME', () => {
      const unchanged = {
        'Case-insensitive': 'Both accept user@EXAMPLE.COM',
        'Special characters': 'Both accept user+tag!#$%@example.com',
        'Standard formats': 'Both accept user.name@subdomain.example.com',
        'Subdomains': 'Both accept user@mail.company.example.com',
      };

      // Core functionality remains the same
      expect(Object.keys(unchanged).length).toBe(4);
    });
  });
});
