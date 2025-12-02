import { cashboxAPI, TransactionType, type PayoutItemResource } from '../../../entities/cashbox';
import { filterPayments } from '../helpers';
import { useCashboxStore } from '../store';
import { promiseMemo } from '../../../shared';
import { useTransactions } from '../composables';
import { storeToRefs, type Pinia } from 'pinia';

export function useCashboxLoad(pinia?: Pinia) {
  const cashboxStore = useCashboxStore(pinia);
  const { withdrawRequests } = storeToRefs(cashboxStore);

  const { reloadTransactionsHistoryByType } = useTransactions();

  async function loadPaymentsData() {
    const { data, meta } = await cashboxAPI.loadMethodsIn();

    cashboxStore.setDepositManagerEnabled(meta.depositManagerEnabled);
    cashboxStore.setPaymentsSystems(filterPayments(data));
  }

  async function loadPayoutsData() {
    const { data } = await cashboxAPI.loadMethodsOut();

    cashboxStore.setPayoutSystems(data);
  }

  const loadWithdrawalDefaultAmounts = promiseMemo(
    async () => {
      const data = await cashboxAPI.loadWithdrawalDefaultAmounts();

      cashboxStore.setWithdrawalDefaultsAmounts(data);
    },
    {
      key: 'loadWithdrawalDefaultAmounts',
    },
  );

  function loadWithdrawData() {
    return Promise.all([loadPayoutsData(), loadWithdrawalDefaultAmounts()]);
  }

  async function loadWithdrawRequests() {
    const data = await cashboxAPI.loadWithdrawalRequests();

    cashboxStore.setWithdrawRequests(data.reverse());
  }

  function addWithdrawRequests(data: PayoutItemResource) {
    cashboxStore.setWithdrawRequests([...withdrawRequests.value, data]);

    reloadTransactionsHistoryByType(TransactionType.PAYOUT);
  }

  async function removeWithdrawRequestById(id: string) {
    const status = await cashboxAPI.cancelWithdrawRequest(id);

    if (status) {
      reloadTransactionsHistoryByType(TransactionType.PAYOUT);

      cashboxStore.setWithdrawRequests(
        withdrawRequests.value.filter((item) => {
          return item.id !== id;
        }),
      );
    }
  }

  const loadSumRanges = promiseMemo(
    async () => {
      const data = await cashboxAPI.loadSumRange();

      if (data.length) {
        cashboxStore.setSumRanges(data);
      }
    },
    {
      key: 'loadSumRanges',
    },
  );

  const loadGeneralLimits = promiseMemo(
    async () => {
      const data = await cashboxAPI.loadGeneralLimit();

      if (data.length) {
        cashboxStore.setGeneralLimits(data);
      }
    },
    {
      key: 'loadGeneralLimits',
    },
  );

  const loadUserDepositNumbers = promiseMemo(
    async () => {
      const { data } = await cashboxAPI.loadUserTransactionNumbers();

      const value = data?.depositNumbers || 0;

      cashboxStore.setUserDepositNumbers(value);

      return value;
    },
    {
      key: 'loadUserDepositNumbers',
    },
  );

  async function loadLastBet() {
    cashboxStore.setLastBet(await cashboxAPI.loadLastBet());
  }

  return {
    loadPaymentsData,
    loadPayoutsData,
    loadWithdrawalDefaultAmounts,
    loadWithdrawData,
    addWithdrawRequests,
    loadWithdrawRequests,
    removeWithdrawRequestById,
    loadSumRanges,
    loadGeneralLimits,
    loadUserDepositNumbers,
    loadLastBet,
  };
}
