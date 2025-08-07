import { createPromiseHook } from '../../helpers/config/createPromiseHook';

export type HttpRequestDurationHookParams = {
  timeDuration: number;
  requestUrl: string;
  requestInit: RequestInit | null;
};

export const httpRequestDurationHook = createPromiseHook<HttpRequestDurationHookParams>({
  hookError: 'HTTP_REQUEST_DURATION_HOOK_ERROR',
  hookNotExistError: 'HTTP_REQUEST_DURATION_HOOK_NOT_EXIST',
});
