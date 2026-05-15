import type { Pinia } from "pinia";
import type { IWinnerResource } from "../api/types";
import { winnersAPI } from "../api/requests";
import { useWinnersStore } from "../store/useWinnersStore";
import { useUserProfile } from "../../user/composables";

export function useLoadWinners(pinia?: Pinia) {
    const store = useWinnersStore(pinia);
    const { isLoggedAsync } = useUserProfile(pinia);

    async function loadWinnersData(): Promise<IWinnerResource | null | undefined> {
        const cached = store.winnersData;
        if (cached && cached.winners.length) {
            return cached;
        }

        const isLogged = await isLoggedAsync();
        const data = await winnersAPI.loadWinnersData(isLogged);
        store.setWinnersData(data);
        return data;
    }

    return {
        loadWinnersData,
    };
}
