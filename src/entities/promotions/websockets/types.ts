export enum TournamentWebsocketType {
  USER_AUTO_CHOICE_CHANGED = 'tournament.user.auto_choice.changed',
}

export type TournamentUserAutoChoiceChangedWebsocket = {
  type: TournamentWebsocketType.USER_AUTO_CHOICE_CHANGED;
  timestamp: number;
  data: { phase_id: string };
};

export type TournamentWebsocketsEvents = {
  [TournamentWebsocketType.USER_AUTO_CHOICE_CHANGED]: TournamentUserAutoChoiceChangedWebsocket;
};
