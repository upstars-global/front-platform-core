import { gamesAPI } from "../api";
import { promiseMemo } from "../../../shared/helpers/promise";
import { log } from "../../../shared/helpers/log";
import { useGamesRecentStore } from "../store";

export function useLoadGamesRecent() {
    const store = useGamesRecentStore();

    const reload = promiseMemo(async () => {
        store.setLoadPending(true);
        try {
            store.setGames(await gamesAPI.loadRecentGamesByPage());
        } catch (error: unknown) {
            log.error("RECENT_GAMES_RELOAD", error);
        } finally {
            store.setLoadPending(false);
        }
    });

    return {
        reload,
    };
}
