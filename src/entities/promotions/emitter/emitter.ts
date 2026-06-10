import mitt from 'mitt';
import type { TournamentEvents } from './types';

export const tournamentEvents = mitt<TournamentEvents>();
