import { describe, it, expect } from 'vitest';
import { isTargetPaymentProcessor } from './isTargetPaymentProcessor';
import { PAYMENT_METHOD } from '../../../../entities/cashbox';

describe('isTargetPaymentProcessor', () => {
  it('should return true when processorId matches targetId', () => {
    const result = isTargetPaymentProcessor({
      processorId: PAYMENT_METHOD.INTERAC,
      targetId: PAYMENT_METHOD.INTERAC,
    });
    expect(result).toBe(true);
  });

  it('should return false when processorId does not match targetId', () => {
    const result = isTargetPaymentProcessor({
      processorId: 'other-processor',
      targetId: PAYMENT_METHOD.INTERAC,
    });
    expect(result).toBe(false);
  });

  it('should return false when processorId is undefined', () => {
    const result = isTargetPaymentProcessor({
      processorId: undefined,
      targetId: PAYMENT_METHOD.INTERAC,
    });
    expect(result).toBe(false);
  });

  it('should return false when processorId is null', () => {
    const result = isTargetPaymentProcessor({
      processorId: null,
      targetId: PAYMENT_METHOD.INTERAC,
    });
    expect(result).toBe(false);
  });

  it('should return false when processorId is empty string', () => {
    const result = isTargetPaymentProcessor({
      processorId: '',
      targetId: PAYMENT_METHOD.INTERAC,
    });
    expect(result).toBe(false);
  });

  it('should perform exact string comparison (case sensitive)', () => {
    const result = isTargetPaymentProcessor({
      processorId: 'INTERAC',
      targetId: 'interac' as PAYMENT_METHOD,
    });
    expect(result).toBe(false);
  });
});
