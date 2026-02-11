import { ref, computed } from "vue";
import { useLoadUserBalance, type UserBet } from "../../../entities/user";

export function useBetsHistory() {
    const { loadBetsList } = useLoadUserBalance();

    const betsList = ref<UserBet[]>([]);
    const nextCursor = ref<string | null>(null);
    const isLoading = ref(false);
    const isInitialLoading = ref(true);
    const error = ref<Error | null>(null);

    const hasMore = computed(() => nextCursor.value !== null);
    const isEmpty = computed(() => !isInitialLoading.value && betsList.value.length === 0);

    async function loadInitial() {
        isInitialLoading.value = true;
        error.value = null;

        try {
            const data = await loadBetsList(null);

            if (data) {
                betsList.value = data.bets;
                nextCursor.value = data.nextCursor;
            }
        } catch (e) {
            error.value = e instanceof Error ? e : new Error("Failed to load bets");
        } finally {
            isInitialLoading.value = false;
        }
    }

    async function loadMore() {
        if (!nextCursor.value || isLoading.value) {
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            const data = await loadBetsList(nextCursor.value);

            if (data) {
                betsList.value = [ ...betsList.value, ...data.bets ];
                nextCursor.value = data.nextCursor;
            }
        } catch (e) {
            error.value = e instanceof Error ? e : new Error("Failed to load more bets");
        } finally {
            isLoading.value = false;
        }
    }

    return {
        // State
        betsList,
        isLoading,
        isInitialLoading,
        error,

        // Computed
        hasMore,
        isEmpty,

        // Actions
        loadInitial,
        loadMore,
    };
}
