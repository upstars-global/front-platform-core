import type { IWinnerResource } from "../api/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWinnersStore = defineStore("winners", () => {
    const winnersData = ref<IWinnerResource | null | undefined>(null);

    function setWinnersData(data: IWinnerResource | null | undefined) {
        winnersData.value = data;
    }

    function resetWinnersData() {
        winnersData.value = null;
    }

    return {
        winnersData,
        setWinnersData,
        resetWinnersData,
    };
});
