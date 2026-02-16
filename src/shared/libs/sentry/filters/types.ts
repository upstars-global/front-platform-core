import type { ErrorEvent, EventHint } from "@sentry/vue";

/**
 * Result of a Sentry event filter.
 *
 * - DROP: Do not send the event to Sentry
 * - KEEP: Send the event to Sentry immediately, skip remaining filters
 * - CONTINUE: Pass to the next filter in the chain
 */
export enum FilterResult {
    DROP = "drop",
    KEEP = "keep",
    CONTINUE = "continue",
}

/**
 * Interface for Sentry event filters.
 * Filters are executed in order and can decide whether to drop, keep, or pass events.
 */
export type SentryEventFilter = {
    name: string;
    filter(event: ErrorEvent, hint: EventHint): FilterResult;
}
