import mitt from 'mitt';

export const websocketsEmitter = mitt<Record<string, Record<string, unknown>>>();
