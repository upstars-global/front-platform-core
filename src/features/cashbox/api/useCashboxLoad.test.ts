import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useCashboxLoad } from './useCashboxLoad';
import type { PayoutItemResource, PaymentMethodResource, LoadPaymentMethodsResource } from '../../../entities/cashbox';
import { cashboxAPI, TransactionType } from '../../../entities/cashbox';
import { useCashboxStore } from '../store';

vi.mock('./../../../entities/user', () => ({
  useUserProfileStore: vi.fn(() => ({
    userInfo: {
      verification: true,
    },
    getCountryCode: vi.fn(() => 'GB'),
  })),
}));

vi.mock('../../../entities/cashbox', () => ({
  cashboxAPI: {
    loadMethodsIn: vi.fn(),
    loadMethodsOut: vi.fn(),
    loadWithdrawalDefaultAmounts: vi.fn(),
    loadWithdrawalRequests: vi.fn(),
    cancelWithdrawRequest: vi.fn(),
    loadSumRange: vi.fn(),
    loadGeneralLimit: vi.fn(),
    loadUserTransactionNumbers: vi.fn(),
    loadLastBet: vi.fn(),
  },
  TransactionType: {
    PAYOUT: 'PAYOUT',
  },
}));

vi.mock('../store', () => {
  const store = {
    setDepositManagerEnabled: vi.fn(),
    setPaymentsSystems: vi.fn(),
    setPayoutSystems: vi.fn(),
    setWithdrawalDefaultsAmounts: vi.fn(),
    setWithdrawRequests: vi.fn(),
    setSumRanges: vi.fn(),
    setGeneralLimits: vi.fn(),
    setUserDepositNumbers: vi.fn(),
    setLastBet: vi.fn(),
  };
  return {
    useCashboxStore: vi.fn(() => store),
  };
});

vi.mock('pinia', async () => {
  const actual = await vi.importActual<typeof import('pinia')>('pinia');
  return {
    ...actual,
    storeToRefs: vi.fn(() => ({
      withdrawRequests: ref([]),
    })),
    defineStore: vi.fn(),
  };
});

const reloadTransactionsHistoryByTypeSpy = vi.fn();

vi.mock('../composables', () => ({
  useTransactions: () => ({
    reloadTransactionsHistoryByType: reloadTransactionsHistoryByTypeSpy,
  }),
}));

const mockedCashboxAPI = vi.mocked(cashboxAPI, true);
const mockedUseCashboxStore = vi.mocked(useCashboxStore);

describe('useCashboxLoad', () => {
  const {
    loadPaymentsData,
    loadPayoutsData,
    loadWithdrawData,
    loadWithdrawRequests,
    loadSumRanges,
    loadGeneralLimits,
    loadUserDepositNumbers,
    loadLastBet,
  } = useCashboxLoad();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads payment methods and sets them in the store', async () => {
    const data: PaymentMethodResource[] = [{ id: 'method1' } as PaymentMethodResource];
    mockedCashboxAPI.loadMethodsIn.mockResolvedValue({
      data,
      meta: { depositManagerEnabled: true },
    });

    await loadPaymentsData();

    expect(mockedCashboxAPI.loadMethodsIn).toHaveBeenCalled();
    expect(mockedUseCashboxStore().setDepositManagerEnabled).toHaveBeenCalledWith(true);
    expect(mockedUseCashboxStore().setPaymentsSystems).toHaveBeenCalledWith(expect.any(Array));
  });

  it('loads payout methods and sets them in the store', async () => {
    const mockData: LoadPaymentMethodsResource = { data: [ { id: 'pm1' } as PaymentMethodResource, ], meta: { depositManagerEnabled: true }, };
    mockedCashboxAPI.loadMethodsOut.mockResolvedValue(mockData);

    await loadPayoutsData();

    expect(mockedUseCashboxStore().setPayoutSystems).toHaveBeenCalledWith([
      { id: 'pm1' },
    ]);
  });

  it('loads withdraw data (payouts + default amounts)', async () => {
    const mockData: LoadPaymentMethodsResource = { data: [], meta: { depositManagerEnabled: true }, };
    mockedCashboxAPI.loadMethodsOut.mockResolvedValue(mockData);
    mockedCashboxAPI.loadWithdrawalDefaultAmounts.mockResolvedValue([]);

    await loadWithdrawData();

    expect(mockedCashboxAPI.loadMethodsOut).toHaveBeenCalled();
    expect(mockedCashboxAPI.loadWithdrawalDefaultAmounts).toHaveBeenCalled();
  });

  it('loads and reverses withdraw requests', async () => {
    const data: PayoutItemResource[] = [
      { id: '1' },
      { id: '2' },
    ] as PayoutItemResource[];

    mockedCashboxAPI.loadWithdrawalRequests.mockResolvedValue(data);

    await loadWithdrawRequests();

    expect(mockedUseCashboxStore().setWithdrawRequests).toHaveBeenCalledWith(data.reverse());
  });

  it('adds a withdraw request and reloads transaction history', () => {
    const { addWithdrawRequests } = useCashboxLoad(); // make sure to use fresh instance if needed

    const request: PayoutItemResource = {
      id: 'new',
      date: 213,
      amount: 213,
      currency: 'qqq',
      customer_purse: '23',
      payment_system: '123',
      reserved_amount: 12,
    };

    addWithdrawRequests(request);

    expect(mockedUseCashboxStore().setWithdrawRequests).toHaveBeenCalledWith([request]);
    expect(reloadTransactionsHistoryByTypeSpy).toHaveBeenCalledWith(TransactionType.PAYOUT); // ✅ fixed
  });

  it('loads sum ranges only if data is present', async () => {
    const data = [{ amount: 100, currency: 'USD' }];
    mockedCashboxAPI.loadSumRange.mockResolvedValue(data);

    await loadSumRanges();

    expect(mockedUseCashboxStore().setSumRanges).toHaveBeenCalledWith(data);
  });

  it('loads general limits only if data is present', async () => {
    const data = [{ min: 10, max: 100, default: 50, currency: 'USD' }];
    mockedCashboxAPI.loadGeneralLimit.mockResolvedValue(data);

    await loadGeneralLimits();

    expect(mockedUseCashboxStore().setGeneralLimits).toHaveBeenCalledWith(data);
  });

  it('loads and sets user deposit numbers', async () => {
    mockedCashboxAPI.loadUserTransactionNumbers.mockResolvedValue({ responseId: 'id-1', data: { depositNumbers: 7 }, error: null});

    const result = await loadUserDepositNumbers();

    expect(mockedUseCashboxStore().setUserDepositNumbers).toHaveBeenCalledWith(7);
    expect(result).toBe(7);
  });

  it('loads and sets last bet', async () => {
    const bet = { amount: 999, currency: 'USD', date: Date.now() };
    mockedCashboxAPI.loadLastBet.mockResolvedValue(bet);

    await loadLastBet();

    expect(mockedUseCashboxStore().setLastBet).toHaveBeenCalledWith(bet);
  });
});
