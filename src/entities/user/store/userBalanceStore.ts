import type { IUserBalanceResource, IUserWinbackDataResource } from '../api';
import { Currency } from '../../../shared/api';
import { DEFAULT_CURRENCY } from '../../../shared/config';

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserBalanceStore = defineStore('userBalance', () => {
  function getBaseBalanceData(): IUserBalanceResource {
    return {
      user_id: '',
      balance: 0, // user's main balance with coins
      currency: DEFAULT_CURRENCY as Currency,
      is_active_bonus: false, // whether bonus funds are available to the user
      bonus: 0, // bonus user balance with coins
      wagering: 0, // wagering amount with coins
      totalWagering: 0,
      bonuses: {
        // bonus balances like: sport, freeBet...
        sport: null,
        freeBet: null,
      },
      bonusesWagering: {
        casino: null,
        sport: null,
      },
    };
  }

  const balanceData = ref<IUserBalanceResource>(getBaseBalanceData());

  function setUserBalance(data: IUserBalanceResource) {
    balanceData.value = {
      ...balanceData.value,
      ...data,
    };
  }

  function getBaseWinbackData() {
    return {
      winback: 0,
      multiplier: 1,
      winbackStatus: false,
    };
  }

  const winbackData = ref<IUserWinbackDataResource>(getBaseWinbackData());

  const setWinbackData = (data: IUserWinbackDataResource) => {
    winbackData.value = data;
  };

  const userCurrency = computed<Currency>(() => {
    return balanceData.value.currency;
  });

  function setUserCurrency(currency: Currency) {
    balanceData.value.currency = currency;
  }

  function cleanUserBalances() {
    balanceData.value = getBaseBalanceData();
    winbackData.value = getBaseWinbackData();
  }

  return {
    balanceData,
    getBaseBalanceData,
    setUserBalance,
    winbackData,
    getBaseWinbackData,
    setWinbackData,
    userCurrency,
    setUserCurrency,
    cleanUserBalances,
  };
});
