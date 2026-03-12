import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSelfExclusionDurations } from './useSelfExclusionDurations';
import { SELF_EXCLUSION_DURATIONS, TRANSLATE_MAP } from '../config';

vi.mock('../config', () => ({
  SELF_EXCLUSION_DURATIONS: [
    { type: 'DAY', value: 1 },
    { type: 'DAY', value: 7 },
    { type: 'MONTH', value: 1 },
    { type: 'YEAR', value: 1 },
  ],
  TRANSLATE_MAP: {
    DAY: 'DAY',
    MONTH: 'MONTH',
    YEAR: 'YEAR',
    FOREVER: 'FOREVER',
  },
}));

vi.mock('../../../entities/limits', () => ({
  SelfExclusionActivatePeriod: {
    DAY: 'DAY',
    MONTH: 'MONTH',
    YEAR: 'YEAR',
    FOREVER: 'FOREVER',
  },
}));

describe('useSelfExclusionDurations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('selfExclusionDurations', () => {
    it('should return formatted self exclusion durations', () => {
      const { selfExclusionDurations } = useSelfExclusionDurations();

      expect(selfExclusionDurations.value).toEqual([
        {
          label: 'LIMITS.SELF_EXCLUSION.DURATION_TYPES.DAY',
          value: '1_DAY',
          duration: { type: 'DAY', value: 1 },
        },
        {
          label: 'LIMITS.SELF_EXCLUSION.DURATION_TYPES.DAY',
          value: '7_DAY',
          duration: { type: 'DAY', value: 7 },
        },
        {
          label: 'LIMITS.SELF_EXCLUSION.DURATION_TYPES.MONTH',
          value: '1_MONTH',
          duration: { type: 'MONTH', value: 1 },
        },
        {
          label: 'LIMITS.SELF_EXCLUSION.DURATION_TYPES.YEAR',
          value: '1_YEAR',
          duration: { type: 'YEAR', value: 1 },
        },
      ]);
    });

    it('should correctly format duration values as "value_type"', () => {
      const { selfExclusionDurations } = useSelfExclusionDurations();

      selfExclusionDurations.value.forEach((item) => {
        expect(item.value).toMatch(/^\d+_\w+$/);
        expect(item.value).toBe(`${item.duration.value || 1}_${item.duration.type}`);
      });
    });

    it('should map duration types to correct translation keys', () => {
      const { selfExclusionDurations } = useSelfExclusionDurations();

      selfExclusionDurations.value.forEach((item) => {
        expect(item.label).toMatch(/^LIMITS\.SELF_EXCLUSION\.DURATION_TYPES\./);
        expect(item.label).toContain(TRANSLATE_MAP[item.duration.type]);
      });
    });

    it('should return same number of durations as in config', () => {
      const { selfExclusionDurations } = useSelfExclusionDurations();

      expect(selfExclusionDurations.value).toHaveLength(SELF_EXCLUSION_DURATIONS.length);
    });

    it('should preserve the order of durations from config', () => {
      const { selfExclusionDurations } = useSelfExclusionDurations();

      const durations = selfExclusionDurations.value.map((d) => d.duration);
      expect(durations).toEqual(SELF_EXCLUSION_DURATIONS);
    });

    it('should include original duration object in result', () => {
      const { selfExclusionDurations } = useSelfExclusionDurations();

      selfExclusionDurations.value.forEach((item, index) => {
        expect(item.duration).toEqual(SELF_EXCLUSION_DURATIONS[index]);
      });
    });
  });

  describe('getDurationByKey', () => {
    it('should return duration for valid key', () => {
      const { getDurationByKey } = useSelfExclusionDurations();

      const result = getDurationByKey('1_DAY');

      expect(result).toEqual({ type: 'DAY', value: 1 });
    });

    it('should return duration for different valid keys', () => {
      const { getDurationByKey } = useSelfExclusionDurations();

      expect(getDurationByKey('7_DAY')).toEqual({ type: 'DAY', value: 7 });
      expect(getDurationByKey('1_MONTH')).toEqual({ type: 'MONTH', value: 1 });
      expect(getDurationByKey('1_YEAR')).toEqual({ type: 'YEAR', value: 1 });
    });

    it('should return undefined for invalid key', () => {
      const { getDurationByKey } = useSelfExclusionDurations();

      const result = getDurationByKey('99_INVALID');

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const { getDurationByKey } = useSelfExclusionDurations();

      const result = getDurationByKey('');

      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent duration', () => {
      const { getDurationByKey } = useSelfExclusionDurations();

      const result = getDurationByKey('100_DAY');

      expect(result).toBeUndefined();
    });

    it('should handle keys with different formats gracefully', () => {
      const { getDurationByKey } = useSelfExclusionDurations();

      expect(getDurationByKey('INVALID')).toBeUndefined();
      expect(getDurationByKey('_')).toBeUndefined();
      expect(getDurationByKey('1_')).toBeUndefined();
    });
  });

  describe('computed reactivity', () => {
    it('should be a computed property', () => {
      const { selfExclusionDurations } = useSelfExclusionDurations();

      expect(selfExclusionDurations.value).toBeDefined();
      expect('value' in selfExclusionDurations).toBe(true);
    });
  });

  describe('integration', () => {
    it('should work correctly when finding duration by key and verifying it', () => {
      const { selfExclusionDurations, getDurationByKey } = useSelfExclusionDurations();

      const firstItem = selfExclusionDurations.value[0];
      const foundDuration = getDurationByKey(firstItem.value);

      expect(foundDuration).toEqual(firstItem.duration);
    });

    it('should find all durations by their generated keys', () => {
      const { selfExclusionDurations, getDurationByKey } = useSelfExclusionDurations();

      selfExclusionDurations.value.forEach((item) => {
        const foundDuration = getDurationByKey(item.value);
        expect(foundDuration).toEqual(item.duration);
      });
    });
  });
});
