import type { HTTPOptions } from './types';
import { getHttpConfig } from './config';
import { exponentialBackoff, concatBaseUrl, checkTimeoutExceed, createHttpAbortController } from './helpers';
import {
  type JsonHttpError,
  JsonHttpJsonParseError,
  JsonHttpServerError,
  JsonHttpTimeoutError,
  JsonHttpUnknownError,
} from './errors';
import { httpRequestDurationHook } from './httpRequestDurationHook';

export function jsonHttp<R = unknown>(url: string, request?: RequestInit, options: HTTPOptions = {}): Promise<R> {
  const { timeout, retryCount, headersDecorator, baseUrl } = getHttpConfig();

  const requestUrl = concatBaseUrl(options?.baseURL || baseUrl, url);

  const headers = new Headers(request?.headers);
  headers.set('X-Requested-With', 'XMLHttpRequest');
  headers.set('Accept', 'application/json');
  if (request?.body) {
    const contentType  = request.body instanceof FormData ? 'multipart/form-data' : 'application/json';
    headers.set('Content-Type', contentType);
  }
  headersDecorator(headers);
  const measurementRequestDurationStart = performance.now();
  return new Promise((resolve, reject: (error: JsonHttpError) => void) => {
    function requestAttempt(attempt = 1) {
      const { signal } = createHttpAbortController(timeout);

      fetch(requestUrl, {
        ...request,
        signal,
        headers,
      })
        .then((response) => {
          if (response.ok) {
            httpRequestDurationHook.run({
              timeDuration: performance.now() - measurementRequestDurationStart,
              requestUrl: url,
              requestInit: request || null,
            });
            response
              .json()
              .then((data: R) => {
                resolve(data);
              })
              .catch(() => {
                response
                  .text()
                  .then((text) => {
                    reject(
                      new JsonHttpJsonParseError({
                        textOutput: text,
                        url: requestUrl,
                        method: request?.method || 'GET',
                      }),
                    );
                  })
                  .catch(() => {
                    reject(
                      new JsonHttpJsonParseError({
                        textOutput: '',
                        url: requestUrl,
                        method: request?.method || 'GET',
                      }),
                    );
                  });
              });
          } else {
            response
              .json()
              .then((data: unknown) => {
                reject(
                  new JsonHttpServerError({
                    status: response.status,
                    statusText: response.statusText,
                    data,
                    url: requestUrl,
                    method: request?.method || 'GET',
                  }),
                );
              })
              .catch(() => {
                response
                  .text()
                  .then((data: string) => {
                    reject(
                      new JsonHttpServerError({
                        status: response.status,
                        statusText: response.statusText,
                        data,
                        url: requestUrl,
                        method: request?.method || 'GET',
                      }),
                    );
                  })
                  .catch(() => {
                    reject(
                      new JsonHttpServerError({
                        status: response.status,
                        statusText: response.statusText,
                        url: requestUrl,
                        method: request?.method || 'GET',
                      }),
                    );
                  });
              });
          }
        })
        .catch((error: unknown) => {
          const isTimeoutExceed = checkTimeoutExceed(signal);
          const isOnLine = typeof window === 'undefined' || window.navigator.onLine;

          if (isTimeoutExceed || (!isOnLine && attempt < retryCount)) {
            exponentialBackoff(attempt)
              .then(() => {
                requestAttempt(attempt + 1);
              })
              .catch((retryError: unknown) => {
                reject(
                  new JsonHttpTimeoutError({
                    error: retryError,
                    url: requestUrl,
                    method: request?.method || 'GET',
                  }),
                );
              });
          } else {
            reject(
              new JsonHttpUnknownError({
                error,
                url: requestUrl,
                method: request?.method || 'GET',
              }),
            );
          }
        });
    }

    requestAttempt();
  });
}
