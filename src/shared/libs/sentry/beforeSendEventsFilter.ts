import type { ErrorEvent, EventHint } from "@sentry/vue";
import { FilterResult, sentryEventFilters } from "./filters";

/**
 * Main "beforeSend" filter for Sentry.
 * Runs all registered filters in order and returns the appropriate result.
 *
 * Filter chain behavior:
 * - DROP: Stop processing, don't send an event to Sentry (returns null)
 * - KEEP: Stop processing, send an event to Sentry immediately (returns event)
 * - CONTINUE: Pass to the next filter in the chain.
 *
 * If all filters return CONTINUE, the event is sent to Sentry.
 */
export function beforeSendFilter(event: ErrorEvent, hint: EventHint): ErrorEvent | null {
    for (const eventFilter of sentryEventFilters) {
        const result = eventFilter.filter(event, hint);

        switch (result) {
            case FilterResult.KEEP:
                return event;
            case FilterResult.CONTINUE:
                continue;
            case FilterResult.DROP:
                return null;
        }
    }

    return event;
}
