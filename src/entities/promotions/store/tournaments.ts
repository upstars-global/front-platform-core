import { 
  type ITournamentListResource, 
  type ITournamentResource, 
  type IUserTournamentListResource , 
  tournamentsAPI 
} from "../api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { configPromotions } from "../config";

import { authEvents } from "../../auth/emitter";
import { userEvents } from "../../user/emitter";

/**
 * @refactor rewrite to composable; store must not use composable, api, event emitter or another store
 */
export const useTournamentsStore = defineStore("tournaments", () => {
    const tournamentList = ref<ITournamentListResource[]>([]);
    async function loadTournamentList(tag: string | string[] = [], page: number = 1, perPage: number = 15) {
        const response = await tournamentsAPI.loadTournamentList(tag, page, perPage);

        if (response?.data) {
            const filteredData = configPromotions.getFilterItemsFn()(response.data);
            tournamentList.value = filteredData;
            return filteredData;
        }
        return [];
    }
    const currentTournament = ref<ITournamentResource>();
    async function loadTournament(slug: string, reload = false): Promise<ITournamentResource | undefined> {
        if (currentTournament.value?.slug === slug && !reload) {
            return Promise.resolve(currentTournament.value);
        }

        currentTournament.value = undefined;

        const data = await tournamentsAPI.loadTournament(slug);

        currentTournament.value = data;
        return data;
    }
    function reloadTournament() {
        if (!currentTournament.value?.slug) {
            return;
        }

        loadTournament(currentTournament.value.slug, true);
    }

    // @Refactor rewrite to composable; store must not use composable, api, or another store
    userEvents.on("profile.loaded", reloadTournament);
    authEvents.on("logout", reloadTournament);

    const userTournamentList = ref<IUserTournamentListResource[]>([]);
    async function loadUserTournamentList(): Promise<IUserTournamentListResource[] | void> {
        const data = await tournamentsAPI.loadUserTournamentList();
        if (data) {
            userTournamentList.value = data;
            return data;
        }
    }

    function cleanUserTournamentList() {
        userTournamentList.value = [];
    }

    function isMembershipByTournamentId(id: string): boolean {
        if (userTournamentList.value.length > 0) {
            return userTournamentList.value.some((tournament: IUserTournamentListResource) => {
                return tournament.id === id;
            });
        }
        return false;
    }

    return {
        tournamentList,
        loadTournamentList,
        currentTournament,
        loadTournament,
        reloadTournament,

        userTournamentList,
        loadUserTournamentList,
        cleanUserTournamentList,

        isMembershipByTournamentId,
    };
});
