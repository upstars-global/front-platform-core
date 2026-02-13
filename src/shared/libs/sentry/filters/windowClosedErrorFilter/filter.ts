import type { ErrorEvent, EventHint } from "@sentry/vue";
import { FilterResult, type SentryEventFilter } from "../types";

const WINDOW_CLOSED_ERROR_PATTERN = "FAILED_TO_FETCH (window closed)";

function getErrorMessage(event: ErrorEvent, hint: EventHint): string {
    const exception = hint.originalException;

    if (typeof exception === "string") {
        return exception;
    }

    if (exception instanceof Error) {
        return exception.message;
    }

    return event.exception?.values?.[0]?.value || "";
}

/**
 * Filter that drops errors caused by the user closing the browser tab.
 *
 * These errors occur when a network request is in progress and the user
 * navigates away or closes the tab. They are expected behavior and not
 * actionable, so we filter them to reduce Sentry noise.
 */
export const windowClosedErrorFilter: SentryEventFilter = {
    name: "windowClosedErrorFilter",

    filter(event: ErrorEvent, hint: EventHint): FilterResult {
        const message = getErrorMessage(event, hint);

        if (message.includes(WINDOW_CLOSED_ERROR_PATTERN)) {
            return FilterResult.DROP;
        }

        return FilterResult.CONTINUE;
    },
};
