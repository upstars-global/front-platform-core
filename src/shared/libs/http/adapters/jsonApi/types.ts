import type { Method } from '@core/shared/libs/http';

export type JsonApiParams = {
  data?: Record<string, unknown>;
  method?: Method;
};
