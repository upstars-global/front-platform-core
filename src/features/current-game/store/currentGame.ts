import type { IGameResource } from "../../../entities/games/api";
import { useContextStore } from "../../../entities/context/store/contextStore";
import { defineStore } from "pinia";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

export const useCurrentGame = defineStore("currentGame", () => {
    const { isMobile } = storeToRefs(useContextStore());

    const gameData = ref<IGameResource | null>(null);
    const gamePrevious = ref<IGameResource | null>(null);

    function clearGame() {
        gameData.value = null;
    }
    function clearGamePrevious() {
        gamePrevious.value = null;
    }

    function setGame(game: IGameResource) {
        setGamePrevious(game);
        gameData.value = game;
    }
    function setGamePrevious(game: IGameResource) {
        gamePrevious.value = game;
    }

    function clear() {
        clearGame();
    }

    function clearPrevious() {
        clearGamePrevious();
    }

    const gameUrl = computed<string | null>(() => {
        if (gameData.value?.id) {
            const demoPathPart = isDemo.value ? "/demo" : "";
            const platform = isMobile.value ? "mobile" : "desktop";

            return `/games${demoPathPart}/start/${platform}/${gameData.value.slug}?exit_url=exit_iframe`;
        }
        return null;
    });

    const gameLoading = ref(false);
    function setGameLoading(value: boolean) {
        gameLoading.value = value;
    }

    const isDemo = ref(false);
    function setGameDemo(boolean: boolean) {
        isDemo.value = boolean;
    }

    return {
        gameData,
        setGame,
        clearGame,
        gameUrl,
        gameLoading,
        setGameLoading,
        isDemo,
        setGameDemo,

        clear,

        gamePrevious,
        setGamePrevious,
        clearGamePrevious,
        clearPrevious,
    };
});
