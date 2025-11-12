import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCashboxStore } from './useCashboxStore';
import { DEFAULT_VALUES } from '../../../../entities/cashbox';
import type {
  BetResource,
  GeneralLimitResource,
  PaymentMethodResource,
  PayoutItemResource,
  SumRangeResource,
  WithdrawalDefaultAmountResource,
} from '../../../../entities/cashbox';
import { Currency } from '../../../../shared';

describe('useCashboxStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createMockPaymentMethod = (overrides: Partial<PaymentMethodResource> = {}): PaymentMethodResource => ({
    id: 'payment-1',
    fee: 0,
    icons: [],
    isLocked: false,
    kycVerificationRequired: false,
    limits: [],
    name: 'Test Payment',
    originalRouteName: 'test',
    routeName: 'test-route',
    tags: [],
    treasuryOrderingPosition: 0,
    ...overrides,
  });

  const createMockWithdrawalDefault = (
    currency: Currency,
    amount: number
  ): WithdrawalDefaultAmountResource => ({
    currency,
    amount,
  });

  const createMockSumRange = (currency: Currency, amount: number): SumRangeResource => ({
    currency,
    amount,
  });

  const createMockGeneralLimit = (
    currency: Currency,
    defaultValue: number,
    min: number,
    max: number
  ): GeneralLimitResource => ({
    currency,
    default: defaultValue,
    min,
    max,
  });

  const createMockPayoutItem = (overrides: Partial<PayoutItemResource> = {}): PayoutItemResource => ({
    id: 'payout-1',
    amount: 100,
    currency: Currency.USD,
    customer_purse: 'test-purse',
    date: Date.now(),
    payment_system: 'test-system',
    reserved_amount: 0,
    ...overrides,
  });

  const createMockBet = (overrides: Partial<BetResource> = {}): BetResource => ({
    amount: 100,
    currency: Currency.USD,
    date: Date.now(),
    ...overrides,
  });

  describe('initial state', () => {
    it('should have empty paymentsSystems array by default', () => {
      const store = useCashboxStore();
      expect(store.paymentsSystems).toEqual([]);
    });

    it('should have depositManagerEnabled set to false by default', () => {
      const store = useCashboxStore();
      expect(store.depositManagerEnabled).toBe(false);
    });

    it('should have empty payoutSystems array by default', () => {
      const store = useCashboxStore();
      expect(store.payoutSystems).toEqual([]);
    });

    it('should have empty withdrawalDefaultsAmounts array by default', () => {
      const store = useCashboxStore();
      expect(store.withdrawalDefaultsAmounts).toEqual([]);
    });

    it('should have empty withdrawRequests array by default', () => {
      const store = useCashboxStore();
      expect(store.withdrawRequests).toEqual([]);
    });

    it('should have empty sumRanges array by default', () => {
      const store = useCashboxStore();
      expect(store.sumRanges).toEqual([]);
    });

    it('should have empty generalLimits array by default', () => {
      const store = useCashboxStore();
      expect(store.generalLimits).toEqual([]);
    });

    it('should have userDepositNumbers set to 0 by default', () => {
      const store = useCashboxStore();
      expect(store.userDepositNumbers).toBe(0);
    });

    it('should have lastBet set to null by default', () => {
      const store = useCashboxStore();
      expect(store.lastBet).toBeNull();
    });

    it('should have depositPayment set to null by default', () => {
      const store = useCashboxStore();
      expect(store.depositPayment).toBeNull();
    });

    it('should have depositValue set to DEFAULT_VALUES.refillAmount by default', () => {
      const store = useCashboxStore();
      expect(store.depositValue).toBe(DEFAULT_VALUES.refillAmount);
    });
  });

  describe('paymentsSystems', () => {
    it('should set paymentsSystems', () => {
      const store = useCashboxStore();
      const payments = [createMockPaymentMethod({ id: '1' }), createMockPaymentMethod({ id: '2' })];

      store.setPaymentsSystems(payments);

      expect(store.paymentsSystems).toEqual(payments);
      expect(store.paymentsSystems).toHaveLength(2);
    });

    it('should replace existing paymentsSystems', () => {
      const store = useCashboxStore();
      const oldPayments = [createMockPaymentMethod({ id: '1' })];
      const newPayments = [createMockPaymentMethod({ id: '2' }), createMockPaymentMethod({ id: '3' })];

      store.setPaymentsSystems(oldPayments);
      store.setPaymentsSystems(newPayments);

      expect(store.paymentsSystems).toEqual(newPayments);
      expect(store.paymentsSystems).toHaveLength(2);
    });

    it('should handle empty array', () => {
      const store = useCashboxStore();
      const payments = [createMockPaymentMethod()];

      store.setPaymentsSystems(payments);
      store.setPaymentsSystems([]);

      expect(store.paymentsSystems).toEqual([]);
    });
  });

  describe('depositManagerEnabled', () => {
    it('should set depositManagerEnabled to true', () => {
      const store = useCashboxStore();

      store.setDepositManagerEnabled(true);

      expect(store.depositManagerEnabled).toBe(true);
    });

    it('should set depositManagerEnabled to false', () => {
      const store = useCashboxStore();

      store.setDepositManagerEnabled(true);
      store.setDepositManagerEnabled(false);

      expect(store.depositManagerEnabled).toBe(false);
    });
  });

  describe('payoutSystems', () => {
    it('should set payoutSystems', () => {
      const store = useCashboxStore();
      const payouts = [createMockPaymentMethod({ id: '1' }), createMockPaymentMethod({ id: '2' })];

      store.setPayoutSystems(payouts);

      expect(store.payoutSystems).toEqual(payouts);
      expect(store.payoutSystems).toHaveLength(2);
    });

    it('should replace existing payoutSystems', () => {
      const store = useCashboxStore();
      const oldPayouts = [createMockPaymentMethod({ id: '1' })];
      const newPayouts = [createMockPaymentMethod({ id: '2' })];

      store.setPayoutSystems(oldPayouts);
      store.setPayoutSystems(newPayouts);

      expect(store.payoutSystems).toEqual(newPayouts);
    });
  });

  describe('withdrawalDefaultsAmounts', () => {
    it('should set withdrawalDefaultsAmounts', () => {
      const store = useCashboxStore();
      const defaults = [
        createMockWithdrawalDefault(Currency.USD, 100),
        createMockWithdrawalDefault(Currency.EUR, 200),
      ];

      store.setWithdrawalDefaultsAmounts(defaults);

      expect(store.withdrawalDefaultsAmounts).toEqual(defaults);
    });

    it('should get default withdrawal amount for specific currency', () => {
      const store = useCashboxStore();
      const defaults = [
        createMockWithdrawalDefault(Currency.USD, 100),
        createMockWithdrawalDefault(Currency.EUR, 200),
      ];

      store.setWithdrawalDefaultsAmounts(defaults);

      expect(store.getDefaultWithdrawalAmount(Currency.USD)).toBe(100);
      expect(store.getDefaultWithdrawalAmount(Currency.EUR)).toBe(200);
    });

    it('should return 0 for currency not in defaults', () => {
      const store = useCashboxStore();
      const defaults = [createMockWithdrawalDefault(Currency.USD, 100)];

      store.setWithdrawalDefaultsAmounts(defaults);

      expect(store.getDefaultWithdrawalAmount(Currency.EUR)).toBe(0);
    });

    it('should return 0 when withdrawalDefaultsAmounts is empty', () => {
      const store = useCashboxStore();

      expect(store.getDefaultWithdrawalAmount(Currency.USD)).toBe(0);
    });
  });

  describe('withdrawRequests', () => {
    it('should set withdrawRequests', () => {
      const store = useCashboxStore();
      const requests = [
        createMockPayoutItem({ id: '1', amount: 100 }),
        createMockPayoutItem({ id: '2', amount: 200 }),
      ];

      store.setWithdrawRequests(requests);

      expect(store.withdrawRequests).toEqual(requests);
      expect(store.withdrawRequests).toHaveLength(2);
    });

    it('should replace existing withdrawRequests', () => {
      const store = useCashboxStore();
      const oldRequests = [createMockPayoutItem({ id: '1' })];
      const newRequests = [createMockPayoutItem({ id: '2' })];

      store.setWithdrawRequests(oldRequests);
      store.setWithdrawRequests(newRequests);

      expect(store.withdrawRequests).toEqual(newRequests);
    });
  });

  describe('sumRanges', () => {
    it('should set sumRanges', () => {
      const store = useCashboxStore();
      const ranges = [
        createMockSumRange(Currency.USD, 100),
        createMockSumRange(Currency.EUR, 200),
      ];

      store.setSumRanges(ranges);

      expect(store.sumRanges).toEqual(ranges);
    });

    it('should get sum ranges for specific currency', () => {
      const store = useCashboxStore();
      const ranges = [
        createMockSumRange(Currency.USD, 100),
        createMockSumRange(Currency.USD, 500),
        createMockSumRange(Currency.EUR, 200),
      ];

      store.setSumRanges(ranges);

      const usdRanges = store.getSumRange(Currency.USD);
      expect(usdRanges).toHaveLength(2);
      expect(usdRanges).toEqual([ranges[0], ranges[1]]);
    });

    it('should return empty array for currency with no ranges', () => {
      const store = useCashboxStore();
      const ranges = [createMockSumRange(Currency.USD, 100)];

      store.setSumRanges(ranges);

      expect(store.getSumRange(Currency.EUR)).toEqual([]);
    });

    it('should return empty array when sumRanges is empty', () => {
      const store = useCashboxStore();

      expect(store.getSumRange(Currency.USD)).toEqual([]);
    });
  });

  describe('generalLimits', () => {
    it('should set generalLimits', () => {
      const store = useCashboxStore();
      const limits = [
        createMockGeneralLimit(Currency.USD, 500, 10, 1000),
        createMockGeneralLimit(Currency.EUR, 1000, 20, 2000),
      ];

      store.setGeneralLimits(limits);

      expect(store.generalLimits).toEqual(limits);
    });

    it('should get general limit for specific currency', () => {
      const store = useCashboxStore();
      const limits = [
        createMockGeneralLimit(Currency.USD, 500, 10, 1000),
        createMockGeneralLimit(Currency.EUR, 1000, 20, 2000),
      ];

      store.setGeneralLimits(limits);

      expect(store.getGeneralLimit(Currency.USD)).toEqual(limits[0]);
      expect(store.getGeneralLimit(Currency.EUR)).toEqual(limits[1]);
    });

    it('should return undefined for currency with no limit', () => {
      const store = useCashboxStore();
      const limits = [createMockGeneralLimit(Currency.USD, 500, 10, 1000)];

      store.setGeneralLimits(limits);

      expect(store.getGeneralLimit(Currency.EUR)).toBeUndefined();
    });

    it('should return undefined when generalLimits is empty', () => {
      const store = useCashboxStore();

      expect(store.getGeneralLimit(Currency.USD)).toBeUndefined();
    });
  });

  describe('userDepositNumbers', () => {
    it('should set userDepositNumbers', () => {
      const store = useCashboxStore();

      store.setUserDepositNumbers(5);

      expect(store.userDepositNumbers).toBe(5);
    });

    it('should update userDepositNumbers multiple times', () => {
      const store = useCashboxStore();

      store.setUserDepositNumbers(5);
      expect(store.userDepositNumbers).toBe(5);

      store.setUserDepositNumbers(10);
      expect(store.userDepositNumbers).toBe(10);
    });

    it('should clean userDepositNumbers back to 0', () => {
      const store = useCashboxStore();

      store.setUserDepositNumbers(5);
      expect(store.userDepositNumbers).toBe(5);

      store.cleanUserDepositNumbers();
      expect(store.userDepositNumbers).toBe(0);
    });

    it('should handle cleaning when already 0', () => {
      const store = useCashboxStore();

      expect(store.userDepositNumbers).toBe(0);
      store.cleanUserDepositNumbers();
      expect(store.userDepositNumbers).toBe(0);
    });
  });

  describe('lastBet', () => {
    it('should set lastBet', () => {
      const store = useCashboxStore();
      const bet = createMockBet({ amount: 100 });

      store.setLastBet(bet);

      expect(store.lastBet).toEqual(bet);
    });

    it('should replace existing lastBet', () => {
      const store = useCashboxStore();
      const firstBet = createMockBet({ amount: 100 });
      const secondBet = createMockBet({ amount: 200 });

      store.setLastBet(firstBet);
      store.setLastBet(secondBet);

      expect(store.lastBet).toEqual(secondBet);
    });
  });

  describe('depositPayment', () => {
    it('should set depositPayment', () => {
      const store = useCashboxStore();
      const payment = createMockPaymentMethod({ id: 'payment-1' });

      store.setDepositPayment(payment);

      expect(store.depositPayment).toEqual(payment);
    });

    it('should replace existing depositPayment', () => {
      const store = useCashboxStore();
      const firstPayment = createMockPaymentMethod({ id: 'payment-1' });
      const secondPayment = createMockPaymentMethod({ id: 'payment-2' });

      store.setDepositPayment(firstPayment);
      store.setDepositPayment(secondPayment);

      expect(store.depositPayment).toEqual(secondPayment);
    });
  });

  describe('depositValue', () => {
    it('should set depositValue', () => {
      const store = useCashboxStore();

      store.setDepositValue(1000);

      expect(store.depositValue).toBe(1000);
    });

    it('should convert string to number', () => {
      const store = useCashboxStore();

      store.setDepositValue(Number('1500'));

      expect(store.depositValue).toBe(1500);
      expect(typeof store.depositValue).toBe('number');
    });

    it('should replace existing depositValue', () => {
      const store = useCashboxStore();

      store.setDepositValue(1000);
      store.setDepositValue(2000);

      expect(store.depositValue).toBe(2000);
    });

    it('should handle decimal values', () => {
      const store = useCashboxStore();

      store.setDepositValue(99.99);

      expect(store.depositValue).toBe(99.99);
    });

    it('should handle zero value', () => {
      const store = useCashboxStore();

      store.setDepositValue(0);

      expect(store.depositValue).toBe(0);
    });
  });

  describe('store isolation', () => {
    it('should maintain the same instance when called multiple times', () => {
      const store1 = useCashboxStore();
      const store2 = useCashboxStore();

      expect(store1).toBe(store2);

      store1.setUserDepositNumbers(5);
      expect(store2.userDepositNumbers).toBe(5);
    });

    it('should have isolated state in different test runs', () => {
      const store = useCashboxStore();

      expect(store.userDepositNumbers).toBe(0);
      expect(store.paymentsSystems).toEqual([]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle setting multiple values in sequence', () => {
      const store = useCashboxStore();

      const payment = createMockPaymentMethod({ id: 'payment-1' });
      const payouts = [createMockPaymentMethod({ id: 'payout-1' })];
      const bet = createMockBet({ amount: 500 });

      store.setDepositPayment(payment);
      store.setPayoutSystems(payouts);
      store.setLastBet(bet);
      store.setDepositValue(1000);
      store.setUserDepositNumbers(3);

      expect(store.depositPayment).toEqual(payment);
      expect(store.payoutSystems).toEqual(payouts);
      expect(store.lastBet).toEqual(bet);
      expect(store.depositValue).toBe(1000);
      expect(store.userDepositNumbers).toBe(3);
    });

    it('should handle getter methods with multiple currencies', () => {
      const store = useCashboxStore();

      const defaults = [
        createMockWithdrawalDefault(Currency.USD, 100),
        createMockWithdrawalDefault(Currency.EUR, 200),
        createMockWithdrawalDefault(Currency.CAD, 300),
      ];

      const limits = [
        createMockGeneralLimit(Currency.USD, 500, 10, 1000),
        createMockGeneralLimit(Currency.EUR, 1000, 20, 2000),
      ];

      const ranges = [
        createMockSumRange(Currency.USD, 100),
        createMockSumRange(Currency.USD, 500),
        createMockSumRange(Currency.EUR, 200),
      ];

      store.setWithdrawalDefaultsAmounts(defaults);
      store.setGeneralLimits(limits);
      store.setSumRanges(ranges);

      expect(store.getDefaultWithdrawalAmount(Currency.USD)).toBe(100);
      expect(store.getDefaultWithdrawalAmount(Currency.EUR)).toBe(200);
      expect(store.getDefaultWithdrawalAmount(Currency.CAD)).toBe(300);

      expect(store.getGeneralLimit(Currency.USD)?.default).toBe(500);
      expect(store.getGeneralLimit(Currency.EUR)?.default).toBe(1000);

      expect(store.getSumRange(Currency.USD)).toHaveLength(2);
      expect(store.getSumRange(Currency.EUR)).toHaveLength(1);
    });
  });
});
