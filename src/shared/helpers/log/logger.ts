import { isServer } from "../ssr";

type LogLevel = "info" | "warn" | "error" | "debug";

const logger = (type: LogLevel, message: string, ...optionalParams: unknown[]) => {
    let showLog: Console["log"] = console.log;

    switch (type) {
        case "warn":
            showLog = console.warn;
            break;
        case "error":
            showLog = console.error;
            break;
        case "debug":
            showLog = console.debug;
            break;
        default:
            break;
    }

    if (isServer) {
        if (type === "error") {
            showLog(
                "\x1b[31m%s\x1b[0m",
                `[FRONT_APP_${type.toUpperCase()}]: ${message} ${JSON.stringify(optionalParams)}`,
                optionalParams,
            );
        }

        if (type === "warn") {
            showLog(
                "\x1b[33m%s\x1b[0m",
                `[FRONT_APP_${type.toUpperCase()}]: ${message} ${JSON.stringify(optionalParams)}`,
            );
        }
        return;
    }

    showLog(`[${type}]: `, `${message} `, ...optionalParams);
};

export const log = {
    info(message: string, ...optionalParams: unknown[]) {
        logger("info", message, ...optionalParams);
    },

    warn(message: string, ...optionalParams: unknown[]) {
        logger("warn", message, ...optionalParams);
    },

    error(message: string, ...optionalParams: unknown[]) {
        logger("error", message, ...optionalParams);
    },

    debug(message: string, ...optionalParams: unknown[]) {
        logger("debug", message, ...optionalParams);
    },
};
