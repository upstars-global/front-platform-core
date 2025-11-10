import { describe, it, expect, vi } from 'vitest';
import { createI18nErrorMapper } from './';

enum TestErrorKeys {
  UserNotFound = 'USER_NOT_FOUND',
  InvalidEmail = 'INVALID_EMAIL',
  ServerError = 'SERVER_ERROR',
}

enum TestI18nKeys {
  UserNotFoundMessage = 'errors.user_not_found',
  InvalidEmailMessage = 'errors.invalid_email',
  ServerErrorMessage = 'errors.server_error',
  UnknownError = 'errors.unknown',
  FallbackError = 'errors.fallback',
  DefaultError = 'errors.default',
}

vi.mock('../../../../shared/helpers', () => {
  return {
    log: {
      error: vi.fn(),
    },
  };
});

describe('createI18nErrorMapper', () => {
  it('should return mapper with getI18nKey method', () => {
    const mapper = createI18nErrorMapper(
      {
        [TestErrorKeys.UserNotFound]: TestI18nKeys.UserNotFoundMessage,
        [TestErrorKeys.InvalidEmail]: TestI18nKeys.InvalidEmailMessage,
        [TestErrorKeys.ServerError]: TestI18nKeys.ServerErrorMessage,
      },
      {
        fallback: () => TestI18nKeys.UnknownError,
      }
    );

    expect(mapper).toHaveProperty('getI18nKey');
    expect(typeof mapper.getI18nKey).toBe('function');
  });

  it('should map error key to i18n key correctly', () => {
    const mappings = {
      [TestErrorKeys.UserNotFound]: TestI18nKeys.UserNotFoundMessage,
      [TestErrorKeys.InvalidEmail]: TestI18nKeys.InvalidEmailMessage,
      [TestErrorKeys.ServerError]: TestI18nKeys.ServerErrorMessage,
    };

    const mapper = createI18nErrorMapper(mappings, {
      fallback: () => TestI18nKeys.UnknownError,
    });

    const result = mapper.getI18nKey(TestErrorKeys.UserNotFound);
    expect(result).toBe(TestI18nKeys.UserNotFoundMessage);
  });

  it('should map multiple different error keys correctly', () => {
    const mappings = {
      [TestErrorKeys.UserNotFound]: TestI18nKeys.UserNotFoundMessage,
      [TestErrorKeys.InvalidEmail]: TestI18nKeys.InvalidEmailMessage,
      [TestErrorKeys.ServerError]: TestI18nKeys.ServerErrorMessage,
    };

    const mapper = createI18nErrorMapper(mappings, {
      fallback: () => TestI18nKeys.UnknownError,
    });

    expect(mapper.getI18nKey(TestErrorKeys.UserNotFound)).toBe(
      TestI18nKeys.UserNotFoundMessage
    );
    expect(mapper.getI18nKey(TestErrorKeys.InvalidEmail)).toBe(
      TestI18nKeys.InvalidEmailMessage
    );
    expect(mapper.getI18nKey(TestErrorKeys.ServerError)).toBe(
      TestI18nKeys.ServerErrorMessage
    );
  });

  it('should call fallback when error key is not found', () => {
    // For this test, we need to use a subset of error keys in mappings
    type SubsetErrorKeys = TestErrorKeys.UserNotFound | 'UNKNOWN_ERROR';
    
    const fallbackSpy = vi.fn(() => TestI18nKeys.FallbackError);
    
    const mapper = createI18nErrorMapper<SubsetErrorKeys, TestI18nKeys>(
      {
        [TestErrorKeys.UserNotFound]: TestI18nKeys.UserNotFoundMessage,
        // 'UNKNOWN_ERROR' is intentionally omitted to test fallback
      } as Record<SubsetErrorKeys, TestI18nKeys>, // This is safe because we're testing the fallback
      {
        fallback: fallbackSpy,
      }
    );

    const result = mapper.getI18nKey('UNKNOWN_ERROR' as SubsetErrorKeys);

    expect(fallbackSpy).toHaveBeenCalledWith('UNKNOWN_ERROR');
    expect(fallbackSpy).toHaveBeenCalledTimes(1);
    expect(result).toBe(TestI18nKeys.FallbackError);
  });

  it('should not call fallback when error key exists', () => {
    const fallbackSpy = vi.fn(() => TestI18nKeys.FallbackError);
    const mapper = createI18nErrorMapper(
      {
        [TestErrorKeys.UserNotFound]: TestI18nKeys.UserNotFoundMessage,
        [TestErrorKeys.InvalidEmail]: TestI18nKeys.InvalidEmailMessage,
        [TestErrorKeys.ServerError]: TestI18nKeys.ServerErrorMessage,
      },
      {
        fallback: fallbackSpy,
      }
    );

    mapper.getI18nKey(TestErrorKeys.UserNotFound);

    expect(fallbackSpy).not.toHaveBeenCalled();
  });

  it('should handle empty mappings object', () => {
    type ErrorKeys = 'ANY_KEY';
    const fallbackSpy = vi.fn(() => TestI18nKeys.DefaultError);
    const mapper = createI18nErrorMapper<ErrorKeys, TestI18nKeys>(
      {} as Record<ErrorKeys, TestI18nKeys>, // Empty object with proper type
      { fallback: fallbackSpy }
    );

    const result = mapper.getI18nKey('ANY_KEY' as ErrorKeys);

    expect(result).toBe(TestI18nKeys.DefaultError);
    expect(fallbackSpy).toHaveBeenCalledTimes(1);
  });

  it('should preserve fallback logic across multiple calls', () => {
    type ErrorKeys = TestErrorKeys | 'UNKNOWN_1' | 'UNKNOWN_2';
    const fallbackSpy = vi.fn(() => TestI18nKeys.FallbackError);
    
    const mapper = createI18nErrorMapper<ErrorKeys, TestI18nKeys>(
      {
        [TestErrorKeys.UserNotFound]: TestI18nKeys.UserNotFoundMessage,
        [TestErrorKeys.InvalidEmail]: TestI18nKeys.InvalidEmailMessage,
        [TestErrorKeys.ServerError]: TestI18nKeys.ServerErrorMessage,
        // UNKNOWN_1 and UNKNOWN_2 are omitted to test fallback
      } as Record<ErrorKeys, TestI18nKeys>,
      {
        fallback: fallbackSpy,
      }
    );

    mapper.getI18nKey('UNKNOWN_1' as ErrorKeys);
    mapper.getI18nKey('UNKNOWN_2' as ErrorKeys);

    expect(fallbackSpy).toHaveBeenCalledTimes(2);
  });

  it('should work with string literal types', () => {
    type ErrorKeys = 'ERROR_A' | 'ERROR_B';
    type I18nKeys = 'i18n.error.a' | 'i18n.error.b' | 'i18n.fallback.ERROR_A' | 'i18n.fallback.ERROR_B';
    
    const mapper = createI18nErrorMapper<ErrorKeys, I18nKeys>(
      {
        ERROR_A: 'i18n.error.a',
        ERROR_B: 'i18n.error.b',
      },
      {
        fallback: (key: string) => `i18n.fallback.${key}` as I18nKeys,
      }
    );

    expect(mapper.getI18nKey('ERROR_A')).toBe('i18n.error.a');
    expect(mapper.getI18nKey('ERROR_B')).toBe('i18n.error.b');
  });

  it('should pass correct error key to fallback function', () => {
    type ErrorKeys = 'CUSTOM_ERROR';
    const fallbackSpy = vi.fn((key: ErrorKeys) => `fallback_${key}` as string);
    
    const mapper = createI18nErrorMapper<ErrorKeys, string>(
      {} as Record<ErrorKeys, string>,
      { fallback: fallbackSpy }
    );

    mapper.getI18nKey('CUSTOM_ERROR');

    expect(fallbackSpy).toHaveBeenCalledWith('CUSTOM_ERROR');
  });
});