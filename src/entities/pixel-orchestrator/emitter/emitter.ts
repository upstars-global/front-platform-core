import mitt from 'mitt';
import type { PixelOrchestratorEvents } from './types';

export const pixelOrchestratorEvents = mitt<PixelOrchestratorEvents>();
