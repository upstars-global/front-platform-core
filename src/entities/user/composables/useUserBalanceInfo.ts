import { useUserBalanceStore } from "../store/userBalanceStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export function useUserBalanceInfo() {
    const { balanceData, winbackData } = storeToRefs(useUserBalanceStore());

    const realBalance = computed<number>(() => {
        return balanceData.value.balance;
    });

    const commonBalance = computed<number>(() => {
        return realBalance.value + commonBonusBalance.value;
    });

    const commonBonusBalance = computed<number>(() => {
        return bonusBalance.value + bettingBonusBalance.value + freeBet.value;
    });

    const bonusBalance = computed<number>(() => {
        return balanceData.value.bonus;
    });

    const bettingBonusBalance = computed<number>(() => {
        return balanceData.value.bonuses?.sport?.sum || 0;
    });

    const freeBet = computed<number>(() => {
        return balanceData.value.bonuses?.freeBet?.sum || 0;
    });

    const userBettingWagering = computed<number>(() => {
        return balanceData.value.bonuses?.sport?.sumWagering || 0;
    });

    const isWinbackOn = computed<boolean>(() => {
        return winbackData.value.winbackStatus && winbackData.value.winback > 0;
    });

    const isWithdrawalBlocked = computed<boolean>(() => {
        return freeBet.value > 0 ||
            userBettingWagering.value > 0 ||
            bettingBonusBalance.value > 0 ||
            bonusBalance.value > 0 ||
            isWinbackOn.value;
    });

    const winback = computed(() => {
        if (isWinbackOn.value) {
            return {
                value: winbackData.value.winback,
                multiplier: winbackData.value.multiplier,
            };
        }
    });

    return {
        commonBalance,
        realBalance,
        commonBonusBalance,
        bonusBalance,
        bettingBonusBalance,
        freeBet,
        userBettingWagering,
        isWithdrawalBlocked,
        winback,
    };
}
