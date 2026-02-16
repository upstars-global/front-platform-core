import type { SentryEventFilter } from "./types";
import { windowClosedErrorFilter } from "./windowClosedErrorFilter";

export * from "./types";

/**
 * List of Sentry event filters to be executed by beforeSendFilter.
 * Filters are executed in order. To add a new filter:
 * 1. Create a new filter folder (e.g., filters/myFilter/)
 * 2. Implement the SentryEventFilter interface in filter.ts
 * 3. Export the filter from index.ts
 * 4. Add the filter to this array
 */
export const sentryEventFilters: SentryEventFilter[] = [
    windowClosedErrorFilter,
];
