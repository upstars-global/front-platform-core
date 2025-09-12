import { log } from '../../../helpers';
import {
    getWebsocketConfig,
    DEFAULT_TIME_RECONNECT,
    MAX_TIME_RECONNECT,
    RECONNECTION_TIME_MULTIPLIER,
} from './config';
import { getWebsocketsPath } from './helpers';
import { websocketsEmitter } from './websocketsEmitter';
import { useWebsocketsStatusStore } from "./websocketsStatusStore";

let sock: WebSocket | null = null;
let reconnectTime = DEFAULT_TIME_RECONNECT;

function createController(setConnectionStatus: (value: boolean) => void) {
    let reconnectionTimeout: undefined | number;

    function handleWebsocketReconnection() {
        sock?.close();
        reconnectionTimeout = setTimeout(start, reconnectTime);
        reconnectTime = reconnectTime * RECONNECTION_TIME_MULTIPLIER;
        if (reconnectTime > MAX_TIME_RECONNECT) {
            reconnectTime = DEFAULT_TIME_RECONNECT;
        }
    }

    function stop() {
        if (sock) {
            clearTimeout(reconnectionTimeout);
            sock.removeEventListener("close", handleWebsocketReconnection);
            sock.close();
        }
    }

    function start(userHash: string) {
        const { bus, hostnameAndProtocol } = getWebsocketConfig();

        stop();
        sock = new WebSocket(getWebsocketsPath(hostnameAndProtocol));

        sock.addEventListener("open", () => {
            reconnectTime = DEFAULT_TIME_RECONNECT;
            setConnectionStatus(true);

            sock?.send(JSON.stringify([
                JSON.stringify({
                    type: "register",
                    user: userHash,
                }),
            ]));
        });

        sock.addEventListener("close", handleWebsocketReconnection);
        sock.addEventListener("close", () => {
            setConnectionStatus(false);
        });

        sock.addEventListener("message", ({ data }) => {
            const type = data.slice(0, 1);
            const content = data.slice(1);
            let json = undefined;
            let payload = undefined;

            if (content) {
                try {
                    payload = JSON.parse(content);
                } catch (error) {
                    log.error("WS_MESSAGE", {
                        payload,
                        error,
                    });
                }
            }

            if (typeof payload === "undefined") {
                return;
            }

            switch (type) {
                case "a":
                    try {
                        if (payload && Array.isArray(payload)) {
                            payload.forEach((message) => {
                                json = JSON.parse(message);
                                // global bus left for back compatibility, use websocketsEmitter only!
                                bus.$emit(`websocket.${ json.type }`, json);
                                websocketsEmitter.emit(json.type, json);
                            });
                        }
                    } catch (error) {
                        log.error("WS_MESSAGE_FOR_TYPE_A", {
                            type,
                            payload,
                            error,
                        });
                    }

                    break;
                case "m":
                default:
                    try {
                        json = JSON.parse(payload);
                        // global bus left for back compatibility, use websocketsEmitter only!
                        bus.$emit(`websocket.${ json.type }`, json);
                        websocketsEmitter.emit(json.type, json);
                    } catch (error) {
                        log.error("WS_MESSAGE_FOR_TYPE_M", {
                            type,
                            payload,
                            error,
                        });
                    }
            }
        });
    }

    return {
        start,
        stop,
    };
}
let controller: ReturnType<typeof createController> | null = null;

export function useWebsocketsController() {
    const websocketsStatusStore = useWebsocketsStatusStore();

    if (!controller) {
        controller = createController((value) => {
            websocketsStatusStore.setConnected(value);
        })
    }

    return controller;
}
