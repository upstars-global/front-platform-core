import mitt from 'mitt';
import type { TournamentWebsocketsEvents } from './types';

export const tournamentWebsocketsEvents = mitt<TournamentWebsocketsEvents>();
