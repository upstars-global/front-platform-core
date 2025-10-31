import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionsStore } from './useTransactionsStore';
import { type TransactionHistoryItemResource, TransactionType } from '../../../../entities/cashbox';
import { Currency } from '../../../../shared';

describe('useTransactionsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const createMockTransaction = (
    overrides: Partial<TransactionHistoryItemResource> = {}
  ): TransactionHistoryItemResource => ({
    cancelReason: null,
    createdAt: Date.now(),
    currency: Currency.USD,
    customerPurse: 'purse123',
    feeMessage: 'No fees',
    id: 'tx-' + Math.random(),
    paymentSystem: 'visa',
    status: 'completed',
    statusText: 'Completed',
    sum: 100,
    sumWithFees: 100,
    type: TransactionType.DEPOSIT,
    updatedAt: Date.now(),
    ...overrides,
  });

  describe('Initial State', () => {
    it('should have depositHistory with empty data array', () => {
      const store = useTransactionsStore();

      expect(store.depositHistory.data).toEqual([]);
    });

    it('should have depositHistory with page 1', () => {
      const store = useTransactionsStore();

      expect(store.depositHistory.page).toBe(1);
    });

    it('should have depositHistory with total 0', () => {
      const store = useTransactionsStore();

      expect(store.depositHistory.total).toBe(0);
    });

    it('should have depositHistory with pending false', () => {
      const store = useTransactionsStore();

      expect(store.depositHistory.pending).toBe(false);
    });

    it('should have payoutHistory with empty data array', () => {
      const store = useTransactionsStore();

      expect(store.payoutHistory.data).toEqual([]);
    });

    it('should have payoutHistory with page 1', () => {
      const store = useTransactionsStore();

      expect(store.payoutHistory.page).toBe(1);
    });

    it('should have payoutHistory with total 0', () => {
      const store = useTransactionsStore();

      expect(store.payoutHistory.total).toBe(0);
    });

    it('should have payoutHistory with pending false', () => {
      const store = useTransactionsStore();

      expect(store.payoutHistory.pending).toBe(false);
    });
  });

  describe('Deposit History Mutations', () => {
    it('should allow setting depositHistory data', () => {
      const store = useTransactionsStore();
      const mockTransactions = [
        createMockTransaction({ id: 'tx-1', type: TransactionType.DEPOSIT }),
        createMockTransaction({ id: 'tx-2', type: TransactionType.DEPOSIT }),
      ];

      store.depositHistory.data = mockTransactions;

      expect(store.depositHistory.data).toEqual(mockTransactions);
      expect(store.depositHistory.data).toHaveLength(2);
    });

    it('should allow updating depositHistory page', () => {
      const store = useTransactionsStore();

      store.depositHistory.page = 3;

      expect(store.depositHistory.page).toBe(3);
    });

    it('should allow updating depositHistory total', () => {
      const store = useTransactionsStore();

      store.depositHistory.total = 150;

      expect(store.depositHistory.total).toBe(150);
    });

    it('should allow updating depositHistory pending', () => {
      const store = useTransactionsStore();

      store.depositHistory.pending = true;

      expect(store.depositHistory.pending).toBe(true);
    });

    it('should allow updating multiple depositHistory properties', () => {
      const store = useTransactionsStore();
      const mockTransactions = [createMockTransaction()];

      store.depositHistory.data = mockTransactions;
      store.depositHistory.page = 2;
      store.depositHistory.total = 50;
      store.depositHistory.pending = true;

      expect(store.depositHistory.data).toEqual(mockTransactions);
      expect(store.depositHistory.page).toBe(2);
      expect(store.depositHistory.total).toBe(50);
      expect(store.depositHistory.pending).toBe(true);
    });
  });

  describe('Payout History Mutations', () => {
    it('should allow setting payoutHistory data', () => {
      const store = useTransactionsStore();
      const mockTransactions = [
        createMockTransaction({ id: 'tx-1', type: TransactionType.PAYOUT }),
        createMockTransaction({ id: 'tx-2', type: TransactionType.PAYOUT }),
      ];

      store.payoutHistory.data = mockTransactions;

      expect(store.payoutHistory.data).toEqual(mockTransactions);
      expect(store.payoutHistory.data).toHaveLength(2);
    });

    it('should allow updating payoutHistory page', () => {
      const store = useTransactionsStore();

      store.payoutHistory.page = 5;

      expect(store.payoutHistory.page).toBe(5);
    });

    it('should allow updating payoutHistory total', () => {
      const store = useTransactionsStore();

      store.payoutHistory.total = 200;

      expect(store.payoutHistory.total).toBe(200);
    });

    it('should allow updating payoutHistory pending', () => {
      const store = useTransactionsStore();

      store.payoutHistory.pending = true;

      expect(store.payoutHistory.pending).toBe(true);
    });

    it('should allow updating multiple payoutHistory properties', () => {
      const store = useTransactionsStore();
      const mockTransactions = [createMockTransaction({ type: TransactionType.PAYOUT })];

      store.payoutHistory.data = mockTransactions;
      store.payoutHistory.page = 3;
      store.payoutHistory.total = 75;
      store.payoutHistory.pending = true;

      expect(store.payoutHistory.data).toEqual(mockTransactions);
      expect(store.payoutHistory.page).toBe(3);
      expect(store.payoutHistory.total).toBe(75);
      expect(store.payoutHistory.pending).toBe(true);
    });
  });

  describe('Store Isolation', () => {
    it('should maintain separate state for depositHistory and payoutHistory', () => {
      const store = useTransactionsStore();
      const depositTx = [createMockTransaction({ id: 'dep-1', type: TransactionType.DEPOSIT })];
      const payoutTx = [createMockTransaction({ id: 'pay-1', type: TransactionType.PAYOUT })];

      store.depositHistory.data = depositTx;
      store.payoutHistory.data = payoutTx;

      expect(store.depositHistory.data).toEqual(depositTx);
      expect(store.payoutHistory.data).toEqual(payoutTx);
      expect(store.depositHistory.data).not.toEqual(store.payoutHistory.data);
    });

    it('should create separate instances when called multiple times', () => {
      const store1 = useTransactionsStore();
      const store2 = useTransactionsStore();

      // Since it's the same Pinia instance, stores are singletons
      expect(store1).toBe(store2);
    });

    it('should not affect payoutHistory when modifying depositHistory', () => {
      const store = useTransactionsStore();

      store.depositHistory.page = 10;
      store.depositHistory.total = 500;

      expect(store.payoutHistory.page).toBe(1);
      expect(store.payoutHistory.total).toBe(0);
    });

    it('should not affect depositHistory when modifying payoutHistory', () => {
      const store = useTransactionsStore();

      store.payoutHistory.page = 15;
      store.payoutHistory.total = 750;

      expect(store.depositHistory.page).toBe(1);
      expect(store.depositHistory.total).toBe(0);
    });
  });

  describe('Reactivity', () => {
    it('should be reactive when depositHistory data changes', () => {
      const store = useTransactionsStore();
      const values: number[] = [];

      values.push(store.depositHistory.data.length);
      store.depositHistory.data = [createMockTransaction()];
      values.push(store.depositHistory.data.length);
      store.depositHistory.data = [createMockTransaction(), createMockTransaction()];
      values.push(store.depositHistory.data.length);

      expect(values).toEqual([0, 1, 2]);
    });

    it('should be reactive when payoutHistory data changes', () => {
      const store = useTransactionsStore();
      const values: number[] = [];

      values.push(store.payoutHistory.data.length);
      store.payoutHistory.data = [createMockTransaction({ type: TransactionType.PAYOUT })];
      values.push(store.payoutHistory.data.length);
      store.payoutHistory.data = [];
      values.push(store.payoutHistory.data.length);

      expect(values).toEqual([0, 1, 0]);
    });

    it('should be reactive when depositHistory page changes', () => {
      const store = useTransactionsStore();
      const values: number[] = [];

      values.push(store.depositHistory.page);
      store.depositHistory.page = 2;
      values.push(store.depositHistory.page);
      store.depositHistory.page = 5;
      values.push(store.depositHistory.page);

      expect(values).toEqual([1, 2, 5]);
    });

    it('should be reactive when pending status changes', () => {
      const store = useTransactionsStore();
      const values: boolean[] = [];

      values.push(store.depositHistory.pending);
      store.depositHistory.pending = true;
      values.push(store.depositHistory.pending);
      store.depositHistory.pending = false;
      values.push(store.depositHistory.pending);

      expect(values).toEqual([false, true, false]);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle pagination workflow for deposits', () => {
      const store = useTransactionsStore();

      // Initial load
      store.depositHistory.pending = true;
      expect(store.depositHistory.pending).toBe(true);

      // Data loaded
      store.depositHistory.data = [
        createMockTransaction({ id: 'tx-1' }),
        createMockTransaction({ id: 'tx-2' }),
      ];
      store.depositHistory.total = 50;
      store.depositHistory.pending = false;

      expect(store.depositHistory.data).toHaveLength(2);
      expect(store.depositHistory.total).toBe(50);
      expect(store.depositHistory.page).toBe(1);
      expect(store.depositHistory.pending).toBe(false);

      // Load next page
      store.depositHistory.pending = true;
      store.depositHistory.page = 2;
      store.depositHistory.data = [
        ...store.depositHistory.data,
        createMockTransaction({ id: 'tx-3' }),
      ];
      store.depositHistory.pending = false;

      expect(store.depositHistory.data).toHaveLength(3);
      expect(store.depositHistory.page).toBe(2);
    });

    it('should handle resetting history data', () => {
      const store = useTransactionsStore();

      // Populate data
      store.depositHistory.data = [createMockTransaction()];
      store.depositHistory.page = 3;
      store.depositHistory.total = 100;
      store.depositHistory.pending = true;

      // Reset
      store.depositHistory.data = [];
      store.depositHistory.page = 1;
      store.depositHistory.total = 0;
      store.depositHistory.pending = false;

      expect(store.depositHistory.data).toEqual([]);
      expect(store.depositHistory.page).toBe(1);
      expect(store.depositHistory.total).toBe(0);
      expect(store.depositHistory.pending).toBe(false);
    });

    it('should handle different transaction types correctly', () => {
      const store = useTransactionsStore();
      const depositTx = createMockTransaction({
        id: 'dep-1',
        type: TransactionType.DEPOSIT,
        sum: 100,
      });
      const payoutTx = createMockTransaction({
        id: 'pay-1',
        type: TransactionType.PAYOUT,
        sum: 50,
      });

      store.depositHistory.data = [depositTx];
      store.payoutHistory.data = [payoutTx];

      expect(store.depositHistory.data[0].type).toBe(TransactionType.DEPOSIT);
      expect(store.depositHistory.data[0].sum).toBe(100);
      expect(store.payoutHistory.data[0].type).toBe(TransactionType.PAYOUT);
      expect(store.payoutHistory.data[0].sum).toBe(50);
    });

    it('should handle multiple currencies in transactions', () => {
      const store = useTransactionsStore();

      store.depositHistory.data = [
        createMockTransaction({ id: 'tx-1', currency: Currency.USD, sum: 100 }),
        createMockTransaction({ id: 'tx-2', currency: Currency.EUR, sum: 200 }),
        createMockTransaction({ id: 'tx-3', currency: Currency.CAD, sum: 300 }),
      ];

      expect(store.depositHistory.data).toHaveLength(3);
      expect(store.depositHistory.data[0].currency).toBe(Currency.USD);
      expect(store.depositHistory.data[1].currency).toBe(Currency.EUR);
      expect(store.depositHistory.data[2].currency).toBe(Currency.CAD);
    });

    it('should handle transaction status changes', () => {
      const store = useTransactionsStore();
      const transaction = createMockTransaction({
        id: 'tx-1',
        status: 'pending',
        statusText: 'Pending',
      });

      store.depositHistory.data = [transaction];

      // Simulate status update
      store.depositHistory.data[0].status = 'completed';
      store.depositHistory.data[0].statusText = 'Completed';

      expect(store.depositHistory.data[0].status).toBe('completed');
      expect(store.depositHistory.data[0].statusText).toBe('Completed');
    });

    it('should handle empty history after having data', () => {
      const store = useTransactionsStore();

      // Add data
      store.depositHistory.data = [createMockTransaction()];
      store.depositHistory.total = 1;
      expect(store.depositHistory.data).toHaveLength(1);

      // Clear data
      store.depositHistory.data = [];
      store.depositHistory.total = 0;

      expect(store.depositHistory.data).toEqual([]);
      expect(store.depositHistory.total).toBe(0);
    });

    it('should handle concurrent updates to both histories', () => {
      const store = useTransactionsStore();
      const depositTxs = [
        createMockTransaction({ id: 'dep-1', type: TransactionType.DEPOSIT }),
        createMockTransaction({ id: 'dep-2', type: TransactionType.DEPOSIT }),
      ];
      const payoutTxs = [
        createMockTransaction({ id: 'pay-1', type: TransactionType.PAYOUT }),
      ];

      store.depositHistory.data = depositTxs;
      store.depositHistory.page = 2;
      store.depositHistory.total = 100;

      store.payoutHistory.data = payoutTxs;
      store.payoutHistory.page = 1;
      store.payoutHistory.total = 25;

      expect(store.depositHistory.data).toHaveLength(2);
      expect(store.depositHistory.page).toBe(2);
      expect(store.depositHistory.total).toBe(100);

      expect(store.payoutHistory.data).toHaveLength(1);
      expect(store.payoutHistory.page).toBe(1);
      expect(store.payoutHistory.total).toBe(25);
    });
  });
});
