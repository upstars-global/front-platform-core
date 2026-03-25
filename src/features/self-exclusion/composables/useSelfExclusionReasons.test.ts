import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSelfExclusionReasons } from './useSelfExclusionReasons';
import { SELF_EXCLUSION_REASONS } from '../config';

vi.mock('../config', () => ({
  SELF_EXCLUSION_REASONS: [
    'PERSONAL_REASONS',
    'NO_WINNINGS',
    'GAMBLING_ADDICTION',
  ],
}));

describe('useSelfExclusionReasons', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('selfExclusionReasons', () => {
    it('should return formatted self exclusion reasons', () => {
      const { selfExclusionReasons } = useSelfExclusionReasons();

      expect(selfExclusionReasons.value).toEqual([
        {
          label: 'LIMITS.SELF_EXCLUSION.REASONS.PERSONAL_REASONS',
          value: 'PERSONAL_REASONS',
        },
        {
          label: 'LIMITS.SELF_EXCLUSION.REASONS.NO_WINNINGS',
          value: 'NO_WINNINGS',
        },
        {
          label: 'LIMITS.SELF_EXCLUSION.REASONS.GAMBLING_ADDICTION',
          value: 'GAMBLING_ADDICTION',
        },
      ]);
    });

    it('should map each reason to correct label format', () => {
      const { selfExclusionReasons } = useSelfExclusionReasons();

      selfExclusionReasons.value.forEach((reason) => {
        expect(reason.label).toMatch(/^LIMITS\.SELF_EXCLUSION\.REASONS\./);
        expect(reason.label).toContain(reason.value);
      });
    });

    it('should return same number of reasons as in config', () => {
      const { selfExclusionReasons } = useSelfExclusionReasons();

      expect(selfExclusionReasons.value).toHaveLength(SELF_EXCLUSION_REASONS.length);
    });

    it('should preserve the order of reasons from config', () => {
      const { selfExclusionReasons } = useSelfExclusionReasons();

      const values = selfExclusionReasons.value.map((r) => r.value);
      expect(values).toEqual(SELF_EXCLUSION_REASONS);
    });

    it('should handle all reasons from config', () => {
      const { selfExclusionReasons } = useSelfExclusionReasons();

      // All reasons should be present with correct structure
      selfExclusionReasons.value.forEach((reason) => {
        expect(reason).toHaveProperty('label');
        expect(reason).toHaveProperty('value');
        expect(typeof reason.label).toBe('string');
        expect(typeof reason.value).toBe('string');
      });
    });
  });

  describe('computed reactivity', () => {
    it('should be a computed property', () => {
      const { selfExclusionReasons } = useSelfExclusionReasons();

      expect(selfExclusionReasons.value).toBeDefined();
      // Computed properties should have a value property
      expect('value' in selfExclusionReasons).toBe(true);
    });
  });
});
