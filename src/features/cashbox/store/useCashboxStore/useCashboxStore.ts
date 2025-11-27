import { DEFAULT_VALUES } from '../../../../entities/cashbox';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import {
  type BetResource,
  type GeneralLimitResource,
  type PaymentMethodResource,
  type PayoutItemResource,
  type SumRangeResource,
  type WithdrawalDefaultAmountResource,
} from '../../../../entities/cashbox';
import type { Currency } from '../../../../shared';

export const useCashboxStore = defineStore('cashbox', () => {
  const paymentsSystems = ref<PaymentMethodResource[]>([]);

  function setPaymentsSystems(data: PaymentMethodResource[]) {
    paymentsSystems.value = data;
  }

  const depositManagerEnabled = ref<boolean>(false);

  function setDepositManagerEnabled(data: boolean) {
    depositManagerEnabled.value = data;
  }

  const payoutSystems = ref<PaymentMethodResource[]>([]);

  function setPayoutSystems(data: PaymentMethodResource[]) {
    payoutSystems.value = data;
  }

  const withdrawalDefaultsAmounts = ref<WithdrawalDefaultAmountResource[]>([]);

  function setWithdrawalDefaultsAmounts(data: WithdrawalDefaultAmountResource[]) {
    withdrawalDefaultsAmounts.value = data;
  }

  function getDefaultWithdrawalAmount(currency: Currency) {
    return withdrawalDefaultsAmounts.value.find((defaultAmount) => defaultAmount.currency === currency)?.amount || 0;
  } 

  const withdrawRequests = ref<PayoutItemResource[]>([]);

  function setWithdrawRequests(data: PayoutItemResource[]) {
    withdrawRequests.value = data;
  }

  const sumRanges = ref<SumRangeResource[]>([]);

  function setSumRanges(data: SumRangeResource[]) {
    sumRanges.value = data;
  }

  function getSumRange(currency: Currency) {
    return sumRanges.value.filter((sumRange) => sumRange.currency === currency);
  }

  const generalLimits = ref<GeneralLimitResource[]>([]);

  function setGeneralLimits(data: GeneralLimitResource[]) {
    generalLimits.value = data;
  }

  function getGeneralLimit(currency: Currency) {
    return generalLimits.value.find((generalLimit) => generalLimit.currency === currency);
  }

  const userDepositNumbers = ref<number>(0);

  function setUserDepositNumbers(data: number) {
    userDepositNumbers.value = data;
  }

  function cleanUserDepositNumbers() {
    userDepositNumbers.value = 0;
  }

  const lastBet = ref<BetResource | null>(null);

  function setLastBet(data: BetResource) {
    lastBet.value = data;
  }

  const depositPayment = ref<PaymentMethodResource | null>(null);

  function setDepositPayment(payment: PaymentMethodResource): void {
    depositPayment.value = payment;
  }

  const depositValue = ref<number>(DEFAULT_VALUES.refillAmount);

  function setDepositValue(value: number): void {
    depositValue.value = Number(value);
  }

  return {
    paymentsSystems,
    setPaymentsSystems,

    payoutSystems,
    setPayoutSystems,

    withdrawalDefaultsAmounts,
    setWithdrawalDefaultsAmounts,
    getDefaultWithdrawalAmount,

    withdrawRequests,
    setWithdrawRequests,

    setDepositPayment,
    depositPayment,

    depositManagerEnabled,
    setDepositManagerEnabled,

    lastBet,
    setLastBet,

    setDepositValue,
    depositValue,

    generalLimits,
    setGeneralLimits,
    getGeneralLimit,
    
    userDepositNumbers,
    setUserDepositNumbers,
    cleanUserDepositNumbers,

    sumRanges,
    setSumRanges,
    getSumRange,
  };
});
