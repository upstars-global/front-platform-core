const ABORT_REASON_TIMEOUT_EXCEED = 'timeout exceed' as const;

export function createHttpAbortController(timeout: number) {
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort(ABORT_REASON_TIMEOUT_EXCEED);
  }, timeout);
  return controller;
}

export function checkTimeoutExceed(signal: AbortSignal) {
  return signal.aborted && signal.reason === ABORT_REASON_TIMEOUT_EXCEED;
}

export function exponentialBackoff(retry: number): Promise<void> {
  return new Promise((resolve) => {
    // https://developers.google.com/analytics/devguides/reporting/core/v3/errors#backoff
    const randomSecond = Math.random() * 1000;
    const time = Math.pow(retry, 2) * 1000 + randomSecond;
    setTimeout(resolve, time);
  });
}

export function concatBaseUrl(baseUrl: string, url: string) {
  if (url.indexOf('http:') === 0 || url.indexOf('https:') === 0) {
    return url;
  }
  const base = baseUrl.trim().replace(/\/*$/g, '');
  const path = url.trim().replace(/(^\/*|\/*$)/g, '');

  return `${base}/${path}`;
}
