import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useBonusAfterDepositStore } from './useBonusAfterDepositStore';

describe('useBonusAfterDepositStore', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    setActivePinia(createPinia());
  });

  it('should have userHasBonusBalanceBeforeDeposit set to false by default', () => {
    const store = useBonusAfterDepositStore();

    expect(store.userHasBonusBalanceBeforeDeposit).toBe(false);
  });
  it('should set userHasBonusBalanceBeforeDeposit to true when called without arguments', () => {
    const store = useBonusAfterDepositStore();

    store.setUserHasBonusBalanceBeforeDeposit();

    expect(store.userHasBonusBalanceBeforeDeposit).toBe(true);
  });
  it('should set userHasBonusBalanceBeforeDeposit to true when called with true', () => {
    const store = useBonusAfterDepositStore();

    store.setUserHasBonusBalanceBeforeDeposit(true);

    expect(store.userHasBonusBalanceBeforeDeposit).toBe(true);
  });
  it('should set userHasBonusBalanceBeforeDeposit to false when called with false', () => {
    const store = useBonusAfterDepositStore();

    store.setUserHasBonusBalanceBeforeDeposit(true);
    expect(store.userHasBonusBalanceBeforeDeposit).toBe(true);

    store.setUserHasBonusBalanceBeforeDeposit(false);
    expect(store.userHasBonusBalanceBeforeDeposit).toBe(false);
  });

  it('should be reactive when value changes', () => {
    const store = useBonusAfterDepositStore();
    const values: boolean[] = [];

    // Track value changes
    const stopWatch = () => {
      values.push(store.userHasBonusBalanceBeforeDeposit);
    };

    stopWatch(); // Initial value
    store.setUserHasBonusBalanceBeforeDeposit(true);
    stopWatch(); // After first change
    store.setUserHasBonusBalanceBeforeDeposit(false);
    stopWatch(); // After second change

    expect(values).toEqual([false, true, false]);
  });
});
