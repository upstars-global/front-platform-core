import { createPromiseHook } from '../../helpers/config/createPromiseHook';

export type HttpRequestDurationHookParams = {
  timeDuration: number;
  requestUrl: string;
  requestInit: RequestInit | null;
};

const HTTP_REQUEST_DURATION_HOOK_ERRORS = {
  HTTP_REQUEST_DURATION: 'HTTP_REQUEST_DURATION_HOOK_ERROR',
  HTTP_REQUEST_DURATION_NOT_EXIST: 'HTTP_REQUEST_DURATION_HOOK_NOT_EXIST',
} as const;

export const httpRequestDurationHook = createPromiseHook<HttpRequestDurationHookParams>({
  hookError: HTTP_REQUEST_DURATION_HOOK_ERRORS.HTTP_REQUEST_DURATION,
  hookNotExistError: HTTP_REQUEST_DURATION_HOOK_ERRORS.HTTP_REQUEST_DURATION_NOT_EXIST,
});
