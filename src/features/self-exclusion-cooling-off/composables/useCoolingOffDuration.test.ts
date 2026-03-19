import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCoolingOffDuration } from './useCoolingOffDuration';
import { COOLING_OFF_DURATIONS, COOLING_OFF_TRANSLATE_MAP } from '../config';

vi.mock('../config', () => ({
  COOLING_OFF_DURATIONS: [
    { type: 'DAY', value: 1 },
    { type: 'DAY', value: 3 },
    { type: 'WEEK', value: 1 },
    { type: 'WEEK', value: 2 },
    { type: 'MONTH', value: 1 },
  ],
  COOLING_OFF_TRANSLATE_MAP: {
    DAY: 'DAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH',
  },
}));

vi.mock('../../../entities/limits', () => ({
  CollingOffActivatePeriod: {
    DAY: 'DAY',
    WEEK: 'WEEK',
    MONTH: 'MONTH',
  },
}));

describe('useCoolingOffDuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('coolingOffDurations', () => {
    it('should return formatted cooling off durations', () => {
      const { coolingOffDurations } = useCoolingOffDuration();

      expect(coolingOffDurations.value).toEqual([
        {
          label: 'LIMITS.COOLING_OFF.DURATION_TYPES.DAY',
          value: '1_DAY',
          duration: { type: 'DAY', value: 1 },
        },
        {
          label: 'LIMITS.COOLING_OFF.DURATION_TYPES.DAY',
          value: '3_DAY',
          duration: { type: 'DAY', value: 3 },
        },
        {
          label: 'LIMITS.COOLING_OFF.DURATION_TYPES.WEEK',
          value: '1_WEEK',
          duration: { type: 'WEEK', value: 1 },
        },
        {
          label: 'LIMITS.COOLING_OFF.DURATION_TYPES.WEEK',
          value: '2_WEEK',
          duration: { type: 'WEEK', value: 2 },
        },
        {
          label: 'LIMITS.COOLING_OFF.DURATION_TYPES.MONTH',
          value: '1_MONTH',
          duration: { type: 'MONTH', value: 1 },
        },
      ]);
    });

    it('should correctly format duration values as "value_type"', () => {
      const { coolingOffDurations } = useCoolingOffDuration();

      coolingOffDurations.value.forEach((item) => {
        expect(item.value).toMatch(/^\d+_\w+$/);
        expect(item.value).toBe(`${item.duration.value || 1}_${item.duration.type}`);
      });
    });

    it('should map duration types to correct translation keys', () => {
      const { coolingOffDurations } = useCoolingOffDuration();

      coolingOffDurations.value.forEach((item) => {
        expect(item.label).toMatch(/^LIMITS\.COOLING_OFF\.DURATION_TYPES\./);
        expect(item.label).toContain(COOLING_OFF_TRANSLATE_MAP[item.duration.type]);
      });
    });

    it('should return same number of durations as in config', () => {
      const { coolingOffDurations } = useCoolingOffDuration();

      expect(coolingOffDurations.value).toHaveLength(COOLING_OFF_DURATIONS.length);
    });

    it('should preserve the order of durations from config', () => {
      const { coolingOffDurations } = useCoolingOffDuration();

      const durations = coolingOffDurations.value.map((d) => d.duration);
      expect(durations).toEqual(COOLING_OFF_DURATIONS);
    });

    it('should include original duration object in result', () => {
      const { coolingOffDurations } = useCoolingOffDuration();

      coolingOffDurations.value.forEach((item, index) => {
        expect(item.duration).toEqual(COOLING_OFF_DURATIONS[index]);
      });
    });
  });

  describe('getDurationByKey', () => {
    it('should return duration for valid key', () => {
      const { getDurationByKey } = useCoolingOffDuration();

      const result = getDurationByKey('1_DAY');

      expect(result).toEqual({ type: 'DAY', value: 1 });
    });

    it('should return duration for different valid keys', () => {
      const { getDurationByKey } = useCoolingOffDuration();

      expect(getDurationByKey('3_DAY')).toEqual({ type: 'DAY', value: 3 });
      expect(getDurationByKey('1_WEEK')).toEqual({ type: 'WEEK', value: 1 });
      expect(getDurationByKey('2_WEEK')).toEqual({ type: 'WEEK', value: 2 });
      expect(getDurationByKey('1_MONTH')).toEqual({ type: 'MONTH', value: 1 });
    });

    it('should return undefined for invalid key', () => {
      const { getDurationByKey } = useCoolingOffDuration();

      const result = getDurationByKey('99_INVALID');

      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const { getDurationByKey } = useCoolingOffDuration();

      const result = getDurationByKey('');

      expect(result).toBeUndefined();
    });

    it('should return undefined for non-existent duration', () => {
      const { getDurationByKey } = useCoolingOffDuration();

      const result = getDurationByKey('100_DAY');

      expect(result).toBeUndefined();
    });

    it('should handle keys with different formats gracefully', () => {
      const { getDurationByKey } = useCoolingOffDuration();

      expect(getDurationByKey('INVALID')).toBeUndefined();
      expect(getDurationByKey('_')).toBeUndefined();
      expect(getDurationByKey('1_')).toBeUndefined();
    });
  });

  describe('computed reactivity', () => {
    it('should be a computed property', () => {
      const { coolingOffDurations } = useCoolingOffDuration();

      expect(coolingOffDurations.value).toBeDefined();
      expect('value' in coolingOffDurations).toBe(true);
    });
  });

  describe('integration', () => {
    it('should work correctly when finding duration by key and verifying it', () => {
      const { coolingOffDurations, getDurationByKey } = useCoolingOffDuration();

      const firstItem = coolingOffDurations.value[0];
      const foundDuration = getDurationByKey(firstItem.value);

      expect(foundDuration).toEqual(firstItem.duration);
    });

    it('should find all durations by their generated keys', () => {
      const { coolingOffDurations, getDurationByKey } = useCoolingOffDuration();

      coolingOffDurations.value.forEach((item) => {
        const foundDuration = getDurationByKey(item.value);
        expect(foundDuration).toEqual(item.duration);
      });
    });
  });
});