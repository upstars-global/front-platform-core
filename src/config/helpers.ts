export function createConfig<T>(defaultValue: T | null = null) {
    let configState = defaultValue;

    function set(value: T | null) {
        configState = value;
    }
    function get() {
        return configState;
    }

    return {
        set,
        get,
    };
}

export function createForcedConfig<T>(defaultValue: T | null = null, errorMessage = 'Config not defined') {
    const config = createConfig<T>(defaultValue);

    return {
        set: config.set,
        get: () => {
            const configState = config.get();
            if (configState === null) {
                throw new Error(errorMessage);
            }
            return configState as T;
        },
    };
}

export function createForcedCallbackConfig<T>(errorMessage = 'Config not defined') {
    let stateCallback: (() => T) | null = null;

    return {
        set: (callback: () => T) => {
            stateCallback = callback;
        },
        get() {
            if (stateCallback === null) {
                throw new Error(errorMessage);
            }
            return stateCallback();
        },
    };
}
