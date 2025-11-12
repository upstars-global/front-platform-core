import { defineStore } from "pinia";
import { type TransactionHistoryItemResource } from "../../../../entities/cashbox";
import { ref } from "vue";

type HistoryDataItem = {
    data: TransactionHistoryItemResource[];
    page: number;
    total: number;
    pending: boolean;
}

function generateEmptyHistory(): HistoryDataItem {
    return {
        data: [],
        page: 1,
        total: 0,
        pending: false,
    };
}

export const useTransactionsStore = defineStore("useTransactionsStore", () => {
    const depositHistory = ref(generateEmptyHistory());
    const payoutHistory = ref(generateEmptyHistory());

    return {
        depositHistory,
        payoutHistory,
    };
});
