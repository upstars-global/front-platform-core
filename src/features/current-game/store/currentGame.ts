import type { IGameResource } from "../../../entities/games/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCurrentGameStore = defineStore("currentGame", () => {
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
