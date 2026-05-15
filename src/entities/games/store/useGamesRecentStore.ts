import { defineStore } from "pinia";
import { ref } from "vue";
import type { IGameRecentResource } from "../api";

export const useGamesRecentStore = defineStore("gamesRecent", () => {
    const games = ref<IGameRecentResource[]>([]);
    const loadPending = ref(false);
    const initPending = ref(true);

    function setGames(data: IGameRecentResource[]) {
        games.value = data;
    }
    function setLoadPending(value: boolean) {
        loadPending.value = value;
    }
    function clear() {
        games.value = [];
    }
    function setInitPending(value: boolean) {
        initPending.value = value;
    }

    return {
        games,
        loadPending,
        setGames,
        setLoadPending,
        clear,

        initPending,
        setInitPending,
    };
});
