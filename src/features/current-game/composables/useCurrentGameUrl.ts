import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useCurrentGameStore } from "../store";
import { useContextStore } from "../../../entities/context/store/contextStore";

export function useCurrentGameUrl() {
    const store = useCurrentGameStore();
    const { isMobile } = storeToRefs(useContextStore());

    const gameUrl = computed<string | null>(() => {
        if (store.gameData?.id) {
            const demoPathPart = store.isDemo ? "/demo" : "";
            const platform = isMobile.value ? "mobile" : "desktop";

            return `/games${demoPathPart}/start/${platform}/${store.gameData.slug}?exit_url=exit_iframe`;
        }
        return null;
    });

    return {
        gameUrl,
    };
}
