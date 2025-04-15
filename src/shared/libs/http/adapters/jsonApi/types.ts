import type { Method } from '../../types';

export type JsonApiParams = {
  data?: Record<string, unknown>;
  method?: Method;
};
