import type {
  ITournamentListResource,
  ITournamentResource,
  IUserTournamentListResource,
} from "../api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTournamentsStore = defineStore("tournaments", () => {
    const tournamentList = ref<ITournamentListResource[]>([]);
    function setTournamentList(data: ITournamentListResource[]) {
        tournamentList.value = data;
    }

    const currentTournament = ref<ITournamentResource>();
    function setCurrentTournament(data: ITournamentResource | undefined) {
        currentTournament.value = data;
    }

    const userTournamentList = ref<IUserTournamentListResource[]>([]);
    function setUserTournamentList(data: IUserTournamentListResource[]) {
        userTournamentList.value = data;
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
        setTournamentList,
        currentTournament,
        setCurrentTournament,

        userTournamentList,
        setUserTournamentList,
        cleanUserTournamentList,

        isMembershipByTournamentId,
    };
});
