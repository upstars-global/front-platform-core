import type { Pinia } from "pinia";
import type {
  ITournamentResource,
  IUserTournamentListResource,
} from "../api";
import { tournamentsAPI } from "../api";
import { configPromotions } from "../config";
import { useTournamentsStore } from "../store";

export function useLoadTournaments(pinia?: Pinia) {
    const store = useTournamentsStore(pinia);

    async function loadTournamentList(tag: string | string[] = [], page: number = 1, perPage: number = 15) {
        const response = await tournamentsAPI.loadTournamentList(tag, page, perPage);

        if (response?.data) {
            const filteredData = configPromotions.getFilterItemsFn()(response.data);
            store.setTournamentList(filteredData);
            return filteredData;
        }
        return [];
    }

    async function loadTournament(slug: string, reload = false): Promise<ITournamentResource | undefined> {
        if (store.currentTournament?.slug === slug && !reload) {
            return Promise.resolve(store.currentTournament);
        }

        store.setCurrentTournament(undefined);

        const data = await tournamentsAPI.loadTournament(slug);

        store.setCurrentTournament(data);
        return data;
    }

    function reloadTournament() {
        if (!store.currentTournament?.slug) {
            return;
        }

        loadTournament(store.currentTournament.slug, true);
    }

    async function loadUserTournamentList(): Promise<IUserTournamentListResource[] | void> {
        const data = await tournamentsAPI.loadUserTournamentList();
        if (data) {
            store.setUserTournamentList(data);
            return data;
        }
    }

    return {
        loadTournamentList,
        loadTournament,
        reloadTournament,
        loadUserTournamentList,
    };
}
