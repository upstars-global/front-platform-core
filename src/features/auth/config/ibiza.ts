const IBIZA_KEYS_SUCCESSFULLY_RESPONSE: Record<string, boolean> = {
    "IBIZA.VALID.ACCEPTED_EMAIL": true,
    "IBIZA.VALID.WHITELISTED": true,
    // keys that can be eliminated and recognized as valid
    "IBIZA.RISKY.TIMEOUT": true,
    "IBIZA.RISKY.RISKY": true,
    "IBIZA.UNKNOWN.UNKNOWN": true,
};
const IBIZA_KEYS_FALSY_RESPONSE: Record<string, boolean> = {
    "IBIZA.INVALID.BLACKLISTED": true,
    "IBIZA.INVALID.INVALID_DOMAIN": true,
    "IBIZA.INVALID.REJECTED_EMAIL": true,
    "IBIZA.RISKY.NON_PERSONAL": true,
    "IBIZA.RISKY.INBOX_FULL": true,
    "IBIZA.RISKY.TEMPORARY": true,
    "IBIZA.INVALID.INVALID_EMAIL": true,
};

export {
    IBIZA_KEYS_SUCCESSFULLY_RESPONSE,
    IBIZA_KEYS_FALSY_RESPONSE,
};