import { cashboxAPI, type LoadTransactionHistoryDTO, TransactionType } from "../../../entities/cashbox";
import { useTransactionsStore } from "../store";

const MAX_TRANSACTIONS_PER_PAGE = 6;

type PaginationConfig = Pick<LoadTransactionHistoryDTO, "page" | "perPage">

type LoadTransactionsHistoryConfig = {
    transactionType: TransactionType;
    paginationConfig?: PaginationConfig;
    shouldResetList?: boolean;
}

export const useTransactions = () => {
    const transactionsStore = useTransactionsStore();

    async function loadTransactionsHistoryByType(params: LoadTransactionsHistoryConfig) {
        const { transactionType, paginationConfig, shouldResetList } = params;
        const history = transactionType === TransactionType.DEPOSIT
            ? transactionsStore.depositHistory
            : transactionsStore.payoutHistory;

        if (history.pending) {
            return;
        }

        history.pending = true;
        const response = await cashboxAPI.loadTreasuryHistory({
            type: transactionType,
            page: paginationConfig?.page || history.page,
            perPage: paginationConfig?.perPage || MAX_TRANSACTIONS_PER_PAGE,
        });
        if (response.data) {
            if (shouldResetList) {
                history.data = response.data;
            } else {
                history.data = [
                    ...history.data,
                    ...response.data,
                ];
            }
            if (response.pagination) {
                history.total = response.pagination.total;
                history.page = response.pagination.pageNumber;
            }
        }
        history.pending = false;
        return history;
    }

    async function loadAllTransactionsHistory() {
        await Promise.all(
            Object.values(TransactionType)
                .map((historyType) => reloadTransactionsHistoryByType(historyType)),
        );
        return {
            depositHistory: transactionsStore.depositHistory,
            payoutHistory: transactionsStore.payoutHistory,
        };
    }

    async function reloadTransactionsHistoryByType(transactionType: TransactionType) {
        await loadTransactionsHistoryByType({
            transactionType,
            paginationConfig: {
                page: 1,
                perPage: MAX_TRANSACTIONS_PER_PAGE,
            },
            shouldResetList: true,
        });
    }

    async function loadNextPageTransactionHistoryByType(transactionType: TransactionType) {
        const history = transactionType === TransactionType.DEPOSIT
            ? transactionsStore.depositHistory
            : transactionsStore.payoutHistory;
        await loadTransactionsHistoryByType({
            transactionType,
            paginationConfig: {
                page: history.page + 1,
                perPage: MAX_TRANSACTIONS_PER_PAGE,
            },
        });
    }

    return {
        reloadTransactionsHistoryByType,
        loadAllTransactionsHistory,
        loadNextPageTransactionHistoryByType,
        MAX_TRANSACTIONS_PER_PAGE,
    };
};
