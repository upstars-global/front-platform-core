import { useUserBalanceStore } from '../store/userBalanceStore';
import { promiseMemo } from '../../../shared/helpers/promise';
import { userAPI, type IUserBalanceResource, type IUserWinbackDataResource } from '../api';
import type { Pinia } from 'pinia';

export function useLoadUserBalance(pinia?: Pinia) {
  const userBalanceStore = useUserBalanceStore(pinia);

  const loadUserBalance = promiseMemo(
    async () => {
      const data = await userAPI.loadUserBalance();

      userBalanceStore.setUserBalance(data);

      return userBalanceStore.balanceData as IUserBalanceResource;
    },
    {
      key: 'loadUserBalance',
    },
  );

  const loadWinbackData = promiseMemo(
    async () => {
      const data = await userAPI.loadWinbackData();

      userBalanceStore.setWinbackData(data || userBalanceStore.getBaseWinbackData());

      return userBalanceStore.winbackData as IUserWinbackDataResource;
    },
    {
      key: 'loadWinbackData',
    },
  );

  async function loadBetsList(cursor: string | null) {
    return await userAPI.loadBetsList({ cursor });
  }

  return {
    loadWinbackData,
    loadUserBalance,
    loadBetsList,
  };
}
