/**
 * Tracks when the browser window/tab is about to close.
 * This helps distinguish "Failed to fetch" errors caused by user navigation from actual network failures.
 */

let isWindowClosed = false;

export function initWindowCloseTracker(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('beforeunload', () => {
    isWindowClosed = true;
  });
}

export function getIsWindowClosed(): boolean {
  return isWindowClosed;
}
