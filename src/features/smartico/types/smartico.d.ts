import type { SmarticoGlobal } from "@smartico/public-api";

declare global {
    interface Window {
        _smartico?: SmarticoGlobal;
        _smartico_user_id?: string | null;
        _smartico_language?: string | null;
        _smartico_allow_localhost?: boolean;
        _smartico_lib_loaded__smartico?: boolean;
        _smartico_visitor_id?: string;
    }

    declare const _smartico: SmarticoGlobal | undefined;
}

export {};
