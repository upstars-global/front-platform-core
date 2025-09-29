import { ref } from "vue";
import { defineStore } from "pinia";

export const useBonusAfterDepositStore = defineStore("bonusAfterDeposit", () => {
    const userHasBonusBalanceBeforeDeposit = ref(false);

    function setUserHasBonusBalanceBeforeDeposit(value = true) {
        userHasBonusBalanceBeforeDeposit.value = value;
    }

    return {
        userHasBonusBalanceBeforeDeposit,
        setUserHasBonusBalanceBeforeDeposit,
    };
});
