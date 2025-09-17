import { jsonApi, publicApi, publicApiV1, JsonHttpServerError } from '../../../shared/libs/http';
import { log } from '../../../shared/helpers/log';
import type {
  BetResource,
  CurrencyRatesResource,
  GeneralLimitResource,
  InitDepositResource,
  InitPayoutResource,
  LoadPaymentMethodsResource,
  PayoutItemResource,
  PayoutLimitResource,
  SumRangeResource,
  TransactionHistoryItemResource,
  WithdrawalDefaultAmountResource,
} from './resources';

import type { InitPaymentDTO, LoadTransactionHistoryDTO, PayoutFlow } from './dto';

export const cashboxAPI = {
  async loadMethodsIn(): Promise<LoadPaymentMethodsResource> {
    try {
      return await publicApi<LoadPaymentMethodsResource>('/treasury/methods-in', { method: 'GET' });
    } catch (error) {
      log.error('CASHBOX_LOAD_METHODS_IN', error);

      return {
        data: [],
        meta: {
          depositManagerEnabled: false,
        },
      };
    }
  },
  async loadMethodsOut(): Promise<LoadPaymentMethodsResource> {
    try {
      return await publicApi<LoadPaymentMethodsResource>('/treasury/methods-out', { method: 'GET' });
    } catch (error) {
      log.error('CASHBOX_LOAD_METHODS_OUT', error);

      return {
        data: [],
        meta: {
          depositManagerEnabled: false,
        },
      };
    }
  },
  async loadWithdrawalDefaultAmounts() {
    try {
      const response = await publicApiV1<WithdrawalDefaultAmountResource[]>({
        url: '/treasury/withdrawal-defaults/list',
        type: (securedType) => `Treasury.V1.${securedType}.WithdrawalDefaults.List`,
      });
      return response.data || [];
    } catch (error) {
      log.error('CASHBOX_LOAD_WITHDRAWAL_DEFAULTS_AMOUNTS', error);
    }
    return [];
  },
  async initDeposit(data: InitPaymentDTO) {
    try {
      return await publicApi<InitDepositResource>('/treasury/deposit/init', { data });
    } catch (error: unknown) {
      log.error('CASHBOX_INIT_DEPOSIT', error);

      if (error instanceof JsonHttpServerError) {
        return error.error.data as InitDepositResource;
      }
      throw error;
    }
  },
  async initPayout(data: InitPaymentDTO) {
    try {
      return await publicApi<InitPayoutResource>('/treasury/payout/init', { data });
    } catch (error: unknown) {
      log.error('CASHBOX_INIT_PAYOUT', error);

      if (error instanceof JsonHttpServerError) {
        return error.error.data as InitPayoutResource;
      }
      throw error;
    }
  },
  async loadWithdrawalLimit(userId: string) {
    try {
      const { data } = await publicApiV1<PayoutLimitResource>({
        url: '/treasury/user-payout-init-limits',
        secured: true,
        type: (securedType) => `Treasury.V1.${securedType}.GetUserPayoutInitLimits`,
        data: { userId },
      });
      return data;
    } catch (error: unknown) {
      log.error('CASHBOX_LOAD_WITHDRAW_LIMIT', error);
      throw error;
    }
  },
  async loadWithdrawalRequests() {
    try {
      const { data } = await jsonApi<{
        data: PayoutItemResource[];
      }>('/treasury/user/new-payouts', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('CASHBOX_LOAD_WITHDRAW_REQUESTS', error);
    }
    return [];
  },
  async cancelWithdrawRequest(transaction_id: string) {
    try {
      const response = await jsonApi<{
        status: boolean;
      }>('/treasury/user-payout/cancel', {
        data: { transaction_id },
      });
      return response.status;
    } catch (error) {
      log.error('CASHBOX_REMOVE_WITHDRAW_REQUEST', error);
    }
    return false;
  },
  async loadSumRange() {
    try {
      const { data } = await jsonApi<{
        data: SumRangeResource[];
      }>('/treasury/sum-range', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('CASHBOX_LOAD_SUM_RANGE', error);
    }
    return [];
  },
  async loadGeneralLimit() {
    try {
      const { data } = await jsonApi<{
        data: GeneralLimitResource[];
      }>('/treasury/general-limit', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('CASHBOX_LOAD_GENERAL_LIMIT', error);
    }
    return [];
  },
  async loadLastBet() {
    try {
      const { data } = await jsonApi<{
        data: BetResource;
      }>('/treasury/user/last-bet', { method: 'GET' });
      return data;
    } catch (error) {
      log.error('CASHBOX_LOAD_LAST_BET', error);
      throw error;
    }
  },
  async loadUserPayoutFlow() {
    try {
      const { data } = await publicApiV1<{
        flow: PayoutFlow;
      }>({
        url: '/treasury/user-payout-flow',
        type: (securedType) => `Treasury.V1.${securedType}.GetUserPayoutFlow`,
        secured: true,
      });
      return data?.flow;
    } catch (error) {
      log.error('CASHBOX_LOAD_USER_PAYOUT_FLOW', error);
      throw error;
    }
  },
  async loadTreasuryHistory(data: LoadTransactionHistoryDTO) {
    try {
      return await publicApiV1<TransactionHistoryItemResource[]>({
        url: '/treasury/transaction-history',
        type: (securedType) => `Treasury.V1.${securedType}.GetTransactionHistory`,
        secured: true,
        data: {
          pagination: {
            pageNumber: data.page || 1,
            perPage: data.perPage || 10,
          },
          filter: {
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            type: data.type,
          },
        },
      });
    } catch (error) {
      log.error('LOAD_TREASURY_HISTORY', error);
      throw error;
    }
  },
  async loadCurrencyRates() {
    try {
      const response = await publicApiV1<CurrencyRatesResource>({
        url: '/core/currency-rates',
        type: () => 'Api.Core.CurrencyRates',
      });
      return response.data;
    } catch (error) {
      log.error('CASHBOX_LOAD_RATES_DATA', error);
      throw error;
    }
  },

  async loadUserTransactionNumbers() {
    try {
      return await publicApiV1<{ depositNumbers: number }>({
        url: '/treasury/user-transaction-numbers',
        secured: true,
        type: (securedType) => `Treasury.V1.${securedType}.GetUserTransactionNumbers`,
      });
    } catch (error) {
      log.error('CASHBOX_LOAD_USER_TRANSACTION_NUMBER', error);
      throw error;
    }
  },
};
