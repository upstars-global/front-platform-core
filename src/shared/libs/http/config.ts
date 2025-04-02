import { type MaybeRefOrGetter, toValue } from 'vue';

export const DEFAULT_TIMEOUT = 30000;
export const DEFAULT_RETRY_COUNT = 6;
export const DEFAULT_BASE_URL = '/';

let timeoutGetter: null | MaybeRefOrGetter<number> = null;
let retryCountGetter: null | MaybeRefOrGetter<number> = null;
let baseUrlGetter: null | MaybeRefOrGetter<string> = null;
let headersDecorator: null | ((headers: Headers) => void) = null;

export function getHttpConfig() {
  return {
    timeout: timeoutGetter !== null ? toValue(timeoutGetter) : DEFAULT_TIMEOUT,
    retryCount: retryCountGetter !== null ? toValue(retryCountGetter) : DEFAULT_RETRY_COUNT,
    baseUrl: baseUrlGetter !== null ? toValue(baseUrlGetter) : DEFAULT_BASE_URL,
    headersDecorator: (headers: Headers) => {
      if (headersDecorator) {
        headersDecorator(headers);
      }
    },
  };
}

export const configHttp = {
  timeout: (value: MaybeRefOrGetter<number> | null) => {
    timeoutGetter = value;
  },
  retryCount: (value: MaybeRefOrGetter<number> | null) => {
    retryCountGetter = value;
  },
  baseUrl: (value: MaybeRefOrGetter<string> | null) => {
    baseUrlGetter = value;
  },
  headersDecorator: (value: ((headers: Headers) => void) | null) => {
    headersDecorator = value;
  },
};
