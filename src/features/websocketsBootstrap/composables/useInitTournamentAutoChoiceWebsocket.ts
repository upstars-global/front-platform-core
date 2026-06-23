import { onMounted } from 'vue';
import { useWebsocketsBridge } from '../../../shared/libs/websockets';
import { log } from '../../../shared/helpers';
import {
  tournamentWebsocketsEvents,
  TournamentWebsocketType,
  tournamentEvents,
  useTournamentsStore,
  useLoadTournaments,
  type IUserTournamentListResource,
} from '../../../entities/promotions';

function useInitTournamentAutoChoiceBridge() {
  useWebsocketsBridge({
    emitter: tournamentWebsocketsEvents,
    websocketConfigMap: {
      [TournamentWebsocketType.USER_AUTO_CHOICE_CHANGED]: {
        event: TournamentWebsocketType.USER_AUTO_CHOICE_CHANGED,
        verifyTimestamp: true,
      },
    },
  });
}

function useInitTournamentAutoChoiceHandlers() {
  const tournamentsStore = useTournamentsStore();
  const { loadUserTournamentList, reloadTournament } = useLoadTournaments();

  async function handleAutoChoiceChanged() {
    const previousIds = new Set(
      tournamentsStore.userTournamentList.map((item: IUserTournamentListResource) => item.id),
    );

    try {
      await loadUserTournamentList();
      reloadTournament();
    } catch (error) {
      log.error('TOURNAMENT_AUTO_CHOICE_REFETCH', error);
      return;
    }

    const newTournament = tournamentsStore.userTournamentList.find(
      (item: IUserTournamentListResource) => !previousIds.has(item.id),
    );

    if (!newTournament?.title) {
      return;
    }

    tournamentEvents.emit('tournament.user.auto-switched', {
      title: newTournament.title,
    });
  }

  onMounted(() => {
    tournamentWebsocketsEvents.on(
      TournamentWebsocketType.USER_AUTO_CHOICE_CHANGED,
      handleAutoChoiceChanged,
    );
  });
}

export function useInitTournamentAutoChoiceWebsocket() {
  useInitTournamentAutoChoiceBridge();
  useInitTournamentAutoChoiceHandlers();
}
