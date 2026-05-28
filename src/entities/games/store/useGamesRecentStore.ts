import { defineStore } from "pinia";
import { ref } from "vue";
import type { IGameRecentResource } from "../api";
import { gamesAPI } from "../api";
import { promiseMemo } from "../../../shared/helpers/promise";
import { log } from "../../../shared/helpers/log";

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

    /** @deprecated Use `useLoadGamesRecent().reload` instead. */
    const reload = promiseMemo(async () => {
        loadPending.value = true;
        try {
            games.value = await gamesAPI.loadRecentGamesByPage();
        } catch (error: unknown) {
            log.error("RECENT_GAMES_RELOAD", error);
        } finally {
            loadPending.value = false;
        }
    });

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
        reload,
        clear,

        initPending,
        setInitPending,
    };
});
